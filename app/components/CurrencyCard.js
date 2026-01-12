"use client";
import { useState, useEffect } from "react";
import { ArrowRightLeft, RefreshCw, AlertCircle, Wallet } from "lucide-react";

export default function CurrencyCard({ onCurrencyChange }) {
  const [rates, setRates] = useState({});
  const [base, setBase] = useState("USD");
  const [amount, setAmount] = useState(1); // Varsayılan miktar 1
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(r => setTimeout(r, 300)); // Hafif gecikme
        
        // API her zaman 1 birim için değer döner
        const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
        if (!response.ok) throw new Error("Sunucudan veri alınamadı.");
        const data = await response.json();
        setRates(data.rates);
        
        // Üst bileşene (Home) tema rengini değiştirmesi için haber ver
        onCurrencyChange(base);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [base, onCurrencyChange]);

  // Hesaplama Fonksiyonu: API'den gelen kur * Girilen Miktar
  const calculateRate = (rate) => {
    if (!rate) return "---";
    return (rate * amount).toLocaleString('tr-TR', { maximumFractionDigits: 4 });
  };

  return (
    <div className="glass-panel content-card">
      <div className="card-header">
        <h2> <ArrowRightLeft size={24} /> Döviz Çevirici</h2>
      </div>

      {/* Giriş Alanları (Yan yana durması için flex yapısı kullanacağız) */}
      <div className="input-row">
        
        {/* Miktar Girişi */}
        <div className="control-group flex-item">
          <label htmlFor="amount-input">Miktar:</label>
          <div className="input-wrapper">
             <Wallet size={18} className="input-icon" />
             <input
              id="amount-input"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="modern-input"
              placeholder="Miktar girin"
            />
          </div>
        </div>

        {/* Para Birimi Seçimi */}
        <div className="control-group flex-item">
          <label htmlFor="currency-select">Para Birimi:</label>
          <select 
            id="currency-select"
            value={base} 
            onChange={(e) => setBase(e.target.value)}
            className="modern-select"
          >
            <option value="USD">🇺🇸 Dolar (USD)</option>
            <option value="EUR">🇪🇺 Euro (EUR)</option>
            <option value="TRY">🇹🇷 Türk Lirası (TRY)</option>
            <option value="GBP">🇬🇧 Sterlin (GBP)</option>
            <option value="JPY">🇯🇵 Japon Yeni (JPY)</option>
            <option value="AUD">🇦🇺 Avustralya Doları</option>
            <option value="CAD">🇨🇦 Kanada Doları</option>
            <option value="CHF">🇨🇭 İsviçre Frangı</option>
            <option value="CNY">🇨🇳 Çin Yuanı</option>
          </select>
        </div>
      </div>

      <div className="results-area">
        {loading && (
          <div className="state-message loading">
            <RefreshCw className="spin" size={30} />
            <p>Hesaplanıyor...</p>
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
             {/* TRY */}
             <div className="rate-item highlight">
              <span className="currency-label">🇹🇷 TRY</span>
              <span className="currency-value">{calculateRate(rates.TRY)} ₺</span>
            </div>
            {/* EUR */}
            <div className="rate-item">
              <span className="currency-label">🇪🇺 EUR</span>
              <span className="currency-value">{calculateRate(rates.EUR)} €</span>
            </div>
            {/* USD */}
            <div className="rate-item">
              <span className="currency-label">🇺🇸 USD</span>
              <span className="currency-value">{calculateRate(rates.USD)} $</span>
            </div>
             {/* GBP */}
             <div className="rate-item">
              <span className="currency-label">🇬🇧 GBP</span>
              <span className="currency-value">{calculateRate(rates.GBP)} £</span>
            </div>
            {/* JPY */}
            <div className="rate-item">
              <span className="currency-label">🇯🇵 JPY</span>
              <span className="currency-value">{calculateRate(rates.JPY)} ¥</span>
            </div>
             {/* AUD */}
            <div className="rate-item">
              <span className="currency-label">🇦🇺 AUD</span>
              <span className="currency-value">{calculateRate(rates.AUD)} $</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
