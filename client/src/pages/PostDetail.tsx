import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../lib/api';

export function PostDetailPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const preview = params.get('preview');

  const { data } = useQuery({
    queryKey: ['post', slug, preview],
    queryFn: async () => {
      if (preview) {
        const resp = await api.get(`/preview?type=post&slug=${slug}&token=${encodeURIComponent(preview)}`);
        return resp.data;
      }
      const resp = await api.get(`/news/${slug}`);
      return resp.data;
    }
  });

  if (!data) return <div className="mx-auto max-w-6xl px-4 py-8">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Helmet>
        <title>{data.title} — Oasis Hospitality</title>
        <meta name="description" content={data.ogDescription || data.excerpt || ''} />
        <meta property="og:title" content={data.ogTitle || data.title} />
        <meta property="og:description" content={data.ogDescription || data.excerpt || ''} />
        <meta property="og:type" content="article" />
      </Helmet>
      <nav className="text-sm">
        <Link to="/news" className="underline">Back to News</Link>
      </nav>
      <h1 className="font-serif text-3xl font-semibold mt-4">{data.title}</h1>
      <article className="prose max-w-none mt-6" dangerouslySetInnerHTML={{ __html: data.body }} />
      <section className="mt-8">
        <h2 className="font-serif text-2xl font-semibold">Related Posts</h2>
        <RelatedPosts />
      </section>
    </div>
  );
}

function RelatedPosts() {
  const { data } = useQuery({ queryKey: ['posts-related'], queryFn: async () => (await api.get('/news?perPage=3')).data });
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {data?.items?.map((p: any) => (
        <Link to={`/news/${p.slug}`} key={p.slug} className="block rounded-lg p-4 bg-light shadow hover:shadow-md">
          <h3 className="text-lg font-semibold">{p.title}</h3>
          <p className="text-sm">{p.category}</p>
        </Link>
      ))}
    </div>
  );
}