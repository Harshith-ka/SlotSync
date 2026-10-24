'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Sparkles,
  MapPin,
  CalendarCheck2,
  DollarSign,
  ArrowLeft,
  Timer,
  Lock,
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  bufferMinutes: number;
  priceMinor: number;
  currency: string;
}

interface StaffItem {
  id: string;
  name: string;
  role: string;
}

const SAMPLE_SERVICES: ServiceItem[] = [
  {
    id: 'svc_haircut',
    name: 'Signature Haircut & Styling',
    description: 'Precision scissor cut, botanical scalp detox shampoo, and signature blowout finish.',
    durationMinutes: 45,
    bufferMinutes: 15,
    priceMinor: 7500,
    currency: 'USD',
  },
  {
    id: 'svc_balayage',
    name: 'Artisan Balayage & Gloss',
    description: 'Hand-painted multidimensional blonde highlights with custom conditioning gloss glaze.',
    durationMinutes: 120,
    bufferMinutes: 25,
    priceMinor: 22000,
    currency: 'USD',
  },
  {
    id: 'svc_beard',
    name: 'Beard Sculpting & Hot Towel',
    description: 'Traditional straight-razor detailing, steam towel infused with essential oils, and beard butter.',
    durationMinutes: 30,
    bufferMinutes: 10,
    priceMinor: 4000,
    currency: 'USD',
  },
];

const SAMPLE_STAFF: StaffItem[] = [
  { id: 'any', name: 'Any Available Professional', role: 'Fastest availability' },
  { id: 'staff_elena', name: 'Elena Rostova', role: 'Master Colorist & Editorial Stylist' },
  { id: 'staff_marcus', name: 'Marcus Thorne', role: 'Barber & Fade Specialist' },
];

const SAMPLE_DATES = [
  { date: '2026-10-26', label: 'Mon, Oct 26' },
  { date: '2026-10-27', label: 'Tue, Oct 27' },
  { date: '2026-10-28', label: 'Wed, Oct 28' },
  { date: '2026-10-29', label: 'Thu, Oct 29' },
  { date: '2026-10-30', label: 'Fri, Oct 30' },
  { date: '2026-10-31', label: 'Sat, Oct 31' },
];

const GENERATED_SLOTS = [
  '09:00 AM',
  '09:45 AM',
  '10:30 AM',
  '11:15 AM',
  '01:00 PM',
  '02:00 PM',
  '02:45 PM',
  '03:30 PM',
  '04:15 PM',
  '05:00 PM',
];

