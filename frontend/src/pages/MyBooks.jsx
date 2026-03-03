import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MyBooks() {
  const [myBooks, setMyBooks] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (userEmail) {
      axios.get(`https://kuviyal-books.onrender.com/api/my-books/${userEmail}`)
        .then(res => setMyBooks(res.data))
        .catch(err => console.error("Error fetching library:", err));
    }
  }, [userEmail]);

  const handleDownload = (fileUrl, title) => {
    try {
      setIsDownloading(title);
      const safeFilename = encodeURIComponent(`${title}.pdf`);
      const separator = fileUrl.includes('?') ? '&' : '?';
      const forceDownloadUrl = `${fileUrl}${separator}download=${safeFilename}`;

      const link = document.createElement('a');
      link.href = forceDownloadUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Failed to download the book.");
    } finally {
      setTimeout(() => setIsDownloading(false), 1000); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Tamil Library</h1>

        {myBooks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Your library is empty</h3>
            <button onClick={() => navigate('/home')} className="mt-4 bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold">Go to Store</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {myBooks.map((book, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col">
                <div className="relative h-80 overflow-hidden bg-gray-100">
                  <img src={book?.coverImage || "https://via.placeholder.com/300x400"} alt={book?.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{book?.title}</h3>
                  <p className="text-xs text-gray-500 mb-6 flex-grow">Purchased Edition • PDF</p>
                  <button onClick={() => handleDownload(book?.pdfUrl, book?.title)} disabled={isDownloading === book?.title} className="w-full py-3 rounded-xl font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-600 hover:text-white transition-colors">
                    {isDownloading === book?.title ? 'Downloading...' : 'Download PDF'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}