// app/components/CurrencyCard.js
"use client";
import { useState, useEffect } from "react";
import { ArrowRightLeft, RefreshCw, AlertCircle } from "lucide-react";

export default function CurrencyCard({ onCurrencyChange }) {
  const [rates, setRates] = useState({});
  const [base, setBase] = useState("USD");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);
      try {
        // Veri çekme simülasyonu için hafif gecikme
        await new Promise(r => setTimeout(r, 500));
        
        const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
        if (!response.ok) throw new Error("Sunucudan veri alınamadı.");
        const data = await response.json();
        setRates(data.rates);
        // Seçilen para birimini üst bileşene bildir
        onCurrencyChange(base);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [base, onCurrencyChange]);

  return (
    // main-container sınıfı ve themeClass kaldırıldı, kontrol üst bileşene geçti
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
          <option value="JPY">🇯🇵 Japon Yeni (JPY)</option>
          <option value="AUD">🇦🇺 Avustralya Doları (AUD)</option>
          <option value="CAD">🇨🇦 Kanada Doları (CAD)</option>
          <option value="CHF">🇨🇭 İsviçre Frangı (CHF)</option>
          <option value="CNY">🇨🇳 Çin Yuanı (CNY)</option>
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
            <div className="rate-item">
              <span className="currency-label">🇯🇵 JPY</span>
              <span className="currency-value">{rates.JPY?.toFixed(2)} ¥</span>
            </div>
            <div className="rate-item">
              <span className="currency-label">🇦🇺 AUD</span>
              <span className="currency-value">{rates.AUD?.toFixed(4)} $</span>
            </div>
            <div className="rate-item">
              <span className="currency-label">🇨🇦 CAD</span>
              <span className="currency-value">{rates.CAD?.toFixed(4)} $</span>
            </div>
            <div className="rate-item">
              <span className="currency-label">🇨🇭 CHF</span>
              <span className="currency-value">{rates.CHF?.toFixed(4)} Fr</span>
            </div>
            <div className="rate-item">
              <span className="currency-label">🇨🇳 CNY</span>
              <span className="currency-value">{rates.CNY?.toFixed(4)} ¥</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
