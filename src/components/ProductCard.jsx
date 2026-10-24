import { Heart, ShoppingBag, Star } from "lucide-react";

const money = (n) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 2
}).format(n);

export default function ProductCard({ product, onAdd, favourite, onToggleFavourite }) {
  return (
    <article className="product-card">
      <div className="product-picture">
        {product.discountPercentage > 0 && <span className="discount">-{Math.round(product.discountPercentage)}%</span>}
        <button className={`heart ${favourite ? "selected" : ""}`} onClick={() => onToggleFavourite(product.id)} aria-label="Toggle favourite">
          <Heart size={18} fill={favourite ? "currentColor" : "none"} />
        </button>
        <img src={product.thumbnail} alt={product.title} loading="lazy"
          onError={(e) => { e.currentTarget.src = "https://placehold.co/500x400/f1f1ec/5f6259?text=Product"; }} />
        <button className="quick-add" onClick={() => onAdd(product)}><ShoppingBag size={15} /> Add to bag</button>
      </div>
      <div className="product-info">
        <small>{product.category?.replaceAll("-", " ")}</small>
        <h3 title={product.title}>{product.title}</h3>
        <div className="product-meta"><strong>{money(product.price)}</strong><span><Star size={14} fill="currentColor" /> {product.rating?.toFixed(1)}</span></div>
      </div>
    </article>
  );
}
