import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export function HomePage() {
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: async () => (await api.get('/settings')).data });
  const { data: projects } = useQuery({ queryKey: ['projects-home'], queryFn: async () => (await api.get('/projects?perPage=6')).data });
  const { data: news } = useQuery({ queryKey: ['news-home'], queryFn: async () => (await api.get('/news?perPage=3')).data });

  return (
    <>
      <Helmet>
        <title>{settings?.brandName || 'Oasis Hospitality'} — Home</title>
        <meta name="description" content={settings?.defaultDescription || 'Hotel management, development, renovation, and operations.'} />
      </Helmet>

      {/* Hero */}
      <section className="bg-primary text-light">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Your property’s growth starts with the right partner.</h1>
          <p className="mt-4 max-w-2xl text-lg">Oasis Hospitality manages, develops, and renovates hotels across the Upper Midwest—aligning operations with ownership goals to drive RevPAR and long-term value.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/contact" className="px-5 py-2 rounded bg-accent text-white">Talk to Oasis</Link>
            <Link to="/projects" className="px-5 py-2 rounded bg-secondary text-dark">View Portfolio</Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-3xl font-semibold text-dark text-center">Management, Development, Renovation</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-light rounded-lg p-6 shadow">
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm">{s.desc}</p>
                <Link to={s.to} className="mt-4 inline-block px-4 py-2 rounded bg-accent text-white">Learn More</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KPI Stats */}
      <section className="py-8 bg-light">
        <div className="mx-auto max-w-6xl px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {kpis.map((k) => (
            <div key={k.title}>
              <div className="text-2xl font-bold text-primary">{k.value}</div>
              <div className="text-sm">{k.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-3xl font-semibold text-dark text-center">Recent Projects</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects?.items?.map((p: any) => (
              <Link to={`/projects/${p.slug}`} key={p.slug} className="block rounded-lg p-4 bg-light shadow hover:shadow-md">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm">{p.locationCity}, {p.locationState} — {prettyProjectType(p.projectType)}</p>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/projects" className="px-4 py-2 rounded bg-accent text-white">View All Projects</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-3xl font-semibold text-dark text-center">Owner Testimonials</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <blockquote key={i} className="bg-light p-6 rounded-lg shadow">
                <p className="italic">“{t.quote}”</p>
                <cite className="mt-2 block text-sm">— {t.cite}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-3xl font-semibold text-dark text-center">News & Insights</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {news?.items?.map((n: any) => (
              <Link to={`/news/${n.slug}`} key={n.slug} className="block rounded-lg p-4 bg-light shadow hover:shadow-md">
                <h3 className="text-lg font-semibold">{n.title}</h3>
                <p className="text-sm">{n.category}</p>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/news" className="px-4 py-2 rounded bg-accent text-white">Visit News</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 bg-primary text-light">
        <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Ready to partner with Oasis?</h3>
            <p>Let’s design an operational plan that meets your goals.</p>
          </div>
          <Link to="/contact" className="mt-4 md:mt-0 px-4 py-2 rounded bg-accent text-white">Contact Us</Link>
        </div>
      </section>
    </>
  );
}

function prettyProjectType(t: string) {
  switch (t) {
    case 'NEW_BUILD': return 'New Build';
    case 'RENOVATION': return 'Renovation';
    case 'BRAND_CONVERSION': return 'Brand Conversion';
    case 'MANAGEMENT_ONLY': return 'Management Only';
    default: return t;
  }
}

const services = [
  { title: 'Management Services', desc: 'Operations, revenue, staffing, compliance, reporting.', to: '/management-services' },
  { title: 'Development & Renovation', desc: 'New builds, conversions, capital upgrades.', to: '/development-renovation' },
  { title: 'Operations Excellence', desc: 'RevPAR strategy, guest satisfaction, training, SOPs.', to: '/about' }
];

const kpis = [
  { title: 'Operational leadership and owner partnerships', value: '20+ Years' },
  { title: 'Regional focus across ND, SD, MT', value: 'Upper Midwest' },
  { title: 'Smarter mix management and rate strategy', value: 'RevPAR Growth' },
  { title: 'Compliance across major flags', value: 'Brand Standards' }
];

const testimonials = [
  { quote: 'Oasis transformed our mix management approach and delivered consistent RevPAR gains.', cite: 'Owner, Upper Midwest Portfolio' },
  { quote: 'Clear communication, brand standards, and a people-first mindset.', cite: 'Franchise Partner' },
  { quote: 'Conversion to opening in 120 days—hit every milestone.', cite: 'Developer, Brand Conversion' }
];