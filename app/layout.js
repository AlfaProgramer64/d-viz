
import "./globals.css";

export const metadata = {
  title: "Modern Döviz Takip",
  description: "React Final Ödevi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        {children}
      </body>
    </html>
  );
}
