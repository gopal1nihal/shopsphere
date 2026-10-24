import { useState } from "react";
import ProductCard from "./components/ProductCard.jsx";
import CartPanel from "./components/CartPanel.jsx";

// Sample products are kept here so the project works without an external API.
const products = [
  { id: 1, name: "Everyday Backpack", category: "Accessories", price: 34.99, tag: "Bestseller", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80" },
  { id: 2, name: "Classic Headphones", category: "Electronics", price: 59.00, tag: "Popular", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80" },
  { id: 3, name: "Ceramic Coffee Mug", category: "Home", price: 16.50, tag: "New", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80" },
  { id: 4, name: "Minimal Desk Lamp", category: "Home", price: 42.00, tag: "Staff pick", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80" },
  { id: 5, name: "Canvas Sneakers", category: "Clothing", price: 48.00, tag: "Popular", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80" },
  { id: 6, name: "Steel Water Bottle", category: "Accessories", price: 22.00, tag: "Everyday", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80" },
  { id: 7, name: "Soft Knit Throw", category: "Home", price: 39.00, tag: "Cozy pick", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80" },
  { id: 8, name: "Everyday Watch", category: "Accessories", price: 75.00, tag: "Classic", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80" }
];

const categories = ["All", "Accessories", "Electronics", "Home", "Clothing"];
const formatPrice = (price) => `$${price.toFixed(2)}`;

export default function App() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("featured");
  const [cartItems, setCartItems] = useState([]);
  const [cartIsOpen, setCartIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Filter first, then sort the matching products.
  let visibleProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (sortOrder === "low-to-high") {
    visibleProducts = [...visibleProducts].sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high-to-low") {
    visibleProducts = [...visibleProducts].sort((a, b) => b.price - a.price);
  }

  function addToCart(product) {
    const alreadyInCart = cartItems.find((item) => item.id === product.id);

    if (alreadyInCart) {
      setCartItems(cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }

    setMessage(`${product.name} added to your bag`);
    setCartIsOpen(false);
  }

  function changeQuantity(productId, amount) {
    setCartItems(cartItems
      .map((item) => item.id === productId ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  }

  function checkout() {
    if (cartItems.length === 0) return;
    setMessage("Demo order placed! No payment was taken.");
    setCartItems([]);
    setCartIsOpen(false);
  }

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="app-shell">
      <div className="announcement">A little something for your everyday <span>✳</span> Free shipping on orders over $50</div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="ShopSphere home">shop<span>sphere</span><b>.</b></a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#shop">Shop all</a>
          <a href="#story">Our story</a>
          <a href="#footer">Contact</a>
        </nav>
        <button className="bag-button" onClick={() => setCartIsOpen(true)}>
          Bag <span className="bag-count">{itemCount}</span>
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">GOOD THINGS, LESS COMPLICATED</p>
            <h1>Find your new<br /><em>everyday favourite.</em></h1>
            <p className="hero-description">Useful things, thoughtful details, and little upgrades that make everyday life feel a bit better.</p>
            <a className="primary-link" href="#shop">Explore the collection <span>↗</span></a>
            <div className="hero-note"><span className="note-star">✳</span><span>Picked with care<br /><strong>Made for real life</strong></span></div>
          </div>
          <div className="hero-image-wrap">
            <img className="hero-image" src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85" alt="Warm, minimal lifestyle shop interior" />
            <div className="image-caption"><span>THE EVERYDAY EDIT</span><strong>Small finds. Big joy.</strong></div>
          </div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div><p className="eyebrow">A FEW GOOD THINGS</p><h2>Shop the collection</h2></div>
            <p>Thoughtful picks for your space, your routine<br className="desktop-break" /> and wherever the day takes you.</p>
          </div>

          <div className="shop-controls">
            <div className="category-list" aria-label="Filter by category">
              {categories.map((category) => (
                <button key={category} className={selectedCategory === category ? "category-button active" : "category-button"} onClick={() => setSelectedCategory(category)}>{category}</button>
              ))}
            </div>
            <div className="search-sort">
              <label className="search-box"><span>⌕</span><input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Find something..." aria-label="Search products" /></label>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} aria-label="Sort products">
                <option value="featured">Featured</option>
                <option value="low-to-high">Price: low to high</option>
                <option value="high-to-low">Price: high to low</option>
              </select>
            </div>
          </div>

          {message && <div className="notice" role="status">{message}<button onClick={() => setMessage("")} aria-label="Dismiss message">×</button></div>}

          <div className="product-grid">
            {visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}
          </div>
          {visibleProducts.length === 0 && <div className="empty-results"><span>⌕</span><h3>Nothing found just yet</h3><p>Try a different search or category.</p><button onClick={() => { setSearchText(""); setSelectedCategory("All"); }}>Clear filters</button></div>}
        </section>

        <section className="story-section" id="story">
          <div className="story-mark">✳</div>
          <p className="eyebrow">A SMALL STUDENT PROJECT WITH A BIG LOVE FOR GOOD DESIGN</p>
          <h2>Shopping should feel<br /><em>easy, not overwhelming.</em></h2>
          <p>This demo store was built to practise React fundamentals: components, props, state, lists, and event handling. The products are sample data, and checkout is only a demo.</p>
        </section>
      </main>

      <footer className="site-footer" id="footer"><a className="brand" href="#top">shop<span>sphere</span><b>.</b></a><p>Made as a learning project · Not a real store</p><a href="#top">Back to top ↑</a></footer>

      {cartIsOpen && <div className="drawer-backdrop" onClick={() => setCartIsOpen(false)}>
        <div className="cart-drawer" onClick={(event) => event.stopPropagation()}>
          <div className="drawer-heading"><div><p className="eyebrow">YOUR PICKS</p><h2>Your bag <span>({itemCount})</span></h2></div><button className="close-button" onClick={() => setCartIsOpen(false)} aria-label="Close bag">×</button></div>
          <CartPanel items={cartItems} onChangeQuantity={changeQuantity} onRemove={removeFromCart} formatPrice={formatPrice} />
          <div className="cart-footer"><div className="subtotal"><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div><p>Shipping and taxes are not included in this demo.</p><button className="checkout-button" disabled={cartItems.length === 0} onClick={checkout}>Place demo order <span>→</span></button></div>
        </div>
      </div>}
    </div>
  );
}
