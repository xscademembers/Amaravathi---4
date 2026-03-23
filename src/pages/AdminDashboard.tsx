import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ImagePlus,
  Trash2,
  MessageSquare,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  Clock,
  Phone,
  Calendar,
  User,
  Mail,
  CheckCircle,
  Circle,
  Plus,
  X,
  RefreshCw,
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

interface GalleryImage {
  _id: string;
  imageUrl: string;
  title: string;
  createdAt: string;
}

interface ContactEntry {
  _id: string;
  name: string;
  phone: string;
  eventType: string;
  eventDate: string;
  message: string;
  read: boolean;
  createdAt: string;
}

function getToken() {
  return localStorage.getItem('admin_token') || '';
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Gallery Tab ──────────────────────────────────────────────────
function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/gallery`);
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/gallery`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ imageUrl, title }),
      });
      if (res.ok) {
        setImageUrl('');
        setTitle('');
        setShowForm(false);
        fetchImages();
      }
    } catch (err) {
      console.error('Failed to add image:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await fetch(`${API}/api/gallery/${id}`, { method: 'DELETE', headers: authHeaders() });
      setImages(prev => prev.filter(img => img._id !== id));
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif text-white">Gallery Images</h2>
          <p className="text-white/40 text-sm mt-1">{images.length} images in gallery</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchImages} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all">
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="gold-gradient text-maroon px-5 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:opacity-90 transition-all"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'Add Image'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 block mb-2">Image URL *</label>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 block mb-2">Title (optional)</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="E.g. Wedding Reception"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold"
              />
            </div>
          </div>
          {imageUrl && (
            <div className="mb-4 rounded-xl overflow-hidden border border-white/10 max-w-xs">
              <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="gold-gradient text-maroon px-6 py-3 rounded-lg font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? <RefreshCw size={14} className="animate-spin" /> : <ImagePlus size={14} />}
            Add to Gallery
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-serif text-lg">No gallery images yet</p>
          <p className="text-sm mt-1">Click "Add Image" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img._id} className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/5">
              <img src={img.imageUrl} alt={img.title} className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => handleDelete(img._id)}
                  className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <a href={img.imageUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors">
                  <ExternalLink size={16} />
                </a>
              </div>
              {img.title && (
                <div className="p-2 text-white/60 text-xs truncate">{img.title}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Contacts Tab ─────────────────────────────────────────────────
function ContactManager() {
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/contacts`, { headers: authHeaders() });
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const markRead = async (id: string) => {
    try {
      await fetch(`${API}/api/contacts/${id}/read`, { method: 'PATCH', headers: authHeaders() });
      setContacts(prev => prev.map(c => c._id === id ? { ...c, read: true } : c));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    try {
      await fetch(`${API}/api/contacts/${id}`, { method: 'DELETE', headers: authHeaders() });
      setContacts(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error('Failed to delete contact:', err);
    }
  };

  const unread = contacts.filter(c => !c.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif text-white">Booking Enquiries</h2>
          <p className="text-white/40 text-sm mt-1">
            {contacts.length} total &middot; {unread} unread
          </p>
        </div>
        <button onClick={fetchContacts} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Enquiries', value: contacts.length, color: 'text-gold' },
          { label: 'Unread', value: unread, color: 'text-orange-400' },
          { label: 'Weddings', value: contacts.filter(c => c.eventType === 'Wedding').length, color: 'text-pink-400' },
          { label: 'Corporate', value: contacts.filter(c => c.eventType === 'Corporate').length, color: 'text-blue-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
            <p className={`text-2xl font-serif ${stat.color}`}>{stat.value}</p>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-serif text-lg">No enquiries yet</p>
          <p className="text-sm mt-1">Submissions from the website will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map(contact => (
            <div
              key={contact._id}
              className={`bg-white/5 border rounded-2xl p-6 transition-all ${contact.read ? 'border-white/5' : 'border-gold/30 bg-gold/5'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {contact.read ? (
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle size={16} className="text-gold flex-shrink-0" />
                    )}
                    <h3 className="font-serif text-white text-lg">{contact.name}</h3>
                    <span className="text-[10px] uppercase tracking-[0.15em] px-2 py-1 rounded-full bg-white/10 text-white/50">
                      {contact.eventType}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 text-sm text-white/50 mb-3">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gold/60" />
                      <a href={`tel:${contact.phone}`} className="hover:text-gold transition-colors">{contact.phone}</a>
                    </div>
                    {contact.eventDate && (
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gold/60" />
                        {contact.eventDate}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gold/60" />
                      {formatDate(contact.createdAt)}
                    </div>
                  </div>

                  {contact.message && (
                    <div className="flex items-start gap-2 text-sm text-white/40 bg-white/5 rounded-lg p-3 mt-2">
                      <Mail size={14} className="text-gold/40 mt-0.5 flex-shrink-0" />
                      {contact.message}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {!contact.read && (
                    <button
                      onClick={() => markRead(contact._id)}
                      className="p-2 bg-green-500/10 rounded-lg text-green-400 hover:bg-green-500/20 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="p-2 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState<'gallery' | 'contacts'>('contacts');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${API}/api/auth/verify`, { headers: authHeaders() });
        if (!res.ok) throw new Error();
      } catch {
        localStorage.removeItem('admin_token');
        navigate('/admin');
      }
    };
    verify();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  const tabs = [
    { id: 'contacts' as const, label: 'Enquiries', icon: MessageSquare },
    { id: 'gallery' as const, label: 'Gallery', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-[#111]">
      {/* Top Bar */}
      <header className="bg-[#1a1a1a] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center text-maroon font-bold text-sm">A</div>
          <div>
            <h1 className="text-white font-serif text-lg leading-tight">Amaravathi Admin</h1>
            <p className="text-white/30 text-[10px] uppercase tracking-[0.2em]">Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            className="text-white/40 hover:text-white text-sm flex items-center gap-1 transition-colors"
          >
            <ExternalLink size={14} /> View Site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/40 hover:text-red-400 text-sm transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 bg-white/5 p-1.5 rounded-xl w-fit border border-white/10">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? 'gold-gradient text-maroon'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'gallery' ? <GalleryManager /> : <ContactManager />}
      </div>
    </div>
  );
}
