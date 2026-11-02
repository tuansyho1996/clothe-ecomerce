import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import MenuCategoryProducts from "./menu-category-products";
import { getNavigationMenu, type MenuNode } from "@/lib/navigation-menu";

type MenuPageProps = {
  params: Promise<{ id: string }>;
};

function findMenuPath(
  nodes: MenuNode[],
  id: string,
  parents: MenuNode[] = [],
): MenuNode[] | null {
  for (const node of nodes) {
    const path = [...parents, node];
    if (node.id === id) {
      return path;
    }

    const childPath = findMenuPath(node.children, id, path);
    if (childPath) {
      return childPath;
    }
  }

  return null;
}

async function MenuPageContent({ params }: MenuPageProps) {
  await connection();
  const { id } = await params;
  const menu = await getNavigationMenu();
  const menuPath = findMenuPath(menu, id);

  if (!menuPath) {
    notFound();
  }

  const menuItem = menuPath[menuPath.length - 1];

  return (
    <main className="menu-category-page">
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        {menuPath.map((item, index) => (
          <span key={item.id}>
            <span aria-hidden="true">/</span>
            {index === menuPath.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <Link href={`/menu/${encodeURIComponent(item.id)}`}>{item.label}</Link>
            )}
          </span>
        ))}
      </nav>

      <section className="shop-section menu-category-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow"><span className="eyebrow-line" />The feel-good collection</span>
            <h1>{menuItem.label}</h1>
          </div>
          <Link className="text-link" href="/#shop">Shop all pieces <span aria-hidden="true">↗</span></Link>
        </div>

        {menuItem.description && <p className="menu-category-description">{menuItem.description}</p>}

        {menuItem.children.length > 0 && (
          <nav className="menu-category-children" aria-label={`${menuItem.label} categories`}>
            {menuItem.children.map((child) => (
              <Link key={child.id} href={`/menu/${encodeURIComponent(child.id)}`}>
                {child.label}<span aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>
        )}

        <div className="shop-controls">
          <span className="category-tab selected">{menuItem.label}</span>
        </div>
        <MenuCategoryProducts menuCategoryId={menuItem.id} />
      </section>

      <footer className="site-footer">
        <Link className="wordmark footer-wordmark" href="/" aria-label="Sunday Studio home">sunday<span>.</span></Link>
        <span>Clothes that feel like a deep breath.</span>
        <span>© Sunday Studio 2025</span>
      </footer>
    </main>
  );
}

export default function MenuPage({ params }: MenuPageProps) {
  return (
    <Suspense fallback={<main className="menu-category-page"><div className="empty-search" role="status"><p>Loading this collection…</p></div></main>}>
      <MenuPageContent params={params} />
    </Suspense>
  );
}
