"use client";

import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "./products";

type StorefrontContextValue = {
  activeCategory: string;
  setActiveCategory: Dispatch<SetStateAction<string>>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  searchOpen: boolean;
  setSearchOpen: Dispatch<SetStateAction<boolean>>;
  products: Product[];
  productsLoading: boolean;
  productsError: string;
  reloadProducts: () => Promise<void>;
  favorites: string[];
  cart: Record<string, number>;
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: Dispatch<SetStateAction<boolean>>;
  checkoutMessage: string;
  setCheckoutMessage: Dispatch<SetStateAction<string>>;
  addToCart: (productId: string) => void;
  changeQuantity: (productId: string, amount: number) => void;
  toggleFavorite: (productId: string) => void;
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.slug === "string" &&
    typeof value.name === "string" &&
    typeof value.category === "string" &&
    typeof value.price === "number" &&
    typeof value.color === "string" &&
    typeof value.image === "string" &&
    typeof value.description === "string"
  );
}

async function requestProducts(): Promise<Product[]> {
  const response = await fetch("/api/products", { cache: "no-store" });
  const payload: unknown = await response.json();

  if (!isRecord(payload)) {
    throw new Error("The product service returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      typeof payload.error === "string"
        ? payload.error
        : "Could not load products. Please try again.",
    );
  }

  if (!Array.isArray(payload.products) || !payload.products.every(isProduct)) {
    throw new Error("The product service returned invalid product data.");
  }

  return payload.products;
}

function getProductsError(error: unknown) {
  return error instanceof Error ? error.message : "Could not load products. Please try again.";
}

export function useStorefront() {
  const context = useContext(StorefrontContext);

  if (!context) {
    throw new Error("useStorefront must be used within StorefrontProvider");
  }

  return context;
}

function BagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 8h14l1 13H4L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

type MenuEntry = {
  id?: string;
  label: string;
  href?: string;
  category?: string;
  description?: string;
  children?: MenuEntry[];
};

type MenuSection = { label: string; entries: MenuEntry[] };

function isMenuEntry(value: unknown): value is MenuEntry {
  return (
    typeof value === "object" &&
    value !== null &&
    "label" in value &&
    typeof value.label === "string" &&
    "href" in value &&
    typeof value.href === "string" &&
    (!("category" in value) || typeof value.category === "string") &&
    (!("description" in value) || typeof value.description === "string") &&
    (!("children" in value) ||
      (Array.isArray(value.children) && value.children.every(isMenuEntry)))
  );
}

const shopLink = "/#shop";
const storyLink = "/about";
const defaultMenuSections: MenuSection[] = [
  {
    label: "Women",
    entries: [
      { label: "All Women's Wear", href: shopLink, category: "All pieces" },
      {
        label: "Tops",
        children: [
          { label: "Linen Button-downs", href: shopLink, category: "Tops" },
          { label: "Organic Cotton Tees", href: shopLink, category: "Tops" },
          { label: "Blouses", href: shopLink, category: "Tops" },
        ],
      },
      {
        label: "Dresses & Jumpsuits",
        children: [
          { label: "Shift Dresses", href: shopLink, category: "Dresses" },
          { label: "Wrap Dresses", href: shopLink, category: "Dresses" },
          { label: "Linen Jumpsuits", href: shopLink, category: "Dresses" },
        ],
      },
      {
        label: "Bottoms",
        children: [
          { label: "High-waisted Wide-leg Pants", href: shopLink, category: "Bottoms" },
          { label: "Culottes", href: shopLink, category: "Bottoms" },
          { label: "Linen Skirts", href: shopLink, category: "Bottoms" },
        ],
      },
      { label: "Loungewear & Basics", href: shopLink, category: "All pieces" },
      { label: "Shop by Style · Wabi-Sabi / Capsule Wardrobe", href: storyLink },
    ],
  },
  {
    label: "Men",
    entries: [
      { label: "All Men's Wear", href: shopLink, category: "All pieces" },
      {
        label: "Tops",
        children: [
          { label: "Grandad Collar Shirts", href: shopLink, category: "Tops" },
          { label: "Boxy Organic Tees", href: shopLink, category: "Tops" },
          { label: "Relaxed Linen Shirts", href: shopLink, category: "Tops" },
        ],
      },
      {
        label: "Bottoms",
        children: [
          { label: "Straight-leg Linen Trousers", href: shopLink, category: "Bottoms" },
          { label: "Casual Shorts", href: shopLink, category: "Bottoms" },
        ],
      },
    ],
  },
  {
    label: "Collections",
    entries: [
      { label: "Wabi-Sabi Spirit", href: storyLink, description: "Relaxed silhouettes, earthy tones, and natural textures." },
      { label: "The Capsule Wardrobe", href: storyLink, description: "Essential pieces made to mix and match." },
      { label: "Botanical & Line-Art", href: shopLink, category: "All pieces", description: "Quiet details inspired by nature." },
      { label: "Eco Essentials", href: shopLink, category: "All pieces", description: "Everyday organic lounge and basics." },
    ],
  },
  {
    label: "Sustainability",
    entries: [
      { label: "Our Materials", href: storyLink },
      { label: "Ethical Production", href: storyLink },
      { label: "Garment Care Guide", href: storyLink },
    ],
  },
];

