'use client';

import React, { useState } from 'react';
import {
  Scissors,
  Plus,
  Clock,
  DollarSign,
  ShieldAlert,
  Sparkles,
  Check,
  Edit2,
  Trash2,
  ShieldCheck,
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  priceMinor: number;
  currency: string;
  isPublic: boolean;
  assignedStaffCount: number;
}

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'svc_1',
    name: 'Signature Haircut & Styling',
    description: 'Precision scissor cut, botanical scalp detox shampoo, and signature blowout finish.',
    durationMinutes: 45,
    bufferBeforeMinutes: 5,
    bufferAfterMinutes: 10,
    priceMinor: 7500,
    currency: 'USD',
    isPublic: true,
    assignedStaffCount: 2,
  },
  {
    id: 'svc_2',
    name: 'Artisan Balayage & Gloss',
    description: 'Hand-painted multidimensional blonde highlights with custom conditioning gloss glaze.',
    durationMinutes: 120,
    bufferBeforeMinutes: 10,
    bufferAfterMinutes: 15,
    priceMinor: 22000,
    currency: 'USD',
    isPublic: true,
    assignedStaffCount: 1,
  },
  {
    id: 'svc_3',
    name: 'Beard Sculpting & Hot Towel Treatment',
    description: 'Traditional straight-razor detailing, steam towel infused with essential oils, and beard butter.',
    durationMinutes: 30,
    bufferBeforeMinutes: 5,
    bufferAfterMinutes: 5,
    priceMinor: 4000,
    currency: 'USD',
    isPublic: true,
    assignedStaffCount: 1,
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Service Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [bufferBeforeMinutes, setBufferBeforeMinutes] = useState(5);
  const [bufferAfterMinutes, setBufferAfterMinutes] = useState(10);
  const [priceDollars, setPriceDollars] = useState(85);

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newService: ServiceItem = {
      id: `svc_${Date.now()}`,
      name,
      description,
      durationMinutes: Number(durationMinutes),
      bufferBeforeMinutes: Number(bufferBeforeMinutes),
      bufferAfterMinutes: Number(bufferAfterMinutes),
      priceMinor: Math.round(Number(priceDollars) * 100),
      currency: 'USD',
      isPublic: true,
      assignedStaffCount: 2,
    };

    setServices([newService, ...services]);
    setIsModalOpen(false);
    setName('');
    setDescription('');
  };

  const handleDelete = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Service Catalog</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Configure services, setup/cleanup buffers, staff eligibility, and pricing.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Create New Service
        </button>
      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {services.map((service) => {
          const totalOccupancy = service.durationMinutes + service.bufferBeforeMinutes + service.bufferAfterMinutes;
          return (
            <div key={service.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{service.name}</h3>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                    ${(service.priceMinor / 100).toFixed(2)}
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px', lineHeight: 1.5 }}>
                  {service.description}
                </p>

                {/* Buffer Visualization Card */}
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-sm)', padding: '12px', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>Setup: {service.bufferBeforeMinutes}m</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Active: {service.durationMinutes}m</span>
                    <span>Cleanup: {service.bufferAfterMinutes}m</span>
                  </div>

                  <div style={{ height: '8px', display: 'flex', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(service.bufferBeforeMinutes / totalOccupancy) * 100}%`, background: 'var(--warning)' }} />
                    <div style={{ width: `${(service.durationMinutes / totalOccupancy) * 100}%`, background: 'var(--accent-primary)' }} />
                    <div style={{ width: `${(service.bufferAfterMinutes / totalOccupancy) * 100}%`, background: 'var(--danger)' }} />
                  </div>

                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    Total Occupancy: <strong>{totalOccupancy} minutes</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-confirmed" style={{ fontSize: '0.7rem' }}>
                  {service.assignedStaffCount} Staff Assigned
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleDelete(service.id)} className="btn-secondary" style={{ padding: '6px 10px', color: 'var(--danger)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Service Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Create Service</h2>

            <form onSubmit={handleCreateService} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Service Name</label>
                <input type="text" required className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Deluxe Scalp Treatment" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Description</label>
                <textarea rows={2} className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explain service features..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Service Duration (mins)</label>
                  <input type="number" required min={5} className="input-field" value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Price (USD)</label>
                  <input type="number" required min={0} className="input-field" value={priceDollars} onChange={(e) => setPriceDollars(Number(e.target.value))} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Buffer Before (mins)</label>
                  <input type="number" min={0} className="input-field" value={bufferBeforeMinutes} onChange={(e) => setBufferBeforeMinutes(Number(e.target.value))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Buffer After (mins)</label>
                  <input type="number" min={0} className="input-field" value={bufferAfterMinutes} onChange={(e) => setBufferAfterMinutes(Number(e.target.value))} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
