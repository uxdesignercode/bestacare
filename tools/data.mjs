// Content for the 7 services and shared copy. Text is taken from the Figma "Version 2 · Alternative" page.

export const PHONE = '91363 76701';
export const PHONE2 = '63874 05700';
export const TEL = 'tel:+919136376701';
export const WA = 'https://wa.me/919136376701';

const SAME = 'Call us and we send another trained person as quickly as we can.';
const GENDER = ['Can I ask for a male or female caretaker?', 'Yes. Tell us when we call and we will match your request.'];
const COST = ['How much does it cost?', "It depends on the patient's needs and the shift. We tell you the price on the call, before anything starts."];

export const services = [
  {
    slug: 'patient-caretaker', file: 'service-patient-caretaker.html', name: 'Patient caretaker', icon: 'hand-heart',
    blurb: 'Bathing, feeding and medicines on time', meta: '12 hr · 24 hr · Home or hospital', photo: 'care',
    sub: 'A trained caretaker for bathing, feeding, medicines and company, at home or in hospital.',
    ticks: ['Male and female caretakers', 'Home or hospital', '12 or 24 hours'], float: ['Male and female', 'caretakers'],
    video: 'What a patient caretaker does', who1: 'caretaker', whoPlural: 'caretakers',
    do: ['Bathing, dressing and personal hygiene', 'Feeding and medicines on time', 'Help with walking and turning in bed', "Keeping the patient's room clean", 'Company through the day or night'],
    dont: ['Give injections or do medical procedures (a nurse does these)', 'Cook or clean for the whole family'],
    forWho: [['home', 'Back home after a hospital stay'], ['bed', 'In bed most of the day'], ['heart', 'A parent who cannot manage alone'], ['clock', 'Family at work or living away']],
    faqs: [COST, ['What if the caretaker cannot come one day?', SAME], GENDER, ['Can the caretaker stay overnight?', 'Yes. Choose the 12 hour night shift or the 24 hour shift.'], ['Can a caretaker give injections?', 'No. Injections and medical procedures are done by a home nurse. We can send one if you need it.']],
  },
  {
    slug: 'home-nurse', file: 'service-home-nurse.html', name: 'Home nurse', icon: 'stethoscope',
    blurb: 'ICU experienced nursing at home', meta: '12 hr · 24 hr · Home or hospital', photo: 'nurse',
    sub: 'An ICU experienced nurse for medical care at home, in 12 or 24 hour shifts.',
    ticks: ['ICU experienced', 'Home or hospital', '12 or 24 hours'], float: ['ICU experienced', 'Home or hospital'],
    video: 'What a home nurse does', who1: 'nurse', whoPlural: 'nurses',
    do: ['Injections and drips as your doctor prescribes', 'Wound dressing and catheter care', 'Checking blood pressure, sugar and oxygen', 'Care for patients on oxygen or a feeding tube', 'A daily record to show your doctor'],
    dont: ['Prescribe or change medicines (your doctor decides)', 'Cook or clean for the whole family'],
    forWho: [['home', 'Home from ICU or after surgery'], ['syringe', 'Needs injections or drips at home'], ['wind', 'On oxygen, a feeding tube or catheter'], ['moon', 'Needs checks through the night']],
    faqs: [COST, ['Are your nurses ICU experienced?', 'Yes. Our home nurses have worked in ICU care.'], ["Will the nurse follow my doctor's instructions?", 'Yes. Share the prescription and the nurse follows it.'], ['Can I ask for a male or female nurse?', 'Yes. Tell us when we call and we will match your request.'], ['What if they cannot come one day?', SAME]],
  },
  {
    slug: 'ward-boy', file: 'service-ward-boy.html', name: 'Ward boy and hospital attendant', icon: 'bed',
    blurb: 'Help during a hospital stay', meta: '12 hr · 24 hr · Home or hospital', photo: 'train',
    sub: 'A trained attendant who stays with the patient during a hospital stay or at home.',
    ticks: ['Patient care boy', 'Hospital or home', '12 or 24 hours'], float: ['In hospital', 'or at home'],
    video: 'What a ward boy does', who1: 'attendant', whoPlural: 'attendants',
    do: ['Stays with the patient in the ward, day or night', 'Help with toilet, bathing and changing clothes', 'Lifts, turns and moves the patient safely', 'Takes the patient for tests in a wheelchair', 'Calls the nurse or family when needed'],
    dont: ['Give injections or medicines (a nurse does these)', 'Handle hospital bills or paperwork'],
    forWho: [['moon', 'Family cannot stay at the hospital at night'], ['users', 'A patient who needs lifting'], ['user', 'A male patient who prefers a male attendant'], ['home', 'The first days home after discharge']],
    faqs: [COST, ['Can the ward boy stay at the hospital overnight?', 'Yes. Choose the 12 hour night shift or the 24 hour shift.'], ['Do you send female attendants too?', 'Yes. Tell us when we call and we will match your request.'], ['What if they cannot come one day?', SAME]],
  },
  {
    slug: 'elderly-care', file: 'service-elderly-care.html', name: 'Elderly care', icon: 'heart',
    blurb: 'Daily support for a parent at home', meta: '12 hr · 24 hr', photo: 'elder',
    sub: 'Daily support and company for an elderly parent at home.',
    ticks: ['For parents and grandparents', 'At home', '12 or 24 hours'], float: ['Same person', 'when possible'],
    video: 'What elderly care looks like', who1: 'caretaker', whoPlural: 'caretakers',
    do: ['Help with bathing, dressing and toilet', 'Meals and medicines on time', 'Walks, light exercise and safe movement', 'Company, conversation and watching for falls', 'Going along to doctor visits'],
    dont: ['Medical procedures (a nurse does these)', 'Cook or clean for the whole family'],
    forWho: [['user', 'A parent living alone'], ['heart', 'Memory loss or confusion'], ['bed', 'Weak after an illness or a fall'], ['clock', 'Children at work all day']],
    faqs: [COST, ['Can the same caretaker come every day?', 'Yes. We try to keep the same person so your parent feels at ease.'], GENDER, ['What if they cannot come one day?', SAME]],
  },
  {
    slug: 'baby-nanny', file: 'service-baby-nanny.html', name: 'Baby nanny and newborn care', icon: 'baby',
    blurb: 'Nanny and newborn care', meta: '12 hr · 24 hr', photo: 'family',
    sub: 'A trained nanny for your newborn and support for the mother, day or night.',
    ticks: ['NICU experienced', 'At home', '12 or 24 hours'], float: ['NICU experienced', 'Day or night'],
    video: 'What a baby nanny does', who1: 'nanny', whoPlural: 'nannies',
    do: ['Bathing, massage and changing the baby', 'Help with feeding and burping', 'Settling the baby to sleep, day or night', 'Keeping baby clothes and bottles clean', 'Support for the mother after delivery'],
    dont: ['Medical treatment for the baby (your doctor decides)', 'Cook or clean for the whole family'],
    forWho: [['baby', 'The first weeks after delivery'], ['heart', 'Baby home from the NICU'], ['users', 'Twins or a premature baby'], ['user', 'Mother recovering from a C-section']],
    faqs: [COST, ['Do your nannies have NICU experience?', 'Yes. Our newborn care staff have NICU experience.'], ['Can the nanny stay at night?', 'Yes. Choose the 12 hour night shift or the 24 hour shift.'], ['What if they cannot come one day?', SAME]],
  },
  {
    slug: 'cancer-care', file: 'service-cancer-care.html', name: 'Cancer patient care', icon: 'ribbon',
    blurb: 'Support during and after treatment', meta: '12 hr · 24 hr · Home or hospital', photo: 'hands',
    sub: 'Gentle, trained care for a patient going through cancer treatment.',
    ticks: ['During and after treatment', 'Home or hospital', '12 or 24 hours'], float: ['Gentle care', 'Home or hospital'],
    video: 'How we care for cancer patients', who1: 'caretaker', whoPlural: 'caretakers',
    do: ['Personal care on weak or tired days', 'Medicines and meals on time', 'Help on chemotherapy and radiation days', 'Comfort care as your doctor advises', 'Calm company for the patient'],
    dont: ['Give chemotherapy or medical treatment', 'Change medicines without the doctor'],
    forWho: [['syringe', 'During chemotherapy or radiation'], ['bed', 'Weak after surgery'], ['moon', 'Needs care through the night'], ['heart', 'Comfort care at home']],
    faqs: [COST, ['Can a nurse come instead of a caretaker?', 'Yes. If the patient needs injections or drips, we send a home nurse.'], GENDER, ['What if they cannot come one day?', SAME]],
  },
  {
    slug: 'industrial-nursing', file: 'service-industrial-nursing.html', name: 'Industrial nursing', icon: 'hardhat',
    blurb: 'Nurses for factories and work sites', meta: '12 hr · 24 hr · On site', photo: 'nurse2',
    sub: 'Trained nurses for first aid and health checks at your workplace.',
    ticks: ['For factories, sites and offices', '12 or 24 hours'], float: ['On site', 'All shifts'],
    video: 'What an industrial nurse does', who1: 'nurse', whoPlural: 'nurses',
    do: ['First aid for injuries at work', 'Basic health checks for workers', 'Keeps the first aid room stocked and ready', 'Daily health records for the site', 'Calls an ambulance and family in an emergency'],
    dont: ['Replace a doctor or hospital', 'Work outside health and first aid'],
    forWho: [['factory', 'Factories and plants'], ['home', 'Construction sites'], ['grid', 'Warehouses'], ['users', 'Offices and events']],
    faqs: [COST, ['Can you cover all shifts at our site?', 'Yes. Tell us your shift timings and we will plan the cover.'], ['Do you offer monthly contracts?', 'Call us and we will discuss what your site needs.'], ['What if they cannot come one day?', SAME]],
  },
];

