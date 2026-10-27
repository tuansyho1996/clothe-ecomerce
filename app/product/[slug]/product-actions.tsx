"use client";

import { useState } from "react";
import { useStorefront } from "../../storefront";

const sizes = ["XS", "S", "M", "L", "XL"];

export default function ProductActions({ productId }: { productId: string }) {
  const { addToCart } = useStorefront();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  function handleAddToBag() {
    if (!selectedSize) {
      setMessage("Choose a size before adding this piece to your bag.");
      return;
    }

    addToCart(productId);
    setMessage(`Added to your bag in size ${selectedSize}.`);
  }

  return (
    <div className="product-purchase">
      <div className="product-size-heading">
        <span>Choose your size</span>
        <button type="button" onClick={() => setMessage("For the best fit, check the garment measurements before ordering.")}>
          Size guide
        </button>
      </div>
      <div className="product-size-options" role="group" aria-label="Select a size">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            className={selectedSize === size ? "product-size-option selected" : "product-size-option"}
            aria-pressed={selectedSize === size}
            onClick={() => {
              setSelectedSize(size);
              setMessage("");
            }}
          >
            {size}
          </button>
        ))}
      </div>
      <button className="product-add-button" type="button" onClick={handleAddToBag}>
        Add to bag <span aria-hidden="true">↗</span>
      </button>
      {message && <p className="product-action-message" role="status">{message}</p>}
      <p className="product-size-note">Sizes shown are a simple demo. Confirm availability and measurements before ordering.</p>
    </div>
  );
}
