import { connection, NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export async function GET() {
  await connection();

  try {
    return NextResponse.json({ products: await getProducts() });
  } catch (error) {
    console.error("Failed to load storefront products from MongoDB:", error);
    const missingUri =
      error instanceof Error &&
      error.message === "Missing MONGODB_URI environment variable";

    return NextResponse.json(
      {
        error: missingUri
          ? "MongoDB is not configured. Set MONGODB_URI in shop/.env.local and restart the app."
          : "Could not load products from MongoDB. Check your connection settings and try again.",
      },
      { status: missingUri ? 503 : 500 },
    );
  }
}
