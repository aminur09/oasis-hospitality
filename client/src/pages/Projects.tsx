import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Helmet } from 'react-helmet-async';

export function ProjectsPage() {
  const [params, setParams] = useSearchParams();
  const page = parseInt(params.get('page') || '1', 10);
  const type = params.get('type') || '';
  const { data } = useQuery({
    queryKey: ['projects', page, type],
    queryFn: async () => (await api.get(`/projects?page=${page}&type=${type}`)).data
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Helmet>
        <title>Portfolio — Oasis Hospitality</title>
      </Helmet>
      <h1 className="font-serif text-3xl font-semibold">Portfolio</h1>

      <div className="mt-4 flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            className={`px-3 py-1 rounded ${type === f.value ? 'bg-primary text-white' : 'bg-light text-dark'}`}
            onClick={() => setParams({ type: f.value })}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {data?.items?.map((p: any) => (
          <Link to={`/projects/${p.slug}`} key={p.slug} className="block rounded-lg p-4 bg-light shadow hover:shadow-md">
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p className="text-sm">{p.locationCity}, {p.locationState} — {prettyProjectType(p.projectType)}</p>
          </Link>
        ))}
      </div>

      <Pagination page={data?.page || 1} perPage={data?.perPage || 12} total={data?.total || 0} onPage={(p) => setParams({ page: String(p), type })} />
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

function Pagination({ page, perPage, total, onPage }: { page: number; perPage: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="mt-6 flex gap-2">
      <button className="px-3 py-1 rounded bg-light" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
      <span className="px-2 py-1">Page {page} of {pages}</span>
      <button className="px-3 py-1 rounded bg-light" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
    </div>
  );
}

const filters = [
  { label: 'All', value: '' },
  { label: 'New Build', value: 'NEW_BUILD' },
  { label: 'Renovation', value: 'RENOVATION' },
  { label: 'Brand Conversion', value: 'BRAND_CONVERSION' },
  { label: 'Management Only', value: 'MANAGEMENT_ONLY' }
];