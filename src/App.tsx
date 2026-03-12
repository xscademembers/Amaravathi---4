/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Maximize, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Star, 
  Menu, 
  X, 
  ChevronRight,
  AirVent,
  Music,
  Utensils,
  Car,
  ShieldCheck,
  Lightbulb,
  ArrowRight,
  ImageOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface NavItem {
  label: string;
  href: string;
}

interface EventType {
  title: string;
  description: string;
  image: string;
}

interface Facility {
  name: string;
  icon: React.ReactNode;
}

// --- Constants ---
const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

const EVENT_TYPES: EventType[] = [
  { 
    title: 'Weddings & Receptions', 
    description: 'Create timeless memories in our grand hall with exquisite decor and premium catering.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800'
  },
  { 
    title: 'Corporate Conferences', 
    description: 'Professional settings for seminars, product launches, and high-level business meetings.',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800'
  },
  { 
    title: 'Exhibitions & Expos', 
    description: 'Spacious layouts perfect for trade shows, art exhibitions, and lifestyle expos.',
    image: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=800'
  },
  { 
    title: 'Private Celebrations', 
    description: 'Intimate spaces for birthdays, anniversaries, and traditional ceremonies.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800'
  },
];

const FACILITIES: Facility[] = [
  { name: 'Central Air Conditioning', icon: <AirVent className="w-6 h-6" /> },
  { name: 'Stage & Sound System', icon: <Music className="w-6 h-6" /> },
  { name: 'In-house & External Catering', icon: <Utensils className="w-6 h-6" /> },
  { name: 'Valet & Ample Parking', icon: <Car className="w-6 h-6" /> },
  { name: 'Bridal & Green Rooms', icon: <Users className="w-6 h-6" /> },
  { name: 'CCTV & Security', icon: <ShieldCheck className="w-6 h-6" /> },
  { name: 'Lighting & Decoration', icon: <Lightbulb className="w-6 h-6" /> },
  { name: 'Lift & Wheelchair Access', icon: <Users className="w-6 h-6" /> },
];

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
];

