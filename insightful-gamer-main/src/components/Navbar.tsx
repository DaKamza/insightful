
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChartBar, Target, Gamepad2 } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-xl font-display font-semibold text-foreground/90 hover:text-foreground transition-colors"
          >
            BetInsight
          </Link>

          <div className="hidden md:flex space-x-8">
            <NavLink to="/" icon={<ChartBar className="w-4 h-4" />} label="Dashboard" />
            <NavLink to="/soccer" icon={<Target className="w-4 h-4" />} label="Soccer" />
            <NavLink
              to="/spina-zonke"
              icon={<Gamepad2 className="w-4 h-4" />}
              label="Spina Zonke"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
