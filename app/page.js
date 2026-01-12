import CurrencyCard from "./components/CurrencyCard";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (

    <div className="app-wrapper">
      <Header />
      <main className="main-content">
        <CurrencyCard />
      </main>
      <Footer />
    </div>
  );
}
