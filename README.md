# Muskan Jewellery - Next.js Rebuild

A premium jewellery storefront rebuilt in Next.js with:

- Next.js App Router
- MongoDB with Mongoose
- Protected admin login
- Product uploads stored in MongoDB as base64 data URLs
- Gmail enquiry forwarding with app password
- Premium white luxury storefront UI

## Environment Variables

Create `.env` with:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=jewellery
ADMIN_EMAIL=akshaykar7874@gmail.com
```

## Run Locally

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/` - storefront
- `http://localhost:3000/login` - admin login/setup
- `http://localhost:3000/admin` - protected admin dashboard

## Deploy

This rebuild is ready for Vercel and Next.js-compatible Netlify deployment.

### Vercel

- Import the project
- Add the same environment variables in project settings
- Deploy

### Netlify

- Use Next.js runtime support
- Add the same environment variables
- Deploy

## Notes

- The admin email is fixed through `ADMIN_EMAIL`
- The first login flow lets you set the admin password
- Product images are stored in MongoDB, so there is no local uploads folder dependency
- Customer enquiries are saved in MongoDB and optionally emailed through Gmail if an app password is saved in admin settings
