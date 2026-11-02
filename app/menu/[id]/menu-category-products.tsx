"use client";

import Link from "next/link";
import { useStorefront } from "@/app/storefront";

export default function MenuCategoryProducts({ menuCategoryId }: { menuCategoryId: string }) {
  const {
    addToCart,
    favorites,
    products,
    productsError,
    productsLoading,
    reloadProducts,
    toggleFavorite,
  } = useStorefront();
  const categoryProducts = products.filter(
    (product) => product.menuCategoryId === menuCategoryId,
  );

  if (productsLoading) {
    return <div className="empty-search" role="status"><p>Loading this collection…</p></div>;
  }

  if (productsError) {
    return (
      <div className="empty-search" role="alert">
        <p>{productsError}</p>
        <button type="button" onClick={() => void reloadProducts()}>Try again</button>
      </div>
    );
  }

  if (categoryProducts.length === 0) {
    return (
      <div className="empty-search">
        <span aria-hidden="true">✳</span>
        <p>There are no pieces in this collection just yet.</p>
        <Link className="text-link" href="/#shop">Browse all pieces <span aria-hidden="true">↗</span></Link>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {categoryProducts.map((product) => (
        <article className="product-card" key={product.id}>
          <div className={`product-image product-image-${product.id}`}>
            <Link
              className="product-image-link"
              href={`/product/${product.slug}`}
              style={product.image ? { backgroundImage: `url("${product.image}")` } : undefined}
              aria-label={`View ${product.name} in ${product.color}`}
            />
            <button
              className={`favorite-button${favorites.includes(product.id) ? " favorited" : ""}`}
              type="button"
              aria-label={`${favorites.includes(product.id) ? "Remove" : "Add"} ${product.name} ${favorites.includes(product.id) ? "from" : "to"} favorites`}
              aria-pressed={favorites.includes(product.id)}
              onClick={() => toggleFavorite(product.id)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill={favorites.includes(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
              </svg>
            </button>
            <button className="quick-add" type="button" onClick={() => addToCart(product.id)}>
              <span>Add to bag</span><span aria-hidden="true">+</span>
            </button>
          </div>
          <div className="product-info">
            <div>
              <h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3>
              <p>{product.color}</p>
            </div>
            <span className="product-price">${product.price.toFixed(2)}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
