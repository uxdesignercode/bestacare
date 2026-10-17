/**
 * BestaCare: saves website form submissions to Google Sheets (Sheets permission only)
 *
 * WHAT IT DOES
 *  - Call-back requests (every call-back form on the site) -> sheet tab "Call backs"
 *  - Job applications (Work with us page)                    -> sheet tab "Job applications"
 *    Each applicant's documents are saved in your Google Drive:  Career / <Name - phone - date> /
 *    and the sheet row holds a link to that folder.
 *
 * HOW TO DEPLOY (one time, about 5 minutes)
 *  1. Create a new Google Sheet (any name, e.g. "BestaCare enquiries").
 *  2. In that sheet: Extensions -> Apps Script. Delete the default code and paste this whole file.
 *  3. Click Run -> testSheet (approve the permissions the first time). Check that test rows appear.
 *  4. Deploy -> New deployment -> type "Web app".
 *       Execute as: Me      Who has access: Anyone
 *     Copy the Web app URL (ends with /exec).
 *  5. Open js/main.js, paste the URL into  var SHEET_URL = '';  and save.
 *  6. Re-deploying after you edit this script: Deploy -> Manage deployments -> edit -> New version.
 *     The URL stays the same.
 *
 * Phone numbers are stored as text (+91 98765 43210) so Sheets never turns them into numbers.
 */

// The long ID in your sheet's address:  docs.google.com/spreadsheets/d/<THIS PART>/edit
// REQUIRED if you created the script at script.google.com. Optional if you opened it from the sheet
// with Extensions -> Apps Script (then leave '').
var SPREADSHEET_ID = '1pzjugvnss2m2DFo8wZ_7rL57x5rAXU9_B90WY-0ggEI';


// Drive folder that holds one sub-folder per applicant. Created in My Drive the first time it is needed.
var ROOT_FOLDER_NAME = 'Career';
var MAX_FILES = 12;
var MAX_FILE_BYTES = 7 * 1024 * 1024;
var ALLOWED_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf' };
var DOC_LABELS = { aadhaar: 'Aadhaar', pan: 'PAN', certs: 'Certificate', photo: 'Photo' };

var TABS = {
  callback: { name: 'Call backs', head: ['Time', 'Name', 'Phone', 'Service', 'Shift', 'Form', 'Page'] },
  job: { name: 'Job applications', head: ['Time', 'Name', 'Phone', 'Role', 'Experience', 'Area', 'Documents saved', 'Drive folder', 'Page'] },
};

function doGet() {
  return json({ ok: true, message: 'BestaCare form endpoint is running.' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.website) return json({ ok: true }); // spam trap field was filled

    var phone = String(d.phone || '').replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(phone)) return json({ ok: false, error: 'bad phone' });
    var phoneText = '+91 ' + phone.slice(0, 5) + ' ' + phone.slice(5);
    var when = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

    lock.waitLock(30000);
    var row;

    if (d.formType === 'job-application') {
      var saved = saveDocs_(d, phone, when);
      row = [when, clean_(d.name), phoneText, clean_(d.service), clean_(d.experience), clean_(d.area),
        saved.summary, saved.url, clean_(d.page)];
      append_(TABS.job, row);
    } else {
      row = [when, clean_(d.name), phoneText, clean_(d.service), clean_(d.shift), clean_(d.form), clean_(d.page)];
      append_(TABS.callback, row);
    }

    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) { /* not held */ }
  }
}

/* ---------- helpers ---------- */

function getSpreadsheet_() {
  var ss = SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No spreadsheet found. Set SPREADSHEET_ID at the top of the script.');
  return ss;
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(v) {
  var s = String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').trim().slice(0, 300);
  // a value that starts with = + - @ could be read as a formula, so mark it as text
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function append_(tab, row) {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(tab.name);
  if (!sheet) {
    sheet = ss.insertSheet(tab.name);
    sheet.appendRow(tab.head);
    sheet.getRange(1, 1, 1, tab.head.length).setFontWeight('bold').setBackground('#e2f2e8');
    sheet.setFrozenRows(1);
    // plain text everywhere, so numbers and "=..." text are stored exactly as typed (no formulas)
    sheet.getRange(1, 1, sheet.getMaxRows(), tab.head.length).setNumberFormat('@');
    var blank = ss.getSheetByName('Sheet1');
    if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(blank);
  }
  // write as plain text (appendRow would turn "+91 ..." into a formula and show #ERROR!)
  var rng = sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length);
  rng.setNumberFormat('@');
  rng.setValues([row]);
}

function rootFolder_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('CAREER_FOLDER_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (x) { /* deleted: make a new one */ } }
  var it = DriveApp.getFoldersByName(ROOT_FOLDER_NAME);
  var f = it.hasNext() ? it.next() : DriveApp.createFolder(ROOT_FOLDER_NAME);
  props.setProperty('CAREER_FOLDER_ID', f.getId());
  return f;
}

function safeName_(v) {
  return String(v || '').replace(/[\\\/:*?"<>|\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60) || 'Applicant';
}

/** Saves the applicant's files to Career/<Name - phone - date>/ and returns {url, summary}. */
function saveDocs_(d, phone, when) {
  var files = (d.files || []).slice(0, MAX_FILES);
  var withData = files.filter(function (f) { return f && f.data; });
  if (!withData.length) return { url: '', summary: 'No documents' };

  var folder = rootFolder_().createFolder(safeName_(d.name) + ' - ' + phone + ' - ' + when.slice(0, 10));
  var counts = {}, names = [];
  withData.forEach(function (f) {
    var type = String(f.type || '').toLowerCase();
    var ext = ALLOWED_TYPES[type];
    if (!ext) return;                                   // not a photo or PDF: skip it
    var bytes = Utilities.base64Decode(String(f.data));
    if (bytes.length > MAX_FILE_BYTES) return;
    var label = DOC_LABELS[f.field] || 'Document';
    counts[label] = (counts[label] || 0) + 1;
    var fname = label + (f.field === 'certs' ? ' ' + counts[label] : (counts[label] > 1 ? ' ' + counts[label] : '')) + '.' + ext;
    folder.createFile(Utilities.newBlob(bytes, type, fname));
    names.push(fname);
  });
  return { url: folder.getUrl(), summary: names.join('; ') || 'No valid documents' };
}

/** Run this once from the editor to check permissions and see the sheet layout. */
function testSheet() {
  append_(TABS.callback, [new Date().toString(), 'TEST', '+91 98765 43210', 'Patient caretaker', '24 hour', 'test', '/index.html']);
  append_(TABS.job, [new Date().toString(), 'TEST', '+91 98765 43210', 'Nurse', '1 to 3 years', 'Vashi', 'Aadhaar.jpg', '(test)', '/work-with-us.html']);
  Logger.log('Test rows written. You can delete them from the sheet.');
}

/** Run this once from the editor: it asks you to allow Drive access and creates the "Career" folder. */
function authorizeDrive() {
  Logger.log('Career folder: ' + rootFolder_().getUrl());
}