export const homeFaqs = [
  COST,
  ['What if the caretaker cannot come one day?', SAME],
  GENDER,
  ['Can the caretaker stay overnight?', 'Yes. Choose the 12 hour night shift or the 24 hour shift.'],
  ['Can a caretaker give injections?', 'No. Injections and medical procedures are done by a home nurse. We can send one if you need it.'],
];

export const faqTopics = [
  ['Cost and booking', [COST, ['How soon can someone start?', 'Call us and we tell you when the right person can start.'], ['How do I pay?', 'We explain payment on the call.']]],
  ['Our staff', [['How do you choose your caretakers?', 'We meet every caretaker in person and check their ID before they work with a family.'], GENDER, ['Can a caretaker give injections?', 'No. Injections and medical procedures are done by a home nurse. We can send one if you need it.'], ['Are your nurses ICU experienced?', 'Yes. Our home nurses have worked in ICU care.']]],
  ['Shifts', [['What shifts can I choose?', '12 hour day, 12 hour night or 24 hour.'], ['Can the caretaker stay overnight?', 'Yes. Choose the 12 hour night shift or the 24 hour shift.'], ['Can the same person come every day?', 'Yes. We try to keep the same person so the patient feels at ease.']]],
  ['Changes', [['What if they cannot come one day?', SAME.replace('Call us and we send', 'Call us and we send')], ['What if we are not happy with the caretaker?', 'Call us. We listen and send another person if needed.'], ['Do you send staff to hospitals?', 'Yes. Caretakers, nurses and ward boys can stay with the patient in hospital.']]],
];
// The Figma copy for the first "Changes" answer is "Call us and we send another trained person as quickly as we can."
faqTopics[3][1][0][1] = SAME;

