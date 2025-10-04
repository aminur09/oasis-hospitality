import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(schema)
  });

  async function onSubmit(values: { email: string; password: string }) {
    try {
      const { data } = await api.post('/auth/login', values);
      localStorage.setItem('token', data.token);
      navigate('/admin');
    } catch (e) {
      alert('Login failed');
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="font-serif text-2xl font-semibold">Admin Login</h1>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} aria-label="Login form">
        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input id="email" type="email" className="w-full px-3 py-2 rounded border" {...register('email')} aria-invalid={!!errors.email} aria-describedby="email-error" />
          {errors.email && <p id="email-error" className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1">Password</label>
          <input id="password" type="password" className="w-full px-3 py-2 rounded border" {...register('password')} aria-invalid={!!errors.password} aria-describedby="password-error" />
          {errors.password && <p id="password-error" className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>
        <button type="submit" className="px-4 py-2 rounded bg-primary text-white" disabled={isSubmitting}>Login</button>
      </form>
    </div>
  );
}