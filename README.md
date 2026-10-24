# ShopSphere — student React project

ShopSphere is a small sample storefront made to practise core React concepts. The goal is readable code that is easy to change and debug, rather than lots of advanced abstractions.

## Features

- Browse a small catalogue of sample products
- Search by product name
- Filter by category
- Sort by price
- Add products to a bag
- Increase/decrease quantities and remove products
- See the subtotal
- Place a demo order (this clears the bag; no payment is taken)
- Responsive layout for mobile and desktop

## Run locally

You need Node.js installed. Open a terminal in this folder and run:

```bash
npm install
npm run dev
```

On Windows PowerShell, `npm.cmd install` and `npm.cmd run dev` also work if the `npm` command is blocked by the execution policy. Open the local URL Vite prints, usually `http://localhost:5173`.

## Folder structure

```text
shopsphere-react/
├── index.html
├── package.json
├── README.md
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # sample data, state, filtering and cart logic
    ├── styles.css            # page styles and responsive rules
    └── components/
        ├── ProductCard.jsx   # displays one product
        └── CartPanel.jsx     # displays items in the bag
```

## Main concepts used

- Components and JSX
- Props (`product`, `onAdd`, and cart callbacks)
- `useState` for search, filters, sort order, and cart items
- `map`, `filter`, `find`, and `reduce`
- Event handlers and controlled inputs
- Conditional rendering for empty search results and empty cart
- Basic CSS Grid, Flexbox, and media queries

## Notes

- Product details are sample data in `src/App.jsx`, so the app does not rely on an API to start.
- Product photos are loaded from Unsplash URLs and need an internet connection.
- The cart only exists in React state. Refreshing the page clears it.
- Checkout is a front-end demonstration only. There is no backend, account system, database, or payment integration.
- This is a learning project, not a real shop. Update the sample data and design yourself as you learn more React.
