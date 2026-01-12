
"use client";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CurrencyCard from "./components/CurrencyCard";

export default function Home() {
  const [theme, setTheme] = useState("USD"); 

  const handleCurrencyChange = (currency) => {
    setTheme(currency);
  };

  const themeClass = `theme-${theme}`;

  return (
    <div className={`app-wrapper ${themeClass}`}>
      <Header />
      <main className="main-content">
        <CurrencyCard onCurrencyChange={handleCurrencyChange} />
      </main>
      <Footer />
    </div>
  );
}
