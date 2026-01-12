"use client";
import { useState, useEffect } from "react";
import { ArrowRightLeft, RefreshCw, AlertCircle } from "lucide-react";

export default function CurrencyCard() {
  const [rates, setRates] = useState({});
  const [base, setBase] = useState("USD");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(r => setTimeout(r, 500));
        
        const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
        if (!response.ok) throw new Error("Sunucudan veri alınamadı.");
        const data = await response.json();
        setRates(data.rates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [base]);

  const themeClass = `theme-${base}`;

  return (
    <div className={`main-container ${themeClass}`}>
      <div className="glass-panel content-card">
        <div className="card-header">
          <h2> <ArrowRightLeft size={24} /> Döviz Çevirici</h2>
        </div>

        <div className="control-group">
          <label htmlFor="currency-select">Baz Para Birimi:</label>
          <select 
            id="currency-select"
            value={base} 
            onChange={(e) => setBase(e.target.value)}
            className="modern-select"
          >
            <option value="USD">🇺🇸 Amerikan Doları (USD)</option>
            <option value="EUR">🇪🇺 Euro (EUR)</option>
            <option value="TRY">🇹🇷 Türk Lirası (TRY)</option>
            <option value="GBP">🇬🇧 İngiliz Sterlini (GBP)</option>
          </select>
        </div>

        <div className="results-area">
          {loading && (
            <div className="state-message loading">
              <RefreshCw className="spin" size={30} />
              <p>Güncel kurlar yükleniyor...</p>
            </div>
          )}
          
          {error && (
            <div className="state-message error">
              <AlertCircle size={30} />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="rates-grid">
               <div className="rate-item highlight">
                <span className="currency-label">🇹🇷 TRY</span>
                <span className="currency-value">{rates.TRY?.toFixed(2)} ₺</span>
              </div>
              <div className="rate-item">
                <span className="currency-label">🇪🇺 EUR</span>
                <span className="currency-value">{rates.EUR?.toFixed(4)} €</span>
              </div>
              <div className="rate-item">
                <span className="currency-label">🇺🇸 USD</span>
                <span className="currency-value">{rates.USD?.toFixed(4)} $</span>
              </div>
               <div className="rate-item">
                <span className="currency-label">🇬🇧 GBP</span>
                <span className="currency-value">{rates.GBP?.toFixed(4)} £</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
