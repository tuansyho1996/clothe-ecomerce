import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDatabaseName, getMongoClient } from "@/lib/mongodb";

type MediaDocument = {
  contentType: string;
  data: Buffer;
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  try {
    const client = await getMongoClient();
    const media = await client
      .db(getDatabaseName())
      .collection<MediaDocument>("media")
      .findOne({ _id: new ObjectId(id) });

    if (!media) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(media.data), {
      headers: {
        "Content-Type": media.contentType,
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Failed to load storefront image from MongoDB:", error);
    return NextResponse.json({ error: "Could not load this image." }, { status: 500 });
  }
}
