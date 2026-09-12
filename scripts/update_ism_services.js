const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, '..', 'server', 'data', 'mtechnovate.sqlite');
const db = new DatabaseSync(dbPath);

console.log('Seeding authentic ismdatatech.com services...');

db.prepare('DELETE FROM services').run();

const insertService = db.prepare(`
  INSERT INTO services (title, slug, icon, short_desc, detailed_desc, tech_tags, featured, display_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const ismServices = [
  {
    title: 'USA Documentation & Vital Records',
    slug: 'usa-documentation-vital-records',
    icon: 'FileText',
    short_desc: 'Accurate entry and processing of birth, death, and marriage certificates per US government standards.',
    detailed_desc: 'We provide accurate and efficient USA documentation services, ensuring data consistency and compliance with international standards. Our experienced team handles complex documentation processes with precision, helping clients save time and maintain quality in every project.',
    tech_tags: JSON.stringify(['USA Documentation', 'Vital Records', 'Civil Registry', 'State Compliance']),
    featured: 1,
    display_order: 1
  },
  {
    title: 'Data Entry & Document Processing',
    slug: 'data-entry-document-processing',
    icon: 'Layers',
    short_desc: 'Fast, accurate typing and document processing for Spanish, Filipino, and Ceylone records.',
    detailed_desc: 'Managing input, organization, and verification of Spanish, Filipino, and Ceylone civil registry records, including birth, marriage, and death certificates, government records, and business documentation with high accuracy.',
    tech_tags: JSON.stringify(['Spanish Projects', 'Filipino Registry', 'Ceylone Records', 'Typing Projects']),
    featured: 1,
    display_order: 2
  },
  {
    title: 'Historical & Vital Records Archival',
    slug: 'historical-vital-records-archival',
    icon: 'Archive',
    short_desc: 'Transcribing and indexing handwritten baptism, burial, and historical vital documents.',
    detailed_desc: 'Accurately transcribed and indexed historical baptism documents, burial record projects, and vital certificate collections for international genealogy and archival institutions.',
    tech_tags: JSON.stringify(['Baptism Records', 'Burial Projects', 'Handwritten Indexing', 'Archival Preservation']),
    featured: 1,
    display_order: 3
  },
  {
    title: 'EPUB & Digital Publishing Services',
    slug: 'epub-digital-publishing-services',
    icon: 'BookOpen',
    short_desc: 'Conversion and formatting of digital books and printed English manuscripts into EPUB format.',
    detailed_desc: 'End-to-end conversion, formatting, and structural styling of printed books, academic literature, and complex documents into standard EPUB format, ensuring flawless layout and typography.',
    tech_tags: JSON.stringify(['EPUB Services', 'Book Extraction', 'Formatting', 'Digital Archiving']),
    featured: 1,
    display_order: 4
  },
  {
    title: 'International Voice & Semi-Voice Support',
    slug: 'international-voice-semi-voice-support',
    icon: 'Headphones',
    short_desc: 'Assisted UK & USA tax filing communication and semi-voice debit processing support.',
    detailed_desc: 'Trained international voice and semi-voice support handling US & UK tax-related communication, client documentation verification, and semi-voice debit processing projects with 24-hour responsiveness.',
    tech_tags: JSON.stringify(['UK & USA Tax Filing', 'Semi-Voice Support', 'Debit Processing', '24/7 Client Desk']),
    featured: 1,
    display_order: 5
  },
  {
    title: 'Australian Scraping & Lead Collection',
    slug: 'australian-scraping-lead-collection',
    icon: 'Cloud',
    short_desc: 'Clean, structured online data extraction and verified Australian B2B business lead collection.',
    detailed_desc: 'Our Australian scraping services deliver clean, structured, and high-quality data from trusted online sources. We extract accurate B2B contact lists, empowering businesses with actionable insights.',
    tech_tags: JSON.stringify(['Web Scraping', 'Australian Leads', 'B2B Lists', 'Data Cleansing']),
    featured: 1,
    display_order: 6
  },
  {
    title: 'XML Processing & Newspaper Zoning',
    slug: 'xml-processing-newspaper-zoning',
    icon: 'Code2',
    short_desc: 'Efficient XML conversion, DTD validation, and newspaper content indexing and zoning.',
    detailed_desc: 'We specialize in efficient XML processing services, ensuring accurate data conversion, validation, and structuring. Our team also handles newspaper zoning projects, classifying diverse newspaper content for research and archiving.',
    tech_tags: JSON.stringify(['XML Processing', 'Newspaper Zoning', 'DTD Validation', 'Media Archiving']),
    featured: 1,
    display_order: 7
  },
  {
    title: 'Healthcare Data & Medical Billing Support',
    slug: 'healthcare-data-medical-billing',
    icon: 'Activity',
    short_desc: 'Managing sensitive healthcare records and back-end support for medical billing operations.',
    detailed_desc: 'Managed sensitive healthcare-related records with accuracy and confidentiality, and delivered reliable back-end support for medical billing operations (Exela Technologies).',
    tech_tags: JSON.stringify(['Healthcare Records', 'Medical Billing', 'Confidential Entry', 'Patient File Indexing']),
    featured: 1,
    display_order: 8
  }
];

for (const s of ismServices) {
  insertService.run(s.title, s.slug, s.icon, s.short_desc, s.detailed_desc, s.tech_tags, s.featured, s.display_order);
}

console.log('✓ Successfully populated 8 ismdatatech-inspired services!');
