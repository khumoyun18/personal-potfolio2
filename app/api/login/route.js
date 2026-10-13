import { NextResponse } from "next/server";
import { checkPassword, createToken, COOKIE_NAME, cookieOptions } from "@/lib/auth";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Parol noto'g'ri" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, createToken(), cookieOptions);
  return res;
}
