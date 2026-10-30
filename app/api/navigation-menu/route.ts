import { connection, NextResponse } from "next/server";
import { getDatabaseName, getMongoClient } from "@/lib/mongodb";

type MenuDocument = {
  _id: string;
  kind: "menu";
  name?: string;
  label: string;
  parentId: string | null;
  position: number;
  href: string;
  category?: string;
  description?: string;
};

type MenuNode = Omit<MenuDocument, "_id" | "kind"> & {
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
    const database = client.db(getDatabaseName());
    const categories = database.collection<MenuDocument>("categories");

    const legacy = database.collection<MenuDocument>("navigation_menu");
    const legacyNodes = await legacy.find().toArray();
    const existingMenuNodes = await categories.find({ kind: "menu" }).toArray();
    const missingNames = existingMenuNodes.filter((node) => !node.name);
    if (missingNames.length > 0) {
      await categories.bulkWrite(
        missingNames.map((node) => ({
          updateOne: {
            filter: { _id: node._id },
            update: { $set: { name: node._id } },
          },
        })),
      );
    }
    const nodesToClean = [...legacyNodes, ...existingMenuNodes];
    const excludedIds = new Set(
      nodesToClean
        .filter(
          (node) =>
            node._id === "journal-support" ||
            node.label.toLocaleLowerCase() === "journal & support",
        )
        .map((node) => node._id),
    );
    let parents = [...excludedIds];

    while (parents.length > 0) {
      const children = nodesToClean
        .filter((node) => node.parentId !== null && parents.includes(node.parentId))
        .map((node) => node._id)
        .filter((id) => !excludedIds.has(id));

      for (const id of children) excludedIds.add(id);
      parents = children;
    }

    if (excludedIds.size > 0) {
      await categories.deleteMany({ _id: { $in: [...excludedIds] }, kind: "menu" });
    }

    const nodes = legacyNodes.filter((node) => !excludedIds.has(node._id));
    if (nodes.length > 0) {
      await categories.bulkWrite(
        nodes.map((node) => ({
          updateOne: {
            filter: { _id: node._id },
            update: { $setOnInsert: { ...node, name: node._id, kind: "menu" as const } },
            upsert: true,
          },
        })),
      );
    }

    const documents = await categories
      .find({ kind: "menu" })
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
