import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

const money = (n) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 2
}).format(n);

export default function CartDrawer({ open, onClose, cart, onChange, onRemove, total, onCheckout, busy }) {
  if (!open) return null;
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <div className="backdrop" onMouseDown={onClose}>
      <aside className="drawer" onMouseDown={(e) => e.stopPropagation()} aria-label="Shopping cart">
        <div className="drawer-head"><div><small>YOUR SELECTION</small><h2>Your bag <span className="count">{count}</span></h2></div><button className="icon-btn" onClick={onClose} aria-label="Close cart"><X /></button></div>
        {cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={34}/><h3>Your bag is empty</h3><p>Find something lovely and add it here.</p><button className="dark-btn" onClick={onClose}>Explore products</button></div> :
          <>
            <div className="cart-lines">{cart.map(item => <div className="cart-line" key={item.id}>
              <img src={item.thumbnail} alt={item.title}/>
              <div className="line-details"><h3>{item.title}</h3><p>{money(item.price)}</p>
                <div className="quantity"><button onClick={() => onChange(item.id, -1)} aria-label="Decrease quantity"><Minus size={13}/></button><span>{item.quantity}</span><button onClick={() => onChange(item.id, 1)} aria-label="Increase quantity"><Plus size={13}/></button></div>
              </div>
              <div className="line-end"><strong>{money(item.price * item.quantity)}</strong><button onClick={() => onRemove(item.id)} aria-label="Remove item"><Trash2 size={15}/></button></div>
            </div>)}</div>
            <div className="drawer-total"><div><span>Subtotal</span><strong>{money(total)}</strong></div><p>Free shipping · Sample storefront</p>
              <button className="dark-btn checkout" disabled={busy} onClick={onCheckout}>{busy ? "Processing…" : "Confirm demo order"} <span>{money(total)}</span></button>
              <button className="text-btn" onClick={onClose}>Continue shopping</button>
            </div>
          </>}
      </aside>
    </div>
  );
}
