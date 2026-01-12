import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "Modern Döviz Takip",
  description: "React Final Ödevi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <div className="app-wrapper">
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