export const guides = [
  { slug: 'bedsores', cat: 'Bed care', title: 'How to prevent bedsores at home', desc: 'Simple daily steps for a patient who stays in bed.', photo: 'hands', read: '5 min read · Bed care' },
  { slug: 'after-a-fall', cat: 'Elderly care', title: 'Caring for a parent after a fall', desc: 'What to change at home in the first weeks.', photo: 'elder', read: 'Elderly care' },
  { slug: 'after-surgery', cat: 'After surgery', title: 'The first week home after surgery', desc: 'What to watch for and when to call the doctor.', photo: 'bp', read: 'After surgery' },
  { slug: 'newborn', cat: 'Newborn care', title: 'Newborn care in the first month', desc: 'Feeding, sleep and bath time basics.', photo: 'family', read: 'Newborn care' },
  { slug: 'chemotherapy', cat: 'Cancer care', title: 'Food and rest during chemotherapy', desc: 'Small things that help on hard days.', photo: 'ball', read: 'Cancer care' },
  { slug: 'caretaker-or-nurse', cat: 'Choosing care', title: 'Caretaker or nurse: which do you need?', desc: 'A simple way to decide.', photo: 'nurse2', read: 'Choosing care' },
];

/* ---------- VIDEOS ----------
   Paste a link or a file for each video section. Then run:  node tools/build.mjs
   Accepted: a YouTube link (watch, youtu.be or embed), a Vimeo link, or a file in the project
   such as 'assets/video/home.mp4' (.mp4 / .webm). Optional poster image: 'assets/video/home.jpg'.
   Leave '' to keep the grey "Video: ..." placeholder. */
export const VIDEOS = {
  home: { src: '', poster: '' },
  'patient-caretaker': { src: '', poster: '' },
  'home-nurse': { src: '', poster: '' },
  'ward-boy': { src: '', poster: '' },
  'elderly-care': { src: '', poster: '' },
  'baby-nanny': { src: '', poster: '' },
  'cancer-care': { src: '', poster: '' },
  'industrial-nursing': { src: '', poster: '' },
};
