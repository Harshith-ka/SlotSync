'use client';

import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Analytics & Financial Intelligence</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Real-time metrics, capacity utilization, conversion funnel, and revenue reconciliation.
        </p>
      </div>

      {/* Financials Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
            GROSS BOOKINGS (30 DAYS)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>$14,200.00</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> +18.4% vs last period
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
            NET COLLECTED REVENUE
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>$13,850.00</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Direct Stripe deposits
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
            REFUNDS & CANCELLATIONS
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>$350.00</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            2 customer-initiated refunds
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
            COMPLETION RATE
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>91.2%</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Target hypothesis: 60%+
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Popular Services Table */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Popular Services</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                <th style={{ padding: '10px 0' }}>SERVICE</th>
                <th style={{ padding: '10px 0' }}>BOOKINGS</th>
                <th style={{ padding: '10px 0', textAlign: 'right' }}>REVENUE</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '14px 0', fontWeight: 600 }}>Signature Haircut & Styling</td>
                <td style={{ padding: '14px 0', color: 'var(--text-secondary)' }}>88 appointments</td>
                <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 700 }}>$6,600.00</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '14px 0', fontWeight: 600 }}>Artisan Balayage & Gloss</td>
                <td style={{ padding: '14px 0', color: 'var(--text-secondary)' }}>28 appointments</td>
                <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 700 }}>$6,160.00</td>
              </tr>
              <tr>
                <td style={{ padding: '14px 0', fontWeight: 600 }}>Beard Sculpting & Hot Towel</td>
                <td style={{ padding: '14px 0', color: 'var(--text-secondary)' }}>36 appointments</td>
                <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 700 }}>$1,440.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Staff Utilization Progress */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Staff Utilization</h2>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
              <span style={{ fontWeight: 600 }}>Elena Rostova (Master Colorist)</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>88%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '88%', height: '100%', background: 'var(--accent-gradient)' }} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
              <span style={{ fontWeight: 600 }}>Marcus Thorne (Precision Barber)</span>
              <span style={{ fontWeight: 700, color: 'var(--success)' }}>79%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '79%', height: '100%', background: 'var(--success)' }} />
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '14px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>Optimal Roster Balance</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Both stylists operate between 75% and 88% capacity, leaving healthy buffer intervals and minimizing customer delays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
