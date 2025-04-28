// components/seo/DynamicMetadata.js
"use server";

/**
 * Komponen untuk menggenerate metadata dinamis
 * @param {Object} props - Props komponen
 * @param {string} props.title - Judul halaman
 * @param {string} [props.description] - Deskripsi halaman (opsional)
 * @param {string} [props.keywords] - Keywords SEO (opsional)
 * @param {string} [props.image] - URL gambar untuk OpenGraph (opsional)
 * @returns {Object} Metadata object untuk Next.js
 */
export async function generateDynamicMetadata({
  title,
  description,
  keywords,
  image,
}) {
  const baseTitle = "SOC Playbooks";
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;

  return {
    title: fullTitle,
    description: description || "Security Operation Center Tools and Playbooks",
    keywords: keywords || "security, soc, playbooks, scanner, tools",
    openGraph: {
      title: fullTitle,
      description:
        description || "Security Operation Center Tools and Playbooks",
      images: image ? [{ url: image }] : [],
      siteName: baseTitle,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description:
        description || "Security Operation Center Tools and Playbooks",
      images: image ? [{ url: image }] : [],
    },
  };
}
