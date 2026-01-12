export default function Footer() {
    // Dinamik yıl bilgisi
    const year = new Date().getFullYear();
  return (
    <footer className="glass-panel footer">
      <p>© {year} Final Ödevi Projesi. Tüm hakları saklıdır.</p>
    </footer>
  );
}