export default function CustomerBookingPortal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [resolvedSlug, setResolvedSlug] = useState('urban-salon');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Booking State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(SAMPLE_SERVICES[0]);
  const [selectedStaff, setSelectedStaff] = useState<StaffItem>(SAMPLE_STAFF[0]);
  const [selectedDate, setSelectedDate] = useState<string>(SAMPLE_DATES[0].date);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Customer Form State
  const [customerName, setCustomerName] = useState('Sophia Rodriguez');
  const [customerEmail, setCustomerEmail] = useState('sophia.r@example.com');
  const [customerPhone, setCustomerPhone] = useState('+1 (212) 555-8941');
  const [customerNotes, setCustomerNotes] = useState('Prefer quiet appointment, scalp sensitive.');

  // Hold Countdown (5 mins = 300 seconds)
  const [holdSecondsLeft, setHoldSecondsLeft] = useState(300);
  const [bookingConfirmedId, setBookingConfirmedId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => {
      if (p.slug) setResolvedSlug(p.slug);
    });
  }, [params]);

  // Hold Timer Effect
  useEffect(() => {
    if (currentStep === 3 && holdSecondsLeft > 0) {
      const interval = setInterval(() => {
        setHoldSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStep, holdSecondsLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
    setHoldSecondsLeft(300); // 5 minute hold started
    setCurrentStep(3);
  };

  const handleConfirmBooking = () => {
    const newBookingId = `bk_${Math.random().toString(36).substring(2, 9)}`;
    setBookingConfirmedId(newBookingId);
    setCurrentStep(4);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Banner */}
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          padding: '16px 24px',
          background: 'rgba(10, 12, 16, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Urban Salon & Spa</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} /> Downtown SoHo Flagship · America/New_York (EDT)
            </p>
          </div>
        </div>

        <Link href="/" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
          Back to Overview
        </Link>
      </header>

      {/* Main Booking Container */}
      <main style={{ flex: 1, maxWidth: '960px', margin: '32px auto', width: '100%', padding: '0 20px' }}>
        {/* Progress Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            background: 'var(--bg-card)',
            padding: '16px 24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {[
            { step: 1, title: '1. Select Service' },
            { step: 2, title: '2. Date & Time' },
            { step: 3, title: '3. Hold & Details' },
            { step: 4, title: '4. Confirmed' },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: currentStep >= item.step ? 700 : 500,
                color: currentStep >= item.step ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '0.9rem',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background:
                    currentStep > item.step
                      ? 'var(--success)'
                      : currentStep === item.step
                      ? 'var(--accent-primary)'
                      : 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  color: '#fff',
                }}
              >
                {currentStep > item.step ? <CheckCircle size={16} /> : item.step}
              </div>
              <span className="step-title">{item.title}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: SERVICE SELECTION */}
        {currentStep === 1 && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>Select a Service</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                All services include consultation, setup, and cleanup buffers.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {SAMPLE_SERVICES.map((service) => {
                const isSelected = selectedService?.id === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className="glass-panel"
                    style={{
                      padding: '24px',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-card)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '20px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{service.name}</h3>
                        <span className="badge badge-confirmed" style={{ fontSize: '0.7rem' }}>
                          Available
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>
                        {service.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={15} color="var(--accent-primary)" /> {service.durationMinutes} mins service
                        </span>
                        <span>·</span>
                        <span>+{service.bufferMinutes}m buffer occupancy</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '110px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        ${(service.priceMinor / 100).toFixed(2)}
                      </div>
                      <button
                        className={isSelected ? 'btn-primary' : 'btn-secondary'}
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        {isSelected ? 'Selected' : 'Choose'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                disabled={!selectedService}
                onClick={() => setCurrentStep(2)}
                className="btn-primary"
                style={{ padding: '12px 28px', fontSize: '1rem' }}
              >
                Proceed to Date & Time <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DATE & TIME */}
        {currentStep === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button onClick={() => setCurrentStep(1)} className="btn-secondary" style={{ padding: '8px 12px' }}>
                <ArrowLeft size={16} /> Back
              </button>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Choose Staff & Appointment Slot</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {selectedService?.name} · {selectedService?.durationMinutes} min service
                </p>
              </div>
            </div>

            {/* Staff Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Select Specialist
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {SAMPLE_STAFF.map((staff) => {
                  const isSelected = selectedStaff.id === staff.id;
                  return (
                    <div
                      key={staff.id}
                      onClick={() => setSelectedStaff(staff)}
                      className="glass-panel"
                      style={{
                        padding: '14px 18px',
                        cursor: 'pointer',
                        border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{staff.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{staff.role}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date Selector */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Available Dates (October 2026)
              </label>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
                {SAMPLE_DATES.map((d) => {
                  const isSelected = selectedDate === d.date;
                  return (
                    <button
                      key={d.date}
                      onClick={() => setSelectedDate(d.date)}
                      className="glass-panel"
                      style={{
                        padding: '12px 20px',
                        cursor: 'pointer',
                        border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'var(--accent-gradient)' : 'var(--bg-card)',
                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot Matrix */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Conflict-Safe Open Slots ({selectedDate})
                </label>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Times in America/New_York (EDT)</span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '12px',
                }}
              >
                {GENERATED_SLOTS.map((slot, index) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => handleSelectSlot(slot)}
                      className="glass-panel"
                      style={{
                        padding: '14px 10px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'var(--accent-gradient)' : 'var(--bg-card)',
                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                      }}
                    >
                      {slot}
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.7rem',
                          color: isSelected ? '#ffffff' : 'var(--success)',
                          marginTop: '4px',
                          fontWeight: 500,
                        }}
                      >
                        {index === 2 ? '⚡ Popular' : 'Available'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DETAILS & 5-MIN TEMPORARY HOLD */}
        {currentStep === 3 && (
          <div>
            {/* Live Hold Alert Banner */}
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Timer size={24} color="var(--warning)" className="pulse-glow" />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--warning)', fontSize: '0.95rem' }}>
                    Temporary Reservation Hold Active
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    This slot is reserved exclusively for you. Complete your details before the hold expires.
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: holdSecondsLeft < 60 ? 'var(--danger)' : 'var(--warning)',
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {formatTimer(holdSecondsLeft)}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px' }}>
              {/* Customer Contact Form */}
              <div className="glass-panel" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Your Contact Details</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Email Address (for confirmation & calendar sync)
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Mobile Phone Number
                    </label>
                    <input
                      type="tel"
                      className="input-field"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Special Notes or Hair History
                    </label>
                    <textarea
                      className="input-field"
                      rows={3}
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="Any notes for your stylist..."
                    />
                  </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                  <button onClick={() => setCurrentStep(2)} className="btn-secondary" style={{ flex: 1 }}>
                    Change Time
                  </button>
                  <button onClick={handleConfirmBooking} className="btn-primary" style={{ flex: 2 }}>
                    <Lock size={16} /> Confirm & Reserve Appointment
                  </button>
                </div>
              </div>

              {/* Booking Summary Card */}
              <div className="glass-panel" style={{ padding: '28px', height: 'fit-content' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Booking Summary</h3>

                <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SERVICE</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>{selectedService?.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {selectedService?.durationMinutes} minutes duration
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DATE & TIME</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>
                    {selectedDate} at {selectedSlot}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Specialist: {selectedStaff.name}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Total Amount</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    ${((selectedService?.priceMinor || 0) / 100).toFixed(2)}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="var(--success)" />
                  <span>Free cancellation up to 24h prior to appointment.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMED */}
        {currentStep === 4 && (
          <div className="glass-panel" style={{ padding: '48px 32px', textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--success-bg)',
                border: '2px solid var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle size={36} color="var(--success)" />
            </div>

            <span className="badge badge-confirmed" style={{ marginBottom: '12px' }}>
              CONFIRMED ALLOCATION
            </span>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
              Your Appointment is Locked In!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
              A confirmation email and calendar invitation have been dispatched to <strong>{customerEmail}</strong>.
            </p>

            <div
              style={{
                background: 'rgba(10, 12, 16, 0.8)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                textAlign: 'left',
                border: '1px solid var(--border-subtle)',
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Booking Reference:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {bookingConfirmedId}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Service:</span>
                <span style={{ fontWeight: 600 }}>{selectedService?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Appointment Time:</span>
                <span style={{ fontWeight: 600 }}>{selectedDate} at {selectedSlot}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Stylist:</span>
                <span style={{ fontWeight: 600 }}>{selectedStaff.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Location:</span>
                <span style={{ fontWeight: 600 }}>452 Broadway, SoHo, NY</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => alert('Calendar invite (.ics) downloaded!')}
                className="btn-primary"
              >
                <CalendarCheck2 size={16} /> Add to Google / Apple Calendar
              </button>
              <Link href="/dashboard" className="btn-secondary">
                View in Business Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
