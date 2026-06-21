import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import GlowButton from '../ui/GlowButton';
import logo from '../../assets/logos/kilsi_logo_complet_blanc.svg';

type Tab = 'blog' | 'faq' | 'applications';

interface BlogFormState {
  id: string;
  title_fr: string;
  title_en: string;
  summary_fr: string;
  summary_en: string;
  content_fr_text: string;
  content_en_text: string;
  author_fr: string;
  author_en: string;
  date: string;
  read_time_fr: string;
  read_time_en: string;
  published: boolean;
}

interface FaqFormState {
  id?: string;
  question_fr: string;
  question_en: string;
  answer_fr: string;
  answer_en: string;
  display_order: number;
}

function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('blog');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Data states
  const [blogs, setBlogs] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  // Action states
  const [blogForm, setBlogForm] = useState<BlogFormState | null>(null);
  const [faqForm, setFaqForm] = useState<FaqFormState | null>(null);
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Authenticate user
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      } else {
        setUser(session.user);
        setLoading(false);
        // Initial fetch
        fetchBlogs();
        fetchFaqs();
        fetchApplications();
      }
    };
    checkAuth();
  }, [navigate]);

  // Status message auto-clear
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Fetch functions
  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setBlogs(data);
  };

  const fetchFaqs = async () => {
    const { data, error } = await supabase
      .from('faq_items')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error && data) setFaqs(data);
  };

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('fasolabel_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setApplications(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  // --- BLOG OPERATIONS ---
  const initNewBlog = () => {
    setIsEditingBlog(false);
    const today = new Date().toISOString().split('T')[0];
    setBlogForm({
      id: '',
      title_fr: '',
      title_en: '',
      summary_fr: '',
      summary_en: '',
      content_fr_text: '',
      content_en_text: '',
      author_fr: 'Dr. Joshua Juste E. Yun Pei NIKIEMA',
      author_en: 'Dr. Joshua Juste E. Yun Pei NIKIEMA',
      date: today,
      read_time_fr: '5 min de lecture',
      read_time_en: '5 min read',
      published: true,
    });
  };

  const initEditBlog = (article: any) => {
    setIsEditingBlog(true);
    setBlogForm({
      id: article.id,
      title_fr: article.title_fr || '',
      title_en: article.title_en || '',
      summary_fr: article.summary_fr || '',
      summary_en: article.summary_en || '',
      content_fr_text: (article.content_fr || []).join('\n\n'),
      content_en_text: (article.content_en || []).join('\n\n'),
      author_fr: article.author_fr || 'Dr. Joshua Juste E. Yun Pei NIKIEMA',
      author_en: article.author_en || 'Dr. Joshua Juste E. Yun Pei NIKIEMA',
      date: article.date || '',
      read_time_fr: article.read_time_fr || '5 min de lecture',
      read_time_en: article.read_time_en || '5 min read',
      published: article.published ?? true,
    });
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm) return;

    if (!blogForm.id.trim()) {
      setStatusMessage({ text: 'Le slug/ID de l\'article est requis.', isError: true });
      return;
    }

    const payload = {
      id: blogForm.id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      title_fr: blogForm.title_fr,
      title_en: blogForm.title_en,
      summary_fr: blogForm.summary_fr,
      summary_en: blogForm.summary_en,
      content_fr: blogForm.content_fr_text.split('\n\n').filter(p => p.trim() !== ''),
      content_en: blogForm.content_en_text.split('\n\n').filter(p => p.trim() !== ''),
      author_fr: blogForm.author_fr,
      author_en: blogForm.author_en,
      date: blogForm.date,
      read_time_fr: blogForm.read_time_fr,
      read_time_en: blogForm.read_time_en,
      published: blogForm.published,
    };

    let error;
    if (isEditingBlog) {
      const { error: err } = await supabase
        .from('blog_posts')
        .update(payload)
        .eq('id', blogForm.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('blog_posts')
        .insert([payload]);
      error = err;
    }

    if (error) {
      setStatusMessage({ text: `Erreur lors de la sauvegarde : ${error.message}`, isError: true });
    } else {
      setStatusMessage({ text: 'Article enregistré avec succès !', isError: false });
      setBlogForm(null);
      fetchBlogs();
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article de blog ?')) return;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      setStatusMessage({ text: `Erreur de suppression : ${error.message}`, isError: true });
    } else {
      setStatusMessage({ text: 'Article supprimé.', isError: false });
      fetchBlogs();
    }
  };

  // --- FAQ OPERATIONS ---
  const initNewFaq = () => {
    const nextOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.display_order || 0)) + 10 : 10;
    setFaqForm({
      question_fr: '',
      question_en: '',
      answer_fr: '',
      answer_en: '',
      display_order: nextOrder,
    });
  };

  const initEditFaq = (faq: any) => {
    setFaqForm({
      id: faq.id,
      question_fr: faq.question_fr || '',
      question_en: faq.question_en || '',
      answer_fr: faq.answer_fr || '',
      answer_en: faq.answer_en || '',
      display_order: faq.display_order || 0,
    });
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm) return;

    const payload = {
      question_fr: faqForm.question_fr,
      question_en: faqForm.question_en,
      answer_fr: faqForm.answer_fr,
      answer_en: faqForm.answer_en,
      display_order: Number(faqForm.display_order),
    };

    let error;
    if (faqForm.id) {
      const { error: err } = await supabase
        .from('faq_items')
        .update(payload)
        .eq('id', faqForm.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('faq_items')
        .insert([payload]);
      error = err;
    }

    if (error) {
      setStatusMessage({ text: `Erreur lors de la sauvegarde : ${error.message}`, isError: true });
    } else {
      setStatusMessage({ text: 'FAQ enregistrée avec succès !', isError: false });
      setFaqForm(null);
      fetchFaqs();
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question FAQ ?')) return;

    const { error } = await supabase
      .from('faq_items')
      .delete()
      .eq('id', id);

    if (error) {
      setStatusMessage({ text: `Erreur de suppression : ${error.message}`, isError: true });
    } else {
      setStatusMessage({ text: 'FAQ supprimée.', isError: false });
      fetchFaqs();
    }
  };

  // --- RENDERING SPINNER ---
  if (loading) {
    return (
      <div className="min-h-screen bg-kilsi-night flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-kilsi-gold border-solid mb-4" />
        <p className="text-kilsi-gray text-sm">Chargement de la console d'administration...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kilsi-night text-kilsi-light pt-28 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header Panel */}
      <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/2 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Kilsi Logo" className="h-8" />
          <div className="h-6 w-[1px] bg-white/10 hidden md:block" />
          <div>
            <h1 className="font-display text-lg font-bold">Console Admin</h1>
            <p className="text-xs text-kilsi-gray/60">{user?.email}</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
          <button
            onClick={() => { setActiveTab('blog'); setBlogForm(null); setFaqForm(null); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg tracking-wider uppercase transition-colors duration-200 cursor-pointer ${
              activeTab === 'blog' ? 'bg-kilsi-gold text-kilsi-night' : 'text-kilsi-light/60 hover:text-kilsi-light'
            }`}
          >
            Insights (Blog)
          </button>
          <button
            onClick={() => { setActiveTab('faq'); setBlogForm(null); setFaqForm(null); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg tracking-wider uppercase transition-colors duration-200 cursor-pointer ${
              activeTab === 'faq' ? 'bg-kilsi-gold text-kilsi-night' : 'text-kilsi-light/60 hover:text-kilsi-light'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => { setActiveTab('applications'); setBlogForm(null); setFaqForm(null); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg tracking-wider uppercase transition-colors duration-200 cursor-pointer ${
              activeTab === 'applications' ? 'bg-kilsi-gold text-kilsi-night' : 'text-kilsi-light/60 hover:text-kilsi-light'
            }`}
          >
            Candidatures (FasoLabel)
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-xs font-semibold tracking-wider text-red-400 hover:text-red-300 transition-colors uppercase border border-red-500/10 hover:border-red-500/30 rounded-xl px-4 py-2 bg-red-500/5 cursor-pointer"
        >
          Déconnexion
        </button>
      </div>

      {/* Notification Toast */}
      {statusMessage && (
        <div className={`p-4 mb-6 rounded-xl border text-sm font-medium animate-fade-in ${
          statusMessage.isError 
            ? 'bg-red-500/10 border-red-500/20 text-red-400' 
            : 'bg-green-500/10 border-green-500/20 text-green-400'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {/* --- TAB CONTENT: BLOG MANAGER --- */}
      {activeTab === 'blog' && (
        <div>
          {!blogForm ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl font-bold">Articles de Blog</h2>
                <GlowButton variant="gold" size="sm" onClick={initNewBlog}>
                  Ajouter un article
                </GlowButton>
              </div>

              <div className="glass-card rounded-2xl border border-white/5 bg-white/2 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-kilsi-gray/60 font-semibold bg-white/2">
                      <th className="p-4 pl-6">Titre / Slug</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Statut</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-kilsi-gray/50 text-sm">
                          Aucun article trouvé. Cliquez sur "Ajouter un article" pour commencer.
                        </td>
                      </tr>
                    ) : (
                      blogs.map((b) => (
                        <tr key={b.id} className="border-b border-white/5 text-sm hover:bg-white/1">
                          <td className="p-4 pl-6">
                            <div className="font-bold text-kilsi-light">{b.title_fr}</div>
                            <div className="text-xs text-kilsi-gray/50 font-semibold mt-0.5">{b.id}</div>
                          </td>
                          <td className="p-4 text-kilsi-gray">{b.date}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.published 
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                                : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                            }`}>
                              {b.published ? 'Publié' : 'Brouillon'}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right flex justify-end gap-3 mt-1.5">
                            <button
                              onClick={() => initEditBlog(b)}
                              className="text-xs font-bold text-kilsi-sky hover:text-kilsi-gold transition-colors cursor-pointer"
                            >
                              Éditer
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(b.id)}
                              className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* BLOG FORM */
            <form onSubmit={handleSaveBlog} className="glass-card p-8 rounded-2xl border border-white/5 bg-white/2 flex flex-col gap-6 max-w-4xl mx-auto">
              <h2 className="font-display text-xl font-bold mb-2">
                {isEditingBlog ? 'Modifier l\'article' : 'Créer un nouvel article'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                    ID / Slug de l'article (ex: mlops-au-sahel)
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isEditingBlog}
                    value={blogForm.id}
                    onChange={(e) => setBlogForm({ ...blogForm, id: e.target.value })}
                    placeholder="souverainete-donnees-afrique"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-full text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                    Date de publication
                  </label>
                  <input
                    type="text"
                    required
                    value={blogForm.date}
                    onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                    placeholder="2026-06-21"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-full text-sm"
                  />
                </div>
              </div>

              {/* Bilingual Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                    Titre (Français)
                  </label>
                  <input
                    type="text"
                    required
                    value={blogForm.title_fr}
                    onChange={(e) => setBlogForm({ ...blogForm, title_fr: e.target.value })}
                    placeholder="Souveraineté Numérique..."
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-full text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={blogForm.title_en}
                    onChange={(e) => setBlogForm({ ...blogForm, title_en: e.target.value })}
                    placeholder="Digital Sovereignty..."
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-full text-sm"
                  />
                </div>
              </div>

              {/* Bilingual Authors & Read Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                    Auteur / Temps de lecture (FR)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={blogForm.author_fr}
                      onChange={(e) => setBlogForm({ ...blogForm, author_fr: e.target.value })}
                      placeholder="Auteur FR"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-1/2 text-sm"
                    />
                    <input
                      type="text"
                      required
                      value={blogForm.read_time_fr}
                      onChange={(e) => setBlogForm({ ...blogForm, read_time_fr: e.target.value })}
                      placeholder="5 min de lecture"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-1/2 text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                    Author / Read Time (EN)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={blogForm.author_en}
                      onChange={(e) => setBlogForm({ ...blogForm, author_en: e.target.value })}
                      placeholder="Author EN"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-1/2 text-sm"
                    />
                    <input
                      type="text"
                      required
                      value={blogForm.read_time_en}
                      onChange={(e) => setBlogForm({ ...blogForm, read_time_en: e.target.value })}
                      placeholder="5 min read"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-1/2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Summaries */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                  Résumé de l'article (Français)
                </label>
                <textarea
                  required
                  rows={2}
                  value={blogForm.summary_fr}
                  onChange={(e) => setBlogForm({ ...blogForm, summary_fr: e.target.value })}
                  placeholder="Bref résumé accrocheur..."
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-full text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                  Summary of the article (English)
                </label>
                <textarea
                  required
                  rows={2}
                  value={blogForm.summary_en}
                  onChange={(e) => setBlogForm({ ...blogForm, summary_en: e.target.value })}
                  placeholder="Short catchy summary..."
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-full text-sm"
                />
              </div>

              {/* Main Content Areas */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                  Contenu (Français) — Séparez les paragraphes par un double saut de ligne
                </label>
                <textarea
                  required
                  rows={10}
                  value={blogForm.content_fr_text}
                  onChange={(e) => setBlogForm({ ...blogForm, content_fr_text: e.target.value })}
                  placeholder="Paragraphe 1...&#10;&#10;Paragraphe 2..."
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-full text-sm font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                  Content (English) — Separate paragraphs with a double line break
                </label>
                <textarea
                  required
                  rows={10}
                  value={blogForm.content_en_text}
                  onChange={(e) => setBlogForm({ ...blogForm, content_en_text: e.target.value })}
                  placeholder="Paragraph 1...&#10;&#10;Paragraph 2..."
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-full text-sm font-sans"
                />
              </div>

              {/* Published Switch */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={blogForm.published}
                  onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 text-kilsi-gold bg-white/5 focus:ring-0"
                />
                <label htmlFor="published" className="text-sm font-medium text-kilsi-light select-none">
                  Publier l'article immédiatement (rendre visible sur le site)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setBlogForm(null)}
                  className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold tracking-wider uppercase transition-colors duration-200 cursor-pointer"
                >
                  Annuler
                </button>
                <GlowButton variant="gold" size="md" onClick={() => {}}>
                  Enregistrer l'article
                </GlowButton>
              </div>
            </form>
          )}
        </div>
      )}

      {/* --- TAB CONTENT: FAQ MANAGER --- */}
      {activeTab === 'faq' && (
        <div>
          {!faqForm ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl font-bold">Questions / Réponses FAQ</h2>
                <GlowButton variant="gold" size="sm" onClick={initNewFaq}>
                  Ajouter une question
                </GlowButton>
              </div>

              <div className="glass-card rounded-2xl border border-white/5 bg-white/2 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-kilsi-gray/60 font-semibold bg-white/2">
                      <th className="p-4 pl-6">Ordre</th>
                      <th className="p-4">Question (FR)</th>
                      <th className="p-4">Question (EN)</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faqs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-kilsi-gray/50 text-sm">
                          Aucune question FAQ trouvée. Cliquez sur "Ajouter une question".
                        </td>
                      </tr>
                    ) : (
                      faqs.map((f) => (
                        <tr key={f.id} className="border-b border-white/5 text-sm hover:bg-white/1">
                          <td className="p-4 pl-6 text-kilsi-gold font-bold">{f.display_order}</td>
                          <td className="p-4 text-kilsi-light font-medium">{f.question_fr}</td>
                          <td className="p-4 text-kilsi-light/80 italic">{f.question_en}</td>
                          <td className="p-4 pr-6 text-right flex justify-end gap-3 mt-1.5">
                            <button
                              onClick={() => initEditFaq(f)}
                              className="text-xs font-bold text-kilsi-sky hover:text-kilsi-gold transition-colors cursor-pointer"
                            >
                              Éditer
                            </button>
                            <button
                              onClick={() => handleDeleteFaq(f.id)}
                              className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* FAQ FORM */
            <form onSubmit={handleSaveFaq} className="glass-card p-8 rounded-2xl border border-white/5 bg-white/2 flex flex-col gap-5 max-w-2xl mx-auto">
              <h2 className="font-display text-xl font-bold mb-2">
                {faqForm.id ? 'Modifier la question FAQ' : 'Créer une question FAQ'}
              </h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                  Ordre d'affichage (Plus petit = affiché en premier)
                </label>
                <input
                  type="number"
                  required
                  value={faqForm.display_order}
                  onChange={(e) => setFaqForm({ ...faqForm, display_order: Number(e.target.value) })}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-32 text-sm"
                />
              </div>

              {/* Questions */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                  Question (Français)
                </label>
                <input
                  type="text"
                  required
                  value={faqForm.question_fr}
                  onChange={(e) => setFaqForm({ ...faqForm, question_fr: e.target.value })}
                  placeholder="Qu'est-ce que Kilsi AI ?"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-full text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                  Question (English)
                </label>
                <input
                  type="text"
                  required
                  value={faqForm.question_en}
                  onChange={(e) => setFaqForm({ ...faqForm, question_en: e.target.value })}
                  placeholder="What is Kilsi AI?"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-full text-sm"
                />
              </div>

              {/* Answers */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                  Réponse (Français)
                </label>
                <textarea
                  required
                  rows={4}
                  value={faqForm.answer_fr}
                  onChange={(e) => setFaqForm({ ...faqForm, answer_fr: e.target.value })}
                  placeholder="Réponse en français..."
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-full text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                  Answer (English)
                </label>
                <textarea
                  required
                  rows={4}
                  value={faqForm.answer_en}
                  onChange={(e) => setFaqForm({ ...faqForm, answer_en: e.target.value })}
                  placeholder="Answer in English..."
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-full text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setFaqForm(null)}
                  className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold tracking-wider uppercase transition-colors duration-200 cursor-pointer"
                >
                  Annuler
                </button>
                <GlowButton variant="gold" size="md" onClick={() => {}}>
                  Enregistrer FAQ
                </GlowButton>
              </div>
            </form>
          )}
        </div>
      )}

      {/* --- TAB CONTENT: APPLICATIONS --- */}
      {activeTab === 'applications' && (
        <div>
          <h2 className="font-display text-xl font-bold mb-6">Candidatures Reçues (FasoLabel)</h2>

          <div className="glass-card rounded-2xl border border-white/5 bg-white/2 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-kilsi-gray/60 font-semibold bg-white/2">
                  <th className="p-4 pl-6">Candidat</th>
                  <th className="p-4">WhatsApp / Email</th>
                  <th className="p-4">Langues</th>
                  <th className="p-4 font-semibold">Diplôme</th>
                  <th className="p-4">CV PDF</th>
                  <th className="p-4 pr-6">Date de dépôt</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-kilsi-gray/50 text-sm">
                      Aucune candidature reçue pour le moment.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="border-b border-white/5 text-sm hover:bg-white/1 align-top">
                      <td className="p-4 pl-6">
                        <div className="font-bold text-kilsi-light">{app.first_name} {app.last_name}</div>
                        {app.motivation && (
                          <div className="text-xs text-kilsi-gray/60 max-w-sm mt-1 bg-white/1 p-2 rounded-lg border border-white/5 italic">
                            "{app.motivation}"
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-kilsi-light font-semibold">{app.whatsapp}</div>
                        <div className="text-xs text-kilsi-gray/50 mt-0.5">{app.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {(app.languages || []).map((l: string) => (
                            <span key={l} className="bg-kilsi-blue/10 border border-kilsi-blue/20 text-kilsi-sky px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                              {l}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 capitalize text-kilsi-gray">
                        {app.studies}
                      </td>
                      <td className="p-4">
                        {app.cv_url ? (
                          <a
                            href={app.cv_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-kilsi-gold hover:underline flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 w-fit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Ouvrir le CV
                          </a>
                        ) : (
                          <span className="text-xs text-red-400 font-semibold italic">Non disponible</span>
                        )}
                      </td>
                      <td className="p-4 pr-6 text-xs text-kilsi-gray/60 font-semibold">
                        {new Date(app.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
