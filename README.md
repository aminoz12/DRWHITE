# DR.WHITE Clone - React + Shopify Headless Store

A modern, conversion-focused e-commerce website built with Next.js, React, Tailwind CSS, and Shopify (headless architecture).

## Features

- **Homepage** with hero section, best sellers, benefits, bundles, and customer reviews
- **Shop Page** displaying all products from Shopify
- **Product Pages** with variant selection, quantity controls, and direct checkout
- **Mobile-first responsive design**
- **Shopify Storefront API** integration for product data
- **Direct Shopify checkout** (no custom cart needed)

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Shopify Storefront API (GraphQL)
- **Icons:** Lucide React
- **Hosting:** Vercel-ready with static export

## Project Structure

```
src/
├── app/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── BestSellers.tsx
│   │   ├── WhyDrDent.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Bundles.tsx
│   │   ├── Reviews.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   └── ProductDetails.tsx
│   ├── shop/
│   │   └── page.tsx          # Shop listing page
│   ├── product/[handle]/
│   │   └── page.tsx          # Individual product page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── globals.css
├── lib/
│   └── shopify.ts            # Shopify API client
└── ...
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Shopify

1. Create a Shopify store (or use existing)
2. Go to **Settings** → **Apps and sales channels** → **Develop apps**
3. Create a new app
4. Configure **Storefront API integration**
   - Enable read access for: Products, Variants, Collections
5. Install the app
6. Copy the **Storefront access token**

### 3. Environment Variables

Create a `.env.local` file (copy from `.env.example`):

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for Production

```bash
npm run build
```

This generates a static site in the `dist/` folder.

## Shopify Integration

### How It Works

1. **Products** - Fetched from Shopify via Storefront API GraphQL
2. **Checkout** - Users are redirected to Shopify's secure checkout
3. **Cart URL format:** `https://your-store.myshopify.com/cart/{variant_id}:{quantity}`

### API Functions

- `getProducts()` - Fetch all products
- `getProduct(handle)` - Fetch single product by handle

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Static Hosts

The `dist/` folder contains the static export ready for any hosting service (Netlify, Cloudflare Pages, etc.)

## Customization

### Brand Colors
Edit Tailwind classes in components:
- Primary purple: `bg-purple-600`, `text-purple-600`
- Adjust in `globals.css` or component files

### Product Data
Update products in your Shopify admin - changes reflect immediately.

### Images
Add product images in Shopify. The site uses Shopify's CDN for all product images.

## Key Design Elements (DrDent Style)

- Clean, minimal aesthetic
- Purple accent color
- Trust badges (reviews, money-back guarantee)
- Benefit-focused copy
- Mobile-optimized layout
- Large CTA buttons
- Social proof sections

## Next Steps

1. Add real product images to Shopify
2. Configure payment methods in Shopify
3. Set up shipping rates
4. Test checkout flow
5. Add Google Analytics
6. Configure SEO meta tags

## Support

For Shopify API issues, refer to [Shopify Storefront API docs](https://shopify.dev/docs/api/storefront).
