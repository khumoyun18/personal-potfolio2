import { NextResponse } from "next/server";
import { COLLECTIONS, updateItem, deleteItem } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { sanitize } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  const { collection, id } = params;
  if (!COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }
  if (!isAdmin()) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { data, error } = sanitize(collection, body);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const item = updateItem(collection, id, data);
  if (!item) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_req, { params }) {
  const { collection, id } = params;
  if (!COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }
  if (!isAdmin()) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const ok = deleteItem(collection, id);
  if (!ok) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
