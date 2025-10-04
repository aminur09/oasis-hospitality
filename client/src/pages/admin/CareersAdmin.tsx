import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type CareerForm = {
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  location: string;
  department: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'SEASONAL' | 'CONTRACT';
  applyEmail: string;
  body: string;
};

export function CareersAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-careers'], queryFn: async () => (await api.get('/admin/careers')).data });
  const { register, handleSubmit, setValue, getValues } = useForm<CareerForm>();
  const createMutation = useMutation({
    mutationFn: async (values: CareerForm) => (await api.post('/admin/careers', values)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-careers'] })
  });

  function onSubmit(values: CareerForm) {
    createMutation.mutate(values);
  }

  async function preview() {
    const slug = getValues('slug');
    if (!slug) return alert('Please provide a slug to preview.');
    try {
      const { data } = await api.get(`/admin/preview-token?type=career&slug=${encodeURIComponent(slug)}`);
      window.open(data.previewUrl, '_blank');
    } catch {
      alert('Unable to generate preview link.');
    }
  }

  return (
    <div>
      <h2 className="font-serif text-xl font-semibold">Careers</h2>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ul className="space-y-2">
            {data?.items?.map((c: any) => (
              <li key={c.id} className="p-3 bg-light rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-sm">{c.status} — {c.location} — {c.department}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Create Career</h3>
          <form className="mt-2 space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <input className="w-full px-3 py-2 rounded border" placeholder="Title" {...register('title')} onChange={(e) => setValue('slug', slugify(e.target.value))} />
            <div className="flex gap-2">
              <input className="w-full px-3 py-2 rounded border" placeholder="Slug" {...register('slug')} />
              <button type="button" className="px-3 py-2 rounded bg-secondary text-dark" onClick={preview}>Preview</button>
            </div>
            <select className="w-full px-3 py-2 rounded border" {...register('status')}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
            <input className="w-full px-3 py-2 rounded border" placeholder="Location" {...register('location')} />
            <input className="w-full px-3 py-2 rounded border" placeholder="Department" {...register('department')} />
            <div className="grid grid-cols-2 gap-2">
              <select className="w-full px-3 py-2 rounded border" {...register('employmentType')}>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="SEASONAL">Seasonal</option>
                <option value="CONTRACT">Contract</option>
              </select>
              <input className="w-full px-3 py-2 rounded border" placeholder="Apply Email" {...register('applyEmail')} />
            </div>
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