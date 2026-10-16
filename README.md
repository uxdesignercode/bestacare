# BestaCare website, Version 2 (plain HTML, CSS, JavaScript)

Built from the Figma page **"Version 2 · Alternative"**. 22 pages, no framework, no build step needed to view it.

## Run it

- Open `index.html` in a browser (works from a folder), or
- `node tools/serve.mjs 4400` and visit http://localhost:4400

## Files

| Path | What it is |
|---|---|
| `*.html` | The pages: Home, Services, 7 service pages (`service-*.html`), FAQs, Contact, About, Our caretakers, Care guides (+6 guide pages), Work with us, Privacy and terms |
| `css/styles.css` | All styles. Colours and sizes are CSS variables at the top (`:root`), matching the Figma v2 tokens |
| `js/main.js` | FAQ accordion, call-back form and dialog, shift picker, chip filters, job application form |
| `assets/img/` | Logo and the sample photos from the Figma design |
| `tools/build.mjs`, `tools/data.mjs` | Optional. Writes the `*.html` files from shared templates so the header, footer and 7 service pages stay identical. Edit text in `tools/data.mjs`, then `node tools/build.mjs`. You can also edit the HTML files directly and ignore `tools/` |

## Before launch (TODO)

1. **Connect the forms to Google Sheets** (steps below). Until you paste the URL, forms work but nothing is saved.
2. **Placeholders from the design:** "0.0 Google rating", "00 years", "0,000 families" on Home; "Owner to add" notes on About and Privacy; team names on About; the 6 care guides (only the key points of the bedsores guide came from the design).
3. **Photos** are the free sample photos from the Figma design. Replace them with real BestaCare staff photos (with consent). Crop positions are set in `tools/build.mjs` (`PHOTOS`).
4. **Privacy and terms** is a draft. A lawyer must review it.
5. Hindi / Marathi are not included in Version 2 (the design has no language switch).

## Adding your videos

There are 8 video sections: Home ("See how we care") and the 7 service pages ("Watch"). Until you add a video they show the grey placeholder.

1. Open `tools/data.mjs` and scroll to the bottom (`VIDEOS`).
2. For each page put the video in `src`:
   - **YouTube:** the normal link, e.g. `'https://www.youtube.com/watch?v=abc123XYZ_0'` or `'https://youtu.be/abc123XYZ_0'`
   - **Vimeo:** `'https://vimeo.com/123456789'`
   - **Your own file:** copy the file into `assets/video/` and use `'assets/video/home.mp4'` (.mp4 works everywhere; keep it under about 20 MB, or use YouTube/Vimeo)
   - Optional `poster`: a picture shown before play, e.g. `'assets/video/home.jpg'`
3. Run `node tools/build.mjs`. The video then plays inside the green band when someone taps play.

YouTube videos use the privacy-friendly youtube-nocookie.com player. Set the YouTube video to **Unlisted** or **Public** (not Private).

## Forms are saved in Google Sheets (already connected)

Every call-back form (header button, hero, bands, Contact, guide pages) and the Work with us application go to the Google Sheet **BestaCare enquiries** (owner: ux.gulam@gmail.com).

- Sheet: https://docs.google.com/spreadsheets/d/1pzjugvnss2m2DFo8wZ_7rL57x5rAXU9_B90WY-0ggEI/edit
- The web app URL is in `js/main.js` (`var SHEET_URL`). The script source is `tools/google-apps-script.js`.

| Sheet tab | Columns |
|---|---|
| **Call backs** | Time, Name, Phone (+91 98765 43210), Service, Shift, Form, Page |
| **Job applications** | Time, Name, Phone, Role, Experience, Area, Documents chosen (names only), Page |

Good to know:
- The script only has **Google Sheets** permission. Uploaded documents are **not** stored, only their file names. To store them you would add Drive permission to the script (it would then be able to see all your Drive files), or change the form to say "bring your documents when we meet".
- Phones are stored as text. Names that start with `=`, `+`, `-` or `@` are stored as text, never as formulas.
- Bots are caught by a hidden field; invalid phone numbers are rejected.
- If sending fails (offline, wrong URL) the visitor sees "We could not send this. Please try again, or call 91363 76701."
- To change the script: open the sheet -> Extensions -> Apps Script (project "BestaCare form endpoint"), edit, then **Deploy -> Manage deployments -> pencil -> Version: New version -> Deploy**. The URL stays the same.
- The URL is public, so anyone who finds it could post rows. Add a CAPTCHA if you see spam.
