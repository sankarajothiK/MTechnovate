const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, '..', 'server', 'data', 'mtechnovate.sqlite');
const db = new DatabaseSync(dbPath);

console.log('Updating database to Non-IT / Global Data Technology & BPO company profile...');

// 1. Update Company Profile
const updateProfile = db.prepare(`
  UPDATE company_profile SET
    company_name = 'M TECHNOVATE SOLUTIONS',
    tagline = 'Delivering Trusted Global Data Solutions',
    ceo_name = 'RAMESH K',
    ceo_designation = 'Founder & Managing Director',
    about_text = 'M TECHNOVATE SOLUTIONS is a premier non-IT global data technology, BPO, and document processing enterprise headquartered in Kadayam, Tamil Nadu. We specialize in high-precision data processing, USA documentation & vital records management, handwritten historical document indexing, EPUB conversion, and international back-office support for clients across USA, UK, Europe, Australia, and worldwide. Driven by social responsibility and rigorous quality, we transform global data operations while creating meaningful professional careers for skilled talent in our local community.',
    ceo_message = 'At M TECHNOVATE SOLUTIONS, our mission is to deliver flawless, global-standard data solutions with 99%+ accuracy to international clients, while creating empowering, sustainable career opportunities for skilled youth and women professionals right here in Kadayam.',
    vision = 'To be an internationally recognized and trusted leader in global data processing, document digitization, and business support solutions, known for precision, reliability, and positive community transformation.',
    mission = 'To deliver accurate, dependable data and document services that adhere to the highest international quality standards, empowering global businesses with trusted data while uplifting local talent through meaningful professional employment.',
    updated_at = datetime('now')
  WHERE id = 1
`);
updateProfile.run();
console.log('✓ Company profile updated');

// 2. Clear old IT software services and insert authentic Data Tech & BPO Services
db.prepare('DELETE FROM services').run();

