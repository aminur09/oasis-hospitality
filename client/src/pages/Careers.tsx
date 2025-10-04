import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Helmet } from 'react-helmet-async';

export function CareersPage() {
  const [params, setParams] = useSearchParams();
  const page = parseInt(params.get('page') || '1', 10);
  const location = params.get('location') || '';
  const dept = params.get('dept') || '';
  const { data } = useQuery({
    queryKey: ['careers', page, location, dept],
    queryFn: async () => (await api.get(`/careers?page=${page}&location=${location}&dept=${dept}`)).data
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Helmet>
        <title>Careers — Oasis Hospitality</title>
      </Helmet>
      <h1 className="font-serif text-3xl font-semibold">Careers at Oasis</h1>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="search"
          className="px-3 py-2 rounded border w-64"
          placeholder="Filter location..."
          value={location}
          onChange={(e) => setParams({ location: e.target.value, dept })}
        />
        <input
          type="search"
          className="px-3 py-2 rounded border w-64"
          placeholder="Filter department..."
          value={dept}
          onChange={(e) => setParams({ location, dept: e.target.value })}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {data?.items?.map((c: any) => (
          <Link to={`/careers/${c.slug}`} key={c.slug} className="block rounded-lg p-4 bg-light shadow hover:shadow-md">
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="text-sm">{c.location} — {c.department}</p>
          </Link>
        ))}
      </div>

      <Pagination page={data?.page || 1} perPage={data?.perPage || 10} total={data?.total || 0} onPage={(p) => setParams({ page: String(p), location, dept })} />
    </div>
  );
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