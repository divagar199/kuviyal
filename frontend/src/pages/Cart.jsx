import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(items);
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleRemove = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    try {
      const { data: order } = await axios.post('https://kuviyal-books.onrender.com/api/payment/order', { amount: totalAmount });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Kuvyal.",
        description: "Tamil Story Purchase",
        order_id: order.id,
        theme: { color: "#1D4ED8" },
        handler: async function (response) {
          const bookIds = cartItems.map(item => item._id);
          await axios.post('https://kuviyal-books.onrender.com/api/payment/verify', { userEmail, bookIds });
          
          alert("Payment Successful! Books added to your library.");
          localStorage.removeItem('cart');
          setCartItems([]);
          navigate('/my-books');
        },
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong initiating the payment.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Your cart is empty</h3>
            <button onClick={() => navigate('/home')} className="mt-4 bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-800 transition-colors">Browse Store</button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={item.coverImage || "https://via.placeholder.com/80x100"} alt={item.title} className="w-16 h-20 object-cover rounded" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-gray-500">Tamil PDF Edition</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="text-lg font-extrabold text-gray-900">₹{item.price}</span>
                    <button onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-700">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-96">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                <h3 className="text-xl font-extrabold text-gray-900 mb-6">Order Summary</h3>
                <div className="flex justify-between text-gray-600 mb-4"><span>Subtotal</span><span>₹{totalAmount}</span></div>
                <div className="border-t border-gray-200 my-4 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-blue-700">₹{totalAmount}</span>
                </div>
                <button onClick={handleCheckout} className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-800">Secure Checkout</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}   