import crypto from "crypto";
import { cookies } from "next/headers";

export const COOKIE_NAME = "admin_token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 kun

function secret() {
  return process.env.AUTH_SECRET || "dev-secret-change-me";
}

function sign(payload) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createToken() {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = String(exp);
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token) {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  return Number(payload) > Date.now();
}

export function checkPassword(input) {
  const real = process.env.ADMIN_PASSWORD || "admin12345";
  const a = Buffer.from(String(input || ""));
  const b = Buffer.from(real);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function isAdmin() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifyToken(token);
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};
