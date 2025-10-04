import { Helmet } from 'react-helmet-async';

export function StaticPage({ title, notFound }: { title: string; notFound?: boolean }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Helmet>
        <title>{title} — Oasis Hospitality</title>
      </Helmet>
      <h1 className="font-serif text-3xl font-semibold">{title}</h1>
      <div className="mt-4 text-sm">
        {notFound ? (
          <p>Sorry, we couldn’t find that page. Try the links above or return to the homepage.</p>
        ) : (
          <p>Content to be provided. This is a placeholder static page.</p>
        )}
      </div>
    </div>
  );
}