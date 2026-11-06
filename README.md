# Miguel Reis Digital Dentistry: website

A one-page site for the clinic's two practices, **Lisboa (Avenidas Novas)** and **Monte Gordo (Algarve)**. It is in Portuguese with an English version (the EN/PT switch, or `?lang=en`). Built from the `anchor` template (implants and full-arch) in `templates/`.

Static site (`index.html`, `clinic.config.js`, `assets/`). It deploys to Vercel with no build step.

## Sources (5 November 2026)

- **Linktree** (linktr.ee/miguelreisdigitaldentistry): the tagline "Holistic · Digital · Evidence-based Dentistry", the logo, WhatsApp 961 931 629, the two Maps links and the booking form.
- **Google Maps, Monte Gordo:** the address, phone 961 632 803 and hours (Mon–Fri 9–12 and 14–19). 4.7 from 36 reviews. Wheelchair-accessible entrance and toilet. Review topics: friendliness 10, urgent care 3, implants 3, clean facilities 3, crowns 2.
- **Google Maps, Lisboa:** Av. Miguel Bombarda 133A and phone 961 931 629. No reviews. The listed website (digitaldentistry.pt) does not resolve.
- **Google Form "Marcar Avaliação":** fields Nome and Telefone.
- **The clinic's feedback (6 November 2026):** Miguel's implantology and university teaching, the team behind both clinics, laser scanning, digital planning and in-house 3D manufacturing. Keep the headline.
- **Doctoralia** (doctoralia.com.pt/perfil/miguel-reis-2): "Prof. Miguel Reis", the specialist areas (implantology, orthodontics, children's dentistry, endodontics, oral surgery, fixed and removable prosthetics, periodontics), "laboratório de prótese integrado", and a multidisciplinary, evidence-based approach.
- **Dialnet** (thesis 202688): Miguel Reis de Almeida, PhD, Programa de Doctorado en Ciencias Odontológicas, Universidade de Santiago de Compostela, 2018. **Cancer Biomarkers 2015** (PMC12928514): affiliation, Oral Surgery and Implantology Unit, Faculty of Medicine and Dentistry, Santiago de Compostela.
- **Google Maps, Lisboa (6 November 2026):** postcode 1050-164 and hours Mon–Fri 10–16. The listing's photos show the street before the clinic opened (another business's sign), so the Lisbon card shows only the map.
- **Instagram** (@miguelreisdigitaldentistry): two before/after posts, used as the cases. The other account, @miguelreisdd, has only the logo banner.

## What's on the page

| Section | What it does |
| --- | --- |
| Hero | The Monte Gordo shopfront photo (from Google Maps). Our copy of the logo sits exactly over the logo on the sign. As you scroll it lifts off, turns white and flies into the menu bar, where it stays. The photo fades to navy and the headline rises into the middle with the facts. This is the shared `logo-dock` scene (`templates/_core/scenes/`). |
| Results | Both cases as before/after sliders. The scroll draws each slider across until the visitor takes hold of it. |
| How we work | "Holistic, digital, evidence-based", said the way a patient would: the whole mouth, seen on screen first, only what works. |
| What holds your new teeth | The 3D implant bridge comes apart part by part (shared `deconstruct` scene). |
| The technology behind the millimetre | Laser scanning, digital planning, made at the clinic in 3D. Each step has a small looping drawing. |
| Treatments | Cards with a line drawing each, drawn as they arrive. On hover the card fills navy, a light follows the pointer and the arrow moves. Clicking opens the booking form with that treatment already chosen. Plus the IRS note. |
| Four steps | Assessment, plan, treatment, follow-up. |
| Reviews | The Google rating for the brand (4.7, 36 reviews), Google's topic counts and one review word for word. The clinic cards show no per-clinic rating: the Lisbon listing has no reviews yet. |
| Who looks after you | Prof. Miguel Reis (clinical director, his degrees and teaching) and the team's areas, with the in-house prosthesis lab. |
| Two clinics | A Google map of each (loaded only when the section is near), the Monte Gordo shopfront laid on its map ("look for this sign"), how to get there, live open/closed status, hours, call, directions and WhatsApp. |
| FAQ, last call, footer | The footer includes the Livro de Reclamações link. |
| Booking | Clinic → reason → name and mobile, sent to the clinic's own Google Form. Choosing "in pain" shows that clinic's phone number. |

## Look

Taken from the shopfronts: brushed aluminium (light grounds and the metal buttons), steel blue (actions), navy graphite (dark sections), and the logo in one colour as on the sign (`logo-white*`, `logo-graphite*`).

Page-wide motion: the dark sections, the 3D stage and the clinics open from an inset card to full width as they arrive. A brushed-metal reading line runs under the header, and the words under headings drift a little slower than the page. With reduced motion all of it stays still.

