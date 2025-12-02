// server/src/utils/slug.ts

// Basic slug generate karne ka helper
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // special chars hatao
    .replace(/[\s_]+/g, '-')    // spaces / underscore ko - banao
    .replace(/^-+|-+$/g, '');   // start/end ke extra - hatao
};

// Same slug already exist karta hai ya nahi, ye check karke
// unique slug banata hai (project, blog etc. ke liye)
export const ensureUniqueSlug = async (
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> => {
  let slug = baseSlug;
  let counter = 2;

  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

// 🔁 Backward-compatible alias:
// jahan jahan { slugify } import ho raha hai, wahan ke liye
export const slugify = (text: string): string => generateSlug(text);

// Optional default export (agar kahin default import use ho raha ho)
export default generateSlug;
