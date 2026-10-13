import { NextResponse } from "next/server";
import { COLLECTIONS, listItems, createItem } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { sanitize } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const { collection } = params;
  if (!COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }
  return NextResponse.json(listItems(collection));
}

export async function POST(req, { params }) {
  const { collection } = params;
  if (!COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }
  if (!isAdmin()) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { data, error } = sanitize(collection, body);
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json(createItem(collection, data), { status: 201 });
}
