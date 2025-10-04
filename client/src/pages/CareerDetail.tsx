import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../lib/api';

export function CareerDetailPage() {
  const { slug } = useParams();
  const { data } = useQuery({ queryKey: ['career', slug], queryFn: async () => (await api.get(`/careers/${slug}`)).data });

  if (!data) return <div className="mx-auto max-w-6xl px-4 py-8">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Helmet>
        <title>{data.title} — Oasis Hospitality</title>
        <meta name="description" content={data.ogDescription || ''} />
      </Helmet>
      <nav className="text-sm">
        <Link to="/careers" className="underline">Back to Careers</Link>
      </nav>
      <h1 className="font-serif text-3xl font-semibold mt-4">{data.title}</h1>
      <p className="mt-2 text-sm">{data.location} — {data.department}</p>
      <article className="prose max-w-none mt-6" dangerouslySetInnerHTML={{ __html: data.body }} />
      <div className="mt-6">
        <a className="px-4 py-2 rounded bg-accent text-white" href={`mailto:${data.applyEmail}`}>Apply via Email</a>
      </div>
    </div>
  );
}