import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(book);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`"${book.title}" added to your cart!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Bright, Modern Editorial Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-[2rem] overflow-hidden border border-gray-200 shadow-sm flex flex-col lg:flex-row items-center">
            {/* Left Column: Platform Copywriting */}
            <div className="w-full lg:w-1/2 p-10 sm:p-16 lg:p-20 z-10">
              {/* Animated Status Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wide mb-8 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                The #1 Tamil PDF Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
                The Ultimate <br />
                <span className="text-blue-700">Tamil Digital</span> Library.
              </h1>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-md">
                Experience the finest collection of Tamil literature. From
                legendary historical sagas to contemporary fiction, download
                high-quality PDFs and build your digital library instantly.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() =>
                    window.scrollTo({ top: 700, behavior: "smooth" })
                  }
                  className="px-8 py-4 bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-700/30 hover:bg-blue-800 hover:-translate-y-1 transition-all duration-300"
                >
                  Browse Collection
                </button>
                <button
                  onClick={() => navigate("/cart")}
                  className="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  View Cart
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative h-96 lg:h-[600px] p-6 lg:p-10">
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://i.pinimg.com/1200x/e3/09/ca/e309ca11ccc2df93acdc7cc843784993.jpg"
                  alt="Tamil Literature"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent"></div>
              </div>
              <div className="absolute bottom-12 left-4 sm:left-10 lg:-left-8 bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 hover:-translate-y-2 transition-transform duration-300 cursor-default">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
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
                  <p className="text-gray-900 font-extrabold text-sm sm:text-base">
                    Instant Access
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm font-medium">
                    Download directly to device
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-10">
            Featured Stories
          </h2>

          {books.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-lg text-gray-500 font-medium">
                Our Tamil literature collection is updating. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col relative"
                >
                  <div className="relative h-80 overflow-hidden bg-gray-100">
                    <img
                      src={
                        book.coverImage || "https://via.placeholder.com/300x400"
                      }
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-extrabold text-gray-900 shadow-sm border border-gray-100">
                      ₹{book.price}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-blue-600 font-semibold mb-5 flex-grow">
                      Tamil PDF Edition
                    </p>
                    <button
                      onClick={() => addToCart(book)}
                      className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-100"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
