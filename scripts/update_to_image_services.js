const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, '..', 'server', 'data', 'mtechnovate.sqlite');
const db = new DatabaseSync(dbPath);

console.log('Updating database services to match mockup image...');

// Clear existing services and insert the exact 6 services from the mockup image
db.prepare('DELETE FROM services').run();

const insertService = db.prepare(`
  INSERT INTO services (title, slug, icon, short_desc, detailed_desc, tech_tags, featured, display_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const imageServices = [
  {
    title: 'Web Development',
    slug: 'web-development',
    icon: 'Globe',
    short_desc: 'High-performance websites built with modern technologies and best practices.',
    detailed_desc: 'We engineer lightning-fast, responsive, and secure web applications designed for scale. From progressive web apps to enterprise portals, our web solutions deliver maximum performance and engagement.',
    tech_tags: JSON.stringify(['React', 'Next.js', 'Node.js', 'Tailwind CSS', 'Cloud Deployments']),
    featured: 1,
    display_order: 1
  },
  {
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    icon: 'Smartphone',
    short_desc: 'Custom mobile applications for Android and iOS that drive business growth.',
    detailed_desc: 'Native and cross-platform mobile apps engineered for fluid user journeys, offline capabilities, and high conversion rates across iOS and Android ecosystems.',
    tech_tags: JSON.stringify(['React Native', 'Flutter', 'iOS / Android', 'Mobile APIs', 'Real-Time Sync']),
    featured: 1,
    display_order: 2
  },
  {
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    icon: 'PenTool',
    short_desc: 'Creative and intuitive designs that provide seamless user experiences.',
    detailed_desc: 'User-centered design architecture, wireframing, interactive prototyping, and design systems that transform complex user journeys into delightful, effortless digital interactions.',
    tech_tags: JSON.stringify(['Figma', 'Prototyping', 'Design Systems', 'User Research', 'Wireframing']),
    featured: 1,
    display_order: 3
  },
  {
    title: 'Software Solutions',
    slug: 'software-solutions',
    icon: 'Code2',
    short_desc: 'End-to-end software solutions tailored to your business requirements.',
    detailed_desc: 'Custom enterprise software, microservices architecture, API integrations, and scalable database systems built to streamline mission-critical business workflows.',
    tech_tags: JSON.stringify(['Custom Software', 'Microservices', 'REST & GraphQL', 'SQL / NoSQL', 'System Integrations']),
    featured: 1,
    display_order: 4
  },
  {
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    icon: 'Megaphone',
    short_desc: 'Result-driven marketing strategies to increase your online presence.',
    detailed_desc: 'Data-backed search engine optimization (SEO), performance marketing, content strategy, and multi-channel campaigns that convert visitors into loyal customers.',
    tech_tags: JSON.stringify(['SEO Optimization', 'Google Ads', 'Social Marketing', 'Conversion Optimization', 'Analytics']),
    featured: 1,
    display_order: 5
  },
  {
    title: 'Support & Maintenance',
    slug: 'support-maintenance',
    icon: 'Headphones',
    short_desc: 'Reliable support and maintenance to keep your business running smoothly.',
    detailed_desc: '24/7 technical monitoring, security audits, cloud infrastructure patching, and continuous performance tuning ensuring 99.9% uptime and peace of mind.',
    tech_tags: JSON.stringify(['24/7 Monitoring', 'Security Patches', 'Bug Fixes', 'SLA Support', 'Performance Tuning']),
    featured: 1,
    display_order: 6
  }
];

for (const s of imageServices) {
  insertService.run(s.title, s.slug, s.icon, s.short_desc, s.detailed_desc, s.tech_tags, s.featured, s.display_order);
}

// Update company profile headline/tagline to match mockup
db.prepare(`
  UPDATE company_profile SET
    tagline = 'Innovate at every step',
    updated_at = datetime('now')
  WHERE id = 1
`).run();

console.log('✓ Successfully populated 6 services matching the mockup image!');
