export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="glass-panel footer">
      <p>© {year} Web Tabanlı Programlama Final Ödevi Projesi.</p>
      <p className="developer-info">Rohat Taş</p>
    </footer>
  );
}