// --- Components ---
const GalleryImage = ({ src, alt, index }: { src: string; alt: string; index: number }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return (
      <div className="aspect-video bg-maroon/5 flex flex-col items-center justify-center p-8 text-center border border-maroon/10 rounded-3xl">
        <ImageOff className="w-12 h-12 text-maroon/20 mb-4" />
        <p className="text-maroon/40 font-serif text-sm italic">Image {index + 1} failed to load</p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-3xl overflow-hidden luxury-shadow group cursor-pointer bg-maroon/5 ${loading ? 'animate-pulse min-h-[200px]' : ''}`}>
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-auto group-hover:scale-105 transition-all duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        referrerPolicy="no-referrer"
        onLoad={() => setLoading(false)}
        onError={(e) => {
          console.error(`Gallery Image ${index + 1} failed to load:`, src);
          setError(true);
          setLoading(false);
        }}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-maroon/20 border-t-maroon rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* --- Navigation --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-ivory/95 backdrop-blur-md py-3 shadow-md' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('#home')}>
            <span className={`text-2xl font-serif font-bold tracking-tight ${scrolled ? 'text-maroon' : 'text-white'}`}>
              AMARAVATHI
              <span className={`block text-xs font-sans tracking-[0.3em] uppercase ${scrolled ? 'text-gold' : 'text-gold'}`}>Conventions</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className={`text-sm font-medium uppercase tracking-widest transition-colors hover:text-gold ${scrolled ? 'text-charcoal' : 'text-white'}`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('#contact')}
              className="bg-maroon text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-maroon/90 transition-all luxury-shadow"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={scrolled ? 'text-charcoal' : 'text-white'}>
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
                  onClick={() => scrollToSection(item.href)}
                  className="text-2xl font-serif text-maroon text-left border-b border-maroon/10 pb-4"
                >
                  {item.label}
                </button>
              ))}
              <button 
                onClick={() => scrollToSection('#contact')}
                className="bg-maroon text-white w-full py-4 rounded-xl text-lg font-bold uppercase tracking-widest"
              >
                Book Venue
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1920" 
            alt="Luxury Wedding Setup" 
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gold font-sans font-semibold tracking-[0.3em] uppercase mb-4"
          >
            Exquisite • Grand • Memorable
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-7xl text-white font-serif mb-8 leading-tight"
          >
            Vijayawada’s Premier Venue for <span className="italic text-gold">Grand Celebrations</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => scrollToSection('#contact')}
              className="w-full sm:w-auto bg-gold text-maroon px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white transition-all luxury-shadow"
            >
              Book Venue
            </button>
            <a 
              href="https://wa.me/919999999999" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              WhatsApp Us
            </a>
          </motion.div>
        </div>

        {/* Floating Enquiry Form (Desktop) */}
        <div className="hidden lg:block absolute bottom-12 right-12 z-20 bg-ivory/95 backdrop-blur-md p-8 rounded-2xl luxury-shadow w-80 border border-gold/20">
          <h3 className="text-maroon font-serif text-xl mb-4">Quick Enquiry</h3>
          <form className="space-y-3">
            <input type="text" placeholder="Your Name" className="w-full bg-white border border-maroon/10 p-3 rounded-lg text-sm focus:outline-none focus:border-gold" />
            <input type="tel" placeholder="Phone Number" className="w-full bg-white border border-maroon/10 p-3 rounded-lg text-sm focus:outline-none focus:border-gold" />
            <select className="w-full bg-white border border-maroon/10 p-3 rounded-lg text-sm focus:outline-none focus:border-gold">
              <option>Select Event Type</option>
              <option>Wedding</option>
              <option>Corporate</option>
              <option>Other</option>
            </select>
            <button className="w-full bg-maroon text-white py-3 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-maroon/90 transition-all">
              Check Availability
            </button>
          </form>
        </div>
      </section>

      {/* --- Highlights Section --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Users className="text-gold w-8 h-8" />, label: '700 Guests', sub: 'Floating Capacity' },
              { icon: <Maximize className="text-gold w-8 h-8" />, label: '8000 sq ft', sub: 'Main Event Hall' },
              { icon: <MapPin className="text-gold w-8 h-8" />, label: 'Prime Location', sub: 'Heart of Vijayawada' },
              { icon: <Calendar className="text-gold w-8 h-8" />, label: 'All Events', sub: 'Custom Packages' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl hover:bg-ivory transition-colors"
              >
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <h3 className="text-xl font-serif text-maroon mb-1">{stat.label}</h3>
                <p className="text-sm text-charcoal/60 uppercase tracking-widest">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="about" className="py-24 bg-ivory overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden luxury-shadow">
                <img 
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800" 
                  alt="Venue Interior" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-maroon p-8 rounded-3xl text-white hidden sm:block luxury-shadow">
                <p className="text-4xl font-serif mb-1">15+</p>
                <p className="text-xs uppercase tracking-widest opacity-80">Years of Excellence</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-gold font-sans font-semibold tracking-widest uppercase mb-4">Welcome to Amaravathi</p>
              <h2 className="text-4xl md:text-5xl font-serif text-maroon mb-8 leading-tight">Where Grandeur Meets <span className="italic">Tradition</span></h2>
              <p className="text-charcoal/80 mb-6 leading-relaxed">
                Located in the heart of Vijayawada, Amaravathi Conventions stands as a beacon of luxury and elegance. Our venue is designed to host the most prestigious events, from royal weddings to high-profile corporate conferences.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  'Centrally located near Railway & Bus Station (1 km)',
                  'Spacious 8000 sq ft Main Hall & 5000 sq ft Canopy',
                  'Exquisite interiors with modern amenities',
                  'Budget-friendly luxury packages'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-gold w-5 h-5 flex-shrink-0" />
                    <span className="text-charcoal/90">{item}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => scrollToSection('#contact')}
                className="group flex items-center gap-3 text-maroon font-bold uppercase tracking-widest hover:text-gold transition-colors"
              >
                Learn More About Us
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Events Section --- */}
      <section id="events" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold font-sans font-semibold tracking-widest uppercase mb-4">Our Expertise</p>
            <h2 className="text-4xl md:text-5xl font-serif text-maroon">Events We Host</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {EVENT_TYPES.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-[400px] rounded-3xl overflow-hidden luxury-shadow cursor-pointer"
              >
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon via-maroon/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <h3 className="text-2xl font-serif mb-2">{event.title}</h3>
                  <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-3">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Facilities Section --- */}
      <section id="facilities" className="py-24 bg-maroon text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-1">
              <p className="text-gold font-sans font-semibold tracking-widest uppercase mb-4">World-Class Amenities</p>
              <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">Premium Facilities for Your Guests</h2>
              <p className="text-white/70 mb-8">
                We provide every essential facility to ensure your event runs smoothly and your guests stay comfortable throughout the celebration.
              </p>
              <button 
                onClick={() => scrollToSection('#contact')}
                className="bg-gold text-maroon px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-white transition-all"
              >
                View All Facilities
              </button>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {FACILITIES.map((facility, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="text-gold">{facility.icon}</div>
                  <span className="font-medium tracking-wide">{facility.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Gallery Section --- */}
      <section id="gallery" className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-gold font-sans font-semibold tracking-widest uppercase mb-4">Visual Journey</p>
              <h2 className="text-4xl md:text-5xl font-serif text-maroon">Our Gallery</h2>
            </div>
            <button className="text-maroon font-bold uppercase tracking-widest flex items-center gap-2 hover:text-gold transition-colors">
              View Full Gallery <ChevronRight size={20} />
            </button>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {GALLERY_IMAGES.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <GalleryImage src={img} alt={`Gallery ${i + 1}`} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold font-sans font-semibold tracking-widest uppercase mb-4">Client Stories</p>
            <h2 className="text-4xl md:text-5xl font-serif text-maroon">What Our Guests Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Srinivas Rao', role: 'Wedding Host', text: 'The interiors are absolutely stunning. Our wedding was a dream come true. The staff was incredibly helpful throughout the event.' },
              { name: 'Priya Sharma', role: 'Corporate Event Manager', text: 'Perfect location in the heart of the city. The facilities are top-notch and the AC was excellent even with a full house.' },
              { name: 'Anil Kumar', role: 'Birthday Party Host', text: 'Very budget-friendly without compromising on luxury. The dining hall is spacious and the catering service was superb.' },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-ivory rounded-3xl luxury-shadow relative"
              >
                <div className="flex text-gold mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-charcoal/80 italic mb-8 leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <p className="font-serif text-maroon text-lg">{testimonial.name}</p>
                  <p className="text-xs uppercase tracking-widest text-gold font-semibold">{testimonial.role}</p>
                </div>
                <div className="absolute top-10 right-10 text-gold/10">
                  <Star size={80} fill="currentColor" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Location Section --- */}
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-gold font-sans font-semibold tracking-widest uppercase mb-4">Find Us</p>
              <h2 className="text-4xl md:text-5xl font-serif text-maroon mb-8">Prime City Location</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-maroon/5 p-4 rounded-2xl text-maroon">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-maroon mb-1">Address</h4>
                    <p className="text-charcoal/70">Above Vijaya Krishna Super Bazar, Near Ragavaiah Park, Bundar Road, Vijayawada, AP 520002</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-maroon/5 p-4 rounded-2xl text-maroon">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-maroon mb-1">Contact</h4>
                    <p className="text-charcoal/70">+91 99999 99999</p>
                    <p className="text-charcoal/70">info@amaravathiconventions.com</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-[450px] rounded-3xl overflow-hidden luxury-shadow border-4 border-white"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.46747192454!2d80.6274473!3d16.5025044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f00000000001%3A0x0000000000000000!2sAmaravathi%20Conventions!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Amaravathi Conventions Location"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Final CTA Section --- */}
      <section id="contact" className="py-24 bg-maroon relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-[3rem] overflow-hidden luxury-shadow grid lg:grid-cols-5">
            <div className="lg:col-span-2 bg-maroon p-12 text-white flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-serif mb-6">Plan Your Perfect Event With Us</h2>
                <p className="text-white/70 mb-10">
                  Ready to host an unforgettable celebration? Fill out the form and our event specialists will get back to you within 24 hours.
                </p>
              </div>
              <div className="space-y-6">
                <a href="tel:+919999999999" className="flex items-center gap-4 hover:text-gold transition-colors">
                  <div className="bg-white/10 p-3 rounded-xl"><Phone size={20} /></div>
                  <span className="font-bold tracking-widest uppercase text-sm">+91 99999 99999</span>
                </a>
                <a href="https://wa.me/919999999999" className="flex items-center gap-4 hover:text-gold transition-colors">
                  <div className="bg-white/10 p-3 rounded-xl"><MessageCircle size={20} /></div>
                  <span className="font-bold tracking-widest uppercase text-sm">WhatsApp Enquiry</span>
                </a>
              </div>
            </div>
            
            <div className="lg:col-span-3 p-12">
              <form className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-maroon/60">Full Name</label>
                  <input type="text" className="w-full border-b-2 border-maroon/10 py-3 focus:outline-none focus:border-maroon transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-maroon/60">Phone Number</label>
                  <input type="tel" className="w-full border-b-2 border-maroon/10 py-3 focus:outline-none focus:border-maroon transition-colors" placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-maroon/60">Event Type</label>
                  <select className="w-full border-b-2 border-maroon/10 py-3 focus:outline-none focus:border-maroon transition-colors bg-transparent">
                    <option>Wedding</option>
                    <option>Corporate</option>
                    <option>Exhibition</option>
                    <option>Private Party</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-maroon/60">Event Date</label>
                  <input type="date" className="w-full border-b-2 border-maroon/10 py-3 focus:outline-none focus:border-maroon transition-colors" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-maroon/60">Message (Optional)</label>
                  <textarea rows={3} className="w-full border-b-2 border-maroon/10 py-3 focus:outline-none focus:border-maroon transition-colors resize-none" placeholder="Tell us more about your event..."></textarea>
                </div>
                <div className="sm:col-span-2 pt-4">
                  <button className="w-full bg-maroon text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-maroon/90 transition-all luxury-shadow">
                    Submit Booking Enquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-charcoal text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <span className="text-3xl font-serif font-bold tracking-tight text-white mb-6 block">
                AMARAVATHI
                <span className="block text-xs font-sans tracking-[0.3em] uppercase text-gold">Conventions</span>
              </span>
              <p className="text-white/50 max-w-md mb-8">
                Vijayawada’s most prestigious convention center, offering a perfect blend of luxury, tradition, and modern amenities for your grand celebrations.
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-maroon transition-all cursor-pointer">
                    <Star size={18} />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-serif text-xl mb-6">Quick Links</h4>
              <ul className="space-y-4 text-white/60">
                {NAV_ITEMS.map(item => (
                  <li key={item.label}>
                    <button onClick={() => scrollToSection(item.href)} className="hover:text-gold transition-colors uppercase text-xs tracking-widest font-bold">
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-xl mb-6">Contact Info</h4>
              <ul className="space-y-4 text-white/60 text-sm">
                <li className="flex gap-3">
                  <MapPin size={18} className="text-gold flex-shrink-0" />
                  Above Vijaya Krishna Super Bazar, Bundar Road, Vijayawada
                </li>
                <li className="flex gap-3">
                  <Phone size={18} className="text-gold flex-shrink-0" />
                  +91 99999 99999
                </li>
                <li className="flex gap-3">
                  <MessageCircle size={18} className="text-gold flex-shrink-0" />
                  info@amaravathiconventions.com
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:row justify-between items-center gap-4 text-white/40 text-xs uppercase tracking-widest">
            <p>© 2026 Amaravathi Conventions. All Rights Reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- Sticky Elements --- */}
      <div className="fixed bottom-8 left-8 z-50">
        <a 
          href="https://wa.me/919999999999" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-4 rounded-full luxury-shadow hover:scale-110 transition-transform block"
        >
          <MessageCircle size={28} />
        </a>
      </div>

      <div className="fixed bottom-8 right-8 z-50 md:hidden">
        <button 
          onClick={() => scrollToSection('#contact')}
          className="bg-maroon text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest luxury-shadow"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