export function SiteHeader() {
  const {
    cartCount,
    query,
    searchOpen,
    setActiveCategory,
    setCartOpen,
    setQuery,
    setSearchOpen,
  } = useStorefront();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuSections, setMenuSections] = useState(defaultMenuSections);
  const [menuError, setMenuError] = useState("");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMenu() {
      try {
        const response = await fetch("/api/navigation-menu", { cache: "no-store" });
        const result: unknown = await response.json();

        if (
          !response.ok ||
          typeof result !== "object" ||
          result === null ||
          !("menu" in result) ||
          !Array.isArray(result.menu) ||
          !result.menu.every(isMenuEntry)
        ) {
          const errorMessage =
            typeof result === "object" &&
            result !== null &&
            "error" in result &&
            typeof result.error === "string"
              ? result.error
              : "Could not load the shop menu.";
          throw new Error(errorMessage);
        }

        if (cancelled) return;

        if (result.menu.length > 0) {
          setMenuSections(
            result.menu.map((section) => ({
              label: section.label,
              entries: section.children ?? [],
            })),
          );
        }
        setMenuError("");
      } catch (error) {
        if (!cancelled) {
          setMenuError(error instanceof Error ? error.message : "Could not load the shop menu.");
        }
      }
    }

    void fetchMenu();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveMenu(null);
        setMobileMenuOpen(false);
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setActiveMenu(null);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchOpen(false);
    setActiveMenu(null);
    setMobileMenuOpen(false);
    router.push("/#shop");
  }

  function selectMenuEntry(entry: MenuEntry) {
    if (entry.href?.startsWith("/#shop")) {
      setActiveCategory(entry.category ?? "All pieces");
      setQuery("");
    }
    setActiveMenu(null);
    setMobileMenuOpen(false);
  }

  function renderEntries(entries: MenuEntry[]) {
    return (
      <ul className="menu-tree">
        {entries.map((entry) => (
          <li key={entry.label}>
            {entry.children && entry.children.length > 0 ? (
              <details className="menu-tree-branch">
                <summary>{entry.label}</summary>
                {renderEntries(entry.children)}
              </details>
            ) : (
              <Link href={entry.href ?? shopLink} onClick={() => selectMenuEntry(entry)}>
                <span>{entry.label}</span>
                {entry.description && <small>{entry.description}</small>}
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <div className="announcement">
        A little something for your first order — take 10% off with <strong>HELLO10</strong>
        <span className="announcement-sparkle" aria-hidden="true">✳</span>
      </div>
      <header className="site-header" ref={headerRef}>
        <Link className="wordmark" href="/" aria-label="Sunday Studio home">sunday<span>.</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          {menuSections.map((section) => (
            <button
              className="menu-trigger"
              type="button"
              key={section.label}
              aria-expanded={activeMenu === section.label}
              onClick={() => setActiveMenu((current) => current === section.label ? null : section.label)}
            >
              {section.label}<span aria-hidden="true">⌄</span>
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="store-menu"
            onClick={() => {
              setMobileMenuOpen((open) => !open);
              setActiveMenu(null);
            }}
          >
            <span aria-hidden="true">{mobileMenuOpen ? "×" : "☰"}</span>
            <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
          </button>
          <button
            className={`icon-button search-toggle${searchOpen ? " active" : ""}`}
            type="button"
            aria-label={searchOpen ? "Close search" : "Search products"}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
          >
            <SearchIcon />
          </button>
          <button
            className="bag-button"
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Open shopping bag${cartCount ? `, ${cartCount} items` : ""}`}
          >
            <BagIcon />
            <span>Bag</span>
            <span className="bag-count">{cartCount}</span>
          </button>
        </div>
        {(activeMenu || mobileMenuOpen) && (
          <nav className={`menu-panel${mobileMenuOpen ? " mobile-open" : ""}`} id="store-menu" aria-label="Shop and information">
            {menuError && <p className="menu-load-error" role="alert">{menuError} Showing the default menu.</p>}
            {menuSections
              .filter((section) => mobileMenuOpen || section.label === activeMenu)
              .map((section) => (
                <section className="menu-section" key={section.label}>
                  {mobileMenuOpen ? (
                    <details>
                      <summary>{section.label}</summary>
                      {renderEntries(section.entries)}
                    </details>
                  ) : (
                    <>
                      <h2>{section.label}</h2>
                      {renderEntries(section.entries)}
                    </>
                  )}
                </section>
              ))}
          </nav>
        )}
      </header>
      {searchOpen && (
        <form className="search-bar" role="search" onSubmit={submitSearch}>
          <SearchIcon />
          <input
            autoFocus
            aria-label="Search the collection"
            placeholder="What are you looking for?"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveCategory("All pieces");
            }}
          />
          {query && (
            <button type="button" onClick={() => setQuery("")}>Clear</button>
          )}
          <button className="search-submit" type="submit">Search</button>
        </form>
      )}
    </>
  );
}

function CartDrawer() {
  const {
    cart,
    cartCount,
    cartOpen,
    changeQuantity,
    checkoutMessage,
    products,
    setCartOpen,
    setCheckoutMessage,
  } = useStorefront();
  const cartItems = products.filter((product) => cart[product.id]);
  const subtotal = cartItems.reduce(
    (total, product) => total + product.price * cart[product.id],
    0,
  );

  if (!cartOpen) return null;

  return (
    <div className="cart-overlay" onClick={() => setCartOpen(false)}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cart-heading">
          <div>
            <span className="eyebrow"><span className="eyebrow-line" />The good stuff</span>
            <h2 id="cart-title">Your bag <span>({cartCount})</span></h2>
          </div>
          <button className="close-button" type="button" onClick={() => setCartOpen(false)} aria-label="Close shopping bag">×</button>
        </div>
        {cartItems.length ? (
          <>
            <div className="cart-items">
              {cartItems.map((product) => (
                <div className="cart-item" key={product.id}>
                  <div
                    className={`cart-item-image product-image-${product.id}`}
                    style={{ backgroundImage: `url("${product.image}")` }}
                    role="img"
                    aria-label={product.name}
                  />
                  <div className="cart-item-info">
                    <h3>{product.name}</h3>
                    <p>{product.color}</p>
                    <div className="quantity-control" aria-label={`Quantity of ${product.name}`}>
                      <button type="button" aria-label={`Remove one ${product.name}`} onClick={() => changeQuantity(product.id, -1)}>−</button>
                      <span>{cart[product.id]}</span>
                      <button type="button" aria-label={`Add one ${product.name}`} onClick={() => changeQuantity(product.id, 1)}>+</button>
                    </div>
                  </div>
                  <span className="cart-item-price">${product.price * cart[product.id]}</span>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
              <p>Shipping and any discounts are calculated at checkout.</p>
              <button type="button" className="checkout-button" onClick={() => setCheckoutMessage("Online checkout is coming soon. Thanks for being here!")}>
                Continue to checkout <span aria-hidden="true">↗</span>
              </button>
              {checkoutMessage && <p className="checkout-message" role="status">{checkoutMessage}</p>}
              <button type="button" className="continue-shopping" onClick={() => setCartOpen(false)}>Keep looking around</button>
            </div>
          </>
        ) : (
          <div className="cart-empty">
            <span aria-hidden="true">✳</span>
            <h3>Nothing in here (yet).</h3>
            <p>Find a few good things to make your everyday a little better.</p>
            <button type="button" className="checkout-button" onClick={() => setCartOpen(false)}>Explore the collection <span aria-hidden="true">↗</span></button>
          </div>
        )}
      </aside>
    </div>
  );
}

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All pieces");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);

  const reloadProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError("");

    try {
      setProducts(await requestProducts());
    } catch (error) {
      setProductsError(getProductsError(error));
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    void requestProducts()
      .then((result) => {
        if (active) {
          setProducts(result);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setProductsError(getProductsError(error));
        }
      })
      .finally(() => {
        if (active) {
          setProductsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const addToCart = useCallback((productId: string) => {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
    setCheckoutMessage("");
  }, []);

  const changeQuantity = useCallback((productId: string, amount: number) => {
    setCart((current) => {
      const nextQuantity = (current[productId] ?? 0) + amount;
      const nextCart = { ...current };

      if (nextQuantity <= 0) {
        delete nextCart[productId];
      } else {
        nextCart[productId] = nextQuantity;
      }

      return nextCart;
    });
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }, []);

  const value = useMemo(
    () => ({
      activeCategory,
      setActiveCategory,
      query,
      setQuery,
      searchOpen,
      setSearchOpen,
      products,
      productsLoading,
      productsError,
      reloadProducts,
      favorites,
      cart,
      cartCount,
      cartOpen,
      setCartOpen,
      checkoutMessage,
      setCheckoutMessage,
      addToCart,
      changeQuantity,
      toggleFavorite,
    }),
    [
      activeCategory,
      query,
      searchOpen,
      products,
      productsLoading,
      productsError,
      reloadProducts,
      favorites,
      cart,
      cartCount,
      cartOpen,
      checkoutMessage,
      addToCart,
      changeQuantity,
      toggleFavorite,
    ],
  );

  return (
    <StorefrontContext.Provider value={value}>
      <Suspense fallback={null}>
        <SiteHeader />
      </Suspense>
      {children}
      <CartDrawer />
    </StorefrontContext.Provider>
  );
}
