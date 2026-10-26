export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  color: string;
  image: string;
  description: string;
  badge?: string;
};

export const products: Product[] = [
  {
    id: 1,
    slug: "everyday-tee",
    name: "The Everyday Tee",
    category: "Tops",
    price: 38,
    color: "Cloud white",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    description: "A relaxed everyday essential with an easy shape that goes with just about everything.",
    badge: "Bestseller",
  },
  {
    id: 2,
    slug: "sunday-knit",
    name: "Sunday Knit",
    category: "Knitwear",
    price: 98,
    color: "Oatmeal",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85",
    description: "A cozy, easygoing knit for cool mornings, slow weekends, and everything in between.",
  },
  {
    id: 3,
    slug: "relaxed-linen-shirt",
    name: "Relaxed Linen Shirt",
    category: "Tops",
    price: 84,
    color: "Soft blue",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85",
    description: "An unfussy shirt with a relaxed feel, ready for a tucked-in look or an easy open layer.",
    badge: "New",
  },
  {
    id: 4,
    slug: "weekend-trouser",
    name: "The Weekend Trouser",
    category: "Bottoms",
    price: 110,
    color: "Warm sand",
    image:
      "https://images.unsplash.com/photo-1506629905607-d9c297d78f23?auto=format&fit=crop&w=900&q=85",
    description: "An easy-to-style trouser made for comfortable plans and the days that turn into them.",
  },
  {
    id: 5,
    slug: "sunday-cotton-dress",
    name: "Sunday Cotton Dress",
    category: "Dresses",
    price: 128,
    color: "Natural",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=85",
    description: "A simple, versatile dress for days when you want getting dressed to feel effortless.",
  },
  {
    id: 6,
    slug: "everywhere-jacket",
    name: "Everywhere Jacket",
    category: "Outerwear",
    price: 168,
    color: "Olive",
    image:
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=85",
    description: "An everyday layer with a relaxed feel, ready to come along when the weather changes.",
    badge: "Almost gone",
  },
  {
    id: 7,
    slug: "easy-rib-tank",
    name: "Easy Rib Tank",
    category: "Tops",
    price: 42,
    color: "Butter",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=85",
    description: "A simple layering piece that works on its own or underneath your favorite shirt.",
  },
  {
    id: 8,
    slug: "soft-structure-blazer",
    name: "Soft Structure Blazer",
    category: "Outerwear",
    price: 188,
    color: "Stone",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85",
    description: "A relaxed finishing layer that brings a little polish to your everyday outfit.",
  },
];

export const categories = ["All pieces", "Tops", "Bottoms", "Knitwear", "Dresses", "Outerwear"];
