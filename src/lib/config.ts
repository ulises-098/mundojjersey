export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Mundo JJersey",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5490000000000",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const googleDriveConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
  appId: process.env.NEXT_PUBLIC_GOOGLE_APP_ID || "",
};

export const isGoogleDriveEnabled = Boolean(
  googleDriveConfig.clientId && googleDriveConfig.apiKey && googleDriveConfig.appId,
);

export function buildWhatsAppLink(productName: string) {
  const message = `Hola! Quiero consultar por la remera: ${productName}`;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
