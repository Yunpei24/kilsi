import symbol from '../../assets/logos/kilsi_symbole_blanc.svg';
import { useLanguage } from '../../context/LanguageContext';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-white/5 py-8 px-6 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-kilsi-gray/40 text-xs mt-12">
      {/* Left side */}
      <div className="text-center sm:text-left">
        &copy; {currentYear} Kilsi AI. {t('footer.copyright')}
      </div>

      {/* Center symbol */}
      <div className="flex justify-center items-center opacity-30 hover:opacity-50 transition-opacity duration-300">
        <img
          src={symbol}
          alt="Kilsi AI Symbol"
          className="h-6 w-auto"
        />
      </div>

      {/* Right side */}
      <div className="text-center sm:text-right italic font-medium">
        {t('footer.slogan')}
      </div>
    </footer>
  );
}

export default Footer;
