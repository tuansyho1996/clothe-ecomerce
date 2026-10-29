import { connection, NextResponse } from "next/server";
import { getDatabaseName, getMongoClient } from "@/lib/mongodb";

type MenuDocument = {
  _id: string;
  label: string;
  parentId: string | null;
  position: number;
  href: string;
  category?: string;
  description?: string;
};

type MenuNode = Omit<MenuDocument, "_id"> & {
  id: string;
  children: MenuNode[];
};

function buildMenuTree(documents: MenuDocument[]) {
  const nodes = new Map<string, MenuNode>();

  for (const document of documents) {
    nodes.set(document._id, {
      id: document._id,
      label: document.label,
      parentId: document.parentId,
      position: document.position,
      href: document.href,
      ...(document.category ? { category: document.category } : {}),
      ...(document.description ? { description: document.description } : {}),
      children: [],
    });
  }

  const roots: MenuNode[] = [];

  for (const node of nodes.values()) {
    if (node.parentId === null) {
      roots.push(node);
    } else {
      nodes.get(node.parentId)?.children.push(node);
    }
  }

  return roots;
}

export async function GET() {
  await connection();

  try {
    const client = await getMongoClient();
    const documents = await client
      .db(getDatabaseName())
      .collection<MenuDocument>("navigation_menu")
      .find()
      .sort({ position: 1, label: 1 })
      .toArray();

    return NextResponse.json({ menu: buildMenuTree(documents) });
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
