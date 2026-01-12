"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowRightLeft, RefreshCw, AlertCircle, Wallet, Coins, TrendingUp } from "lucide-react";

export default function CurrencyCard() {
  // rawUSDRates: API'den gelen HAM USD bazlı veriler
  const [rawUSDRates, setRawUSDRates] = useState({});
  const [base, setBase] = useState("TRY"); // Kullanıcının seçtiği baz para birimi
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tema Rengi Belirleme (Vurgu için)
  const getThemeColor = (currency) => {
    const colors = {
      USD: "#3b82f6", TRY: "#ef4444", EUR: "#10b981", GBP: "#8b5cf6",
      JPY: "#f59e0b", AUD: "#06b6d4", CAD: "#dc2626", CHF: "#e11d48",
      RUB: "#9ca3af", SAR: "#16a34a", AZN: "#0ea5e9"
    };
    return colors[currency] || "#64748b";
  };

  // Veri Çekme: HER ZAMAN USD BAZLI ÇEKİYORUZ
  useEffect(() => {
    const fetchUSDRates = async () => {
      setLoading(true);
      setError(null);
      try {
        // Hile burada: Baz ne olursa olsun USD çekiyoruz
        const response = await fetch(`https://open.er-api.com/v6/latest/USD`);
        if (!response.ok) throw new Error("Veri alınamadı.");
        const data = await response.json();
        setRawUSDRates(data.rates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUSDRates();
  }, []); // Sadece sayfa ilk açıldığında çalışır

  // --- YENİ HESAPLAMA MANTIĞI (Çapraz Kur) ---
  
  // Seçilen 'base' paranın USD karşılığını bulur (Örn: 1 USD = 30 TRY ise, rate 30'dur)
  const baseUSDRate = rawUSDRates[base] || 1;

  // Standart Döviz Hesaplama
  const calculateCrossRate = useCallback((targetCurrency) => {
    if (!rawUSDRates[targetCurrency] || !baseUSDRate) return "...";
    
    // Formül: (Hedef Para USD Kuru / Baz Para USD Kuru) * Miktar
    // Örnek: TRY'den EUR'a geçiş için: (USD/EUR) / (USD/TRY)
    const crossRate = rawUSDRates[targetCurrency] / baseUSDRate;
    const result = crossRate * amount;
    
    return result.toLocaleString('tr-TR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }, [rawUSDRates, baseUSDRate, amount]);


  // Altın/Gümüş Hesaplama (En garantili yöntem)
  const calculateGold = useCallback((type) => {
    // XAU (Altın) ve XAG (Gümüş) ONS fiyatları USD bazında gelir.
    // rawUSDRates.XAU -> 1 USD ile kaç ONS altın alınır (Örn: 0.00049)
    const usdXauRate = rawUSDRates.XAU;
    const usdXagRate = rawUSDRates.XAG;

    if (!usdXauRate || !usdXagRate || !baseUSDRate) return "---";

    // 1 ONS Altının USD Fiyatı = 1 / usdXauRate
    const oneOunceGoldInUSD = 1 / usdXauRate;
    const oneOunceSilverInUSD = 1 / usdXagRate;

    // ONS Fiyatını, Seçilen Baz Paraya Çevir (Örn: ONS kaç TL?)
    const oneOunceGoldInBase = oneOunceGoldInUSD * baseUSDRate;
    const oneOunceSilverInBase = oneOunceSilverInUSD * baseUSDRate;

    // Gram Fiyatı (1 ONS = 31.1035 Gram)
    const gramGoldPrice = oneOunceGoldInBase / 31.1035;
    const gramSilverPrice = oneOunceSilverInBase / 31.1035;
    
    let result = 0;
    if (type === "GRAM") result = gramGoldPrice * amount;
    // Çeyrek Altın: Gram * 1.6065 (Has altın karşılığı) + İşçilik payı (yaklaşık %2-3 ekleyelim) -> ~1.635
    if (type === "CEYREK") result = (gramGoldPrice * 1.635) * amount; 
    if (type === "SILVER") result = gramSilverPrice * amount;

    return result.toLocaleString('tr-TR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }, [rawUSDRates, baseUSDRate, amount]);


  const dynamicStyle = { "--accent-color": getThemeColor(base) };

  return (
    <div className="glass-panel content-card" style={dynamicStyle}>
      <div className="card-header">
        <h2 style={{color: 'var(--accent-color)'}}> <ArrowRightLeft size={24} /> Döviz & Altın Çevirici</h2>
      </div>

      <div className="input-row">
        <div className="control-group flex-item">
          <label>Miktar / Adet:</label>
          <div className="input-wrapper">
             <Wallet size={18} className="input-icon" style={{color: 'var(--accent-color)'}}/>
             <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="modern-input"/>
          </div>
        </div>

        <div className="control-group flex-item">
          <label>Baz Para Birimi:</label>
          <select value={base} onChange={(e) => setBase(e.target.value)} className="modern-select">
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
          <div className="state-message"><RefreshCw className="spin" size={30} /><p>Veriler alınıyor...</p></div>
        )}
        
        {error && <div className="state-message error"><AlertCircle /> {error}</div>}

        {!loading && !error && rawUSDRates.USD && (
          <>
            <h3 className="section-title">Döviz Kurları</h3>
            <div className="rates-grid">
               {base !== "TRY" && <div className="rate-item"><span className="currency-label">🇹🇷 TRY</span><span className="currency-value">{calculateCrossRate("TRY")} ₺</span></div>}
               {base !== "USD" && <div className="rate-item"><span className="currency-label">🇺🇸 USD</span><span className="currency-value">{calculateCrossRate("USD")} $</span></div>}
               {base !== "EUR" && <div className="rate-item"><span className="currency-label">🇪🇺 EUR</span><span className="currency-value">{calculateCrossRate("EUR")} €</span></div>}
               {base !== "GBP" && <div className="rate-item"><span className="currency-label">🇬🇧 GBP</span><span className="currency-value">{calculateCrossRate("GBP")} £</span></div>}
               <div className="rate-item"><span className="currency-label">🇯🇵 JPY</span><span className="currency-value">{calculateCrossRate("JPY")} ¥</span></div>
               <div className="rate-item"><span className="currency-label">🇷🇺 RUB</span><span className="currency-value">{calculateCrossRate("RUB")} ₽</span></div>
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
