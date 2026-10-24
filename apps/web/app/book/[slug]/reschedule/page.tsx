'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';

export default function ReschedulePage() {
  const [currentSlot] = useState('Monday, Oct 26 at 10:00 AM');
  const [stylist] = useState('Elena Rostova');
  const [service] = useState('Signature Haircut & Styling');

  const [newDate, setNewDate] = useState('2026-10-28');
  const [newSlot, setNewSlot] = useState('02:00 PM');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReschedule = () => {
    setIsSuccess(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link href="/book/urban-salon" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '12px' }}>
            <ChevronLeft size={16} /> Back to Booking Page
          </Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Reschedule Your Appointment</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Urban Salon & Spa · Downtown SoHo Flagship
          </p>
        </div>

        {/* Existing Appointment Card */}
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', borderLeft: '4px solid var(--accent-primary)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>CURRENT APPOINTMENT</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>{service}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {currentSlot} with {stylist}
          </div>
        </div>

        {!isSuccess ? (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Select New Date & Slot</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                New Date
              </label>
              <select className="input-field" value={newDate} onChange={(e) => setNewDate(e.target.value)}>
                <option value="2026-10-27">Tuesday, Oct 27, 2026</option>
                <option value="2026-10-28">Wednesday, Oct 28, 2026</option>
                <option value="2026-10-29">Thursday, Oct 29, 2026</option>
                <option value="2026-10-30">Friday, Oct 30, 2026</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Available Conflict-Safe Slots
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {['11:00 AM', '01:30 PM', '02:00 PM', '03:15 PM', '04:30 PM', '05:00 PM'].map((slot) => {
                  const isSelected = newSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setNewSlot(slot)}
                      style={{
                        padding: '12px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'var(--accent-gradient)' : 'rgba(0, 0, 0, 0.4)',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ padding: '12px 16px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '24px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="var(--success)" />
              <span>
                <strong>Zero-Risk Guarantee:</strong> The new slot is transactionally verified before releasing your
                current reservation. If the new slot fails, your original booking remains completely intact.
              </span>
            </div>

            <button onClick={handleReschedule} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
              Confirm Reschedule to {newSlot} <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '36px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--success-bg)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle size={32} color="var(--success)" />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
              Appointment Successfully Rescheduled!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px' }}>
              Your new time is confirmed for <strong>{newDate} at {newSlot}</strong> with {stylist}.
            </p>

            <Link href="/book/urban-salon" className="btn-primary">
              Return to Booking Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
