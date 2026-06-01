import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const navigate = useNavigate();
  const { userEmail } = useAuth();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(items);
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleRemove = (indexToRemove, title) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setToast({ message: `Removed "${title}" from cart.`, type: 'info' });
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsProcessing(true);
    try {
      const { data: order } = await axios.post(`${API_BASE_URL}/api/payment/order`, { amount: totalAmount });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Kuviyal.",
        description: "Tamil Story Purchase",
        order_id: order.id,
        theme: { color: "#1D4ED8" },
        handler: async function (response) {
          try {
            const bookIds = cartItems.map(item => item._id);
            await axios.post(`${API_BASE_URL}/api/payment/verify`, { userEmail, bookIds });
            
            // Successfully verified payment
            localStorage.removeItem('cart');
            setCartItems([]);
            setIsProcessing(false);
            setToast({ message: "Payment Successful! Books added to your library.", type: 'success' });
            setTimeout(() => {
              navigate('/my-books');
            }, 1500);
          } catch (verifyErr) {
            console.error("Payment verification failed:", verifyErr);
            setToast({ message: "Verification failed. Please contact support.", type: 'error' });
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            setToast({ message: "Payment cancelled.", type: 'info' });
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout Error:", error);
      setToast({ message: "Something went wrong initiating the payment.", type: 'error' });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans animate-fade-in">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Cart</h1>
          <p className="text-slate-500 text-sm font-semibold mt-1">Review your selected Tamil digital literature editions</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-200/80 shadow-sm flex flex-col justify-center items-center gap-6 flex-grow">
            <span className="text-5xl animate-float">🛒</span>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">Your shopping cart is empty</h3>
              <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto">Explore our extensive collection of classic stories and add them to your bookshelf!</p>
            </div>
            <button onClick={() => navigate('/home')} className="mt-4 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-sm cursor-pointer">Browse Store</button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Cart Items List */}
            <div className="flex-grow space-y-4 w-full lg:w-2/3">
              {cartItems.map((item, index) => (
                <div key={index} className="flex bg-white p-5 rounded-2xl shadow-sm border border-slate-100 items-center justify-between group hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-5">
                    <img src={item.coverImage || "https://via.placeholder.com/80x100"} alt={item.title} className="w-16 h-22 object-cover rounded-xl shadow-sm border border-slate-100" />
                    <div>
                      <h3 className="text-lg font-black text-slate-900 line-clamp-1 leading-snug group-hover:text-blue-600 transition-colors">{item.title}</h3>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-1">Tamil PDF Edition</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="text-xl font-black text-slate-900">₹{item.price}</span>
                    <button onClick={() => handleRemove(index, item.title)} className="text-slate-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-xl transition-all cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Checkout Card */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100/80 sticky top-24 space-y-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-4">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-slate-500 font-bold text-sm">
                    <span>Selected PDFs ({cartItems.length})</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-bold text-sm">
                    <span>Tax & Service Charge</span>
                    <span className="text-emerald-600 uppercase font-black tracking-wide text-xs bg-emerald-50 px-2 py-0.5 rounded">Free</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <span className="text-slate-900 font-black text-lg">Total Amount</span>
                  <span className="text-3xl font-black text-blue-600 tracking-tight">₹{totalAmount}</span>
                </div>

                <button 
                  onClick={handleCheckout} 
                  disabled={isProcessing}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-blue-500/10 cursor-pointer disabled:bg-slate-300 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secure Checkout
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}