## Opening it straight from the disk

The scenes are bundled into one script, `assets/sx/scenes.bundle.js`, so the page also works when you double-click `index.html`. Browsers refuse separate script modules from the disk, which is why the 3D model did not show before. three.js still loads from the CDN, so you need to be online. After changing a scene in `templates/_core/scenes/`, rebuild:

```bash
node ../../templates/_core/scenes/bundle.mjs assets/sx deconstruct logo-dock
```

## Booking

The site posts straight to the existing Google Form (`booking` in `clinic.config.js`), so requests land in the same place as today. The form has only Nome and Telefone, so the name arrives as "Ana Silva · Monte Gordo · Implantes / dentes fixos" (with "· EN" from the English page). If the clinic adds "Clínica" and "Motivo" questions to the form, put their `entry.…` ids in `booking.fields.clinic` and `booking.fields.reason`. If sending fails, the visitor is offered the same message on WhatsApp.

## To confirm with the clinic before launch (TEMPLATE)

- The **shopfront photo** is from their Google Maps listing: confirm it is theirs, or take a new one (straight on, the sign centred, landscape and portrait). If the framing changes, re-measure `data-mark` / `data-mark-tall` on the hero.
- **Patient consent** to show both cases on the website, and the **original photos**. Instagram's copies are only 640 px wide, so they look soft on large screens.
- The **treatment** in each case (`cases[].title`).
- **Lisbon opening hours**: Mon–Fri 10–16, from Google (`clinics[0].hours`).
- **Miguel's credentials:** the master's in oral medicine, oral surgery and implantology, and the OMD specialty in oral surgery, were seen only in a search engine's copy of digitaldentistry.pt/about, which no longer loads. Confirm them, plus the university where he teaches now and his role there, and his OMD number.
- **The team:** names, roles and photos, and a portrait of Miguel, to replace the logo mark on his card. Confirm "diretor clínico".
- **A photo of the Lisbon clinic**, ideally straight on, with the sign.
- The **treatment list** shows only what their public pages back up (checked 6 November 2026): implants (logo, Google topic), crowns (Google topic), full-mouth rehabilitation (the Instagram cases), fillings and replacing old fillings (Google topic and a review), urgent care (Google topic and a walk-in review), cleaning and check-ups (a review), English spoken (a review). Ask the clinic for anything else they offer (veneers, orthodontics, whitening, root canals…) and whether they do fixed bridges on implants, which the 3D section shows.
- The **written-quote promise**, same-day urgent appointments and English spoken.
- The **steps** of a first visit and whether the assessment is free.
- **Reviews** to quote, word for word, with permission.
- **ERS registration number** of each clinic and the dentists' **OMD numbers**, for the footer.
- An **email address**, if they want one shown.
- The **domain**: `og:url`, `canonical`, `og:image` and `twitter:image` in the page head point at digital-dentistry-ten.vercel.app. Change them to the clinic's domain at launch, or link previews will keep showing the demo address.

## Link preview, icons and speed

- **Link preview** (WhatsApp, Facebook, iMessage, LinkedIn): `assets/og-image.jpg`, 1200 × 630, the white stacked logo on navy with the treatments and both towns. Previews need full URLs, so the head carries the site's address (see above). WhatsApp and Facebook cache a preview for days; after changing it, refresh it with the Facebook Sharing Debugger.
- **Icons**, all made from the logo's ring and implant: `favicon.ico` (16, 32 and 48 px), `assets/favicon-32.png`, `assets/apple-touch-icon.png` (iPhone home screen) and `assets/icon-192.png` / `icon-512.png` (Android, through `site.webmanifest`).
- **Images** are WebP. The header logos are 416 × 90, twice their size on screen.
- **3D:** three.js (the largest download) loads only after the page has finished loading, or when the visitor scrolls near the 3D section, so it never delays the first screen.
- **Vercel Web Analytics and Speed Insights:** the two `/_vercel/…/script.js` tags at the end of the page. Both must also be switched on in the Vercel project (*Analytics* and *Speed Insights* tabs). Until then the scripts return 404 and nothing is recorded. Neither uses cookies.

## Demo

The page carries `<meta name="robots" content="noindex">` while it is a demo, so search engines skip it. Remove that line at launch.

## Publishing (GitHub → Vercel)

```bash
npm install          # once
npm run dev          # preview at http://localhost:4190
npm run build:css    # after changing Tailwind classes in index.html
npm run export       # builds github/: upload its contents to the clinic's repository
```

On Vercel: *Add New → Project*, pick the repository, framework **Other**, leave the build command and output directory empty, *Deploy*.
