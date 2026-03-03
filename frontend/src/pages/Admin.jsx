import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
  const [isAdmin, setIsAdmin] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('userEmail') === "divagar.m.msc.cs@gmail.com") setIsAdmin(true);
  }, []);

  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Access Denied</p></div>;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!pdfFile || !coverFile) return alert("Select Cover and PDF!");
    setIsUploading(true);

    try {
      const coverName = `cover_${Date.now()}_${coverFile.name.replace(/\s+/g, '_')}`;
      await supabase.storage.from('books').upload(coverName, coverFile);
      const { data: coverData } = supabase.storage.from('books').getPublicUrl(coverName);

      const pdfName = `pdf_${Date.now()}_${pdfFile.name.replace(/\s+/g, '_')}`;
      await supabase.storage.from('books').upload(pdfName, pdfFile);
      const { data: pdfData } = supabase.storage.from('books').getPublicUrl(pdfName);

      await axios.post('http://localhost:5000/api/admin/add-book', {
        title, price: Number(price), coverImage: coverData.publicUrl, pdfUrl: pdfData.publicUrl
      });

      alert("Book Added!");
      setTitle(''); setPrice(''); setCoverFile(null); setPdfFile(null); e.target.reset(); 
    } catch (error) { alert("Upload error."); } finally { setIsUploading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-8 text-center">
            <h1 className="text-3xl font-extrabold text-white">Add Tamil Story</h1>
          </div>
          <div className="px-8 py-8">
            <form onSubmit={handleUpload} className="space-y-6">
              <input type="text" placeholder="Book Title" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl border focus:ring-2 focus:ring-blue-600 outline-none" />
              <input type="number" placeholder="Price (INR)" required value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl border focus:ring-2 focus:ring-blue-600 outline-none" />
              
              <div className="grid grid-cols-2 gap-4">
                <label className="flex justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer hover:bg-blue-50">
                  <span className="text-xs font-bold text-blue-600">{coverFile ? coverFile.name : "Select Cover Art"}</span>
                  <input type="file" accept="image/*" required className="hidden" onChange={e => setCoverFile(e.target.files[0])} />
                </label>
                <label className="flex justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer hover:bg-red-50">
                  <span className="text-xs font-bold text-red-600">{pdfFile ? pdfFile.name : "Select PDF Story"}</span>
                  <input type="file" accept="application/pdf" required className="hidden" onChange={e => setPdfFile(e.target.files[0])} />
                </label>
              </div>
              
              <button type="submit" disabled={isUploading} className="w-full py-4 rounded-xl font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400">
                {isUploading ? 'Uploading...' : 'Publish to Kuvyal'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}