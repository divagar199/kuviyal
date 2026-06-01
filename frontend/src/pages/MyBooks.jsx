import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

export default function MyBooks() {
  const [myBooks, setMyBooks] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const navigate = useNavigate();
  const { userEmail } = useAuth();

  useEffect(() => {
    if (userEmail) {
      axios.get(`${API_BASE_URL}/api/my-books/${userEmail}`)
        .then(res => setMyBooks(res.data || []))
        .catch(err => {
          console.error("Error fetching library:", err);
          setToast({ message: "Failed to load library books.", type: "error" });
        });
    }
  }, [userEmail]);

  const handleDownload = (fileUrl, title) => {
    try {
      setIsDownloading(title);
      setToast({ message: `Initiating download for "${title}"...`, type: "info" });
      
      const safeFilename = encodeURIComponent(`${title}.pdf`);
      const separator = fileUrl.includes('?') ? '&' : '?';
      const forceDownloadUrl = `${fileUrl}${separator}download=${safeFilename}`;

      const link = document.createElement('a');
      link.href = forceDownloadUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        setToast({ message: `Downloaded "${title}" successfully!`, type: "success" });
      }, 800);
    } catch (error) {
      setToast({ message: "Failed to download the book.", type: "error" });
    } finally {
      setTimeout(() => setIsDownloading(false), 1200); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans animate-fade-in">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Tamil Library</h1>
          <p className="text-slate-500 text-sm font-semibold mt-1">Your premium personal shelf of downloaded Tamil digital literature</p>
        </div>

        {myBooks.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-200/80 shadow-sm flex flex-col justify-center items-center gap-6 flex-grow">
            <span className="text-5xl animate-float">📖</span>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">Your library is currently empty</h3>
              <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto">Purchase storybooks from our store and they will automatically populate here!</p>
            </div>
            <button onClick={() => navigate('/home')} className="mt-4 bg-blue-600 hover:bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg cursor-pointer">Explore Store</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {myBooks.map((book, idx) => (
              <div key={idx} className="bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-[0_20px_50px_rgba(8,112,184,0.06)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col group relative">
                {/* Book cover art */}
                <div className="relative h-88 overflow-hidden bg-slate-50 flex items-center justify-center border-b border-slate-100">
                  <img src={book?.coverImage || "https://via.placeholder.com/300x400"} alt={book?.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                  
                  {/* Glassmorphic digital badge */}
                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-[10px] font-black text-slate-900 border border-slate-200/30 uppercase tracking-widest">
                    PDF Book
                  </div>
                </div>

                {/* Metadata */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors leading-snug">{book?.title}</h3>
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Purchased Edition</p>
                  </div>
                  
                  <button 
                    onClick={() => handleDownload(book?.pdfUrl, book?.title)} 
                    disabled={isDownloading === book?.title} 
                    className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isDownloading === book?.title 
                        ? 'bg-slate-100 text-slate-400 border border-slate-200' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-600 hover:text-white hover:shadow-emerald-500/10'
                    }`}
                  >
                    {isDownloading === book?.title ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}