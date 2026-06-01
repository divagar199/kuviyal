import { useEffect, useState } from 'react';
import { getRedirectResult, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

export default function Login() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          navigate('/home');
        }
      } catch (error) {
        console.error('Redirect sign-in failed:', error);
        setToast({ message: 'Redirect login failed. Please try again.', type: 'error' });
      }
    };

    handleRedirectResult();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        setToast({
          message: 'Popup was blocked. Redirecting to Google sign-in instead...',
          type: 'warning',
        });
        await signInWithRedirect(auth, provider);
        return;
      }
      setToast({ message: 'Login failed. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Left side: Premium Brand editorial cover */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 flex-col justify-center items-center p-16 relative overflow-hidden">
        {/* Animated fluid blur circles */}
        <div className="absolute -bottom-32 -left-32 w-[35rem] h-[35rem] rounded-full bg-blue-600/10 blur-3xl animate-pulse duration-[10s]"></div>
        <div className="absolute -top-32 -right-32 w-[35rem] h-[35rem] rounded-full bg-indigo-500/10 blur-3xl animate-pulse duration-[7s]"></div>
        
        <div className="relative z-10 text-center space-y-6 max-w-lg animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-300 font-bold text-xs uppercase tracking-widest backdrop-blur-sm">
            Discover Tamil Literature
          </div>
          
          <h1 className="text-7xl font-black tracking-tight text-white leading-none">
            Kuviyal<span className="text-blue-500 font-normal font-serif">.</span>
          </h1>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 tracking-widest">
            குவியல்
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full my-6"></div>
          <p className="text-lg text-slate-300 font-medium leading-relaxed">
            Your digital gateway to the rich heritage of Tamil literature. Read, collect, and experience high-quality digital book editions instantly.
          </p>
        </div>

        {/* Elegant aesthetic floating background card */}
        <div className="absolute bottom-10 left-10 right-10 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex items-center justify-between text-white/60 text-xs tracking-wider uppercase font-bold animate-float">
          <span>© 2026 Kuviyal Digital</span>
          <span>Designed with Love</span>
        </div>
      </div>

      {/* Right side: Sleek Glassmorphic login box */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 sm:p-12 lg:p-24 bg-gradient-to-br from-slate-50 to-slate-100 relative">
        <div className="lg:hidden mb-12 text-center animate-fade-in">
          <h1 className="text-6xl font-black text-slate-900 tracking-tight">Kuviyal<span className="text-blue-600">.</span></h1>
          <h2 className="text-lg font-bold text-blue-600 mt-2 tracking-widest">குவியல்</h2>
        </div>

        <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,112,184,0.05)] border border-slate-100 flex flex-col justify-center items-center gap-8 relative z-10 animate-fade-in">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/20 mx-auto mb-4">
              📖
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed">Sign in with your Google account to unlock your digital book shelf.</p>
          </div>

          <button 
            onClick={handleLogin} 
            className="w-full flex items-center justify-center gap-4 px-6 py-4 border border-slate-200 rounded-2xl shadow-sm bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:ring-4 focus:ring-blue-100 outline-none cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="tracking-wide">Continue with Google</span>
          </button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}