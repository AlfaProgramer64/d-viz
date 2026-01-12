"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowRightLeft, RefreshCw, Wallet, TrendingUp, Coins } from "lucide-react";

export default function CurrencyCard() {
  const [rates, setRates] = useState({});
  const [base, setBase] = useState("TRY");
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(true);

  // API'den veri çekme (Exchangerate-API v4 kullanıyoruz, daha stabil)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await res.json();
        setRates(data.rates);
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Hesaplama Fonksiyonu
  const calculate = useCallback((target) => {
    if (!rates[target] || !rates[base]) return "...";
    // Formül: (Hedef Kur / Baz Kur) * Miktar
    const result = (rates[target] / rates[base]) * amount;
    return result.toLocaleString("tr-TR", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }, [rates, base, amount]);

  // Altın Hesaplama Fonksiyonu
  const calculateGold = useCallback((type) => {
    // API'den XAU (Altın) ve XAG (Gümüş) 1 USD karşılığı gelir.
    if (!rates.XAU || !rates.XAG || !rates[base]) return "---";

    // 1 Ons Altının Dolar Fiyatı = 1 / XAU Oranı
    const onsGoldUSD = 1 / rates.XAU;
    const onsSilverUSD = 1 / rates.XAG;

    // Seçili para birimine (örn: TRY) çevir
    const onsGoldBase = onsGoldUSD * rates[base];
    const onsSilverBase = onsSilverUSD * rates[base];

    // 1 Ons = 31.10 gram
    const gramGold = onsGoldBase / 31.1035;
    const gramSilver = onsSilverBase / 31.1035;

    let val = 0;
    if (type === "GRAM") val = gramGold * amount;
    if (type === "CEYREK") val = (gramGold * 1.75) * amount; // Çeyrek katsayısı
    if (type === "SILVER") val = gramSilver * amount;

    return val.toLocaleString("tr-TR", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }, [rates, base, amount]);

  return (
    <div className="content-card">
      <div style={{textAlign:'center', marginBottom:'20px'}}>
        <h2><ArrowRightLeft style={{verticalAlign:'middle'}}/> Döviz Çevirici</h2>
      </div>

      <div className="input-row">
        <div className="flex-item control-group">
          <label>Miktar</label>
          <div className="input-wrapper">
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="modern-input" 
            />
          </div>
        </div>
        <div className="flex-item control-group">
          <label>Para Birimi</label>
          <select value={base} onChange={(e) => setBase(e.target.value)} className="modern-select">
            <option value="TRY">TRY - Türk Lirası</option>
            <option value="USD">USD - Amerikan Doları</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - İngiliz Sterlini</option>
            <option value="JPY">JPY - Japon Yeni</option>
            <option value="AZN">AZN - Azerbaycan Manatı</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{textAlign:'center', color:'#94a3b8'}}><RefreshCw className="spin"/> Yükleniyor...</div>
      ) : (
        <>
          <h3 className="section-title">Döviz Kurları</h3>
          <div className="rates-grid">
            {base !== "TRY" && <div className="rate-item"><span className="currency-label">TRY</span><span className="currency-value">{calculate("TRY")} ₺</span></div>}
            {base !== "USD" && <div className="rate-item"><span className="currency-label">USD</span><span className="currency-value">{calculate("USD")} $</span></div>}
            {base !== "EUR" && <div className="rate-item"><span className="currency-label">EUR</span><span className="currency-value">{calculate("EUR")} €</span></div>}
            {base !== "GBP" && <div className="rate-item"><span className="currency-label">GBP</span><span className="currency-value">{calculate("GBP")} £</span></div>}
          </div>

          <h3 className="section-title"><TrendingUp size={16}/> Altın & Gümüş</h3>
          <div className="rates-grid">
            <div className="rate-item gold-item">
              <span className="currency-label">Gram Altın</span>
              <span className="currency-value">{calculateGold("GRAM")}</span>
            </div>
            <div className="rate-item gold-item">
              <span className="currency-label">Çeyrek Altın</span>
              <span className="currency-value">{calculateGold("CEYREK")}</span>
            </div>
            <div className="rate-item silver-item">
              <span className="currency-label">Gram Gümüş</span>
              <span className="currency-value">{calculateGold("SILVER")}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
