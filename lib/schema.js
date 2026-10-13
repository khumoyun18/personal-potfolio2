// Har bir bo'lim uchun maydonlar. Admin panel ham, API ham shu yerdan foydalanadi.
export const SCHEMA = {
  projects: {
    label: "Loyihalar",
    singular: "Loyiha",
    titleField: "title",
    fields: [
      { name: "title", label: "Nomi", type: "text", required: true },
      { name: "description", label: "Tavsif", type: "textarea" },
      { name: "tech", label: "Texnologiyalar (vergul bilan)", type: "text" },
      { name: "image", label: "Rasm URL", type: "text" },
      { name: "demo", label: "Demo havola", type: "text" },
      { name: "repo", label: "GitHub havola", type: "text" },
    ],
  },
  skills: {
    label: "Ko'nikmalar",
    singular: "Ko'nikma",
    titleField: "name",
    fields: [
      { name: "name", label: "Nomi", type: "text", required: true },
      { name: "level", label: "Daraja (0-100)", type: "number" },
      { name: "category", label: "Kategoriya (Frontend, Backend...)", type: "text" },
    ],
  },
  experience: {
    label: "Tajriba",
    singular: "Tajriba",
    titleField: "role",
    fields: [
      { name: "role", label: "Lavozim", type: "text", required: true },
      { name: "company", label: "Kompaniya", type: "text" },
      { name: "from", label: "Boshlangan (masalan 2022-01)", type: "text" },
      { name: "to", label: "Tugagan (bo'sh = hozirgacha)", type: "text" },
      { name: "description", label: "Tavsif", type: "textarea" },
    ],
  },
  education: {
    label: "Ta'lim",
    singular: "Ta'lim",
    titleField: "school",
    fields: [
      { name: "school", label: "O'quv yurti", type: "text", required: true },
      { name: "degree", label: "Daraja / Yo'nalish", type: "text" },
      { name: "from", label: "Boshlangan yil", type: "text" },
      { name: "to", label: "Tugagan yil", type: "text" },
      { name: "description", label: "Qo'shimcha", type: "textarea" },
    ],
  },
};

export const PROFILE_FIELDS = [
  { name: "name", label: "Ism-familiya", type: "text" },
  { name: "title", label: "Kasbingiz (masalan Full-Stack Dasturchi)", type: "text" },
  { name: "bio", label: "O'zingiz haqingizda", type: "textarea" },
  { name: "avatar", label: "Rasm URL", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Telefon", type: "text" },
  { name: "location", label: "Manzil", type: "text" },
  { name: "github", label: "GitHub havola", type: "text" },
  { name: "linkedin", label: "LinkedIn havola", type: "text" },
  { name: "telegram", label: "Telegram havola", type: "text" },
];

// Kelgan ma'lumotni tozalaydi va tekshiradi
export function sanitize(collection, body) {
  const schema = SCHEMA[collection];
  if (!schema) return { error: "Noma'lum bo'lim" };
  const data = {};
  for (const f of schema.fields) {
    let v = body?.[f.name];
    if (f.type === "number") {
      v = v === "" || v == null ? 0 : Number(v);
      if (Number.isNaN(v)) v = 0;
      v = Math.max(0, Math.min(100, v));
    } else {
      v = typeof v === "string" ? v.trim() : "";
    }
    if (f.required && !v && v !== 0) {
      return { error: `"${f.label}" majburiy` };
    }
    data[f.name] = v;
  }
  return { data };
}
