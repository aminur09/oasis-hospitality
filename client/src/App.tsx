import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/Home';
import { ProjectsPage } from './pages/Projects';
import { ProjectDetailPage } from './pages/ProjectDetail';
import { NewsPage } from './pages/News';
import { PostDetailPage } from './pages/PostDetail';
import { CareersPage } from './pages/Careers';
import { CareerDetailPage } from './pages/CareerDetail';
import { StaticPage } from './pages/Static';
import { AdminRoutes } from './pages/admin/AdminRoutes';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/management-services" element={<StaticPage title="Management Services" />} />
        <Route path="/development-renovation" element={<StaticPage title="Development & Renovation" />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<PostDetailPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/:slug" element={<CareerDetailPage />} />
        <Route path="/about" element={<StaticPage title="About Oasis Hospitality" />} />
        <Route path="/contact" element={<StaticPage title="Contact" />} />
        <Route path="/privacy" element={<StaticPage title="Privacy Policy" />} />
        <Route path="/terms" element={<StaticPage title="Terms of Service" />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<StaticPage title="Not Found" notFound />} />
      </Routes>
    </Layout>
  );
}