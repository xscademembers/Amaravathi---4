/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { 
  Users, 
  Maximize, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Star, 
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
import { motion } from 'motion/react';

// --- Types ---
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
  {
    title: 'Product Launches',
    description: 'Launch your brand with impact in a premium venue built for visibility and engagement.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Cultural & Religious Events',
    description: 'A versatile setting for cultural gatherings, spiritual functions, and community celebrations.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'College Events & Fests',
    description: 'Host vibrant student events, fests, and annual celebrations with full event support.',
    image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Government & Political Events',
    description: 'Reliable infrastructure and spacious arrangements for large formal gatherings and public events.',
    image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=800'
  },
];

const FACILITIES: Facility[] = [
  { name: 'Air Conditioning', icon: <AirVent className="w-6 h-6" /> },
  { name: 'Stage & Sound System', icon: <Music className="w-6 h-6" /> },
  { name: 'In-house Catering', icon: <Utensils className="w-6 h-6" /> },
  { name: 'External Catering Allowed', icon: <Utensils className="w-6 h-6" /> },
  { name: 'Valet Parking', icon: <Car className="w-6 h-6" /> },
  { name: 'Ample Parking Space', icon: <Car className="w-6 h-6" /> },
  { name: 'Bridal Room', icon: <Users className="w-6 h-6" /> },
  { name: 'Green Room', icon: <Users className="w-6 h-6" /> },
  { name: 'Generator Backup', icon: <ShieldCheck className="w-6 h-6" /> },
  { name: 'Lift', icon: <Users className="w-6 h-6" /> },
  { name: 'Wheelchair Accessibility', icon: <Users className="w-6 h-6" /> },
  { name: 'CCTV & Security', icon: <ShieldCheck className="w-6 h-6" /> },
  { name: 'Decoration Services', icon: <Lightbulb className="w-6 h-6" /> },
  { name: 'Lighting Setup', icon: <Lightbulb className="w-6 h-6" /> },
  { name: 'Chairs', icon: <ShieldCheck className="w-6 h-6" /> },
  { name: 'Chair Covers', icon: <ShieldCheck className="w-6 h-6" /> },
  { name: 'Dining Tables', icon: <ShieldCheck className="w-6 h-6" /> },
  { name: 'Kitchen', icon: <ShieldCheck className="w-6 h-6" /> },
  { name: 'Utensils', icon: <ShieldCheck className="w-6 h-6" /> },
  { name: 'RO Water Plant', icon: <ShieldCheck className="w-6 h-6" /> },
  { name: 'Fire Fighting System', icon: <ShieldCheck className="w-6 h-6" /> },
];

const API = import.meta.env.VITE_API_URL || '';

