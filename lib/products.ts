import type { ObjectId } from "mongodb";
import type { Product } from "@/app/products";
import { getDatabaseName, getMongoClient } from "@/lib/mongodb";

type ProductDocument = {
  _id: ObjectId;
  name: string;
  category: string;
  price: number;
  color?: string;
  image?: string;
};

function createSlug(name: string, id: string) {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${nameSlug || "product"}-${id.slice(-6)}`;
}

function getStorefrontImage(image: string | undefined) {
  if (!image) {
    return "";
  }

  if (/^\/api\/media\/[a-f\d]{24}$/i.test(image)) {
    return image;
  }

  try {
    const url = new URL(image);
    if (
      url.protocol === "https:" &&
      url.hostname === "res.cloudinary.com" &&
      /^\/[^/]+\/image\/upload\//.test(url.pathname)
    ) {
      return image;
    }
  } catch {
    return "";
  }

  return "";
}

export async function getProducts(): Promise<Product[]> {
  const client = await getMongoClient();
  const documents = await client
    .db(getDatabaseName())
    .collection<ProductDocument>("products")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  return documents.map((document) => {
    const id = document._id.toString();
    const color = document.color ?? "";

    return {
      id,
      slug: createSlug(document.name, id),
      name: document.name,
      category: document.category,
      price: document.price,
      color: color.startsWith("#") ? "Natural" : color || "Natural",
      image: getStorefrontImage(document.image),
      description: `A thoughtful ${document.category.toLowerCase()} made for everyday wear.`,
    };
  });
}
