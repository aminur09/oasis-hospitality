import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create Settings
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      brandName: 'Oasis Hospitality',
      tagline: 'Your property’s growth starts with the right partner.',
      address: '900 37TH AVE SW, Minot, ND 58701',
      phone: '701-484-1244',
      email: 'info@oasishospitality.net',
      primaryColor: '#0E6E6E',
      secondaryColor: '#C19A6B',
      darkColor: '#0B1B1E',
      lightColor: '#F7F8F8',
      accentColor: '#4C63FF',
      siteTitleSuffix: ' | Oasis Hospitality',
      defaultDescription: 'Hotel management, development, renovation, and operations across the Upper Midwest.',
      socials: {
        linkedin: 'https://www.linkedin.com/',
        facebook: 'https://www.facebook.com/',
        instagram: 'https://www.instagram.com/'
      }
    }
  });

  // Create Admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@oasis.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Site Admin',
      role: 'ADMIN',
      provider: 'local'
    }
  });

  // Sample Posts
  const posts = [
    { title: 'Driving RevPAR with Smarter Mix Management', category: 'INSIGHTS' },
    { title: 'Oasis Selected to Operate the Midtown Suites', category: 'NEWS' },
    { title: 'Brand Conversion: From Economy to Upper-Midscale in 120 Days', category: 'CASE_STUDIES' },
    { title: 'Press: Oasis Hospitality Expands Across the Upper Midwest', category: 'PRESS' },
    { title: 'How We Build Owner Confidence from Day One', category: 'INSIGHTS' }
  ];

  for (const p of posts) {
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await prisma.post.upsert({
      where: { slug },
      update: {},
      create: {
        title: p.title,
        slug,
        status: 'PUBLISHED',
        excerpt: 'Seeded content for Oasis Hospitality.',
        body: `<p>${p.title} — seeded sample content body.</p>`,
        category: p.category as any,
        tags: ['Revenue Management', 'Operations', 'Development', 'Brand Standards'],
        authorId: admin.id,
        publishedAt: new Date()
      }
    });
  }

  // Sample Projects
  const projects = [
    { title: 'Hampton Inn – Airport District', type: 'MANAGEMENT_ONLY', keys: 112, city: 'Minot', state: 'ND' },
    { title: 'Holiday Inn Express – Downtown', type: 'RENOVATION', keys: 98, city: 'Fargo', state: 'ND' },
    { title: 'Courtyard by Marriott – Riverfront', type: 'NEW_BUILD', keys: 146, city: 'Sioux Falls', state: 'SD' },
    { title: 'La Quinta – Northgate', type: 'BRAND_CONVERSION', keys: 84, city: 'Bismarck', state: 'ND' },
    { title: 'Candlewood Suites – Medical Center', type: 'MANAGEMENT_ONLY', keys: 92, city: 'Grand Forks', state: 'ND' },
    { title: 'Fairfield Inn & Suites – Westside', type: 'RENOVATION', keys: 120, city: 'Billings', state: 'MT' }
  ];

  for (const pr of projects) {
    const slug = pr.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await prisma.project.upsert({
      where: { slug },
      update: {},
      create: {
        title: pr.title,
        slug,
        status: 'PUBLISHED',
        locationCity: pr.city,
        locationState: pr.state,
        brandFlag: '',
        keys: pr.keys,
        servicesProvided: ['Operations', 'Revenue'],
        timelineStart: new Date('2024-01-01'),
        timelineEnd: new Date('2024-06-01'),
        projectType: pr.type as any,
        highlights: ['Seeded project highlight'],
        body: `<p>${pr.title} — seeded sample project body.</p>`
      }
    });
  }

  // Sample Careers
  const careers = [
    { title: 'General Manager – Hampton Inn – Minot, ND', location: 'Minot, ND', dept: 'Operations' },
    { title: 'Director of Sales – Regional (Upper Midwest)', location: 'Regional', dept: 'Sales' },
    { title: 'Housekeeping Supervisor – Fargo, ND', location: 'Fargo, ND', dept: 'Operations' }
  ];

  for (const c of careers) {
    const slug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await prisma.career.upsert({
      where: { slug },
      update: {},
      create: {
        title: c.title,
        slug,
        status: 'PUBLISHED',
        location: c.location,
        department: c.dept,
        employmentType: 'FULL_TIME',
        compensationRange: 'DOE',
        applyEmail: 'jobs@oasishospitality.net',
        body: `<p>${c.title} — seeded sample job description.</p>`
      }
    });
  }

  console.log('Seed complete.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});