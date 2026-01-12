"use client";
import { useState, useEffect } from "react";
import { ArrowRightLeft, RefreshCw, AlertCircle, Wallet, Coins, TrendingUp } from "lucide-react";

export default function CurrencyCard() {
  const [rates, setRates] = useState({});
  const [base, setBase] = useState("TRY"); // Başlangıç TRY olsun
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tema Rengi Belirleme (Sadece vurgu için)
  const getThemeColor = (currency) => {
    const colors = {
      USD: "#3b82f6", // Mavi
      EUR: "#10b981", // Yeşil
      TRY: "#ef4444", // Kırmızı
      GBP: "#8b5cf6", // Mor
      JPY: "#f59e0b", // Turuncu
      XAU: "#eab308", // Altın Sarısı
    };
    return colors[currency] || "#64748b"; // Varsayılan Gri
  };

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(r => setTimeout(r, 300));
        
        // API'den veriyi çek
        const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
        if (!response.ok) throw new Error("Veri alınamadı.");
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

  // --- HESAPLAMA FONKSİYONLARI ---
  
  const calculateRate = (targetCurrency) => {
    if (!rates || !rates[targetCurrency]) return "...";
    const val = rates[targetCurrency] * amount;
    return val.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
  };

  const calculateGold = (type) => {
    // API bazen XAU (Altın) vermeyebilir, kontrol edelim
    if (!rates.XAU || !rates.XAG) return "---";

    // 1 Ons Altının Baz Para cinsinden değeri = 1 / rates.XAU
    const ozPrice = 1 / rates.XAU; 
    const gramPrice = ozPrice / 31.1035; 
    
    let result = 0;
    if (type === "GRAM") result = gramPrice * amount;
    if (type === "CEYREK") result = (gramPrice * 1.63) * amount; // 1.63 katsayısı (22 ayar + işçilik simülasyonu)
    if (type === "SILVER") {
        const ozSilver = 1 / rates.XAG;
        result = (ozSilver / 31.1035) * amount;
    }

    return result.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
  };

  // Dinamik Stil (CSS Variable olarak rengi karta atıyoruz)
  const dynamicStyle = {
    "--accent-color": getThemeColor(base),
  };

  return (
    <div className="glass-panel content-card" style={dynamicStyle}>
      <div className="card-header">
        <h2 style={{color: 'var(--accent-color)'}}> <ArrowRightLeft size={24} /> Döviz & Altın Çevirici</h2>
      </div>

      <div className="input-row">
        {/* Miktar */}
        <div className="control-group flex-item">
          <label>Miktar / Adet:</label>
          <div className="input-wrapper">
             <Wallet size={18} className="input-icon" style={{color: 'var(--accent-color)'}}/>
             <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="modern-input"
            />
          </div>
        </div>

        {/* Para Birimi Seçimi */}
        <div className="control-group flex-item">
          <label>Baz Para Birimi:</label>
          <select 
            value={base} 
            onChange={(e) => setBase(e.target.value)}
            className="modern-select"
          >
            <option value="TRY">🇹🇷 Türk Lirası (TRY)</option>
            <option value="USD">🇺🇸 Amerikan Doları (USD)</option>
            <option value="EUR">🇪🇺 Euro (EUR)</option>
            <option value="GBP">🇬🇧 Sterlin (GBP)</option>
            <option value="JPY">🇯🇵 Japon Yeni (JPY)</option>
            <option value="AUD">🇦🇺 Avustralya Doları</option>
            <option value="CAD">🇨🇦 Kanada Doları</option>
            <option value="CHF">🇨🇭 İsviçre Frangı</option>
            <option value="RUB">🇷🇺 Rus Rublesi</option>
            <option value="SAR">🇸🇦 Suudi Riyali</option>
            <option value="AZN">🇦🇿 Azerbaycan Manatı</option>
          </select>
        </div>
      </div>

      <div className="results-area">
        {loading && (
          <div className="state-message">
            <RefreshCw className="spin" size={30} />
            <p>Piyasalar güncelleniyor...</p>
          </div>
        )}
        
        {error && <div className="state-message error"><AlertCircle /> {error}</div>}

        {!loading && !error && (
          <>
            <h3 className="section-title">Döviz Kurları</h3>
            <div className="rates-grid">
               {/* Base TRY ise onu gösterme */}
               {base !== "TRY" && (
                <div className="rate-item">
                    <span className="currency-label">🇹🇷 TRY</span>
                    <span className="currency-value">{calculateRate("TRY")} ₺</span>
                </div>
               )}
               {base !== "USD" && (
              <div className="rate-item">
                <span className="currency-label">🇺🇸 USD</span>
                <span className="currency-value">{calculateRate("USD")} $</span>
              </div>
               )}
               {base !== "EUR" && (
              <div className="rate-item">
                <span className="currency-label">🇪🇺 EUR</span>
                <span className="currency-value">{calculateRate("EUR")} €</span>
              </div>
               )}
               {base !== "GBP" && (
               <div className="rate-item">
                <span className="currency-label">🇬🇧 GBP</span>
                <span className="currency-value">{calculateRate("GBP")} £</span>
              </div>
               )}
               {/* Ekstra Birimler */}
               <div className="rate-item">
                <span className="currency-label">🇯🇵 JPY</span>
                <span className="currency-value">{calculateRate("JPY")} ¥</span>
               </div>
            </div>

            <h3 className="section-title" style={{marginTop: '20px'}}> <Coins size={18} style={{marginRight:'5px', color:'gold'}}/> Altın & Gümüş</h3>
            <div className="rates-grid">
              
              <div className="rate-item gold-item">
                <div className="icon-badge gold-bg"><TrendingUp size={16}/></div>
                <span className="currency-label">Gram Altın (24K)</span>
                <span className="currency-value">{calculateGold("GRAM")} {base === 'TRY' ? '₺' : base}</span>
              </div>

              <div className="rate-item gold-item">
                 <div className="icon-badge gold-bg"><Coins size={16}/></div>
                <span className="currency-label">Çeyrek Altın</span>
                <span className="currency-value">{calculateGold("CEYREK")} {base === 'TRY' ? '₺' : base}</span>
              </div>

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
