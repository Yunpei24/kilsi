import { Link } from 'react-router-dom';
import symbol from '../../assets/logos/kilsi_symbole_blanc.svg';
import { useLanguage } from '../../context/LanguageContext';
import { company, legalDocs } from '../../data/legalData';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { language, t } = useLanguage();

  return (
    <footer className="mt-12 w-full border-t border-white/5 pt-8 pb-6 px-6 lg:px-12 text-xs text-kilsi-gray/40">
      {/* Ligne principale */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-center sm:text-left">
          &copy; {currentYear} Kilsi Tech. {t('footer.copyright')}
        </div>

        <div className="flex items-center justify-center opacity-30 transition-opacity duration-300 hover:opacity-50">
          <img src={symbol} alt="Kilsi Tech Symbol" className="h-6 w-auto" />
        </div>

        <div className="text-center font-medium italic sm:text-right">
          {t('footer.slogan')}
        </div>
      </div>

      {/* Liens légaux + identifiants d'entreprise */}
      <div className="mt-6 flex flex-col items-center gap-3 border-t border-white/5 pt-5 sm:flex-row sm:justify-between">
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {legalDocs.map((doc) => (
            <Link
              key={doc.slug}
              to={`/legal/${doc.slug}`}
              className="transition-colors duration-300 hover:text-kilsi-gold"
            >
              {doc.label[language]}
            </Link>
          ))}
        </nav>

        <p className="text-center text-[11px] text-kilsi-gray/30 sm:text-right">
          {language === 'fr' ? 'RCCM' : 'Trade reg.'} {company.rccm} · IFU {company.ifu}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
