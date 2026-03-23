import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = true }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (href: string) => {
    setIsMenuOpen(false);
    if (isHome) {
      const el = document.getElementById(href.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/' + href);
    }
  };

  const showSolid = !transparent || scrolled;

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${showSolid ? 'bg-ivory/95 backdrop-blur-md py-3 shadow-md' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => handleNav('#home')}>
            <span className={`text-2xl font-serif font-bold tracking-tight ${showSolid ? 'text-maroon' : 'text-white'}`}>
              AMARAVATHI
              <span className="block text-xs font-sans tracking-[0.3em] uppercase text-gold">Conventions</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.href)}
                className={`text-sm font-medium uppercase tracking-widest transition-colors hover:text-gold ${showSolid ? 'text-charcoal' : 'text-white'}`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('#contact')}
              className="gold-gradient text-maroon px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all luxury-shadow"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={showSolid ? 'text-charcoal' : 'text-white'}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-ivory pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col space-y-6">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNav(item.href)}
                  className="text-2xl font-serif text-maroon text-left border-b border-maroon/10 pb-4"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => handleNav('#contact')}
                className="gold-gradient text-maroon w-full py-4 rounded-xl text-lg font-bold uppercase tracking-widest"
              >
                Book Venue
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
