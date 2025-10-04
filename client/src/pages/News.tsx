import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Helmet } from 'react-helmet-async';

export function NewsPage() {
  const [params, setParams] = useSearchParams();
  const page = parseInt(params.get('page') || '1', 10);
  const category = params.get('category') || '';
  const q = params.get('q') || '';
  const { data } = useQuery({
    queryKey: ['news', page, category, q],
    queryFn: async () => (await api.get(`/news?page=${page}&category=${category}&q=${encodeURIComponent(q)}`)).data
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Helmet>
        <title>News &amp; Insights — Oasis Hospitality</title>
      </Helmet>
      <h1 className="font-serif text-3xl font-semibold">News &amp; Insights</h1>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="search"
          className="px-3 py-2 rounded border w-64"
          placeholder="Search..."
          value={q}
          onChange={(e) => setParams({ q: e.target.value, category })}
        />
        {filters.map((f) => (
          <button
            key={f.value}
            className={`px-3 py-1 rounded ${category === f.value ? 'bg-primary text-white' : 'bg-light text-dark'}`}
            onClick={() => setParams({ category: f.value })}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {data?.items?.map((n: any) => (
          <Link to={`/news/${n.slug}`} key={n.slug} className="block rounded-lg p-4 bg-light shadow hover:shadow-md">
            <h3 className="text-lg font-semibold">{n.title}</h3>
            <p className="text-sm">{n.category}</p>
          </Link>
        ))}
      </div>

      <Pagination page={data?.page || 1} perPage={data?.perPage || 10} total={data?.total || 0} onPage={(p) => setParams({ page: String(p), category, q })} />
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

const filters = [
  { label: 'All', value: '' },
  { label: 'News', value: 'NEWS' },
  { label: 'Insights', value: 'INSIGHTS' },
  { label: 'Press', value: 'PRESS' },
  { label: 'Case Studies', value: 'CASE_STUDIES' }
];