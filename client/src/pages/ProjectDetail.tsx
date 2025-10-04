import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../lib/api';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const { data } = useQuery({ queryKey: ['project', slug], queryFn: async () => (await api.get(`/projects/${slug}`)).data });

  if (!data) return <div className="mx-auto max-w-6xl px-4 py-8">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Helmet>
        <title>{data.title} — Oasis Hospitality</title>
        <meta name="description" content={data.ogDescription || data.excerpt || ''} />
      </Helmet>
      <nav className="text-sm">
        <Link to="/projects" className="underline">Back to Portfolio</Link>
      </nav>
      <h1 className="font-serif text-3xl font-semibold mt-4">{data.title}</h1>
      <p className="mt-2 text-sm">{data.locationCity}, {data.locationState} — {prettyProjectType(data.projectType)} · {data.keys} keys</p>
      <article className="prose max-w-none mt-6" dangerouslySetInnerHTML={{ __html: data.body }} />
      {data.highlights?.length ? (
        <ul className="mt-4 list-disc pl-6">
          {data.highlights.map((h: string, i: number) => <li key={i}>{h}</li>)}
        </ul>
      ) : null}
      <section className="mt-8">
        <h2 className="font-serif text-2xl font-semibold">More Projects</h2>
        <RelatedProjects />
      </section>
    </div>
  );
}

function RelatedProjects() {
  const { data } = useQuery({ queryKey: ['projects-related'], queryFn: async () => (await api.get('/projects?perPage=3')).data });
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {data?.items?.map((p: any) => (
        <Link to={`/projects/${p.slug}`} key={p.slug} className="block rounded-lg p-4 bg-light shadow hover:shadow-md">
          <h3 className="text-lg font-semibold">{p.title}</h3>
          <p className="text-sm">{p.locationCity}, {p.locationState} — {prettyProjectType(p.projectType)}</p>
        </Link>
      ))}
    </div>
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