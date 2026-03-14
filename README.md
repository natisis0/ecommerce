# NextGen Ecommerce 🛒

[![Production URL](https://img.shields.io/badge/Production-Live-green?style=for-the-badge)](https://ecommerce-nu-cyan.vercel.app/)

A high-performance, full-stack E-commerce application built with **Next.js 15**, **Supabase**, and **Stripe Integration**. This project serves as a comprehensive demonstration of modern web development capabilities, including secure authentication, efficient state management, and real-time database interactions.

---

## 🔗 Live Demo
Check out the live application here: [https://ecommerce-nu-cyan.vercel.app/](https://ecommerce-nu-cyan.vercel.app/)

---

## ⚡ Key Features

- **🛍️ Extensive Product Catalog**: Browse products across multiple categories (Men, Women, Kids).
- **🛒 Dynamic Shopping Cart**: Managed with **Redux Toolkit** for a seamless user experience and persisted via `localStorage`.
- **💳 Secure Stripe Checkout**: Integrated Stripe Checkout with detailed line items, supporting a realistic payment flow.
- **🔐 Robust Authentication**: Secure user login and signup powered by **Supabase Auth**.
- **📦 Order Management**: View order history, track payment statuses, and re-initiate payments for pending orders.
- **📱 Fully Responsive Design**: Optimized for desktops, tablets, and mobile devices using **Tailwind CSS**.
- **🚀 Server-Side Excellence**: Leverages **Next.js Server Actions** for secure backend logic and data mutations.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons), [Sonner](https://sonner.stevenly.me/) (Toasts)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
- **Payments**: [Stripe API](https://stripe.com/)

---

## 🧪 Testing Payments

You can test the full purchase flow using Stripe's test environment. 
On the checkout page, use the following details:

- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/30`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any ZIP code

---

## ⚙️ Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ecommerce-nextjs.git
   cd ecommerce-nextjs
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

---

*This project was developed to showcase full-stack proficiency in modern JavaScript frameworks and cloud-native services.*
