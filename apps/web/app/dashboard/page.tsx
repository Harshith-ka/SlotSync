'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Plus,
  CheckCircle2,
  MoreVertical,
  Timer,
  Scissors,
  ArrowUpRight,
} from 'lucide-react';

interface BookingRow {
  id: string;
  timeDisplay: string;
  occupancyDisplay: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  staffName: string;
  priceFormatted: string;
  status: 'CONFIRMED' | 'HELD' | 'CHECKED_IN' | 'COMPLETED';
}

const INITIAL_BOOKINGS: BookingRow[] = [
  {
    id: 'bk_9182',
    timeDisplay: '09:00 AM - 09:45 AM',
    occupancyDisplay: '08:55 AM - 09:55 AM (60m)',
    customerName: 'Marcus Bennett',
    customerEmail: 'm.bennett@example.com',
    serviceName: 'Beard Sculpting & Hot Towel',
    staffName: 'Marcus Thorne',
    priceFormatted: '$40.00',
    status: 'COMPLETED',
  },
  {
    id: 'bk_9183',
    timeDisplay: '10:00 AM - 10:45 AM',
    occupancyDisplay: '09:55 AM - 10:55 AM (60m)',
    customerName: 'Sophia Rodriguez',
    customerEmail: 'sophia.r@example.com',
    serviceName: 'Signature Haircut & Styling',
    staffName: 'Elena Rostova',
    priceFormatted: '$75.00',
    status: 'CHECKED_IN',
  },
  {
    id: 'bk_9184',
    timeDisplay: '11:15 AM - 01:15 PM',
    occupancyDisplay: '11:05 AM - 01:30 PM (145m)',
    customerName: 'Claire Beaumont',
    customerEmail: 'claire.b@fashion.org',
    serviceName: 'Artisan Balayage & Gloss',
    staffName: 'Elena Rostova',
    priceFormatted: '$220.00',
    status: 'CONFIRMED',
  },
  {
    id: 'bk_9185',
    timeDisplay: '02:00 PM - 02:45 PM',
    occupancyDisplay: '01:55 PM - 02:55 PM (60m)',
    customerName: 'David Zhang',
    customerEmail: 'dzhang@gmail.com',
    serviceName: 'Signature Haircut & Styling',
    staffName: 'Marcus Thorne',
    priceFormatted: '$75.00',
    status: 'CONFIRMED',
  },
  {
    id: 'hold_9186',
    timeDisplay: '03:30 PM - 04:15 PM',
    occupancyDisplay: '03:25 PM - 04:25 PM (60m)',
    customerName: 'Checkout in progress...',
    customerEmail: 'Holding for customer checkout',
    serviceName: 'Signature Haircut & Styling',
    staffName: 'Elena Rostova',
    priceFormatted: '$75.00',
    status: 'HELD',
  },
];

export default function DashboardOverviewPage() {
  const [bookings, setBookings] = useState<BookingRow[]>(INITIAL_BOOKINGS);

  const handleCheckIn = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'CHECKED_IN' } : b)),
    );
  };

  const handleComplete = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'COMPLETED' } : b)),
    );
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Page Title & Action Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Daily Scheduling & Dispatch
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Live status for Monday, October 26, 2026 · Downtown SoHo Flagship
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => alert('New reservation modal')}>
            <Plus size={16} /> Add Manual Booking
          </button>
          <a href="/book/urban-salon" target="_blank" className="btn-primary">
            Customer Booking Portal <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      {/* Real-Time Temporary Hold Monitor */}
      <div
        style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Timer size={20} color="var(--warning)" className="pulse-glow" />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            <strong>1 Active Hold in Flight:</strong> Customer is currently checking out for Elena Rostova at 03:30 PM
            (Expires in 03:42). Double-booking is locked.
          </span>
        </div>

        <span
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '4px 10px',
            borderRadius: '4px',
            color: 'var(--warning)',
          }}
        >
          POSTGRES ADVISORY LOCK ENGAGED
        </span>
      </div>

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {/* KPI 1 */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>TODAY'S APPOINTMENTS</span>
            <Calendar size={18} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>18 Booked</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> 84% Staff Utilization
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>GROSS BOOKINGS TODAY</span>
            <DollarSign size={18} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>$1,420.00</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across 2 active specialists
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ACTIVE STAFF MEMBERS</span>
            <User size={18} color="var(--info)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>2 On Duty</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Elena Rostova, Marcus Thorne
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>CONFLICT INVARIANT</span>
            <ShieldCheck size={18} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>0 Overlaps</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            100% Database-Enforced
          </div>
        </div>
      </div>

      {/* Today's Schedule Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Today's Dispatch Roster</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Auto-refreshed via WebSockets</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px' }}>TIME & OCCUPANCY</th>
                <th style={{ padding: '12px 16px' }}>CUSTOMER</th>
                <th style={{ padding: '12px 16px' }}>SERVICE</th>
                <th style={{ padding: '12px 16px' }}>SPECIALIST</th>
                <th style={{ padding: '12px 16px' }}>PRICE</th>
                <th style={{ padding: '12px 16px' }}>STATUS</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    fontSize: '0.9rem',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 700 }}>{booking.timeDisplay}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Range: {booking.occupancyDisplay}
                    </div>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 600 }}>{booking.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.customerEmail}</div>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Scissors size={14} color="var(--accent-primary)" />
                      <span>{booking.serviceName}</span>
                    </div>
                  </td>

                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                    {booking.staffName}
                  </td>

                  <td style={{ padding: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {booking.priceFormatted}
                  </td>

                  <td style={{ padding: '16px' }}>
                    {booking.status === 'CONFIRMED' && <span className="badge badge-confirmed">Confirmed</span>}
                    {booking.status === 'HELD' && <span className="badge badge-held">Active Hold</span>}
                    {booking.status === 'CHECKED_IN' && (
                      <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--info)' }}>
                        Checked In
                      </span>
                    )}
                    {booking.status === 'COMPLETED' && (
                      <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
                        Completed
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleCheckIn(booking.id)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        Check In
                      </button>
                    )}
                    {booking.status === 'CHECKED_IN' && (
                      <button
                        onClick={() => handleComplete(booking.id)}
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
