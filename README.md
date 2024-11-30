# ShopYangu Admin Dashboard

A modern admin dashboard for managing shops, products, and orders on the ShopYangu platform. Built with Next.js 14, this dashboard provides a comprehensive interface for store administrators to manage their e-commerce operations.

You can view the live demo site at [https://shop-yangu-nine.vercel.app](https://shop-yangu-nine.vercel.app)

## Features

-  **Shop Management**: Create, edit, and manage multiple shops
-  **Product Management**: Add, update, and track product inventory
-  **Analytics Dashboard**: View key metrics and performance indicators
-  **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

-  [Next.js 14](https://nextjs.org/) - React framework
-  [Tailwind CSS](https://tailwindcss.com/) - CSS framework
-  [NextAuth.js](https://next-auth.js.org/) - Authentication
-  [SQLite](https://www.sqlite.org/) - Database
-  [shadcn/ui](https://ui.shadcn.com/) - UI components
-  [Recharts](https://recharts.org/) - Charts and analytics

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/Ogwenya/shop-yangu.git
cd shop-yangu
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing the Admin Panel

1. **Shop Management**:

   -  Navigate to the Shops page
   -  Try creating a new shop using the "Add Shop" button
   -  Edit existing shops using the edit icon
   -  Test shop deletion functionality

2. **Product Management**:

   -  Go to the Products page
   -  Add new products with images and details
   -  Update product stock levels
   -  Test filtering and search functionality

3. **Dashboard**:
   -  Check if analytics graphs are displaying correctly
   -  Verify that metrics are updating with data changes
   -  Test responsiveness on different screen sizes
