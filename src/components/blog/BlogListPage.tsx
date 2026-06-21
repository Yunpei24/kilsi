import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { blogArticles, type Article } from '../../data/blogData';
import Section from '../layout/Section';
import RevealOnScroll from '../ui/RevealOnScroll';
import aboutVideo from '../../assets/videos/about-bg.mp4';
import { supabase } from '../../lib/supabaseClient';

function BlogListPage() {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // SEO setup
    if (language === 'fr') {
      document.title = "Kilsi Insights — Blog & Expertise IA";
      document.querySelector('meta[name="description"]')?.setAttribute(
        'content', 
        "Découvrez Kilsi Insights, notre blog dédié à l'intelligence artificielle, au cloud souverain, à l'annotation de données et au MLOps en Afrique."
      );
    } else {
      document.title = "Kilsi Insights — Blog & AI Expertise";
      document.querySelector('meta[name="description"]')?.setAttribute(
        'content', 
        "Discover Kilsi Insights, our blog dedicated to artificial intelligence, sovereign cloud, data annotation, and MLOps in Africa."
      );
    }

    // Fetch published blogs from Supabase
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map((b: any) => ({
            id: b.id,
            title: { fr: b.title_fr || '', en: b.title_en || '' },
            date: b.date || '',
            author: { fr: b.author_fr || '', en: b.author_en || '' },
            readTime: { fr: b.read_time_fr || '', en: b.read_time_en || '' },
            summary: { fr: b.summary_fr || '', en: b.summary_en || '' },
            content: { fr: b.content_fr || [], en: b.content_en || [] }
          }));
          setArticles(mapped);
        } else {
          setArticles(blogArticles);
        }
      } catch (err) {
        // Fallback silently to static blog articles
        setArticles(blogArticles);
      }
    };

    fetchArticles();
  }, [language]);

  return (
    <div className="bg-kilsi-night text-kilsi-light min-h-screen">
      {/* Hero Header */}
      <Section id="blog-hero" videoSrc={aboutVideo} overlayOpacity={0.8}>
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto">
          {/* Label */}
          <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-kilsi-gold animate-fade-in">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-kilsi-gold" />
            INSIGHTS
          </span>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-kilsi-light mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Kilsi <span className="gradient-text-gold">Insights</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl font-display text-lg text-kilsi-gray mb-8 leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {language === 'fr' 
              ? "Partage d'expertise, état de l'art et réflexions sur l'avenir de la technologie et de l'intelligence artificielle en Afrique."
              : "Expertise sharing, state of the art, and reflections on the future of technology and artificial intelligence in Africa."}
          </p>
        </div>
      </Section>

      {/* Articles Grid */}
      <section className="py-24 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article, index) => (
            <RevealOnScroll key={article.id} direction="up" delay={index * 150}>
              <Link to={`/blog/${article.id}`} className="block h-full cursor-pointer group">
                <article className="glass-card p-8 rounded-2xl border border-white/5 hover:border-kilsi-gold/25 h-full flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] bg-white/2">
                  <div>
                    {/* Date & Read Time */}
                    <div className="flex gap-4 items-center text-xs text-kilsi-gray/60 mb-4 font-semibold tracking-wider">
                      <span>{article.date}</span>
                      <span className="opacity-30">•</span>
                      <span>{article.readTime[language]}</span>
                    </div>

                    {/* Title */}
                    <h2 className="font-display text-xl font-bold text-kilsi-light mb-4 group-hover:text-kilsi-gold transition-colors duration-300">
                      {article.title[language]}
                    </h2>

                    {/* Summary */}
                    <p className="text-sm text-kilsi-gray leading-relaxed mb-6">
                      {article.summary[language]}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className="text-xs font-bold text-kilsi-sky group-hover:text-kilsi-gold transition-colors tracking-widest uppercase flex items-center gap-1 mt-auto">
                    {language === 'fr' ? "Lire l'article" : "Read Article"}
                    <svg className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </article>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </div>
  );
}

export default BlogListPage;
