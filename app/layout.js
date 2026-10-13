import "./globals.css";

export const metadata = {
  title: "Shaxsiy portfolio",
  description: "Mening shaxsiy portfolio saytim",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
