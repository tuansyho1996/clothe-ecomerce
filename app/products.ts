export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  color: string;
  image: string;
  description: string;
};

export const categories = ["All pieces", "Tops", "Bottoms", "Knitwear", "Dresses", "Outerwear"];