const insertService = db.prepare(`
  INSERT INTO services (title, slug, icon, short_desc, detailed_desc, tech_tags, featured, display_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const newServices = [
  {
    title: 'USA Documentation & Vital Records',
    slug: 'usa-documentation-vital-records',
    icon: 'ShieldCheck',
    short_desc: 'Accurate entry, validation, and indexing of birth, marriage, death, and civil registry certificates per US government standards.',
    detailed_desc: 'We provide specialized USA documentation services, ensuring rigorous data consistency, compliance, and strict confidentiality. Our experienced team handles complex civil registry documentation, vital statistics, and state archival records with 99.8% precision.',
    tech_tags: JSON.stringify(['USA Records', 'Civil Registry', 'Vital Statistics', 'Data Verification', 'Quality Audits']),
    featured: 1,
    display_order: 1
  },
  {
    title: 'Global Data Entry & Document Processing',
    slug: 'global-data-entry-document-processing',
    icon: 'Layers',
    short_desc: 'End-to-end data processing for Spanish, Filipino, Ceylone, and multi-language international projects.',
    detailed_desc: 'High-throughput data extraction, transcription, and form processing. From handwritten logs and commercial invoices to international civil records, our skilled operators deliver error-free structured data ready for corporate databases.',
    tech_tags: JSON.stringify(['Multilingual Processing', 'Spanish Data', 'Filipino Registry', 'High-Speed Typing', 'Form Processing']),
    featured: 1,
    display_order: 2
  },
  {
    title: 'Historical & Vital Records Archival',
    slug: 'historical-vital-records-archival',
    icon: 'Code2',
    short_desc: 'Transcribing and indexing centuries-old handwritten baptism, burial, and census documents for global archives.',
    detailed_desc: 'Preserving history with utmost precision. Our specialized indexing team carefully deciphers and transcribes historical handwritten church registries, baptism records, and burial logs for leading genealogy and national archival organizations.',
    tech_tags: JSON.stringify(['Handwritten Indexing', 'Baptism Records', 'Burial Logs', 'Genealogy Archiving', 'Historical Records']),
    featured: 1,
    display_order: 3
  },
  {
    title: 'EPUB & Digital Publishing Services',
    slug: 'epub-digital-publishing-services',
    icon: 'Smartphone',
    short_desc: 'Conversion, formatting, and extraction of digital books and printed English manuscripts into EPUB/Kindle.',
    detailed_desc: 'Professional digital publishing services converting physical books, academic journals, and complex manuscripts into fully responsive EPUB3, Mobi, and XML formats, ensuring flawless typography and structure across all e-readers.',
    tech_tags: JSON.stringify(['EPUB3 Conversion', 'Kindle Formatting', 'Printed Book Extraction', 'Typesetting', 'Proofreading']),
    featured: 1,
    display_order: 4
  },
  {
    title: 'International Voice & Semi-Voice BPO',
    slug: 'international-voice-semi-voice-bpo',
    icon: 'Terminal',
    short_desc: 'Dedicated back-office voice and semi-voice support for UK & USA tax filing and debit dispute processing.',
    detailed_desc: 'Our trained international support associates handle US & UK tax filing communication, client documentation verification, debit support, and back-office helpdesk services with high professionalism and 24-hour responsiveness.',
    tech_tags: JSON.stringify(['US & UK Tax Filing', 'International Semi-Voice', 'Debit Support', 'Client Communication', '24/7 BPO']),
    featured: 1,
    display_order: 5
  },
  {
    title: 'Australian Scraping & B2B Lead Generation',
    slug: 'australian-scraping-b2b-leads',
    icon: 'Cloud',
    short_desc: 'Clean, structured online data extraction and verified, actionable B2B contact lists for enterprise clients.',
    detailed_desc: 'Delivering verified Australian business intelligence, company directories, web scraping, and B2B lead lists. We clean, de-duplicate, and enrich datasets so sales and marketing teams can execute high-conversion campaigns.',
    tech_tags: JSON.stringify(['Web Scraping', 'Australian B2B Leads', 'Data Cleansing', 'Contact Enrichment', 'Excel/CSV Stacks']),
    featured: 1,
    display_order: 6
  },
  {
    title: 'XML Processing & Newspaper Zoning',
    slug: 'xml-processing-newspaper-zoning',
    icon: 'Cpu',
    short_desc: 'Efficient XML conversion, DTD validation, and newspaper content classification for digital preservation.',
    detailed_desc: 'Specialized newspaper article zoning, headline indexing, and high-volume XML data structuring. We enable media houses, researchers, and university libraries to digitize paper archives into searchable electronic repositories.',
    tech_tags: JSON.stringify(['XML Tagging', 'DTD Validation', 'Newspaper Zoning', 'Media Archival', 'Content Structuring']),
    featured: 1,
    display_order: 7
  },
  {
    title: 'Healthcare Data & Medical Billing Support',
    slug: 'healthcare-data-medical-billing',
    icon: 'ShieldCheck',
    short_desc: 'Confidential healthcare records management, patient file indexing, and medical billing back-end support.',
    detailed_desc: 'Back-office operations support for global medical billing firms and healthcare providers. Strict confidentiality, HIPAA compliance awareness, and accurate patient demographic and billing entry.',
    tech_tags: JSON.stringify(['Healthcare Data', 'Medical Billing', 'Confidential Entry', 'Patient File Indexing', 'HIPAA Standards']),
    featured: 1,
    display_order: 8
  }
];

for (const s of newServices) {
  insertService.run(s.title, s.slug, s.icon, s.short_desc, s.detailed_desc, s.tech_tags, s.featured, s.display_order);
}
console.log(`✓ Seeded ${newServices.length} authentic Data Technology & BPO services`);

// 3. Clear old jobs and insert authentic BPO & Data Tech Openings
db.prepare('DELETE FROM jobs').run();

const insertJob = db.prepare(`
  INSERT INTO jobs (
    title, department, location, employment_type, experience,
    salary_range, skills, description, responsibilities, requirements,
    posted_date, deadline, is_active
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, date('now'), ?, 1)
`);

const newJobs = [
  {
    title: 'Data Processing & Entry Executive',
    department: 'Data Operations',
    location: 'Kadayam Office',
    employment_type: 'Full Time',
    experience: '0–2 Years (Freshers Welcome)',
    salary_range: '₹1,80,000 – ₹2,50,000 / yr + Performance Bonus',
    skills: 'Typing Speed (35+ WPM), Basic English, MS Excel, Accuracy, Attention to Detail',
    description: 'We are hiring dedicated Data Entry & Document Processing Executives to work on international records management, Spanish/Filipino projects, and US civil registry documents.',
    responsibilities: JSON.stringify([
      'Accurately transcribe and input handwritten and printed international records into designated database formats.',
      'Perform initial quality self-checks to ensure 99%+ accuracy benchmarks are met.',
      'Maintain daily throughput quotas assigned by team leaders.',
      'Maintain strict confidentiality of client data and identity records.'
    ]),
    requirements: JSON.stringify([
      'Any Bachelor degree or diploma (Freshers actively encouraged to apply).',
      'Good keyboard typing speed with high keystroke accuracy.',
      'Basic knowledge of MS Word, MS Excel, and computerized document management.',
      'Punctual, disciplined, and eager to learn in a supportive professional office environment.'
    ]),
    deadline: '2026-10-31'
  },
  {
    title: 'International Semi-Voice Support Associate (UK/USA Tax)',
    department: 'Voice & BPO Operations',
    location: 'Kadayam Office',
    employment_type: 'Full Time',
    experience: '0–2 Years',
    salary_range: '₹2,20,000 – ₹3,20,000 / yr',
    skills: 'Fluent English Communication, Customer Interaction, Basic Tax/Finance Awareness',
    description: 'Provide international client coordination and semi-voice support for US & UK tax filing processes and debit resolution workflows.',
    responsibilities: JSON.stringify([
      'Assist overseas clients with tax filing documentation and procedural inquiries via semi-voice/voice channels.',
      'Coordinate with senior project managers on daily resolution cases.',
      'Accurately document interaction summaries and ticket statuses.',
      'Maintain high customer satisfaction and compliance with international voice SLAs.'
    ]),
    requirements: JSON.stringify([
      'Excellent verbal and written English communication skills.',
      'Basic familiarity with commerce, financial terms, or international customer support is an advantage.',
      'Comfortable working rotational shifts matching UK/US business hours.',
      'Positive attitude with strong interpersonal and listening skills.'
    ]),
    deadline: '2026-11-15'
  },
  {
    title: 'EPUB & XML Conversion Specialist',
    department: 'Digital Publishing',
    location: 'Kadayam Office',
    employment_type: 'Full Time',
    experience: '1–3 Years',
    salary_range: '₹2,40,000 – ₹3,50,000 / yr',
    skills: 'EPUB3, HTML/CSS, XML Tagging, Proofreading, Book Formatting, Adobe InDesign',
    description: 'Format, structure, and convert printed books, literature, and educational manuscripts into flawless EPUB, Kindle, and XML outputs.',
    responsibilities: JSON.stringify([
      'Convert printed manuscripts and PDF files into structured EPUB3 and Kindle digital formats.',
      'Implement XML tagging according to client-provided DTD schemas.',
      'Validate e-books on diverse reader simulators for layout and font consistency.',
      'Identify and rectify OCR errors and character formatting inconsistencies.'
    ]),
    requirements: JSON.stringify([
      'Prior experience in EPUB conversion, e-publishing, or XML document structuring.',
      'Working knowledge of HTML, CSS, and basic XML tags.',
      'Strong eye for typographical aesthetics, margins, and layout alignment.',
      'Degree in Computer Science, Literature, or related field.'
    ]),
    deadline: '2026-10-25'
  },
  {
    title: 'Historical Records Indexing & Archival Executive',
    department: 'Archival Services',
    location: 'Kadayam Office',
    employment_type: 'Full Time',
    experience: '0–2 Years',
    salary_range: '₹1,90,000 – ₹2,70,000 / yr',
    skills: 'Cursive Handwriting Reading, Attention to Detail, Transcription, Historical Indexing',
    description: 'Specialize in deciphering and indexing historical handwritten baptism, burial, and vital civil certificates for global heritage institutions.',
    responsibilities: JSON.stringify([
      'Transcribe 18th, 19th, and 20th-century handwritten church and government registers.',
      'Cross-verify historical naming conventions, dates, and locations.',
      'Collaborate with Senior Quality Auditors to achieve 99.9% indexing accuracy.',
      'Maintain daily volume targets while preserving meticulous archival precision.'
    ]),
    requirements: JSON.stringify([
      'Strong ability to read English cursive and historical handwriting scripts.',
      'High concentration, patience, and attention to detail.',
      'Basic computer literacy and proficiency with numeric/alpha keypad entry.',
      'Graduate in any discipline.'
    ]),
    deadline: '2026-11-05'
  },
  {
    title: 'Quality Assurance & Audit Analyst',
    department: 'Quality Control',
    location: 'Kadayam Office',
    employment_type: 'Full Time',
    experience: '1–3 Years',
    salary_range: '₹2,50,000 – ₹3,60,000 / yr',
    skills: 'Quality Audit, Proofreading, Error Sampling, SLA Management, Excel Reporting',
    description: 'Lead quality assurance reviews across data entry batches, ensuring 99%+ client SLA compliance before final export to overseas partners.',
    responsibilities: JSON.stringify([
      'Conduct rigorous random sampling and 100% verification checks on completed data files.',
      'Identify recurring error patterns and provide coaching feedback to data operators.',
      'Generate daily quality scorecards and batch release certifications.',
      'Liaise with the Operations Manager on workflow optimization.'
    ]),
    requirements: JSON.stringify([
      '1+ years experience in BPO / KPO quality audit, proofreading, or data verification.',
      'Thorough knowledge of quality metrics (AQL, Error % thresholds).',
      'Advanced proficiency in Microsoft Excel.',
      'Strong communication and leadership mentoring abilities.'
    ]),
    deadline: '2026-10-20'
  }
];

for (const j of newJobs) {
  insertJob.run(
    j.title, j.department, j.location, j.employment_type, j.experience,
    j.salary_range, j.skills, j.description, j.responsibilities, j.requirements,
    j.deadline
  );
}
console.log(`✓ Seeded ${newJobs.length} authentic BPO & Data Processing career listings`);

console.log('Database successfully reconfigured to Non-IT / Global Data Technology model!');
