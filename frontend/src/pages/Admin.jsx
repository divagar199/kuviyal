import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) { supabase = createClient(supabaseUrl, supabaseKey); }

export default function Admin() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Access Denied</p></div>;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!pdfFile || !coverFile) {
      setToast({ message: "Please select both Cover Art and PDF Story file!", type: "error" });
      return;
    }
    setIsUploading(true);
    setToast({ message: "Uploading assets to storage...", type: "info" });

    try {
      const coverName = `cover_${Date.now()}_${coverFile.name.replace(/\s+/g, '_')}`;
      const { error: coverErr } = await supabase.storage.from('books').upload(coverName, coverFile);
      if (coverErr) throw coverErr;
      const { data: coverData } = supabase.storage.from('books').getPublicUrl(coverName);

      const pdfName = `pdf_${Date.now()}_${pdfFile.name.replace(/\s+/g, '_')}`;
      const { error: pdfErr } = await supabase.storage.from('books').upload(pdfName, pdfFile);
      if (pdfErr) throw pdfErr;
      const { data: pdfData } = supabase.storage.from('books').getPublicUrl(pdfName);

      await axios.post(`${API_BASE_URL}/api/admin/add-book`, {
        title, price: Number(price), coverImage: coverData.publicUrl, pdfUrl: pdfData.publicUrl
      });

      setToast({ message: "Book published successfully to Kuviyal!", type: "success" });
      setTitle(''); 
      setPrice(''); 
      setCoverFile(null); 
      setPdfFile(null); 
      e.target.reset(); 
    } catch (error) { 
      console.error(error);
      setToast({ message: "Upload or publishing error. Check credentials.", type: "error" });
    } finally { 
      setIsUploading(false); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans animate-fade-in">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-xl border border-slate-100/80 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-8 text-center space-y-2">
            <span className="text-3xl">⚙️</span>
            <h1 className="text-3xl font-black text-white tracking-tight">Add Tamil Story</h1>
            <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Administrative Portal</p>
          </div>
          
          <div className="px-8 py-8 sm:px-10">
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Book Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ponniyin Selvan" 
                  required 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-800 placeholder-slate-400 mt-1" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Price (INR)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 299" 
                  required 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-800 placeholder-slate-400 mt-1" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Cover Art</span>
                  <label className="flex flex-col justify-center items-center p-5 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-blue-50/50 hover:border-blue-400 transition-all text-center min-h-[90px] mt-1 relative">
                    <span className="text-xs font-bold text-blue-600 px-2 line-clamp-2">{coverFile ? coverFile.name : "Select Cover Art"}</span>
                    <input type="file" accept="image/*" required className="hidden" onChange={e => setCoverFile(e.target.files[0])} />
                  </label>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">PDF Story File</span>
                  <label className="flex flex-col justify-center items-center p-5 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-emerald-50/30 hover:border-emerald-400 transition-all text-center min-h-[90px] mt-1 relative">
                    <span className="text-xs font-bold text-emerald-600 px-2 line-clamp-2">{pdfFile ? pdfFile.name : "Select PDF Story"}</span>
                    <input type="file" accept="application/pdf" required className="hidden" onChange={e => setPdfFile(e.target.files[0])} />
                  </label>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isUploading} 
                className="w-full py-4.5 rounded-2xl font-bold text-white bg-blue-600 hover:bg-slate-900 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>Publish to Kuviyal</>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}