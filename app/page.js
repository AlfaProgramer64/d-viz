"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [rates, setRates] = useState({});
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // ExchangeRate-API (Ücretsiz ve hızlıdır)
        const res = await fetch(`https://open.er-api.com/v6/latest/${currency}`);
        if (!res.ok) throw new Error("Veri çekilirken bir hata oluştu!");
        const data = await res.json();
        setRates(data.rates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currency]);

  return (
    <main className={`main-wrapper bg-${currency}`}>
      <div className="content">
        <label>İncelemek istediğiniz para birimini seçin:</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">Dolar (USD)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="TRY">Türk Lirası (TRY)</option>
        </select>

        {loading && <p>Veriler yükleniyor (Loading...)</p>}
        {error && <p className="error">Hata: {error}</p>}

        {!loading && !error && (
          <div className="card">
            <h2>1 {currency} karşılığı:</h2>
            <hr />
            <ul>
              <li><strong>TRY:</strong> {rates.TRY?.toFixed(2)} ₺</li>
              <li><strong>EUR:</strong> {rates.EUR?.toFixed(4)} €</li>
              <li><strong>USD:</strong> {rates.USD?.toFixed(4)} $</li>
              <li><strong>GBP:</strong> {rates.GBP?.toFixed(4)} £</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
