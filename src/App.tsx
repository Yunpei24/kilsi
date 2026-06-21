import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar'
import HeroSection from './components/hero/HeroSection'
import AboutSection from './components/about/AboutSection'
import ServicesSection from './components/services/ServicesSection'
import TeamSection from './components/team/TeamSection'
import FAQSection from './components/faq/FAQSection'
import ContactSection from './components/contact/ContactSection'
import BranchPage from './components/branch/BranchPage'
import BlogListPage from './components/blog/BlogListPage'
import BlogPostPage from './components/blog/BlogPostPage'
import ScrollToTop from './components/layout/ScrollToTop'
import PageTransition from './components/layout/PageTransition'
import { useLanguage } from './context/LanguageContext';

function Home() {
  const { language } = useLanguage();

  useEffect(() => {
    if (language === 'fr') {
      document.title = "Kilsi AI — Intelligence built in Africa, designed for the world";
      document.querySelector('meta[name="description"]')?.setAttribute(
        'content', 
        "Kilsi AI — Solutions d'intelligence artificielle, ingénierie logicielle, data, drone et cloud. Ouagadougou, Burkina Faso."
      );
      document.querySelector('meta[property="og:description"]')?.setAttribute(
        'content', 
        "Solutions technologiques d'excellence — IA, logiciel, data, drone, cloud et formation."
      );
      document.documentElement.setAttribute('lang', 'fr');
    } else {
      document.title = "Kilsi AI — Intelligence built in Africa, designed for the world";
      document.querySelector('meta[name="description"]')?.setAttribute(
        'content', 
        "Kilsi AI — Artificial intelligence solutions, software engineering, data, drone, and cloud. Ouagadougou, Burkina Faso."
      );
      document.querySelector('meta[property="og:description"]')?.setAttribute(
        'content', 
        "Excellent technology solutions — AI, software, data, drone, cloud, and training."
      );
      document.documentElement.setAttribute('lang', 'en');
    }
  }, [language]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <TeamSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-kilsi-night min-h-screen">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/branches/:id" element={<PageTransition><BranchPage /></PageTransition>} />
            <Route path="/blog" element={<PageTransition><BlogListPage /></PageTransition>} />
            <Route path="/blog/:id" element={<PageTransition><BlogPostPage /></PageTransition>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
