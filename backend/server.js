require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Razorpay = require('razorpay');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected"));

const BookSchema = new mongoose.Schema({
  title: String,
  price: Number,
  coverImage: String,
  pdfUrl: String
});
const Book = mongoose.model('Book', BookSchema);

const PurchaseSchema = new mongoose.Schema({
  userEmail: String,
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
});
const Purchase = mongoose.model('Purchase', PurchaseSchema);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


app.get('/api/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});


app.post('/api/admin/add-book', async (req, res) => {
  const newBook = new Book(req.body);
  await newBook.save();
  res.json({ message: "Book Added successfully!" });
});


app.post('/api/payment/order', async (req, res) => {
  const { amount } = req.body;
  const options = { amount: amount * 100, currency: "INR" }; 
  const order = await razorpay.orders.create(options);
  res.json(order);
});


app.post('/api/payment/verify', async (req, res) => {
  const { userEmail, bookIds } = req.body;

  
  for (let id of bookIds) {
    await new Purchase({ userEmail, bookId: id }).save();
  }
  res.json({ success: true });
});


app.get('/api/my-books/:email', async (req, res) => {
  const purchases = await Purchase.find({ userEmail: req.params.email }).populate('bookId');
  res.json(purchases.map(p => p.bookId)); 
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));