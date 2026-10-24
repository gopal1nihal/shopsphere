export default function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
        <span className="product-tag">{product.tag}</span>
      </div>
      <div className="product-details">
        <div><p className="product-category">{product.category}</p><h3>{product.name}</h3></div>
        <div className="product-buy-row"><strong>${product.price.toFixed(2)}</strong><button onClick={() => onAdd(product)} aria-label={`Add ${product.name} to bag`}>+ Add</button></div>
      </div>
    </article>
  );
}
