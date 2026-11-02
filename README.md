# Sunday Studio shop

The storefront reads products and uploaded product images from the same MongoDB database as manager-shop.

## Configure MongoDB

Copy `.env.example` to `.env.local` and use the same `MONGODB_URI` and `MONGODB_DB` values as `manager-shop/.env.local`. The default database name is `manager_shop`. The shop navigation menu is read from category documents in the `categories` collection and can be managed in manager-shop under `/category`.

Then start the storefront:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Products added in manager-shop will appear in the storefront when the page loads. Menu entries linked to the shop open their own `/menu/[id]` collection page, showing products assigned to that menu item.
