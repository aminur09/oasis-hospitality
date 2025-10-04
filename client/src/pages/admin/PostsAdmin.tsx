import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type PostForm = {
  title: string;
  slug: string;
  category: 'NEWS' | 'INSIGHTS' | 'PRESS' | 'CASE_STUDIES';
  status: 'DRAFT' | 'PUBLISHED';
  excerpt?: string;
  body: string;
};

export function PostsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-posts'], queryFn: async () => (await api.get('/admin/posts')).data });
  const { register, handleSubmit, setValue, getValues } = useForm<PostForm>();
  const createMutation = useMutation({
    mutationFn: async (values: PostForm) => (await api.post('/admin/posts', values)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-posts'] })
  });

  function onSubmit(values: PostForm) {
    createMutation.mutate(values);
  }

  async function preview() {
    const slug = getValues('slug');
    if (!slug) return alert('Please provide a slug to preview.');
    try {
      const { data } = await api.get(`/admin/preview-token?type=post&slug=${encodeURIComponent(slug)}`);
      window.open(data.previewUrl, '_blank');
    } catch {
      alert('Unable to generate preview link.');
    }
  }

  return (
    <div>
      <h2 className="font-serif text-xl font-semibold">Posts</h2>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ul className="space-y-2">
            {data?.items?.map((p: any) => (
              <li key={p.id} className="p-3 bg-light rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm">{p.status} — {p.category}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Create Post</h3>
          <form className="mt-2 space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <input className="w-full px-3 py-2 rounded border" placeholder="Title" {...register('title')} onChange={(e) => setValue('slug', slugify(e.target.value))} />
            <div className="flex gap-2">
              <input className="w-full px-3 py-2 rounded border" placeholder="Slug" {...register('slug')} />
              <button type="button" className="px-3 py-2 rounded bg-secondary text-dark" onClick={preview}>Preview</button>
            </div>
            <select className="w-full px-3 py-2 rounded border" {...register('category')}>
              <option value="NEWS">News</option>
              <option value="INSIGHTS">Insights</option>
              <option value="PRESS">Press</option>
              <option value="CASE_STUDIES">Case Studies</option>
            </select>
            <select className="w-full px-3 py-2 rounded border" {...register('status')}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
            <input className="w-full px-3 py-2 rounded border" placeholder="Excerpt (optional)" {...register('excerpt')} />
            <ReactQuill theme="snow" onChange={(v) => setValue('body', v)} />
            <button className="px-4 py-2 rounded bg-primary text-white" type="submit">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}