import { PropsWithChildren } from 'react';
import { Header } from './header/Header';
import { Footer } from './footer/Footer';

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col bg-light text-dark">
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}