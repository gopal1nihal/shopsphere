# ShopSphere

ShopSphere is a student-built React storefront project. I am using it to practise React components, state, forms, filtering, local storage, and a simple checkout flow.

## Features

- Product catalogue loaded from DummyJSON
- Search, category filtering, and sorting
- Responsive product cards
- Add/remove cart items and change quantities
- Favourites / saved items
- Sign-in and create-account screens for the frontend demo
- My Account dashboard with profile summary, saved items, and demo order history
- Checkout form with UPI, card, and cash-on-delivery payment-method selection
- Order summary and demo order confirmation
- Cart, favourites, orders, and demo profile persist in the browser using localStorage
- Loading, empty, and error states

## Run locally on Windows

Open this folder in VS Code, then run:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

To check a production build:

```powershell
npm.cmd run build
```

## Project structure

```text
shopsphere-react/
├── index.html
├── package.json
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    └── components/
        ├── ProductCard.jsx
        └── CartDrawer.jsx
```

## Important limitations

This is a frontend portfolio prototype. Product data comes from DummyJSON. The sign-in/sign-up flow is a UI demo; it does not verify credentials with a server and does not store passwords. Checkout records a demo order in the browser only. Payment methods are selectable previews, but no payment details are collected and no money is charged.

For a real production store, this project still needs a backend API, database, secure authentication, server-side order validation, and a payment provider integration (for example, Razorpay or Stripe) with server-side verification. Never collect or process real payment details directly in a frontend-only app.

## Learning notes

I have kept the code split into components and used descriptive function names so I can keep building on it while learning. This project is a work in progress.
