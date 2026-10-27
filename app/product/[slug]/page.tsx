import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getProducts } from "@/lib/products";
import ProductActions from "./product-actions";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return { title: "Product not found | Sunday Studio" };
  }

  return {
    title: `${product.name} | Sunday Studio`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  await connection();
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return (
    <main className="product-page">
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <Link href="/#shop">Clothing</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <section className="product-detail" aria-labelledby="product-title">
        <div
          className={`product-detail-image product-image-${product.id}`}
          style={product.image ? { backgroundImage: `url("${product.image}")` } : undefined}
          role="img"
          aria-label={`${product.name} in ${product.color}`}
        >
        </div>
        <div className="product-detail-copy">
          <span className="eyebrow"><span className="eyebrow-line" />{product.category}</span>
          <h1 id="product-title">{product.name}</h1>
          <p className="product-detail-color">{product.color}</p>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <div className="product-detail-rule" />
          <p className="product-detail-description">{product.description}</p>
          <p className="product-detail-note">Easy to wear, easy to make your own. Choose a size to add this piece to your bag.</p>
          <ProductActions productId={product.id} />
          <details className="product-info-disclosure">
            <summary>Materials &amp; making</summary>
            <p>Material composition, sourcing, and production details have not been provided for this demo product. We believe those details should be shared clearly once they are verified.</p>
          </details>
          <details className="product-info-disclosure">
            <summary>Care &amp; fit</summary>
            <p>Care and garment measurements have not been provided for this demo product. Please confirm fit and care information before placing an order.</p>
          </details>
        </div>
      </section>

      <section className="related-products" aria-labelledby="related-title">
        <div className="related-heading">
          <div>
            <span className="eyebrow"><span className="eyebrow-line" />A few more good things</span>
            <h2 id="related-title">Keep <em>looking.</em></h2>
          </div>
          <Link className="text-link" href="/#shop">Shop all <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="product-grid">
          {relatedProducts.map((relatedProduct) => (
            <article className="product-card" key={relatedProduct.id}>
              <Link
                className={`product-image product-image-${relatedProduct.id} related-product-image`}
                href={`/product/${relatedProduct.slug}`}
                style={relatedProduct.image ? { backgroundImage: `url("${relatedProduct.image}")` } : undefined}
                aria-label={`View ${relatedProduct.name}`}
              >
              </Link>
              <div className="product-info">
                <div>
                  <h3><Link href={`/product/${relatedProduct.slug}`}>{relatedProduct.name}</Link></h3>
                  <p>{relatedProduct.color}</p>
                </div>
                <span className="product-price">${relatedProduct.price}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <Link className="wordmark footer-wordmark" href="/" aria-label="Sunday Studio home">sunday<span>.</span></Link>
        <span>Clothes that feel like a deep breath.</span>
        <span>© Sunday Studio 2025</span>
      </footer>
    </main>
  );
}
