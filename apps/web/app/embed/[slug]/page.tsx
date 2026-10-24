'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Timer,
} from 'lucide-react';

export default function EmbedBookingWidget({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState('urban-salon');
  const [selectedService, setSelectedService] = useState('Signature Haircut & Styling');
  const [selectedSlot, setSelectedSlot] = useState<string | null>('10:30 AM');
  const [step, setStep] = useState<1 | 2>(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    params.then((p) => {
      if (p.slug) setSlug(p.slug);
    });
  }, [params]);

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '20px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--accent-primary)" />
          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Book with Urban Salon</span>
        </div>
        <span className="badge badge-confirmed" style={{ fontSize: '0.65rem' }}>
          Verified Available
        </span>
      </div>

      {step === 1 ? (
        <div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Service
            </label>
            <select
              className="input-field"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              style={{ fontSize: '0.9rem' }}
            >
              <option value="Signature Haircut & Styling">Signature Haircut & Styling ($75 · 45 min)</option>
              <option value="Artisan Balayage & Gloss">Artisan Balayage & Gloss ($220 · 120 min)</option>
              <option value="Beard Sculpting & Hot Towel">Beard Sculpting & Hot Towel ($40 · 30 min)</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Select Open Slot (Monday, Oct 26)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {['09:00 AM', '10:30 AM', '11:15 AM', '02:00 PM', '03:30 PM', '04:15 PM'].map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--accent-gradient)' : 'rgba(0, 0, 0, 0.4)',
                      border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      color: isSelected ? '#ffffff' : 'var(--text-primary)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
          >
            Reserve Slot & Continue <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: '14px', fontSize: '0.8rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Timer size={16} /> Hold active for 5:00 on {selectedSlot}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Your full name"
              className="input-field"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email for confirmation"
              className="input-field"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1 }}>
              Back
            </button>
            <button
              type="button"
              onClick={() => alert('Appointment confirmed via embedded widget!')}
              className="btn-primary"
              style={{ flex: 2 }}
            >
              Complete Reservation
            </button>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        Powered by <strong style={{ color: 'var(--text-secondary)' }}>SlotSync Engine</strong>
      </div>
    </div>
  );
}
