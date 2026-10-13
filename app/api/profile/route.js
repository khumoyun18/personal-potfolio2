import { NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const FIELDS = [
  "name",
  "title",
  "bio",
  "email",
  "phone",
  "location",
  "github",
  "linkedin",
  "telegram",
  "avatar",
];

export async function GET() {
  return NextResponse.json(getProfile());
}

export async function PUT(req) {
  if (!isAdmin()) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const data = {};
  for (const f of FIELDS) {
    if (typeof body[f] === "string") data[f] = body[f].trim();
  }
  return NextResponse.json(updateProfile(data));
}
