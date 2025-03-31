
import { Brain } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-nfon-blue text-white py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <Brain size={32} />
        <div>
          <h1 className="text-xl font-bold md:text-2xl">NFON AI Produktberater</h1>
          <p className="text-xs md:text-sm opacity-80">Intelligente Analyse von Kundenanfragen</p>
        </div>
      </div>
      <div className="text-sm text-right">
        <p>AI Sales Team</p>
        <p className="text-xs opacity-75">v1.0</p>
      </div>
    </header>
  );
};

export default Header;
