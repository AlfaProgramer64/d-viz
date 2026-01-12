"use client";
import { useState, useEffect, useCallback } from "react";
import { 
  ArrowRightLeft, 
  RefreshCw, 
  Wallet, 
  TrendingUp, 
  Coins, 
  ArrowDownUp
} from "lucide-react";

export default function CurrencyCard() {
  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("TRY"); // Kaynak Para
  const [toCurrency, setToCurrency] = useState("USD");     // Hedef Para
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");

  // --- AYARLAR ---
  const currencyConfig = {
    TRY: { symbol: "₺", color: "#ef4444", name: "Türk Lirası", flag: "🇹🇷" },
    USD: { symbol: "$", color: "#3b82f6", name: "Amerikan Doları", flag: "🇺🇸" },
    EUR: { symbol: "€", color: "#10b981", name: "Euro", flag: "🇪🇺" },
    GBP: { symbol: "£", color: "#8b5cf6", name: "Sterlin", flag: "🇬🇧" },
    JPY: { symbol: "¥", color: "#f59e0b", name: "Japon Yeni", flag: "🇯🇵" },
    AZN: { symbol: "₼", color: "#06b6d4", name: "Azerbaycan Manatı", flag: "🇦🇿" },
    RUB: { symbol: "₽", color: "#9ca3af", name: "Rus Rublesi", flag: "🇷🇺" },
    CHF: { symbol: "₣", color: "#e11d48", name: "İsviçre Frangı", flag: "🇨🇭" },
  };

  const getConfig = (code) => currencyConfig[code] || { symbol: code, color: "#cbd5e1", name: code, flag: "🌐" };
  
  // Temayı "Kaynak" paraya göre ayarla
  const currentTheme = getConfig(fromCurrency);

  // --- API ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json");
        const data = await res.json();
        setRates(data.usd);
        setLastUpdate(data.date);
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- HESAPLAMA ---
  const convertCurrency = () => {
    const fromRate = rates[fromCurrency.toLowerCase()];
    const toRate = rates[toCurrency.toLowerCase()];

    if (!fromRate || !toRate) return "---";

    // (Miktar / KaynakKur) * HedefKur
    // Not: API USD tabanlı olduğu için önce USD'ye çevirip sonra hedefe gidiyoruz.
    const result = (amount / fromRate) * toRate;
    return result.toLocaleString("tr-TR", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  };

  // Birim Fiyat (Örn: 1 USD = 32.50 TRY)
  const getExchangeRate = () => {
    const fromRate = rates[fromCurrency.toLowerCase()];
    const toRate = rates[toCurrency.toLowerCase()];
    if (!fromRate || !toRate) return "...";
    
    const rate = (1 / fromRate) * toRate;
    return rate.toLocaleString("tr-TR", { maximumFractionDigits: 4 });
  };

  // Yer Değiştirme (Swap) Fonksiyonu
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Altın Hesaplama (Kaynak paraya göre)
  const calculateMetal = useCallback((type) => {
    const rateXAU = rates.xau;
    const rateXAG = rates.xag;
    const rateBase = rates[fromCurrency.toLowerCase()];

    if (!rateXAU || !rateXAG || !rateBase) return "---";

    const onsGoldPrice = rateBase / rateXAU;
    const onsSilverPrice = rateBase / rateXAG;
    const gramGold = onsGoldPrice / 31.1035;
    const gramSilver = onsSilverPrice / 31.1035;

    let val = 0;
    if (type === "GRAM_ALTIN") val = gramGold;
    if (type === "CEYREK") val = gramGold * 1.75;
    if (type === "GRAM_GUMUS") val = gramSilver;

    return val.toLocaleString("tr-TR", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }, [rates, fromCurrency]);

  const dynamicStyle = { "--theme-color": currentTheme.color };

  return (
    <div className="content-card" style={dynamicStyle}>
      <div className="card-header">
        <h2 style={{color: 'var(--theme-color)'}}>
           <RefreshCw size={24}/> Döviz Çevirici
        </h2>
        <span className="date-badge">{lastUpdate}</span>
      </div>

      {/* --- ANA ÇEVİRİ ALANI --- */}
      <div className="converter-section">
        
        {/* MİKTAR GİRİŞİ */}
        <div className="input-block">
          <label>Miktar</label>
          <div className="input-wrapper focus-effect">
            <Wallet className="input-icon" style={{color: 'var(--theme-color)'}} size={20}/>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="modern-input" 
            />
          </div>
        </div>

        {/* SEÇİM ALANI (YAN YANA) */}
        <div className="selection-row">
          
          {/* KAYNAK PARA */}
          <div className="select-block">
            <label>Şundan:</label>
            <div className="input-wrapper focus-effect">
              <span className="input-icon flag-icon">{getConfig(fromCurrency).flag}</span>
              <select 
                value={fromCurrency} 
                onChange={(e) => setFromCurrency(e.target.value)} 
                className="modern-select"
              >
                {Object.keys(currencyConfig).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* SWAP BUTONU */}
          <button className="swap-btn" onClick={swapCurrencies} title="Değiştir">
            <ArrowRightLeft size={20} />
          </button>

          {/* HEDEF PARA */}
          <div className="select-block">
            <label>Şuna:</label>
            <div className="input-wrapper focus-effect">
              <span className="input-icon flag-icon">{getConfig(toCurrency).flag}</span>
              <select 
                value={toCurrency} 
                onChange={(e) => setToCurrency(e.target.value)} 
                className="modern-select"
              >
                 {Object.keys(currencyConfig).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* SONUÇ EKRANI */}
        <div className="result-display">
          {loading ? <p>Hesaplanıyor...</p> : (
            <>
              <div className="result-main">
                {convertCurrency()} <span className="result-symbol">{getConfig(toCurrency).symbol}</span>
              </div>
              <div className="exchange-rate-info">
                1 {fromCurrency} = {getExchangeRate()} {toCurrency}
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- ALT BİLGİ: ALTIN PİYASASI --- */}
      <h3 className="section-title" style={{marginTop:'30px'}}>
        <TrendingUp size={18} color="#eab308"/> {fromCurrency} Bazında Emtia
      </h3>
      <div className="rates-grid">
         <MetalBox label="Gram Altın" value={calculateMetal("GRAM_ALTIN")} currency={getConfig(fromCurrency).symbol} type="gold" />
         <MetalBox label="Çeyrek Altın" value={calculateMetal("CEYREK")} currency={getConfig(fromCurrency).symbol} type="gold" />
         <MetalBox label="Gram Gümüş" value={calculateMetal("GRAM_GUMUS")} currency={getConfig(fromCurrency).symbol} type="silver" />
      </div>

    </div>
  );
}

function MetalBox({ label, value, currency, type }) {
  const isGold = type === 'gold';
  return (
    <div className={`rate-item ${isGold ? 'gold-glow' : 'silver-glow'}`}>
      <div className="icon-badge">
        <Coins size={16} color={isGold ? '#facc15' : '#cbd5e1'} />
      </div>
      <span className="currency-label">{label}</span>
      <span className={`currency-value ${isGold ? 'gold-text' : 'silver-text'}`}>
        {value} <span style={{fontSize:'0.6em'}}>{currency}</span>
      </span>
    </div>
  );
}
