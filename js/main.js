/* BestaCare Version 2. Small, dependency-free script.
   Pages read fine without it; it adds the accordion, forms, dialogs and filters. */
(function () {
  'use strict';
  var doc = document;
  doc.documentElement.classList.add('js');

  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };

  /* ---------- scroll reveal ---------- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  /* ---------- videos: play in place when a link has been added ---------- */
  function videoEmbed(src, title) {
    var m;
    if ((m = src.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/))) {
      return '<iframe src="https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0" title="' + title + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    }
    if ((m = src.match(/vimeo\.com\/(?:video\/)?(\d+)/))) {
      return '<iframe src="https://player.vimeo.com/video/' + m[1] + '?autoplay=1" title="' + title + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    }
    return null;
  }
  $$('.vid[data-video]').forEach(function (box) {
    var btn = $('button', box);
    btn.addEventListener('click', function () {
      var src = box.getAttribute('data-video'), title = box.getAttribute('data-title') || 'Video';
      var html = videoEmbed(src, title);
      if (!html) {
        var v = doc.createElement('video');
        v.controls = true; v.autoplay = true; v.playsInline = true; v.preload = 'metadata';
        v.setAttribute('aria-label', title);
        v.src = src;
        box.innerHTML = ''; box.appendChild(v); box.classList.add('is-playing');
        v.play && v.play().catch(function () {});
        return;
      }
      box.innerHTML = html; box.classList.add('is-playing');
    });
  });

  /* ---------- FAQ accordion (one open per list) ---------- */
  $$('[data-accordion]').forEach(function (list) {
    list.addEventListener('click', function (e) {
      var q = e.target.closest('.faq__q');
      if (!q) return;
      var item = q.closest('.faq');
      var open = !item.classList.contains('is-open');
      $$('.faq.is-open', list).forEach(function (o) {
        o.classList.remove('is-open');
        $('.faq__q', o).setAttribute('aria-expanded', 'false');
        $('.faq__a', o).hidden = true;
      });
      if (open) {
        item.classList.add('is-open');
        q.setAttribute('aria-expanded', 'true');
        $('.faq__a', item).hidden = false;
      }
    });
  });

  /* ---------- FAQs page: topic filter ---------- */
  var topics = $('[data-topics]');
  if (topics) {
    topics.addEventListener('click', function (e) {
      var b = e.target.closest('.topic');
      if (!b) return;
      $$('.topic', topics).forEach(function (t) { t.setAttribute('aria-pressed', String(t === b)); });
      var key = b.getAttribute('data-topic');
      $$('[data-group]').forEach(function (el) { el.hidden = key !== 'all' && el.getAttribute('data-group') !== key; });
    });
  }

  /* ---------- single-choice chip groups ---------- */
  $$('[data-single]').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var c = e.target.closest('.chip');
      if (!c) return;
      var on = c.getAttribute('aria-pressed') === 'true';
      $$('.chip', g).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      c.setAttribute('aria-pressed', String(!on));
    });
  });
  function chipValue(name, root) {
    var g = $('[data-name="' + name + '"]', root);
    var c = g && $('.chip[aria-pressed="true"]', g);
    return c ? c.getAttribute('data-value') : '';
  }

  /* ---------- care guides filter ---------- */
  var gf = $('[data-guide-filter]');
  if (gf) {
    gf.addEventListener('click', function (e) {
      var c = e.target.closest('.chip');
      if (!c) return;
      $$('.chip', gf).forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      var cat = c.getAttribute('data-cat');
      $$('.guide').forEach(function (g) { g.hidden = cat !== 'All' && g.getAttribute('data-cat') !== cat; });
    });
  }

  /* ---------- shift picker ---------- */
  var sh = $('[data-shifts]');
  if (sh) {
    var summary = $('[data-shift-summary]', sh);
    var svc = sh.getAttribute('data-service');
    var update = function () {
      var v = $('input[name="shift"]:checked', sh).value.replace('12 hour day', '12 hour day').replace('24 hour', '24 hour');
      summary.textContent = 'For: ' + svc + ' · ' + v;
    };
    sh.addEventListener('change', update);
    update();
    var ask = $('[data-ask-shift]', sh);
    ask.addEventListener('click', function () {
      // Carry the chosen shift into the call-back request (TODO: send with the form once a backend exists)
      window.sessionStorage && sessionStorage.setItem('bc-shift', summary.textContent);
      var target = doc.getElementById('callback');
      var input = target && $('input[name="phone"]', target);
      if (input) setTimeout(function () { input.focus({ preventScroll: true }); }, 500);
    });
  }

  /* ---------- shorter placeholder on phones ---------- */
  if (window.matchMedia) {
    var mq = matchMedia('(max-width: 760px)');
    var setPh = function () { $$('[data-ph-m]').forEach(function (i) { if (!i.getAttribute('data-ph-d')) i.setAttribute('data-ph-d', i.placeholder); i.placeholder = mq.matches ? i.getAttribute('data-ph-m') : i.getAttribute('data-ph-d'); }); };
    setPh(); if (mq.addEventListener) mq.addEventListener('change', setPh);
  }

  /* ---------- phone number field ---------- */
  function digits(v) { return String(v || '').replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, ''); }
  function fmt(v) { var d = digits(v).slice(0, 10); return d.length > 5 ? d.slice(0, 5) + ' ' + d.slice(5) : d; }
  function validPhone(v) { return /^[6-9]\d{9}$/.test(digits(v)); }
  $$('input[type="tel"]').forEach(function (i) {
    i.addEventListener('input', function () { var p = fmt(i.value); if (p !== i.value) i.value = p; });
  });
  function setErr(box, input, msg) {
    var err = $('.err', box) || (input.closest('.fld') && $('.err', input.closest('.fld')));
    var holder = input.closest('.field__box') || input;
    holder.classList.toggle('is-error', !!msg);
    if (err) { err.hidden = !msg; $('span', err).textContent = msg || ''; }
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  /* ---------- call-back dialog ---------- */
  var dlg = $('#cb-dialog');
  var lastFocus = null;
  function openDialog(mode, phone) {
    if (!dlg) return;
    lastFocus = doc.activeElement;
    $('[data-dlg="form"]', dlg).hidden = mode === 'ok';
    $('[data-dlg="ok"]', dlg).hidden = mode !== 'ok';
    if (mode === 'ok') $('[data-ok-text]', dlg).textContent = 'We will call +91 ' + phone + ' within 5 minutes.';
    dlg.hidden = false;
    doc.body.style.overflow = 'hidden';
    var f = $('input', dlg);
    setTimeout(function () { (mode === 'ok' ? $('[data-close].btn', dlg) : f).focus(); }, 30);
  }
  function closeDialog() {
    if (!dlg || dlg.hidden) return;
    dlg.hidden = true;
    doc.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  doc.addEventListener('click', function (e) {
    if (e.target.closest('[data-open-callback]')) { e.preventDefault(); openDialog('form'); }
    else if (e.target.closest('[data-close]') || e.target === dlg) closeDialog();
  });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDialog();
    if (e.key === 'Tab' && dlg && !dlg.hidden) {
      var f = $$('button, a[href], input', dlg).filter(function (x) { return !x.closest('[hidden]'); });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Google Sheet endpoint ----------
     Paste your Apps Script web app URL below (see tools/google-apps-script.js and README.md).
     While it is empty, forms still work but nothing is saved: the data is only logged to the console. */
  var SHEET_URL = 'https://script.google.com/macros/s/AKfycbznVHVgepY_UTS4L_Wws2ompVVn_j5rJRmxXGqbYJxyAeHZ5fv_0jVramEBZ2mQv_AWKg/exec';
  var SEND_TIMEOUT = 45000;
  function sendToSheet(payload) {
    return new Promise(function (resolve, reject) {
      if (payload.website) { resolve(); return; } // spam trap field was filled: pretend it worked
      if (!SHEET_URL) { if (window.console) console.warn('[BestaCare] SHEET_URL is empty, so this was NOT saved:', payload); resolve(); return; }
      var timer = setTimeout(function () { reject(new Error('timeout')); }, SEND_TIMEOUT);
      // text/plain keeps this a "simple" request, which Apps Script accepts from any site without CORS preflight
      fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
        .then(function () { clearTimeout(timer); resolve(); }, function (e) { clearTimeout(timer); reject(e); });
    });
  }
  function busy(btn, on) {
    if (!btn) return;
    if (on) { btn._html = btn.innerHTML; btn.disabled = true; btn.textContent = 'Sending...'; }
    else { btn.disabled = false; if (btn._html) btn.innerHTML = btn._html; }
  }
  var SEND_FAIL = 'We could not send this. Please try again, or call 91363 76701.';

  /* ---------- call-back forms ---------- */
  $$('form[data-callback]').forEach(function (form) {
    var input = $('input[name="phone"]', form);
    var nameInput = $('input[name="cbname"]', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = false;
      if (nameInput && !nameInput.value.trim()) {
        setErr(nameInput.closest('.fld') || form, nameInput, 'Please enter your name.');
        bad = true;
      } else if (nameInput) {
        setErr(nameInput.closest('.fld') || form, nameInput, '');
      }
      if (!validPhone(input.value)) {
        setErr(input.closest('.fld') || form, input, 'Please enter a 10 digit mobile number.');
        bad = true;
      } else {
        setErr(input.closest('.fld') || form, input, '');
      }
      if (bad) { (nameInput && !nameInput.value.trim() ? nameInput : input).focus(); return; }
      var payload = {
        name: nameInput ? nameInput.value.trim() : '',
        phone: digits(input.value),
        service: (form.closest('[data-cb-card]') && chipValue('service', form.closest('[data-cb-card]'))) || (sh ? sh.getAttribute('data-service') : ''),
        shift: sh ? $('input[name="shift"]:checked', sh).value : '',
        form: (input.id || '').replace(/-phone$/, ''),
        page: location.pathname,
        formType: 'callback',
        website: ($('input[name="website"]', form) || {}).value || ''
      };
      var submitBtn = $('button[type="submit"]', form);
      busy(submitBtn, true);
      sendToSheet(payload).then(function () {
        busy(submitBtn, false);
        var wasDlg = dlg && dlg.contains(form);
        form.reset();
        if (wasDlg) { $('[data-dlg="form"]', dlg).hidden = true; $('[data-dlg="ok"]', dlg).hidden = false; $('[data-ok-text]', dlg).textContent = 'We will call +91 ' + fmt(payload.phone) + ' within 5 minutes.'; }
        else openDialog('ok', fmt(payload.phone));
      }, function () {
        busy(submitBtn, false);
        setErr(input.closest('.fld') || form, input, SEND_FAIL);
      });
    });
    input.addEventListener('input', function () { if (input.getAttribute('aria-invalid') === 'true') setErr(input.closest('.fld') || form, input, ''); });
    if (nameInput) nameInput.addEventListener('input', function () { if (nameInput.getAttribute('aria-invalid') === 'true') setErr(nameInput.closest('.fld') || form, nameInput, ''); });
  });

  /* ---------- work with us application ---------- */
  var jf = $('[data-jobform]');
  if (jf) {
    var MAX = 5 * 1024 * 1024;
    var store = {}; // upload key -> File[]
    function toBase64(file) {
      return new Promise(function (res, rej) {
        var r = new FileReader();
        r.onload = function () { res(String(r.result).split(',')[1] || ''); };
        r.onerror = rej;
        r.readAsDataURL(file);
      });
    }
    function size(n) { return n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }
    function renderFiles(box) {
      var key = box.getAttribute('data-upload');
      var list = $('.files', box);
      list.innerHTML = '';
      var dropB = $('.drop b', box), dropS = $('.drop span span', box);
      if (!box._add) box._add = [dropB.textContent, dropS.textContent];
      var has = (store[key] || []).length > 0, multi = $('input[type="file"]', box).multiple;
      dropB.textContent = has ? (multi ? 'Add another file' : 'Replace file') : box._add[0];
      dropS.textContent = has ? (multi ? 'You can add more than one file' : 'One file') : box._add[1];
      (store[key] || []).forEach(function (f, i) {
        var row = doc.createElement('div');
        row.className = 'file';
        var ico = doc.createElement('span'); ico.className = 'file__ic'; ico.innerHTML = '<svg class="i" aria-hidden="true"><use href="#i-file-text"/></svg>';
        var n = doc.createElement('span'); n.textContent = f.name;
        var s = doc.createElement('span'); s.className = 'muted'; s.textContent = size(f.size);
        var b = doc.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Remove ' + f.name); b.innerHTML = '&times;';
        b.addEventListener('click', function () { store[key].splice(i, 1); renderFiles(box); });
        var t = doc.createElement('span'); t.className = 'file__t'; t.appendChild(n); t.appendChild(s); row.appendChild(ico); row.appendChild(t); row.appendChild(b); list.appendChild(row);
      });
    }
    $$('[data-upload]', jf).forEach(function (box) {
      var key = box.getAttribute('data-upload');
      var input = $('input[type="file"]', box);
      var multi = input.multiple;
      input.addEventListener('change', function () {
        var errs = [];
        Array.prototype.forEach.call(input.files, function (f) {
          if (f.size > MAX) errs.push(f.name + ' is bigger than 5 MB.');
          else if (!/^(image\/|application\/pdf)/.test(f.type)) errs.push(f.name + ' must be a photo or PDF.');
          else store[key] = multi ? (store[key] || []).concat(f) : [f];
        });
        input.value = '';
        renderFiles(box);
        $('.drop', box).classList.toggle('is-error', errs.length > 0);
        var e = $('.err', box); e.hidden = !errs.length; $('span', e).textContent = errs.join(' ');
      });
    });
    function fieldErr(el, msg) {
      var wrap = el.closest('.fld') || el.closest('.up');
      var e = $('.err', wrap);
      if (e) { e.hidden = !msg; $('span', e).textContent = msg || ''; }
      var t = $('.input', wrap) || $('.field__box', wrap);
      if (t) t.classList.toggle('is-error', !!msg);
    }
    jf.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var bad = [];
      var name = $('[name="name"]', jf), phone = $('[name="phone"]', jf);
      var role = chipValue('role', jf);
      if (!name.value.trim()) { fieldErr(name, 'Please tell us your name.'); bad.push(name); } else fieldErr(name, '');
      if (!validPhone(phone.value)) { fieldErr(phone, 'Please enter a 10 digit mobile number.'); bad.push(phone); } else fieldErr(phone, '');
      var roleBox = $('[data-name="role"]', jf);
      fieldErr(roleBox, role ? '' : 'Please choose a role.'); if (!role) bad.push($('.chip', roleBox));
      $$('[data-upload][data-required="true"]', jf).forEach(function (box) {
        var key = box.getAttribute('data-upload');
        var missing = !(store[key] && store[key].length);
        var label = key === 'photo' ? 'Please add a full-size photo.' : 'Please add your Aadhaar card.';
        var e = $('.err', box); e.hidden = !missing; $('span', e).textContent = missing ? label : '';
        $('.drop', box).classList.toggle('is-error', missing);
        if (missing) bad.push($('input', box));
      });
      if (bad.length) { bad[0].focus && bad[0].focus(); return; }
      var submitBtn = $('button[type="submit"]', jf), subErr = $('[data-submit-err]', jf);
      subErr.hidden = true;
      busy(submitBtn, true);
      var order = ['aadhaar', 'pan', 'certs', 'photo'];
      var all = [];
      order.forEach(function (k) { (store[k] || []).forEach(function (f) { all.push({ field: k, file: f }); }); });
      // Only the file names are sent: the sheet script has no Drive access, so the files themselves are not stored.
      Promise.resolve(all.map(function (x) { return { field: x.field, name: x.file.name, type: x.file.type, size: x.file.size }; }))
        .then(function (files) {
          return sendToSheet({
            formType: 'job-application', name: name.value.trim(), phone: digits(phone.value), service: role,
            experience: chipValue('experience', jf), area: ($('[name="area"]', jf) || {}).value || '',
            files: files, page: location.pathname, website: ($('input[name="website"]', jf) || {}).value || ''
          });
        })
        .then(function () {
          busy(submitBtn, false);
          var first = name.value.trim().split(/\s+/)[0];
          $('[data-sent-text]').textContent = 'Thank you, ' + first + '. We will call you on +91 ' + fmt(phone.value) + ' about the ' + role + ' role.';
          jf.hidden = true; $('.next').hidden = true; $('[data-sent]').hidden = false;
          $('[data-sent]').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, function () {
          busy(submitBtn, false);
          $('span', subErr).textContent = SEND_FAIL; subErr.hidden = false;
        });
    });
  }
})();
