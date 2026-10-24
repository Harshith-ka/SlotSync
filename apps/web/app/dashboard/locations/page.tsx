'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Clock,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
} from 'lucide-react';

interface LocationItem {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  address: string;
  phone: string;
  email: string;
  staffCount: number;
  isActive: boolean;
}

const INITIAL_LOCATIONS: LocationItem[] = [
  {
    id: 'loc_manhattan',
    name: 'Downtown Manhattan Flagship',
    slug: 'manhattan-flagship',
    timezone: 'America/New_York',
    address: '452 Broadway, SoHo, New York, NY 10013',
    phone: '+1 (212) 555-0199',
    email: 'soho@urbansalon.com',
    staffCount: 2,
    isActive: true,
  },
  {
    id: 'loc_brooklyn',
    name: 'Brooklyn Heights Atelier',
    slug: 'brooklyn-heights',
    timezone: 'America/New_York',
    address: '128 Montague St, Brooklyn, NY 11201',
    phone: '+1 (718) 555-0144',
    email: 'brooklyn@urbansalon.com',
    staffCount: 1,
    isActive: true,
  },
];

export default function LocationsPage() {
  const [locations, setLocations] = useState<LocationItem[]>(INITIAL_LOCATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const newLoc: LocationItem = {
      id: `loc_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      timezone,
      address,
      phone: '+1 (555) 0100',
      email: 'contact@urbansalon.com',
      staffCount: 1,
      isActive: true,
    };
    setLocations([...locations, newLoc]);
    setIsModalOpen(false);
    setName('');
    setAddress('');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Business Locations & Timezones</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Multi-branch management with independent IANA timezones, staff assignments, and operating schedules.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Add Location
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {locations.map((loc) => (
          <div key={loc.id} className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>{loc.name}</h3>
                <span className="badge badge-confirmed" style={{ fontSize: '0.7rem' }}>
                  Active Branch
                </span>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--accent-primary)',
                  background: 'rgba(99, 102, 241, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                }}
              >
                {loc.timezone}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--accent-primary)" /> {loc.address}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--text-muted)" /> {loc.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="var(--text-muted)" /> {loc.email}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>{loc.staffCount} Staff Allocated</span>
              <span style={{ color: 'var(--success)' }}>Schedule Synchronized</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Add Location</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Location Name</label>
                <input type="text" required className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Upper East Side Studio" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Address</label>
                <input type="text" required className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full street address..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>IANA Timezone</label>
                <select className="input-field" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  <option value="America/New_York">America/New_York (EDT/EST)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PDT/PST)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
