import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

export const COLLECTIONS = ["projects", "skills", "experience", "education"];

const DEFAULT_DB = {
  profile: {
    name: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    telegram: "",
    avatar: "",
  },
  projects: [],
  skills: [],
  experience: [],
  education: [],
};

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2));
  }
}

export function readDb() {
  ensure();
  const raw = fs.readFileSync(DB_FILE, "utf8");
  const db = JSON.parse(raw);
  return { ...DEFAULT_DB, ...db, profile: { ...DEFAULT_DB.profile, ...db.profile } };
}

export function writeDb(db) {
  ensure();
  const tmp = DB_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

export function newId() {
  return crypto.randomUUID();
}

export function listItems(collection) {
  return readDb()[collection];
}

export function createItem(collection, data) {
  const db = readDb();
  const item = { ...data, id: newId(), createdAt: new Date().toISOString() };
  db[collection].push(item);
  writeDb(db);
  return item;
}

export function updateItem(collection, id, data) {
  const db = readDb();
  const idx = db[collection].findIndex((x) => x.id === id);
  if (idx === -1) return null;
  db[collection][idx] = { ...db[collection][idx], ...data, id };
  writeDb(db);
  return db[collection][idx];
}

export function deleteItem(collection, id) {
  const db = readDb();
  const before = db[collection].length;
  db[collection] = db[collection].filter((x) => x.id !== id);
  writeDb(db);
  return db[collection].length < before;
}

export function getProfile() {
  return readDb().profile;
}

export function updateProfile(data) {
  const db = readDb();
  db.profile = { ...db.profile, ...data };
  writeDb(db);
  return db.profile;
}
