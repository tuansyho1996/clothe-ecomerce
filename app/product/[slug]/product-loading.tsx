export default function ProductLoading() {
  return (
    <main className="product-page" aria-busy="true" aria-label="Loading product">
      <div className="product-breadcrumb"><span>Loading product details…</span></div>
      <section className="product-detail">
        <div className="product-detail-image product-loading-image" />
        <div className="product-detail-copy product-loading-copy">
          <span className="eyebrow"><span className="eyebrow-line" />Just a moment</span>
          <div className="product-loading-line product-loading-title" />
          <div className="product-loading-line" />
          <div className="product-loading-line product-loading-description" />
          <div className="product-loading-action" />
        </div>
      </section>
    </main>
  );
}
