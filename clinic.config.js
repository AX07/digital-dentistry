/* ==========================================================================
   CLINIC SETTINGS: Miguel Reis Digital Dentistry. Edit, save, reload.
   Text that the page shows in both languages is { pt: '…', en: '…' }.
   Anything marked TEMPLATE was not on the clinic's public pages: confirm it with the clinic before launch.
   ========================================================================== */
window.CLINIC = {
  name: 'Miguel Reis Digital Dentistry',
  shortName: 'Miguel Reis',
  tagline: 'Digital Dentistry',
  timeZone: 'Europe/Lisbon',

  brand: {
    // shown one colour, as on the shopfront sign; the palette (brushed aluminium, steel blue, navy) is in index.html :root
    logo: 'assets/logo-graphite.png',
    logoLight: 'assets/logo-white.png',
  },

  // WhatsApp from the clinic's Linktree; it is also the Lisbon phone line
  contact: { whatsapp: '351961931629', email: '' },   // TEMPLATE: the clinic's email, if they want one shown

  // "Marque a sua Avaliação": the clinic's existing Google Form. The site posts to it directly, so requests
  // arrive where they arrive today. The form only has Nome and Telefone, so the clinic and the reason are
  // added to the name ("Ana Silva · Monte Gordo · Implantes"). If the clinic adds fields to the form, put their
  // entry ids under fields.clinic and fields.reason and they are sent separately.
  booking: {
    form: 'https://docs.google.com/forms/d/e/1FAIpQLSewBC9TAXJEqLF7cyyjajmKkItqMWCYOvSOLhxtYngEwC_u8g/formResponse',
    fields: { name: 'entry.532852029', phone: 'entry.1301046870', clinic: '', reason: '' },
  },

  // the two clinics. hours: day 0 = Sunday; each day is a list of [open, close] in 24h, or null when closed
  clinics: [
    {
      id: 'lisboa', city: 'Lisboa', area: { pt: 'Avenidas Novas', en: 'Avenidas Novas' },
      lines: ['Av. Miguel Bombarda 133A', 'Avenidas Novas, Lisboa'],
      phone: '+351961931629', phoneLabel: '961 931 629', whatsapp: true,
      maps: 'https://maps.app.goo.gl/u6oPxiDJUjbkGFhY9', geo: [38.7363531, -9.1507482],
      hours: null,   // TEMPLATE: Google shows only "opens 10 am" for Lisbon. Fill in, e.g. { 1: [[10, 19]], … }
      reviews: null, // no Google reviews yet
    },
    {
      id: 'monte-gordo', city: 'Monte Gordo', area: { pt: 'Algarve', en: 'Algarve' },
      lines: ['Alameda da Índia, Ed. Katavento, Lj. 1', '8900-440 Monte Gordo'],
      phone: '+351961632803', phoneLabel: '961 632 803',
      maps: 'https://maps.app.goo.gl/xscxmjvRhZ7c7EYC6', geo: [37.1807998, -7.4487994],
      hours: { 0: null, 1: [[9, 12], [14, 19]], 2: [[9, 12], [14, 19]], 3: [[9, 12], [14, 19]], 4: [[9, 12], [14, 19]], 5: [[9, 12], [14, 19]], 6: null },
      access: { pt: 'Entrada e casa de banho acessíveis em cadeira de rodas.', en: 'Wheelchair-accessible entrance and toilet.' },
      reviews: { rating: 4.7, count: 36, url: 'https://maps.app.goo.gl/xscxmjvRhZ7c7EYC6' },   // Google, 5 November 2026
    },
  ],

  // what patients mention most in the Google reviews (Google's own topic counts, Monte Gordo, 5 November 2026)
  reviewTopics: [
    { pt: 'Simpatia', en: 'Friendliness', n: 10 },
    { pt: 'Urgências', en: 'Urgent care', n: 3 },
    { pt: 'Implantes', en: 'Implants', n: 3 },
    { pt: 'Instalações limpas', en: 'Clean facilities', n: 3 },
    { pt: 'Coroas', en: 'Crowns', n: 2 },
  ],
  // reviews quoted word for word, in the language they were written in. TEMPLATE: ask the clinic which to show.
  reviews: {
    items: [
      { quote: 'Excellent clinic, our whole family has been coming here for several years.', name: 'Урсу М.', detail: 'Google' },
    ],
  },

  // the clinic's own before/after pairs (from its Instagram). TEMPLATE: confirm the patients' consent for the
  // website, ask for the original photographs (Instagram's are 640 px), and the treatment of each case.
  cases: [
    { id: 'b', before: 'assets/case-b-before.jpg', after: 'assets/case-b-after.jpg',
      title: { pt: 'Reabilitação oral', en: 'Full-mouth rehabilitation' },
      alt: { pt: 'Sorriso do mesmo paciente', en: 'The same patient’s smile' } },
    { id: 'a', before: 'assets/case-a-before.jpg', after: 'assets/case-a-after.jpg',
      title: { pt: 'Reabilitação oral', en: 'Full-mouth rehabilitation' },
      alt: { pt: 'Sorriso da mesma paciente', en: 'The same patient’s smile' } },
  ],

  // Only treatments the clinic's own public pages show (checked 6 November 2026):
  //   implants: the logo, Google review topic "implants" (3) · crowns: review topic "crown" (2)
  //   full-mouth rehabilitation: the two cases on Instagram · fillings: review topic "filling replacement" (2) and a
  //   review of a cavity found by scan and filled · urgent care: review topic (3), and a walk-in seen within minutes
  //   cleaning: a review mentions a teeth cleaning · families: "our whole family has been coming here for years"
  // Not listed because nothing public shows them: veneers, orthodontics, whitening, root canals, extractions.
  // TEMPLATE: ask the clinic for its full list and add the rest.
  treatments: [
    { id: 'implantes', pt: ['Implantes dentários', 'Substituem um ou mais dentes em falta por uma raiz de titânio e um dente novo, planeados a partir de exames digitais.'], en: ['Dental implants', 'One or more missing teeth replaced with a titanium root and a new tooth, planned from digital scans.'] },
    { id: 'reabilitacao', pt: ['Reabilitação oral', 'Quando faltam ou estão gastos muitos dentes: o sorriso refeito por inteiro, como nos casos acima.'], en: ['Full-mouth rehabilitation', 'When many teeth are missing or worn: the whole smile rebuilt, like the cases above.'] },
    { id: 'coroas', pt: ['Coroas', 'Para proteger e reconstruir um dente partido, muito desgastado ou sobre um implante.'], en: ['Crowns', 'To protect and rebuild a broken or badly worn tooth, or to top an implant.'] },
    { id: 'restauracoes', pt: ['Cáries e restaurações', 'Tratamento de cáries e substituição de restaurações antigas.'], en: ['Fillings', 'Treating decay, and replacing old fillings.'] },
    { id: 'urgencias', pt: ['Urgências', 'Com dor ou um dente partido? Ligue: muitas vezes conseguimos vê-lo no próprio dia.'], en: ['Urgent care', 'In pain, or broke a tooth? Call us: we can often see you the same day.'] },
    { id: 'geral', pt: ['Higiene e consultas', 'Limpeza dos dentes, check-ups e prevenção, para toda a família.'], en: ['Cleaning and check-ups', 'Teeth cleaning, check-ups and prevention for the whole family.'] },
  ],
};
