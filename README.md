# Kuviyal (குவியல்) 📚

**Kuviyal** is a full-stack digital bookstore platform dedicated to preserving and sharing the rich heritage of Tamil literature. It provides a modern, seamless experience for users to discover, purchase, and maintain a personal digital library of Tamil stories.

## 🚀 Features

* **Secure Authentication:** Seamless Google Sign-In integrated via **Firebase Authentication**.
* **Digital Asset Hosting:** High-quality book PDFs and cover images are securely stored and served using **Supabase Storage Buckets**.
* **Integrated Payments:** Secure INR transactions powered by the **Razorpay** payment gateway.
* **Personalized Library:** A "My Books" section where users can access and view their purchased content.
* **Admin Dashboard:** Functionality to manage the book catalog, including adding new titles with PDF URLs and pricing.

## 🛠️ Tech Stack

### Frontend
* **React.js** with **Vite** for a high-performance user interface.
* **Tailwind CSS** for modern, responsive styling.
* **React Router** for efficient client-side navigation.

### Backend
* **Node.js** & **Express** handling API requests and business logic.
* **MongoDB** (via Mongoose) for flexible data modeling of books and user purchases.

### Cloud Services
* **Firebase:** Authentication and identity management.
* **Supabase:** Scalable cloud storage for digital assets (PDFs/Images).
* **Razorpay:** Secure payment processing.
