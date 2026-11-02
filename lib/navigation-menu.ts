import { getDatabaseName, getMongoClient } from "@/lib/mongodb";

type MenuDocument = {
  _id: string;
  kind: "menu";
  label: string;
  parentId: string | null;
  position: number;
  href: string;
  category?: string;
  description?: string;
};

export type MenuNode = Omit<MenuDocument, "_id" | "kind"> & {
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

export async function getNavigationMenu() {
  const client = await getMongoClient();
  const categories = client
    .db(getDatabaseName())
    .collection<MenuDocument>("categories");
  const documents = await categories
    .find({ kind: "menu" })
    .sort({ position: 1, label: 1 })
    .toArray();

  return buildMenuTree(documents);
}
