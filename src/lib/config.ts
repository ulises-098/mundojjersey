export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "MundoJersey",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5490000000000",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export function buildWhatsAppLink(productName: string) {
  const message = `Hola! Quiero consultar por la remera: ${productName}`;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
