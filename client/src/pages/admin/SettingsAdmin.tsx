import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/api';

type SettingsForm = {
  brandName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  primaryColor: string;
  secondaryColor: string;
  darkColor: string;
  lightColor: string;
  accentColor: string;
  siteTitleSuffix?: string;
  defaultDescription?: string;
  ga4Id?: string;
};

export function SettingsAdmin() {
  const { data } = useQuery({ queryKey: ['admin-settings'], queryFn: async () => (await api.get('/admin/settings')).data });
  const { register, handleSubmit, reset } = useForm<SettingsForm>();
  const mutation = useMutation({ mutationFn: async (values: SettingsForm) => (await api.put('/admin/settings', values)).data });

  // Initialize form when data loads
  if (data && !mutation.isLoading) {
    reset(data as any);
  }

  async function onSubmit(values: SettingsForm) {
    await mutation.mutateAsync(values);
    alert('Settings updated');
  }

  return (
    <div>
      <h2 className="font-serif text-xl font-semibold">Settings</h2>
      <form className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <input className="w-full px-3 py-2 rounded border" placeholder="Brand Name" {...register('brandName')} />
          <input className="w-full px-3 py-2 rounded border" placeholder="Tagline" {...register('tagline')} />
          <input className="w-full px-3 py-2 rounded border" placeholder="Address" {...register('address')} />
          <input className="w-full px-3 py-2 rounded border" placeholder="Phone" {...register('phone')} />
          <input className="w-full px-3 py-2 rounded border" placeholder="Email" {...register('email')} />
        </div>
        <div className="space-y-2">
          <input className="w-full px-3 py-2 rounded border" placeholder="Primary Color" {...register('primaryColor')} />
          <input className="w-full px-3 py-2 rounded border" placeholder="Secondary Color" {...register('secondaryColor')} />
          <input className="w-full px-3 py-2 rounded border" placeholder="Dark Color" {...register('darkColor')} />
          <input className="w-full px-3 py-2 rounded border" placeholder="Light Color" {...register('lightColor')} />
          <input className="w-full px-3 py-2 rounded border" placeholder="Accent Color" {...register('accentColor')} />
        </div>
        <div className="md:col-span-2 space-y-2">
          <input className="w-full px-3 py-2 rounded border" placeholder="Site Title Suffix" {...register('siteTitleSuffix')} />
          <input className="w-full px-3 py-2 rounded border" placeholder="Default Description" {...register('defaultDescription')} />
          <input className="w-full px-3 py-2 rounded border" placeholder="GA4 ID" {...register('ga4Id')} />
        </div>
        <button className="px-4 py-2 rounded bg-primary text-white md:col-span-2" type="submit">Save Settings</button>
      </form>
    </div>
  );
}