import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type ProjectForm = {
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  locationCity: string;
  locationState: string;
  keys: number;
  projectType: 'NEW_BUILD' | 'RENOVATION' | 'BRAND_CONVERSION' | 'MANAGEMENT_ONLY';
  body: string;
};

export function ProjectsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-projects'], queryFn: async () => (await api.get('/admin/projects')).data });
  const { register, handleSubmit, setValue } = useForm<ProjectForm>();
  const createMutation = useMutation({
    mutationFn: async (values: ProjectForm) => (await api.post('/admin/projects', values)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-projects'] })
  });

  function onSubmit(values: ProjectForm) {
    createMutation.mutate(values);
  }

  return (
    <div>
      <h2 className="font-serif text-xl font-semibold">Projects</h2>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ul className="space-y-2">
            {data?.items?.map((p: any) => (
              <li key={p.id} className="p-3 bg-light rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm">{p.status} — {prettyProjectType(p.projectType)} — {p.locationCity}, {p.locationState}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Create Project</h3>
          <form className="mt-2 space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <input className="w-full px-3 py-2 rounded border" placeholder="Title" {...register('title')} onChange={(e) => setValue('slug', slugify(e.target.value))} />
            <input className="w-full px-3 py-2 rounded border" placeholder="Slug" {...register('slug')} />
            <select className="w-full px-3 py-2 rounded border" {...register('status')}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input className="w-full px-3 py-2 rounded border" placeholder="City" {...register('locationCity')} />
              <input className="w-full px-3 py-2 rounded border" placeholder="State" {...register('locationState')} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input className="w-full px-3 py-2 rounded border" type="number" placeholder="Keys" {...register('keys', { valueAsNumber: true })} />
              <select className="w-full px-3 py-2 rounded border" {...register('projectType')}>
                <option value="NEW_BUILD">New Build</option>
                <option value="RENOVATION">Renovation</option>
                <option value="BRAND_CONVERSION">Brand Conversion</option>
                <option value="MANAGEMENT_ONLY">Management Only</option>
              </select>
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

function prettyProjectType(t: string) {
  switch (t) {
    case 'NEW_BUILD': return 'New Build';
    case 'RENOVATION': return 'Renovation';
    case 'BRAND_CONVERSION': return 'Brand Conversion';
    case 'MANAGEMENT_ONLY': return 'Management Only';
    default: return t;
  }
}