const DEFAULT_GALLERY_IMAGES = [
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
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState<string[]>(DEFAULT_GALLERY_IMAGES);
  const [formData, setFormData] = useState({ name: '', phone: '', eventType: 'Wedding', eventDate: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const fetchGallery = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/gallery`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setGalleryImages(data.map((img: { imageUrl: string }) => img.imageUrl));
        }
      }
    } catch { /* fallback to defaults */ }
  }, []);

  useEffect(() => { fetchGallery(); }, [fetchGallery]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      const res = await fetch(`${API}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormStatus('success');
        setFormData({ name: '', phone: '', eventType: 'Wedding', eventDate: '', message: '' });
        setTimeout(() => setFormStatus('idle'), 4000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 3000);
      }
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar transparent={false} />

      {/* --- Hero Section --- */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-12">
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
              className="w-full sm:w-auto gold-gradient text-maroon px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:opacity-90 transition-all luxury-shadow"
            >
              Enquiry Now
            </button>
            <a 
              href="https://wa.me/919000387878" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              WhatsApp Us
            </a>
          </motion.div>
        </div>


      </section>

      {/* --- Highlights Section --- */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Users className="text-gold w-8 h-8" />, label: '400 Seating', sub: '700 Standing Capacity' },
              { icon: <Maximize className="text-gold w-8 h-8" />, label: '8000 + 5000 sq ft', sub: 'Hall + Canopy Space' },
              { icon: <MapPin className="text-gold w-8 h-8" />, label: 'Prime Main Road', sub: '1 km from Bus & Rail' },
              { icon: <Calendar className="text-gold w-8 h-8" />, label: 'All Event Types', sub: 'Fixed & Custom Packages' },
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
                Located in the heart of Vijayawada on the main road, Amaravathi Conventions is just 1 km from the bus station and railway station. Our venue is designed to host everything from grand weddings to high-profile corporate conferences.
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
                className="gold-gradient text-maroon px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:opacity-90 transition-all"
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
            <button onClick={() => navigate('/gallery')} className="gold-gradient text-maroon px-12 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-sm hover:opacity-90 transition-all luxury-shadow">
              The Full Collection
            </button>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryImages.map((img, i) => (
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
            <p className="text-gold font-sans font-semibold tracking-[0.3em] uppercase mb-4">Kind Words</p>
            <h2 className="text-4xl md:text-5xl font-serif text-maroon">Guest Experiences</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Srinivas Rao', initial: 'S', role: 'Wedding Client', text: 'The most elegant venue in Vijayawada. The staff was incredibly professional and the hall setup was breathtaking.' },
              { name: 'Ananya Sharma', initial: 'A', role: 'Corporate Event', text: 'Perfect location for our product launch. The central AC and sound system were top-notch. Highly recommended!' },
              { name: 'Prakash Reddy', initial: 'P', role: 'Private Party', text: 'Spacious, clean, and very well-maintained. The valet parking made it so easy for our 500+ guests.' },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-2xl border border-maroon/5 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-default flex flex-col justify-between"
              >
                <div>
                  <div className="flex text-gold mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-charcoal/70 italic mb-8 leading-relaxed font-serif">"{testimonial.text}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-maroon font-bold text-sm">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-serif text-maroon text-base font-semibold">{testimonial.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">{testimonial.role}</p>
                  </div>
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
                  <div className="bg-maroon/5 rounded-2xl text-maroon shrink-0 flex size-14 items-center justify-center">
                    <MapPin size={24} className="shrink-0" strokeWidth={2} aria-hidden />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-maroon mb-1">Address</h4>
                    <p className="text-charcoal/70">Amaravathi Conventions, Above Vijaya Krishna Super Bazar, Bunder Road, Vijayawada - 520 002</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-maroon/5 rounded-2xl text-maroon shrink-0 flex size-14 items-center justify-center">
                    <Phone size={24} className="shrink-0" strokeWidth={2} aria-hidden />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-maroon mb-1">Contact</h4>
                    <p className="text-charcoal/70">+91 90003 87878</p>
                    <p className="text-charcoal/70">amaravathiconventions@gmail.com</p>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30602.714261003697!2d80.58602367431642!3d16.508960400000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f00302c5ea47%3A0xd4339665f95e2d8c!2sAmaravati%20Conventions!5e0!3m2!1sen!2sus!4v1774422510261!5m2!1sen!2sus" 
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
          <div className="bg-white rounded-[2.5rem] overflow-hidden luxury-shadow border border-gold/20">
            <div className="grid lg:grid-cols-2">
              <div className="bg-maroon text-white p-10 md:p-14 relative">
                <div className="absolute top-0 right-0 w-56 h-56 bg-gold/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                <p className="text-gold font-semibold text-xs tracking-[0.25em] uppercase mb-4 relative">Reserve Your Date</p>
                <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6 relative">
                  Plan Your Perfect Event With Us
                </h2>
                <p className="text-white/75 leading-relaxed mb-10 relative">
                  Share your event details and our team will help you with availability, pricing, and the best package options within 24 hours.
                </p>

                <div className="space-y-4 relative">
                  <a href="tel:+919000387878" className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-gold/40 transition-colors">
                    <div className="bg-white/10 p-3 rounded-xl text-gold"><Phone size={20} /></div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Call Us</p>
                      <p className="font-semibold tracking-wide">+91 90003 87878</p>
                    </div>
                  </a>
                  <a href="https://wa.me/919000387878" className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-gold/40 transition-colors">
                    <div className="bg-white/10 p-3 rounded-xl text-gold"><MessageCircle size={20} /></div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Instant Support</p>
                      <p className="font-semibold tracking-wide">WhatsApp Enquiry</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="p-8 md:p-12 bg-ivory/30">
                <div className="mb-8">
                  <p className="text-gold font-semibold text-xs tracking-[0.22em] uppercase mb-3">Booking Request</p>
                  <h3 className="text-3xl font-serif text-maroon">Tell Us About Your Event</h3>
                </div>

                <form onSubmit={handleContactSubmit} className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-maroon/60">Full Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className="w-full bg-white border border-maroon/15 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-maroon/60">Phone Number</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData(p => ({...p, phone: e.target.value}))} className="w-full bg-white border border-maroon/15 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors" placeholder="+91 98765 43210" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-maroon/60">Event Type</label>
                    <select value={formData.eventType} onChange={e => setFormData(p => ({...p, eventType: e.target.value}))} className="w-full bg-white border border-maroon/15 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors">
                      <option>Wedding</option>
                      <option>Corporate</option>
                      <option>Exhibition</option>
                      <option>Private Party</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-maroon/60">Event Date</label>
                    <input type="date" value={formData.eventDate} onChange={e => setFormData(p => ({...p, eventDate: e.target.value}))} className="w-full bg-white border border-maroon/15 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-maroon/60">Message (Optional)</label>
                    <textarea rows={4} value={formData.message} onChange={e => setFormData(p => ({...p, message: e.target.value}))} className="w-full bg-white border border-maroon/15 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors resize-none" placeholder="Tell us more about your event..."></textarea>
                  </div>
                  <div className="sm:col-span-2 pt-2">
                    {formStatus === 'success' ? (
                      <div className="w-full bg-green-500/10 border border-green-500/30 text-green-700 py-4 rounded-xl font-bold uppercase tracking-widest text-center text-sm">
                        Enquiry Submitted Successfully!
                      </div>
                    ) : (
                      <button type="submit" disabled={formStatus === 'sending'} className="w-full gold-gradient text-maroon py-4 rounded-xl font-bold uppercase tracking-[0.18em] text-sm hover:opacity-90 transition-all luxury-shadow disabled:opacity-60">
                        {formStatus === 'sending' ? 'Submitting...' : formStatus === 'error' ? 'Failed - Try Again' : 'Submit Booking Enquiry'}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#1a1a1a] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
            <div>
              <div className="flex justify-center mb-2 -mt-4">
                <div className="w-56 h-56 flex items-center justify-center">
                  <img
                    src="/logo%20accepted.png"
                    alt="Amaravathi Conventions"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                Vijayawada's premier destination for luxury weddings, corporate events, and grand celebrations. Experience world-class hospitality in the heart of the city.
              </p>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-white/50 text-sm">
                {[
                  { label: 'Home', href: '#home' },
                  { label: 'About Venue', href: '#about' },
                  { label: 'Event Types', href: '#events' },
                  { label: 'Gallery', href: '#gallery' },
                  { label: 'Contact Us', href: '#contact' },
                ].map(item => (
                  <li key={item.label}>
                    <button onClick={() => scrollToSection(item.href)} className="hover:text-gold transition-colors">
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6">Event Types</h4>
              <ul className="space-y-3 text-white/50 text-sm">
                {['Weddings & Receptions', 'Corporate Conferences', 'Product Launches', 'Exhibitions', 'Private Celebrations'].map(item => (
                  <li key={item}>
                    <button onClick={() => scrollToSection('#events')} className="hover:text-gold transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6">Newsletter</h4>
              <p className="text-white/40 text-sm mb-5 leading-relaxed">
                Subscribe to get updates on our latest packages and event inspirations.
              </p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="flex-1 bg-white/10 border border-white/10 px-4 py-3 rounded-l-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold"
                />
                <button className="gold-gradient text-maroon px-4 py-3 rounded-r-lg hover:opacity-90 transition-all">
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-[11px] uppercase tracking-[0.2em]">
            <p>&copy; 2026 Amaravathi Conventions. All Rights Reserved.</p>
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
          href="https://wa.me/919000387878" 
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
          className="gold-gradient text-maroon px-6 py-3 rounded-full font-bold uppercase tracking-widest luxury-shadow"
        >
          Enquiry Now
        </button>
      </div>
    </div>
  );
}
