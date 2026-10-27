"use client";

import Link from "next/link";
import { useMemo } from "react";
import { categories } from "./products";
import { useStorefront } from "./storefront";


function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}

export default function Home() {
  const {
    activeCategory,
    addToCart,
    favorites,
    products,
    productsError,
    productsLoading,
    query,
    reloadProducts,
    setActiveCategory,
    setQuery,
    toggleFavorite,
  } = useStorefront();

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          activeCategory === "All pieces" || product.category === activeCategory;
        const matchesSearch = `${product.name} ${product.category} ${product.color}`
          .toLowerCase()
          .includes(query.trim().toLowerCase());

        return matchesCategory && matchesSearch;
      }),
    [activeCategory, products, query],
  );

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-image" role="img" aria-label="A relaxed, sunlit afternoon in the countryside" />
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-line" />Made for the in-between</span>
          <h1 id="hero-title">Good clothes.<br />Easy <em>days.</em></h1>
          <p>Thoughtful pieces for wherever the day takes you. Made to feel like you, only a little more put together.</p>
          <a className="primary-link" href="#shop">
            Find your everyday <span aria-hidden="true">↗</span>
          </a>
          <div className="hero-note"><span>01 / 03</span><span className="hero-note-rule" />A softer kind of wardrobe</div>
        </div>
        <div className="hero-sticker" aria-label="Designed to wear on repeat">
          <span>DESIGNED TO</span>
          <strong>wear<br />on repeat</strong>
          <span className="sticker-star" aria-hidden="true">✳</span>
        </div>
        <div className="hero-caption">A slower wardrobe, for all the little things.</div>
      </section>

      <section className="values-strip" aria-label="Our values">
        <span>Good things, made thoughtfully</span><span className="value-dot">✳</span>
        <span>Natural fabrics, always</span><span className="value-dot">✳</span>
        <span>Wear it on repeat</span><span className="value-dot">✳</span>
        <span>Good things, made thoughtfully</span>
      </section>

      <section className="shop-section" id="shop" aria-labelledby="shop-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow"><span className="eyebrow-line" />The feel-good collection</span>
            <h2 id="shop-title">A few good <em>things.</em></h2>
          </div>
          <a className="text-link" href="#shop">A wardrobe, less complicated <span aria-hidden="true">↗</span></a>
        </div>

        <div className="shop-controls">
          <div className="category-tabs" role="group" aria-label="Filter products by category">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={activeCategory === category ? "category-tab selected" : "category-tab"}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
          <span className="product-count">{visibleProducts.length} pieces</span>
        </div>

        {productsLoading ? (
          <div className="empty-search" role="status">
            <p>Loading the collection…</p>
          </div>
        ) : productsError ? (
          <div className="empty-search" role="alert">
            <p>{productsError}</p>
            <button type="button" onClick={() => void reloadProducts()}>Try again</button>
          </div>
        ) : visibleProducts.length ? (
          <div className="product-grid">
            {visibleProducts.map((product, index) => (
              <article className="product-card" key={product.id}>
                <div
                  className={`product-image product-image-${product.id}`}
                >
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
                    <HeartIcon filled={favorites.includes(product.id)} />
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
                  <span className="product-price">${product.price}</span>
                </div>
                <span className="sr-only">Product {index + 1} of {visibleProducts.length}</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-search">
            <span aria-hidden="true">✳</span>
            <p>No pieces found for “{query}”. Try a different search.</p>
            <button type="button" onClick={() => setQuery("")}>Clear search</button>
          </div>
        )}
      </section>

      <section className="story-section" id="story">
        <div className="story-image" role="img" aria-label="Carefully chosen natural fabrics" />
        <div className="story-copy">
          <span className="eyebrow"><span className="eyebrow-line" />A more thoughtful way to dress</span>
          <h2>Wear what you love.<br /><em>Love it longer.</em></h2>
          <p>Fashion can feel good without moving faster. We believe in buying more thoughtfully, choosing comfortable pieces you’ll reach for again, and keeping the things you love in your wardrobe for longer. We’re always learning how to make more responsible choices—and sharing that journey as we go.</p>
          <Link className="primary-link" href="/about">A bit about us <span aria-hidden="true">↗</span></Link>
          <span className="story-handwriting">Buy thoughtfully. Wear on repeat. <span aria-hidden="true">♡</span></span>
        </div>
      </section>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#" aria-label="Sunday Studio home">sunday<span>.</span></a>
        <span>Clothes that feel like a deep breath.</span>
        <span>© Sunday Studio 2025</span>
      </footer>

    </main>
  );
}
