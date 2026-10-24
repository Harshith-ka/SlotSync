'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  Users,
  Compass,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(10, 12, 16, 0.8)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
            }}
          >
            <Calendar size={20} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Slot<span style={{ color: 'var(--accent-primary)' }}>Sync</span>
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--accent-primary)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            V1.0 ENTERPRISE
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link
            href="/book/urban-salon"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.925rem',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
          >
            Customer Booking Portal
          </Link>
          <Link
            href="/dashboard"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.925rem',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
          >
            Business Dashboard
          </Link>
          <Link href="/book/urban-salon" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
            Book Appointment <ArrowRight size={16} />
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '64px 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 56px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
            }}
          >
            <Sparkles size={16} color="var(--accent-primary)" />
            <span>Multi-Tenant Booking & Scheduling Infrastructure SaaS</span>
          </div>

          <h1
            style={{
              fontSize: '3.5rem',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '24px',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Zero double-booking scheduling engine for modern businesses.
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '36px' }}>
            Coordinate staff, resources, buffers, and time zones with database-enforced exclusion guarantees,
            real-time 5-minute reservation holds, and branded customer booking experiences.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/book/urban-salon" className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              <Compass size={18} /> Open Live Booking Demo
            </Link>
            <Link href="/dashboard" className="btn-secondary" style={{ padding: '14px 24px', fontSize: '1rem' }}>
              <Layers size={18} /> Business Operational Dashboard
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '64px',
          }}
        >
          {/* Card 1 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid rgba(99, 102, 241, 0.25)',
              }}
            >
              <ShieldCheck size={24} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
              Database Exclusion Guarantees
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Protected by PostgreSQL <code style={{ color: '#c084fc' }}>btree_gist</code> exclusion constraints and
              lexicographically ordered advisory locks. Zero overlapping confirmed allocations across staff or physical
              rooms.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid rgba(245, 158, 11, 0.25)',
              }}
            >
              <Clock size={24} color="var(--warning)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
              Atomic 5-Minute Holds
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Temporary reservation holds prevent competing checkouts during payment. Backed by database-clock authority
              so delayed workers never block availability.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              <Zap size={24} color="var(--success)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
              Timezone & Buffer Precision
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Service duration + setup buffer + cleanup buffer occupancy model. Handles IANA business zones, customer
              conversions, and Daylight Saving transitions.
            </p>
          </div>
        </div>

        {/* Live Architecture Visualizer */}
        <div className="glass-panel" style={{ padding: '36px', border: '1px solid var(--border-focus)' }}>
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
              <span className="badge badge-confirmed" style={{ marginBottom: '8px' }}>
                Operational Engine Invariant
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Occupancy Range vs Appointment Time</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--success)" /> Staff Occupancy Protected
              </span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(10, 12, 16, 0.9)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>10:00 AM (Buffer Before: 10m)</span>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Active Service: 10:10 AM - 10:55 AM (45 min)</span>
              <span>11:10 AM (Buffer After: 15m)</span>
            </div>

            {/* Time Bar */}
            <div style={{ height: '32px', display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div
                style={{
                  width: '15%',
                  background: 'rgba(245, 158, 11, 0.25)',
                  borderRight: '1px dashed var(--warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  color: 'var(--warning)',
                  fontWeight: 600,
                }}
              >
                Setup 10m
              </div>
              <div
                style={{
                  width: '65%',
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  color: '#ffffff',
                  fontWeight: 700,
                }}
              >
                Customer Service (Haircut & Styling)
              </div>
              <div
                style={{
                  width: '20%',
                  background: 'rgba(239, 68, 68, 0.25)',
                  borderLeft: '1px dashed var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  color: 'var(--danger)',
                  fontWeight: 600,
                }}
              >
                Cleanup 15m
              </div>
            </div>

            <p style={{ marginTop: '16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Total exclusive staff allocation: <strong>70 minutes</strong>. Competing reservations in this window are
              immediately blocked by the availability calculation and locked by PostgreSQL exclusion constraints.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '24px 32px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
        }}
      >
        SlotSync Scheduling Engine · Production Monorepo Architecture · NestJS & Next.js 15
      </footer>
    </div>
  );
}
