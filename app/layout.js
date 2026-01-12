import "./globals.css";

export const metadata = {
  title: "Döviz Takip Sistemi",
  description: "Anlık kur bilgilerini takip edin",
};

function Header() {
  return (
    <header className="header">
      <h1>💰 Kur Takip Sistemi</h1>
      <p>API kullanarak anlık döviz kurlarını listeleyin.</p>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2026 Final Ödevi - Tüm Hakları Saklıdır.</p>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
