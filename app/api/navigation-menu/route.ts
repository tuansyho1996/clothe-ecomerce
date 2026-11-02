import { connection, NextResponse } from "next/server";
import { getNavigationMenu } from "@/lib/navigation-menu";

export async function GET() {
  await connection();

  try {
    return NextResponse.json({ menu: await getNavigationMenu() });
  } catch (error) {
    console.error("Failed to load the storefront navigation menu from MongoDB:", error);
    const missingUri =
      error instanceof Error &&
      error.message === "Missing MONGODB_URI environment variable";

    return NextResponse.json(
      {
        error: missingUri
          ? "MongoDB is not configured. Set MONGODB_URI in shop/.env.local and restart the app."
          : "Could not load the shop menu from MongoDB. Check your connection settings and try again.",
      },
      { status: missingUri ? 503 : 500 },
    );
  }
}
