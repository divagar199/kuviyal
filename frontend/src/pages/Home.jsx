import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { API_BASE_URL } from "../config";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);
  
  const navigate = useNavigate();
  const { userEmail } = useAuth();

  // Load books and local cart on mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/books`)
      .then((res) => setBooks(res.data))
      .catch((err) => {
        console.error("Error fetching books:", err);
        setToast({ message: "Could not load Tamil stories. Please try again.", type: "error" });
      });

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // Fetch user's purchased books if logged in
  useEffect(() => {
    if (userEmail) {
      axios
        .get(`${API_BASE_URL}/api/my-books/${userEmail}`)
        .then((res) => setPurchasedBooks(res.data || []))
        .catch((err) => console.error("Error fetching library state:", err));
    }
  }, [userEmail]);

  const addToCart = (book) => {
    // Check if already in cart
    if (cartItems.some((item) => item._id === book._id)) {
      setToast({ message: `"${book.title}" is already in your cart!`, type: "info" });
      return;
    }
    
    const updatedCart = [...cartItems, book];
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setToast({ message: `"${book.title}" added to your cart!`, type: "success" });
  };

  // Sets for lightning fast lookup
  const purchasedIds = new Set(purchasedBooks.filter(Boolean).map((b) => b._id));
  const cartIds = new Set(cartItems.filter(Boolean).map((item) => item._id));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans animate-fade-in">
      <Navbar />

      <main className="flex-grow">
        {/* Bright, Modern Editorial Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 rounded-[2.5rem] overflow-hidden border border-slate-200/60 shadow-sm flex flex-col lg:flex-row items-center relative">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
            
            {/* Left Column: Platform Copywriting */}
            <div className="w-full lg:w-1/2 p-8 sm:p-14 lg:p-20 z-10 space-y-6">
              {/* Animated Status Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-xs uppercase tracking-widest shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                The Ultimate Tamil Digital Library
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
                Unlock the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Tamil Digital</span> Heritage.
              </h1>

              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">
                Experience the finest curated collection of Tamil literature. From legendary historical sagas to contemporary fiction, download high-quality PDFs and read instantly.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() =>
                    window.scrollTo({ top: 750, behavior: "smooth" })
                  }
                  className="px-8 py-4 bg-slate-900 text-white font-extrabold rounded-2xl shadow-lg shadow-slate-900/10 hover:bg-blue-600 hover:-translate-y-1 hover:shadow-blue-500/20 active:translate-y-0 transition-all duration-300 cursor-pointer"
                >
                  Browse Stories
                </button>
                <button
                  onClick={() => navigate("/cart")}
                  className="px-8 py-4 bg-white text-slate-700 font-extrabold rounded-2xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                >
                  View Cart
                </button>
              </div>
            </div>

            {/* Right Column: Hero Art Illustration */}
            <div className="w-full lg:w-1/2 relative h-96 lg:h-[600px] p-6 lg:p-12">
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] group border border-slate-100">
                <img
                  src="https://i.pinimg.com/1200x/e3/09/ca/e309ca11ccc2df93acdc7cc843784993.jpg"
                  alt="Tamil Literature Art"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent"></div>
              </div>

              {/* Float Glassmorphic Badge */}
              <div className="absolute bottom-16 left-6 sm:left-12 lg:-left-6 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-200/50 flex items-center gap-4 hover:-translate-y-2 transition-transform duration-300 cursor-default animate-float">
                <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-900 font-black text-sm sm:text-base tracking-tight leading-none mb-1">
                    Instant Access
                  </p>
                  <p className="text-slate-500 text-xs sm:text-sm font-semibold">
                    Download direct to device
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Stories Bookshelf */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                Featured Stories
              </h2>
              <p className="text-slate-500 text-sm font-bold tracking-wide mt-2 uppercase text-blue-600">
                Premium Tamil Digital Editions
              </p>
            </div>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300/80 shadow-sm flex flex-col justify-center items-center gap-4">
              <span className="text-4xl animate-bounce">📚</span>
              <p className="text-lg text-slate-500 font-semibold max-w-sm leading-relaxed">
                Our Tamil literature collection is updating. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.map((book) => {
                const isPurchased = purchasedIds.has(book._id);
                const isInCart = cartIds.has(book._id);

                return (
                  <div
                    key={book._id}
                    className="bg-white rounded-3xl shadow-sm hover:shadow-[0_20px_50px_rgba(8,112,184,0.06)] hover:-translate-y-2 border border-slate-100/80 overflow-hidden group flex flex-col relative transition-all duration-500"
                  >
                    {/* Book Art Cover */}
                    <div className="relative h-88 overflow-hidden bg-slate-50 border-b border-slate-100 flex items-center justify-center">
                      <img
                        src={
                          book.coverImage || "https://via.placeholder.com/300x400"
                        }
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      
                      {/* Price Badge */}
                      {!isPurchased && (
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl text-sm font-black text-slate-900 shadow-md border border-slate-100">
                          ₹{book.price}
                        </div>
                      )}

                      {/* Already Purchased Label Indicator */}
                      {isPurchased && (
                        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3.5 py-2 rounded-2xl text-xs font-black shadow-md flex items-center gap-1.5 tracking-wider uppercase animate-fade-in">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                          Purchased
                        </div>
                      )}
                    </div>

                    {/* Book Metadata */}
                    <div className="p-6 flex flex-col flex-grow space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-extrabold text-slate-900 line-clamp-1 leading-snug">
                          {book.title}
                        </h3>
                        <p className="text-xs text-blue-600 font-bold tracking-wide uppercase">
                          Tamil PDF Edition
                        </p>
                      </div>

                      {/* Action Button states */}
                      <div className="w-full pt-2">
                        {isPurchased ? (
                          <button
                            onClick={() => navigate("/my-books")}
                            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 border border-emerald-100 cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Go to Library
                          </button>
                        ) : isInCart ? (
                          <button
                            onClick={() => navigate("/cart")}
                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 border border-blue-100 cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            View in Cart
                          </button>
                        ) : (
                          <button
                            onClick={() => addToCart(book)}
                            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
