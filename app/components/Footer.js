export default function Footer() {

    const year = new Date().getFullYear();
  return (
    <footer className="glass-panel footer">
      <p>© {year} Final Ödevi Projesi. Tüm hakları saklıdır.</p>
      <p className="developer-info">Yapan Kişi: Rohat Taş</p>
    </footer>
  );
}
