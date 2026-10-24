import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, ChevronDown, Heart, LogIn, LogOut, Menu,
  Package, Search, ShieldCheck, ShoppingBag, Sparkles, Truck, UserRound,
  WalletCards, X, CreditCard, Smartphone, Banknote, MapPin, Mail, LockKeyhole
} from "lucide-react";
import ProductCard from "./components/ProductCard.jsx";
import CartDrawer from "./components/CartDrawer.jsx";

const API = "https://dummyjson.com/products?limit=100";
const money = (amount) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 2
}).format(amount);

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState(() => readStorage("ss-cart", []));
  const [favourites, setFavourites] = useState(() => readStorage("ss-favourites", []));
  const [orders, setOrders] = useState(() => readStorage("ss-orders", []));
  const [user, setUser] = useState(() => readStorage("ss-demo-user", null));
  const [screen, setScreen] = useState("home");
  const [authMode, setAuthMode] = useState("login");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [authError, setAuthError] = useState("");
  const [checkoutForm, setCheckoutForm] = useState({ fullName: "", email: "", address: "", city: "", postalCode: "" });

  function loadProducts() {
    setLoading(true);
    setError("");
    fetch(API)
      .then(response => {
        if (!response.ok) throw new Error(`Product API returned ${response.status}`);
        return response.json();
      })
      .then(data => setProducts(data.products || []))
      .catch(err => setError(`${err.message}. Check your connection and retry.`))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { localStorage.setItem("ss-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("ss-favourites", JSON.stringify(favourites)); }, [favourites]);
  useEffect(() => { localStorage.setItem("ss-orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => {
    if (user) localStorage.setItem("ss-demo-user", JSON.stringify(user));
    else localStorage.removeItem("ss-demo-user");
  }, [user]);

  const categories = useMemo(
    () => ["all", ...new Set(products.map(product => product.category).filter(Boolean))],
    [products]
  );
  const shownProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = products.filter(product =>
      (product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)) &&
      (category === "all" || product.category === category)
    );
    if (sort === "low") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...filtered].sort((a, b) => b.rating - a.rating);
    if (sort === "name") return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    return filtered;
  }, [products, query, category, sort]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const userOrders = useMemo(
    () => user ? orders.filter(order => order.email === user.email) : [],
    [orders, user]
  );

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  function addToCart(product) {
    setCart(current => {
      const existing = current.find(item => item.id === product.id);
      return existing
        ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }];
    });
    notify(`${product.title} added to your bag`);
  }

  function changeQuantity(id, amount) {
    setCart(current => current
      .map(item => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
      .filter(item => item.quantity > 0));
  }

  function toggleFavourite(id) {
    setFavourites(current => current.includes(id)
      ? current.filter(productId => productId !== id)
      : [...current, id]);
  }

  function openAuth(mode = "login") {
    setAuthMode(mode);
    setAuthError("");
    setAuthForm({ name: "", email: "", password: "", confirmPassword: "" });
    setScreen("auth");
    setMenuOpen(false);
  }

  function submitAuth(event) {
    event.preventDefault();
    setAuthError("");
    const email = authForm.email.trim().toLowerCase();
    if (!email || !authForm.password) {
      setAuthError("Please enter your email and password.");
      return;
    }
    if (authMode === "signup") {
      if (!authForm.name.trim()) {
        setAuthError("Please enter your name.");
        return;
      }
      if (authForm.password.length < 8) {
        setAuthError("Use at least 8 characters for your password.");
        return;
      }
      if (authForm.password !== authForm.confirmPassword) {
        setAuthError("The passwords do not match.");
        return;
      }
    }
    // Frontend prototype only: never store the password or treat this as secure authentication.
    const profile = {
      name: authMode === "signup" ? authForm.name.trim() : (user?.email === email ? user.name : email.split("@")[0]),
      email
    };
    setUser(profile);
    setCheckoutForm(current => ({ ...current, fullName: profile.name, email: profile.email }));
    setScreen("account");
    notify(authMode === "signup" ? "Demo account created." : "You are signed in to the demo.");
  }

  function signOut() {
    setUser(null);
    setScreen("home");
    notify("You have signed out.");
  }

  function beginCheckout() {
    if (!cart.length) {
      notify("Your bag is empty.");
      return;
    }
    setCartOpen(false);
    if (!user) {
      openAuth("login");
      notify("Sign in to continue to checkout.");
      return;
    }
    setCheckoutForm(current => ({
      ...current,
      fullName: current.fullName || user.name,
      email: current.email || user.email
    }));
    setScreen("checkout");
  }

  function placeDemoOrder(event) {
    event.preventDefault();
    if (checkoutBusy || !cart.length) return;
    if (!checkoutForm.fullName.trim() || !checkoutForm.email.trim() ||
        !checkoutForm.address.trim() || !checkoutForm.city.trim() || !checkoutForm.postalCode.trim()) {
      notify("Please complete all delivery details.");
      return;
    }
    setCheckoutBusy(true);
    const order = {
      id: `SS-${Date.now().toString().slice(-7)}`,
      items: cart.map(item => ({ ...item })),
      total: cartTotal,
      date: new Date().toLocaleString(),
      status: "Demo confirmed",
      paymentMethod,
      email: user.email,
      deliveryName: checkoutForm.fullName,
      deliveryAddress: `${checkoutForm.address}, ${checkoutForm.city} ${checkoutForm.postalCode}`
    };
    window.setTimeout(() => {
      setOrders(current => [order, ...current]);
      setCart([]);
      setCheckoutBusy(false);
      setScreen("account");
      notify("Demo order placed. No payment was taken.");
    }, 700);
  }

  function updateAuthField(event) {
    setAuthForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateCheckoutField(event) {
    setCheckoutForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  function showShop() {
    setScreen("home");
    setMenuOpen(false);
    window.setTimeout(() => document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  return (
    <div className="app">
      <div className="announcement">
        <Sparkles size={14} /> GOOD FINDS FOR EVERYDAY LIFE <span>· Free shipping in this demo</span>
      </div>

      <header className="header">
        <button className="brand brand-button" onClick={() => { setScreen("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="ShopSphere home">
          <span className="brand-icon"><ShoppingBag size={19} /></span>
          <span>shop<span>sphere</span><small>THE EVERYDAY EDIT</small></span>
        </button>
        <nav className={menuOpen ? "nav nav-open" : "nav"}>
          <button onClick={showShop}>Shop all</button>
          <button onClick={() => { setCategory("beauty"); showShop(); }}>Beauty</button>
          <button onClick={() => { setCategory("furniture"); showShop(); }}>Home</button>
          <button onClick={() => { setScreen("account"); setMenuOpen(false); }}>My account</button>
          <button className="nav-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
        </nav>
        <div className="header-actions">
          <button className="icon-btn search-top" onClick={() => { showShop(); window.setTimeout(() => document.querySelector("#search")?.focus(), 50); }} aria-label="Focus search"><Search /></button>
          <button className="account-button" onClick={() => setScreen("account")}><UserRound size={17} /><span>{user ? "My account" : "Sign in"}</span></button>
          <button className="bag-button" onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><span>Bag</span><b>{cartCount}</b></button>
          <button className="icon-btn menu-button" onClick={() => setMenuOpen(open => !open)} aria-label="Toggle menu"><Menu /></button>
        </div>
      </header>

      {screen === "home" && (
        <main id="home">
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow">— GOOD FINDS. GOOD FEELING.</p>
              <h1>Everyday things.<br /><em>A little more lovely.</em></h1>
              <p className="hero-description">Thoughtful picks for your space, your routine, and everything in between. Meet your next favourite thing.</p>
              <button className="primary-btn" onClick={showShop}>Explore the collection <ArrowRight size={17} /></button>
              <p className="hero-caption">✳ Curated for your everyday</p>
            </div>
            <div className="hero-visual">
              <div className="orbit"></div>
              <div className="hero-image"><img src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1000&q=85" alt="Carefully styled everyday objects" /></div>
              <div className="sticker">GOOD<strong>STUFF</strong>ONLY ✳</div><span className="image-note">THE LITTLE THINGS CLUB ↗</span>
            </div>
            <div className="hero-index">ISSUE NO. 001 · THE EVERYDAY EDIT</div>
          </section>

          <section className="benefits" id="promise">
            <div><Truck /><span><strong>Easy, free shipping</strong><small>On every demo order</small></span></div>
            <div><ShieldCheck /><span><strong>Thoughtfully selected</strong><small>Find things worth keeping</small></span></div>
            <div><Heart /><span><strong>Here to help</strong><small>Shopping should feel simple</small></span></div>
          </section>

          <section className="shop section" id="shop">
            <div className="section-title">
              <div><p className="eyebrow">— THE GOOD STUFF</p><h2>Find your <em>favourite.</em></h2><p>A collection of useful, delightful, just-because things.</p></div>
              <button className="orders-toggle" onClick={() => setScreen("account")}>My account <ArrowRight size={16} /></button>
            </div>
            <div className="toolbar">
              <label className="search-field"><Search size={18} /><input id="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search something lovely…" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></button>}</label>
              <label className="sort"><span>Sort by</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option><option value="name">Name: A to Z</option></select><ChevronDown size={15} /></label>
            </div>
            <div className="categories">{categories.map(cat => <button key={cat} className={category === cat ? "chip active" : "chip"} onClick={() => setCategory(cat)}>{cat === "all" ? "Everything" : cat.replaceAll("-", " ")}</button>)}</div>
            <div className="results">{loading ? "Finding good things…" : `${shownProducts.length} items to love`}{category !== "all" && <button onClick={() => setCategory("all")}>Clear category ×</button>}</div>
            {loading && <div className="grid">{Array.from({ length: 8 }, (_, index) => <div className="skeleton" key={index}><div /><span /><span /></div>)}</div>}
            {!loading && error && <div className="empty"><h3>We couldn't load the collection.</h3><p>{error}</p><button className="primary-btn" onClick={loadProducts}>Try again</button></div>}
            {!loading && !error && shownProducts.length === 0 && <div className="empty"><h3>No matches just yet.</h3><p>Try another search or clear your filters.</p><button className="primary-btn" onClick={() => { setQuery(""); setCategory("all"); }}>Clear filters</button></div>}
            {!loading && !error && shownProducts.length > 0 && <div className="grid">{shownProducts.map(product => <ProductCard key={product.id} product={product} onAdd={addToCart} favourite={favourites.includes(product.id)} onToggleFavourite={toggleFavourite} />)}</div>}
            <div className="collection-end">YOU'VE REACHED THE GOOD PART <span>✳</span> {shownProducts.length} FINDS</div>
          </section>

          <section className="newsletter">
            <span className="spark">✳</span><p className="eyebrow">A NOTE FROM THE GOOD STUFF CLUB</p><h2>A little good in<br /><em>your inbox.</em></h2><p>New finds, thoughtful ideas, and the occasional reason to smile.</p>
            <form onSubmit={event => { event.preventDefault(); notify("Thanks! Newsletter signup is a frontend demo."); event.currentTarget.reset(); }}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" required placeholder="Your email address" /><button aria-label="Subscribe"><ArrowRight /></button></form>
            <small>Demo form — no email is sent.</small>
          </section>
        </main>
      )}

      {screen === "auth" && (
        <main className="page-shell auth-shell">
          <button className="back-link" onClick={() => setScreen("home")}><ArrowLeft size={16} /> Back to shopping</button>
          <section className="auth-card">
            <div className="auth-intro">
              <span className="brand-icon"><ShoppingBag size={22} /></span>
              <p className="eyebrow">WELCOME TO SHOPSPHERE</p>
              <h1>{authMode === "signup" ? "Make yourself at home." : "Good to see you again."}</h1>
              <p>{authMode === "signup" ? "Create an account to keep your orders and favourites together." : "Sign in to see your account, saved items and orders."}</p>
            </div>
            <form className="form-stack" onSubmit={submitAuth}>
              {authMode === "signup" && <label>Full name<input name="name" autoComplete="name" value={authForm.name} onChange={updateAuthField} placeholder="Your name" required /></label>}
              <label>Email address<input name="email" type="email" autoComplete="email" value={authForm.email} onChange={updateAuthField} placeholder="you@example.com" required /></label>
              <label>Password<input name="password" type="password" autoComplete={authMode === "signup" ? "new-password" : "current-password"} value={authForm.password} onChange={updateAuthField} placeholder="At least 8 characters" minLength={authMode === "signup" ? 8 : 1} required /></label>
              {authMode === "signup" && <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" value={authForm.confirmPassword} onChange={updateAuthField} placeholder="Enter password again" required /></label>}
              {authError && <p className="form-error" role="alert">{authError}</p>}
              <button className="dark-btn full-btn" type="submit">{authMode === "signup" ? "Create demo account" : "Sign in"} <ArrowRight size={16} /></button>
            </form>
            <p className="auth-switch">{authMode === "signup" ? "Already have an account?" : "New to ShopSphere?"} <button onClick={() => openAuth(authMode === "signup" ? "login" : "signup")}>{authMode === "signup" ? "Sign in" : "Create account"}</button></p>
            <p className="demo-note"><ShieldCheck size={15} /> Portfolio demo only. Passwords are not saved or verified by a server.</p>
          </section>
        </main>
      )}

      {screen === "account" && (
        <main className="page-shell account-shell">
          <button className="back-link" onClick={() => setScreen("home")}><ArrowLeft size={16} /> Continue shopping</button>
          {!user ? (
            <section className="account-welcome">
              <span className="brand-icon"><UserRound size={24} /></span>
              <p className="eyebrow">YOUR SHOPSPHERE</p>
              <h1>Your little corner of the store.</h1>
              <p>Sign in to view your demo orders, manage your profile and keep track of your favourites.</p>
              <div className="welcome-actions"><button className="dark-btn" onClick={() => openAuth("login")}><LogIn size={17} /> Sign in</button><button className="light-btn" onClick={() => openAuth("signup")}>Create account <ArrowRight size={16} /></button></div>
              <p className="demo-note"><ShieldCheck size={15} /> This is a frontend portfolio demo, not a real customer account system.</p>
            </section>
          ) : (
            <>
              <section className="dashboard-heading">
                <div><p className="eyebrow">MY ACCOUNT</p><h1>Hello, {user.name}.</h1><p>Here's a quick look at your ShopSphere activity.</p></div>
                <button className="light-btn" onClick={signOut}><LogOut size={16} /> Sign out</button>
              </section>
              <div className="dashboard-stats">
                <article><span><Package /></span><small>Orders</small><strong>{userOrders.length}</strong></article>
                <article><span><Heart /></span><small>Saved items</small><strong>{favourites.length}</strong></article>
                <article><span><ShoppingBag /></span><small>Items in bag</small><strong>{cartCount}</strong></article>
              </div>
              <div className="dashboard-grid">
                <section className="dashboard-card profile-card">
                  <div className="card-heading"><div><p className="eyebrow">YOUR DETAILS</p><h2>Profile</h2></div><UserRound /></div>
                  <p className="profile-line"><Mail size={17} /><span><small>Email address</small><strong>{user.email}</strong></span></p>
                  <p className="profile-line"><UserRound size={17} /><span><small>Name</small><strong>{user.name}</strong></span></p>
                  <p className="muted small-copy">Profile editing will be connected to the backend in a later version.</p>
                </section>
                <section className="dashboard-card">
                  <div className="card-heading"><div><p className="eyebrow">YOUR SHORTLIST</p><h2>Saved items</h2></div><Heart /></div>
                  {favourites.length === 0 ? <p className="muted">Tap the heart on a product to save it here.</p> : (
                    <div className="saved-list">{products.filter(product => favourites.includes(product.id)).slice(0, 4).map(product => <button key={product.id} className="saved-item" onClick={() => { setScreen("home"); window.setTimeout(() => document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" }), 0); }}><img src={product.thumbnail} alt="" /><span>{product.title}<small>{money(product.price)}</small></span><ArrowRight size={15} /></button>)}</div>
                  )}
                  <button className="text-link" onClick={showShop}>Browse the collection <ArrowRight size={15} /></button>
                </section>
              </div>
              <section className="dashboard-card orders-card">
                <div className="card-heading"><div><p className="eyebrow">PAST PURCHASES</p><h2>Order history</h2></div><Package /></div>
                {userOrders.length === 0 ? <div className="empty-orders"><Package size={28} /><h3>No orders yet</h3><p>Your demo orders will show up here after checkout.</p><button className="dark-btn" onClick={showShop}>Start shopping</button></div> : userOrders.map(order => (
                  <article className="dashboard-order" key={order.id}>
                    <div className="order-icon"><Package /></div>
                    <div className="order-main"><strong>{order.id}</strong><small>{order.date} · {order.items.length} item type(s)</small><small>{order.paymentMethod.toUpperCase()} · {order.deliveryAddress}</small></div>
                    <div className="order-total"><strong>{money(order.total)}</strong><small>{order.status}</small></div>
                  </article>
                ))}
              </section>
            </>
          )}
        </main>
      )}

      {screen === "checkout" && (
        <main className="page-shell checkout-shell">
          <button className="back-link" onClick={() => setCartOpen(true)}><ArrowLeft size={16} /> Back to bag</button>
          <div className="checkout-title"><p className="eyebrow">ALMOST YOURS</p><h1>Checkout</h1><p>Delivery details, then choose a demo payment method.</p></div>
          <form className="checkout-layout" onSubmit={placeDemoOrder}>
            <div className="checkout-main">
              <section className="checkout-card">
                <div className="card-heading"><div><p className="eyebrow">STEP 01</p><h2>Delivery details</h2></div><MapPin /></div>
                <div className="form-grid">
                  <label>Full name<input name="fullName" value={checkoutForm.fullName} onChange={updateCheckoutField} autoComplete="name" required /></label>
                  <label>Email address<input name="email" type="email" value={checkoutForm.email} onChange={updateCheckoutField} autoComplete="email" required /></label>
                  <label className="field-wide">Street address<input name="address" value={checkoutForm.address} onChange={updateCheckoutField} placeholder="House number, street, area" autoComplete="street-address" required /></label>
                  <label>City<input name="city" value={checkoutForm.city} onChange={updateCheckoutField} required /></label>
                  <label>Postal code<input name="postalCode" value={checkoutForm.postalCode} onChange={updateCheckoutField} autoComplete="postal-code" required /></label>
                </div>
              </section>
              <section className="checkout-card">
                <div className="card-heading"><div><p className="eyebrow">STEP 02</p><h2>Payment method</h2></div><WalletCards /></div>
                <p className="muted">Choose an option to preview how checkout would work.</p>
                <div className="payment-options">
                  <label className={paymentMethod === "upi" ? "payment-option selected" : "payment-option"}><input type="radio" name="payment" value="upi" checked={paymentMethod === "upi"} onChange={event => setPaymentMethod(event.target.value)} /><Smartphone /><span><strong>UPI</strong><small>Google Pay, PhonePe, BHIM</small></span><Check className="payment-check" /></label>
                  <label className={paymentMethod === "card" ? "payment-option selected" : "payment-option"}><input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={event => setPaymentMethod(event.target.value)} /><CreditCard /><span><strong>Credit / debit card</strong><small>Visa, Mastercard and more</small></span><Check className="payment-check" /></label>
                  <label className={paymentMethod === "cod" ? "payment-option selected" : "payment-option"}><input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={event => setPaymentMethod(event.target.value)} /><Banknote /><span><strong>Cash on delivery</strong><small>Pay when your order arrives (demo)</small></span><Check className="payment-check" /></label>
                </div>
                <p className="demo-note"><ShieldCheck size={15} /> Demo checkout only. No payment details are collected and no money is charged.</p>
              </section>
            </div>
            <aside className="checkout-summary">
              <p className="eyebrow">YOUR ORDER</p><h2>Order summary</h2>
              <div className="summary-items">{cart.map(item => <div className="summary-item" key={item.id}><img src={item.thumbnail} alt="" /><span>{item.title}<small>Qty {item.quantity}</small></span><strong>{money(item.price * item.quantity)}</strong></div>)}</div>
              <div className="summary-total"><span>Subtotal</span><strong>{money(cartTotal)}</strong></div>
              <div className="summary-total"><span>Shipping</span><strong>Free</strong></div>
              <div className="summary-grand"><span>Total</span><strong>{money(cartTotal)}</strong></div>
              <button className="dark-btn full-btn" type="submit" disabled={checkoutBusy || !cart.length}>{checkoutBusy ? "Placing demo order…" : `Place demo order · ${money(cartTotal)}`} <ArrowRight size={16} /></button>
              <p className="tiny-note">By placing this demo order, you agree that this is a portfolio prototype only.</p>
            </aside>
          </form>
        </main>
      )}

      <footer className="footer">
        <button className="brand brand-button" onClick={() => setScreen("home")}><span className="brand-icon"><ShoppingBag size={18} /></span><span>shop<span>sphere</span><small>THE EVERYDAY EDIT</small></span></button>
        <p>Find the useful. Keep the delightful.</p>
        <div><button onClick={showShop}>Shop</button><button onClick={() => setScreen("account")}>My account</button><button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top ↑</button></div>
        <small className="disclaimer">Portfolio demo · Sample products from DummyJSON · No real purchases or payments</small>
      </footer>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onChange={changeQuantity}
        onRemove={id => setCart(current => current.filter(item => item.id !== id))}
        total={cartTotal}
        onCheckout={beginCheckout}
        busy={checkoutBusy}
      />
      {checkoutBusy && <div className="processing"><span className="spinner" /> Placing your demo order…</div>}
      {notice && <div className="toast" role="status"><Check size={16} />{notice}</div>}
    </div>
  );
}

export default App;
