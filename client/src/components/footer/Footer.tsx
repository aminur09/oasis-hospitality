import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-dark text-light mt-12" aria-label="Footer">
      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-xl font-semibold">Oasis Hospitality</h3>
          <p className="mt-2 text-sm">900 37TH AVE SW, Minot, ND 58701</p>
          <p className="mt-1 text-sm"><a href="tel:7014841244" className="underline">701-484-1244</a></p>
          <p className="mt-1 text-sm"><a href="mailto:info@oasishospitality.net" className="underline">info@oasishospitality.net</a></p>
          <div className="mt-3 flex gap-3">
            <a href="https://www.linkedin.com/" aria-label="LinkedIn" className="underline">LinkedIn</a>
            <a href="https://www.facebook.com/" aria-label="Facebook" className="underline">Facebook</a>
            <a href="https://www.instagram.com/" aria-label="Instagram" className="underline">Instagram</a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <nav className="mt-2 flex flex-col gap-2">
            <Link to="/projects" className="underline">Portfolio</Link>
            <Link to="/news" className="underline">News & Insights</Link>
            <Link to="/careers" className="underline">Careers</Link>
            <Link to="/management-services" className="underline">Management Services</Link>
            <Link to="/development-renovation" className="underline">Development & Renovation</Link>
          </nav>
        </div>
        <div>
          <h4 className="font-semibold">Get in Touch</h4>
          <p className="mt-2 text-sm">Ready to discuss your property’s goals? We’d love to connect.</p>
          <Link to="/contact" className="inline-block mt-3 px-4 py-2 rounded bg-accent text-white">Contact Us</Link>
        </div>
      </div>
      <div className="border-t border-slate-700">
        <div className="mx-auto max-w-6xl px-4 py-4 text-sm flex items-center justify-between">
          <p>© {new Date().getFullYear()} Oasis Hospitality. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link to="/privacy" className="underline">Privacy Policy</Link>
            <Link to="/terms" className="underline">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}