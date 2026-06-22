# RecipeHub 🍽️

RecipeHub is a premium, state-of-the-art recipe sharing community and marketplace platform built with a modern web design system. It allows home chefs to post their culinary creations, bookmark favorites, report spam, and monetize their recipes by locking them behind Stripe premium checkout options.

## 🌟 Key Features

### 1. **Authentication & Session Persistence**
- Secure, custom cookie-based JWT authentication with HttpOnly cookies.
- Test logins for Chef, Foodie, and Admin accounts to facilitate immediate evaluation.
- Fully protected client-side and server-side routes via Edge-compatible Next.js 16 `proxy.js` middleware.

### 2. **Double Theme Toggling (Light & Dark)**
- Dynamic selector-based theme engine supporting Light and Dark modes.
- Sleek Cream palette for Light mode and deep obsidian/mint forest theme for Dark mode.

### 3. **Recipe Catalog & Filtering**
- Search by recipe name, cuisine, or category.
- Server-side multi-category filtering using MongoDB `$in` logic.
- Complete pagination controls (server-side limits & skips).

### 4. **Recipe Creation & Editing**
- Standard user limits restricting submissions to a maximum of 2 recipes.
- File-upload integration to upload thumbnails directly to ImgBB.
- Interactive Tag-Editor for ingredients list.

### 5. **Monetization & Stripe Integration**
- Stripe payment checkouts for premium recipe unlocks.
- Stripe subscription updates for upgrading users to Premium membership.
- Automatic mock checkout system for sandbox testing if live Stripe credentials are omitted.

### 6. **Admin Moderation & Control**
- Comprehensive dashboard overview of system stats (users, recipes, payments, abuse flags).
- Block/Unblock users and Delete/Edit recipes.
- Recipe spotlight featuring: toggle featured recipes to showcase on the homepage.
- Review and dismiss reports or delete offending recipes.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.9 (Turbopack)
- **Styling**: Tailwind CSS v4 (CSS-first config)
- **Database**: MongoDB (via Mongoose)
- **Server**: Express.js
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Payments**: Stripe API

---

## 🚀 Local Setup

### Client Configuration

1. Navigate to the client directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following keys:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
   JWT_SECRET=your_jwt_secret
   ```
4. Run the Next.js development server:
   ```bash
   npm run dev
   ```

### Server Configuration

1. Navigate to the server directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following keys:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:3000
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
