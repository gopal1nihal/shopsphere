export default function CartPanel({ items, onChangeQuantity, onRemove, formatPrice }) {
  if (items.length === 0) {
    return <div className="empty-cart"><span>↗</span><h3>Your bag is taking a break.</h3><p>When you find something you like, it will show up here.</p></div>;
  }

  return (
    <div className="cart-items">
      {items.map((item) => (
        <article className="cart-item" key={item.id}>
          <img src={item.image} alt={item.name} />
          <div className="cart-item-info">
            <h3>{item.name}</h3>
            <p>{formatPrice(item.price)}</p>
            <div className="quantity-control">
              <button onClick={() => onChangeQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => onChangeQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`}>+</button>
            </div>
          </div>
          <div className="cart-item-end"><strong>{formatPrice(item.price * item.quantity)}</strong><button className="remove-button" onClick={() => onRemove(item.id)}>Remove</button></div>
        </article>
      ))}
    </div>
  );
}
