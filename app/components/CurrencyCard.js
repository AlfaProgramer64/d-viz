"use client";
import { useState, useEffect } from "react";
import { ArrowRightLeft, RefreshCw, AlertCircle, Wallet, Coins, TrendingUp } from "lucide-react";

export default function CurrencyCard({ onCurrencyChange }) {
  const [rates, setRates] = useState({});
  const [base, setBase] = useState("TRY"); // Varsayılanı TRY yaptık ki altın fiyatı mantıklı görünsün
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(r => setTimeout(r, 300));
        
        const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
        if (!response.ok) throw new Error("Sunucudan veri alınamadı.");
        const data = await response.json();
        setRates(data.rates);
        
        onCurrencyChange(base);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [base, onCurrencyChange]);

  // --- HESAPLAMA FONKSİYONLARI ---

  // Standart Para Birimi Hesapla
  const calculateRate = (rate) => {
    if (!rate) return "---";
    return (rate * amount).toLocaleString('tr-TR', { maximumFractionDigits: 2 });
  };

  // Altın/Gümüş Hesapla (Ons -> Gram -> Adet)
  // Mantık: 1 Birim Baz Para (örn TRY) = X Ons Altın (rates.XAU)
  // 1 Ons Altın Fiyatı = 1 / rates.XAU
  const calculateGold = (type) => {
    if (!rates.XAU || !rates.XAG) return "---";

    const ozPrice = 1 / rates.XAU; // 1 Ons Altının Baz Para cinsinden değeri
    const gramPrice = ozPrice / 31.1035; // 1 Gram fiyatı
    
    // Girilen miktar ile çarpıyoruz (Örn: 5 tane çeyrek ne kadar?)
    if (type === "GRAM") return (gramPrice * amount).toLocaleString('tr-TR', { maximumFractionDigits: 2 });
    if (type === "CEYREK") return ((gramPrice * 1.63) * amount).toLocaleString('tr-TR', { maximumFractionDigits: 2 });
    
    // Gümüş
    const ozSilver = 1 / rates.XAG;
    const gramSilver = ozSilver / 31.1035;
    if (type === "SILVER") return (gramSilver * amount).toLocaleString('tr-TR', { maximumFractionDigits: 2 });
  };

  return (
    <div className="glass-panel content-card">
      <div className="card-header">
        <h2> <ArrowRightLeft size={24} /> Döviz & Altın Çevirici</h2>
      </div>

      <div className="input-row">
        <div className="control-group flex-item">
          <label htmlFor="amount-input">Miktar / Adet:</label>
          <div className="input-wrapper">
             <Wallet size={18} className="input-icon" />
             <input
              id="amount-input"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="modern-input"
              placeholder="1"
            />
          </div>
        </div>

        <div className="control-group flex-item">
          <label htmlFor="currency-select">Baz Para Birimi:</label>
          <select 
            id="currency-select"
            value={base} 
            onChange={(e) => setBase(e.target.value)}
            className="modern-select"
          >
            <option value="TRY">🇹🇷 Türk Lirası (TRY)</option>
            <option value="USD">🇺🇸 Amerikan Doları (USD)</option>
            <option value="EUR">🇪🇺 Euro (EUR)</option>
            <option value="GBP">🇬🇧 Sterlin (GBP)</option>
          </select>
        </div>
      </div>

      <div className="results-area">
        {loading && (
          <div className="state-message loading">
            <RefreshCw className="spin" size={30} />
            <p>Piyasalar yükleniyor...</p>
          </div>
        )}
        
        {error && (
          <div className="state-message error">
            <AlertCircle size={30} />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* DÖVİZ BÖLÜMÜ */}
            <h3 className="section-title">Döviz Kurları</h3>
            <div className="rates-grid">
               {/* TRY Seçiliyse gösterme, değilse göster mantığı */}
               {base !== "TRY" && (
                <div className="rate-item highlight">
                    <span className="currency-label">🇹🇷 TRY</span>
                    <span className="currency-value">{calculateRate(rates.TRY)} ₺</span>
                </div>
               )}
              <div className="rate-item">
                <span className="currency-label">🇺🇸 USD</span>
                <span className="currency-value">{calculateRate(rates.USD)} $</span>
              </div>
              <div className="rate-item">
                <span className="currency-label">🇪🇺 EUR</span>
                <span className="currency-value">{calculateRate(rates.EUR)} €</span>
              </div>
               <div className="rate-item">
                <span className="currency-label">🇬🇧 GBP</span>
                <span className="currency-value">{calculateRate(rates.GBP)} £</span>
              </div>
            </div>

            {/* ALTIN & EMTİA BÖLÜMÜ */}
            <h3 className="section-title" style={{marginTop: '20px'}}> <Coins size={18} style={{marginRight:'5px'}}/> Altın & Gümüş</h3>
            <div className="rates-grid">
              
              {/* Gram Altın */}
              <div className="rate-item gold-item">
                <div className="icon-badge gold-bg"><TrendingUp size={16}/></div>
                <span className="currency-label">Gram Altın (24K)</span>
                <span className="currency-value">{calculateGold("GRAM")} {base === 'TRY' ? '₺' : base}</span>
              </div>

              {/* Çeyrek Altın */}
              <div className="rate-item gold-item">
                 <div className="icon-badge gold-bg"><Coins size={16}/></div>
                <span className="currency-label">Çeyrek Altın (Yeni)</span>
                <span className="currency-value">{calculateGold("CEYREK")} {base === 'TRY' ? '₺' : base}</span>
              </div>

              {/* Gram Gümüş */}
              <div className="rate-item silver-item">
                <div className="icon-badge silver-bg"><TrendingUp size={16}/></div>
                <span className="currency-label">Gram Gümüş</span>
                <span className="currency-value">{calculateGold("SILVER")} {base === 'TRY' ? '₺' : base}</span>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
