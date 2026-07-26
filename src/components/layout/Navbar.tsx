import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useScrollDirection from '../../hooks/useScrollDirection';
import BrandLogo from '../ui/BrandLogo';
import { useLanguage } from '../../context/LanguageContext';

function Navbar() {
  const { isAtTop } = useScrollDirection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBranchesOpen, setIsBranchesOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (!isMenuOpen) {
      setIsBranchesOpen(false);
    }
  }, [isMenuOpen]);

  const branches = [
    { name: 'Kilsi Studio', id: 'studio' },
    { name: 'Kilsi AI', id: 'ai' },
    { name: 'Kilsi Data', id: 'data' },
    { name: 'Kilsi Drone', id: 'drone' },
    { name: 'Kilsi Cloud', id: 'cloud' },
    { name: 'Kilsi Academy', id: 'academy' },
  ];

  const navLinks = [
    { label: t('nav.home'), href: '/#hero' },
    { label: t('nav.about'), href: '/#about' },
    { label: t('nav.services'), href: '/#services' },
    { label: t('nav.team'), href: '/#team' },
    { label: t('nav.blog'), href: '/blog' },
    { label: t('nav.contact'), href: '/#contact' },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const isHomePage = window.location.pathname === '/';
    if (isHomePage && href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 py-4 px-6 lg:px-12 flex justify-between items-center ${
          isAtTop && !isMenuOpen
            ? 'bg-transparent border-b border-transparent'
            : 'bg-kilsi-night/95 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.2)]'
        }`}
      >
        {/* Logo */}
        <Link
          to="/#hero"
          className="flex items-center z-55 transition-transform duration-300 hover:scale-102"
          onClick={(e) => handleNavClick(e, '/#hero')}
          aria-label="Kilsi Tech — Accueil"
        >
          <BrandLogo variant="nav" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => {
            if (link.href === '/#services') {
              return (
                <div key={link.href} className="relative group/dropdown py-2">
                  <button className="flex items-center gap-1 text-sm font-medium tracking-wider text-kilsi-light/70 hover:text-kilsi-light transition-colors duration-300 focus:outline-none cursor-pointer">
                    {link.label}
                    <svg className="w-3 h-3 transition-transform duration-300 group-hover/dropdown:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover/dropdown:block w-52 pt-2 z-50">
                    <div className="bg-kilsi-night/95 backdrop-blur-2xl border border-white/5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden p-1.5 flex flex-col">
                      {branches.map((b) => (
                        <Link
                          key={b.id}
                          to={`/branches/${b.id}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="px-3.5 py-2.5 text-xs font-semibold tracking-wider text-kilsi-light/80 hover:text-kilsi-gold hover:bg-white/5 rounded-lg transition-colors duration-200 text-left"
                        >
                          {b.name}
                        </Link>
                      ))}
                      <div className="h-[1px] bg-white/5 my-1.5" />
                      <Link
                        to="/#services"
                        onClick={(e) => handleNavClick(e, '/#services')}
                        className="px-3.5 py-2 text-xs font-bold tracking-wider text-kilsi-sky hover:text-kilsi-gold hover:bg-white/5 rounded-lg transition-colors duration-200 text-left flex items-center justify-between"
                      >
                        {language === 'fr' ? 'Toutes les solutions' : 'All solutions'}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative text-sm font-medium tracking-wider text-kilsi-light/70 hover:text-kilsi-light transition-colors duration-300 py-2 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-kilsi-gold transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </Link>
            );
          })}

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="text-xs font-semibold tracking-widest text-kilsi-light/60 hover:text-kilsi-gold transition-colors duration-300 border border-white/10 rounded-md px-2 py-1 flex gap-1 items-center bg-white/5"
            aria-label={t('nav.toggle')}
          >
            <span className={language === 'fr' ? 'text-kilsi-gold font-bold' : ''}>FR</span>
            <span className="opacity-40">|</span>
            <span className={language === 'en' ? 'text-kilsi-gold font-bold' : ''}>EN</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 z-55 text-kilsi-light focus:outline-none"
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-[2px] bg-current transform transition-all duration-300 origin-center ${
              isMenuOpen ? 'rotate-45 translate-y-[6px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-current my-[4px] transition-all duration-200 ${
              isMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-current transform transition-all duration-300 origin-center ${
              isMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-kilsi-night/98 backdrop-blur-2xl flex flex-col justify-center items-center transition-all duration-500 md:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link, index) => {
            if (link.href === '/#services') {
              return (
                <div key={link.href} className="flex flex-col items-center">
                  <button
                    onClick={() => setIsBranchesOpen(!isBranchesOpen)}
                    className={`font-display text-2xl font-semibold tracking-widest text-kilsi-light/80 hover:text-kilsi-gold transition-colors duration-300 flex items-center gap-2 ${
                      isMenuOpen ? 'animate-reveal-up' : ''
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {link.label}
                    <svg className={`w-5 h-5 transition-transform duration-300 ${isBranchesOpen ? 'rotate-180 text-kilsi-gold' : 'text-kilsi-light/50'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Collapsible Submenu */}
                  <div className={`overflow-hidden transition-all duration-300 flex flex-col items-center gap-4 ${isBranchesOpen ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {branches.map((b) => (
                      <Link
                        key={b.id}
                        to={`/branches/${b.id}`}
                        onClick={(e) => {
                          handleNavClick(e, `/branches/${b.id}`);
                        }}
                        className="font-display text-lg font-medium tracking-wide text-kilsi-light/60 hover:text-kilsi-gold transition-colors duration-200"
                      >
                        {b.name}
                      </Link>
                    ))}
                    <Link
                      to="/#services"
                      onClick={(e) => {
                        handleNavClick(e, '/#services');
                      }}
                      className="font-display text-sm font-bold tracking-widest text-kilsi-sky hover:text-kilsi-gold transition-colors duration-200 uppercase"
                    >
                      {language === 'fr' ? 'Toutes les solutions' : 'All solutions'}
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`font-display text-2xl font-semibold tracking-widest text-kilsi-light/80 hover:text-kilsi-gold transition-colors duration-300 ${
                  isMenuOpen ? 'animate-reveal-up' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Mobile Language Switcher */}
          <div 
            className={`mt-6 flex gap-4 border border-white/10 rounded-lg px-4 py-2 bg-white/5 items-center transition-all duration-500 delay-300 ${
              isMenuOpen ? 'animate-reveal-up opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={() => { setLanguage('fr'); handleLinkClick(); }}
              className={`text-sm font-semibold tracking-widest transition-colors duration-300 ${
                language === 'fr' ? 'text-kilsi-gold font-bold' : 'text-kilsi-light/50'
              }`}
            >
              FRANÇAIS
            </button>
            <span className="text-white/10">|</span>
            <button
              onClick={() => { setLanguage('en'); handleLinkClick(); }}
              className={`text-sm font-semibold tracking-widest transition-colors duration-300 ${
                language === 'en' ? 'text-kilsi-gold font-bold' : 'text-kilsi-light/50'
              }`}
            >
              ENGLISH
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
