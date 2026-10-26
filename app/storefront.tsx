"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { products } from "./products";

type StorefrontContextValue = {
  activeCategory: string;
  setActiveCategory: Dispatch<SetStateAction<string>>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  searchOpen: boolean;
  setSearchOpen: Dispatch<SetStateAction<boolean>>;
  favorites: number[];
  cart: Record<number, number>;
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: Dispatch<SetStateAction<boolean>>;
  checkoutMessage: string;
  setCheckoutMessage: Dispatch<SetStateAction<string>>;
  addToCart: (productId: number) => void;
  changeQuantity: (productId: number, amount: number) => void;
  toggleFavorite: (productId: number) => void;
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

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

export function SiteHeader() {
  const {
    activeCategory,
    cartCount,
    query,
    searchOpen,
    setActiveCategory,
    setCartOpen,
    setQuery,
    setSearchOpen,
  } = useStorefront();
  const pathname = usePathname();
  const router = useRouter();

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchOpen(false);
    router.push("/#shop");
  }

  return (
    <>
      <div className="announcement">
        A little something for your first order — take 10% off with <strong>HELLO10</strong>
        <span className="announcement-sparkle" aria-hidden="true">✳</span>
      </div>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Sunday Studio home">sunday<span>.</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/#shop" onClick={() => setActiveCategory("All pieces")}>Shop all</Link>
          <Link
            href="/#shop"
            onClick={() => setActiveCategory("Tops")}
            aria-current={pathname === "/" && activeCategory === "Tops" ? "page" : undefined}
          >
            Clothing
          </Link>
          <Link href="/about" aria-current={pathname === "/about" ? "page" : undefined}>Our story</Link>
        </nav>
        <div className="header-actions">
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
  const [activeCategory, setActiveCategory] = useState("All pieces");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);

  const addToCart = useCallback((productId: number) => {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
    setCheckoutMessage("");
  }, []);

  const changeQuantity = useCallback((productId: number, amount: number) => {
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

  const toggleFavorite = useCallback((productId: number) => {
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
      <SiteHeader />
      {children}
      <CartDrawer />
    </StorefrontContext.Provider>
  );
}
