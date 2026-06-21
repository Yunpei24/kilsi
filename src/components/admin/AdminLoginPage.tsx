import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import GlowButton from '../ui/GlowButton';
import logo from '../../assets/logos/kilsi_logo_complet_blanc.svg';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect straight to dashboard
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message === 'Invalid login credentials' 
          ? 'Identifiants de connexion invalides / Invalid credentials' 
          : authError.message);
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kilsi-night flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kilsi-blue/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-kilsi-gold/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8 rounded-2xl border border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-white/2 flex flex-col items-center">
          {/* Logo */}
          <img src={logo} alt="Kilsi Logo" className="h-10 mb-6" />
          
          <h1 className="font-display text-2xl font-bold text-kilsi-light mb-2 tracking-tight text-center">
            Espace Administration
          </h1>
          <p className="text-xs text-kilsi-gray/60 mb-8 text-center uppercase tracking-widest">
            Kilsi AI Secure Console
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-full text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">
                Mot de passe / Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-kilsi-light placeholder-kilsi-gray/30 focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50 transition w-full text-sm"
              />
            </div>

            <div className="mt-4">
              <GlowButton
                variant="gold"
                className="w-full justify-center"
                onClick={() => {}}
                disabled={loading}
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </GlowButton>
            </div>
          </form>

          <button
            onClick={() => navigate('/')}
            className="mt-6 text-xs text-kilsi-gray/50 hover:text-kilsi-gold transition-colors font-semibold tracking-wider uppercase cursor-pointer"
          >
            Retour au site / Back to website
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
