# Muskan Jewellery

A premium jewellery storefront with a MongoDB-only backend that also stores uploaded product images in MongoDB, making it safer for Vercel deployments.

## Backend Stack

- Express
- Mongoose
- MongoDB Atlas via `.env`
- Nodemailer for Gmail enquiries
- Multer memory uploads
- `serverless-http` for Vercel serverless runtime

## Structure

- `server.js`: local startup entry
- `api/index.js`: Vercel serverless entrypoint
- `src/app.js`: Express app setup
- `src/config/`: Mongo connection, defaults, seeding
- `src/models/`: Mongoose models
- `src/controllers/`: route logic
- `src/routes/`: API routes
- `src/middleware/`: auth middleware
- `src/utils/`: password, cookies, async helpers

## Environment

Create `C:\Users\Elcom\Desktop\jewellery\.env` with:

```env
PORT=3000
MONGODB_URI=mongodb+srv://your-db-user:your-encoded-password@your-cluster.mongodb.net/jewellery?retryWrites=true&w=majority&appName=jewellery
MONGODB_DB_NAME=jewellery
```

## Start Locally

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/`
- `http://localhost:3000/admin.html`

## Vercel Notes

- `vercel.json` rewrites `/api/*` and `/admin.html` into the serverless function.
- Product images are stored in MongoDB as data URLs instead of local files.
- This avoids Vercel filesystem upload problems and removes any runtime dependency on an `uploads/` folder.

## Notes

- JSON storage has been removed from the app logic.
- Admin email is fixed to `akshaykar7874@gmail.com`.
- Store settings, Gmail app password, enquiries, products, images, and admin session data are all stored in MongoDB.

## If MongoDB Does Not Connect

Check these Atlas items:

- The cluster hostname from Atlas `Connect > Drivers` is exactly correct
- The database username is exactly correct
- The password is correct
- The password is URL-encoded if it contains symbols like `@`
- Your IP is allowed in Atlas Network Access
