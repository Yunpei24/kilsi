import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { blogArticles, type Article } from '../../data/blogData';
import Section from '../layout/Section';
import GlowButton from '../ui/GlowButton';
import RevealOnScroll from '../ui/RevealOnScroll';
import aboutVideo from '../../assets/videos/about-bg.mp4';
import { supabase } from '../../lib/supabaseClient';

function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          const mapped: Article = {
            id: data.id,
            title: { fr: data.title_fr || '', en: data.title_en || '' },
            date: data.date || '',
            author: { fr: data.author_fr || '', en: data.author_en || '' },
            readTime: { fr: data.read_time_fr || '', en: data.read_time_en || '' },
            summary: { fr: data.summary_fr || '', en: data.summary_en || '' },
            content: { fr: data.content_fr || [], en: data.content_en || [] }
          };
          setArticle(mapped);
        } else {
          useStaticFallback();
        }
      } catch (err) {
        useStaticFallback();
      } finally {
        setLoading(false);
      }
    };

    const useStaticFallback = () => {
      const staticArt = blogArticles.find((art) => art.id === id);
      setArticle(staticArt || null);
    };

    fetchArticle();
  }, [id, language]);

  useEffect(() => {
    if (article) {
      document.title = `${article.title[language]} — Kilsi Insights`;
      document.querySelector('meta[name="description"]')?.setAttribute(
        'content', 
        article.summary[language]
      );
    }
  }, [article, language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-kilsi-night flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-kilsi-gold border-solid mb-4" />
        <p className="text-kilsi-gray text-sm">Chargement de l'article / Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-kilsi-night flex flex-col items-center justify-center text-center p-6">
        <h1 className="font-display text-4xl font-bold text-kilsi-light mb-4">404</h1>
        <p className="text-kilsi-gray mb-8">Article non trouvé / Article not found</p>
        <Link to="/blog">
          <GlowButton variant="gold">
            Retour au blog / Back to Blog
          </GlowButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-kilsi-night text-kilsi-light min-h-screen">
      {/* Hero Header */}
      <Section id="post-hero" videoSrc={aboutVideo} overlayOpacity={0.85}>
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
          {/* Back to Blog */}
          <Link
            to="/blog"
            className="absolute top-28 left-6 md:left-12 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-kilsi-light/50 hover:text-kilsi-gold transition-colors duration-300 uppercase border border-white/5 bg-white/5 px-3 py-2 rounded-lg"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Blog
          </Link>

          {/* Date & Read Time */}
          <div className="mb-4 inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-kilsi-gold animate-fade-in">
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime[language]}</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-kilsi-light mb-6 opacity-0 animate-fade-in leading-tight" style={{ animationDelay: '0.2s' }}>
            {article.title[language]}
          </h1>

          {/* Author */}
          <p className="text-sm text-kilsi-gray/70 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {language === 'fr' ? 'Par' : 'By'} <strong className="text-kilsi-light">{article.author[language]}</strong>
          </p>
        </div>
      </Section>

      {/* Article Content */}
      <article className="py-20 px-6 lg:px-12 max-w-3xl mx-auto">
        <RevealOnScroll direction="up">
          <div className="flex flex-col gap-6 text-kilsi-gray text-base md:text-lg leading-relaxed font-normal">
            {article.content[language].map((para, i) => (
              <p key={i} className="mb-4">
                {para}
              </p>
            ))}
          </div>
        </RevealOnScroll>
      </article>

      {/* Next Actions CTA */}
      <section className="py-20 border-t border-white/5 text-center bg-kilsi-night-light/20">
        <div className="max-w-xl mx-auto px-6">
          <RevealOnScroll direction="up">
            <h3 className="font-display text-2xl font-bold text-kilsi-light mb-4">
              {language === 'fr' ? 'Intéressé par nos solutions ?' : 'Interested in our solutions?'}
            </h3>
            <p className="text-sm text-kilsi-gray mb-8">
              {language === 'fr' 
                ? 'Découvrez comment Kilsi AI conçoit des infrastructures souveraines et des applications sur-mesure.' 
                : 'Discover how Kilsi AI builds sovereign infrastructures and bespoke applications.'}
            </p>
            <div className="flex gap-4 justify-center items-center flex-wrap">
              <Link to="/#services">
                <GlowButton variant="blue">
                  {language === 'fr' ? 'Nos Branches' : 'Our Branches'}
                </GlowButton>
              </Link>
              <Link to="/#contact">
                <GlowButton variant="gold">
                  {language === 'fr' ? 'Nous Contacter' : 'Get in Touch'}
                </GlowButton>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}

export default BlogPostPage;
