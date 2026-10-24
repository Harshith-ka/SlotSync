'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Palmtree,
  Sparkles,
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  location: string;
  weeklyHoursSummary: string;
  exceptionsCount: number;
  status: 'ACTIVE' | 'ON_VACATION';
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff_elena',
    name: 'Elena Rostova',
    role: 'Master Colorist & Editorial Stylist',
    location: 'Downtown Manhattan Flagship',
    weeklyHoursSummary: 'Mon–Fri 09:00–18:00 (Break: 13:00–14:00), Sat 10:00–16:00',
    exceptionsCount: 1,
    status: 'ACTIVE',
  },
  {
    id: 'staff_marcus',
    name: 'Marcus Thorne',
    role: 'Barber & Fade Specialist',
    location: 'Downtown Manhattan Flagship',
    weeklyHoursSummary: 'Mon–Fri 09:00–18:00 (Break: 13:00–14:00), Sat 10:00–16:00',
    exceptionsCount: 0,
    status: 'ACTIVE',
  },
];

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function StaffPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember>(INITIAL_STAFF[0]);
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [exceptionDate, setExceptionDate] = useState('2026-11-15');
  const [exceptionReason, setExceptionReason] = useState('Paris Fashion Week styling masterclass');

  const handleAddException = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Time-off recorded for ${selectedStaff.name} on ${exceptionDate}: ${exceptionReason}`);
    setIsExceptionModalOpen(false);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Staff & Availability Schedules</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage service providers, weekly working hours, break intervals, and vacation overrides.
          </p>
        </div>

        <button onClick={() => alert('Invite staff modal')} className="btn-primary">
          <Plus size={16} /> Invite Team Member
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Staff List Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {staffList.map((member) => {
            const isSelected = selectedStaff.id === member.id;
            return (
              <div
                key={member.id}
                onClick={() => setSelectedStaff(member)}
                className="glass-panel"
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{member.name}</div>
                  <span className="badge badge-confirmed" style={{ fontSize: '0.7rem' }}>
                    Active
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {member.role}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Location: {member.location}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Staff Schedule Detail */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <span className="badge badge-confirmed" style={{ marginBottom: '8px' }}>
                Assigned Specialist
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedStaff.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{selectedStaff.role}</p>
            </div>

            <button onClick={() => setIsExceptionModalOpen(true)} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <Palmtree size={16} color="var(--warning)" /> Add Vacation / Time Off
            </button>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-secondary)' }}>
            Weekly Shift Grid (Local Time · EDT)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
            {[
              { day: 'Monday', hours: '09:00 – 18:00', breakTime: '13:00 – 14:00 (Lunch)', active: true },
              { day: 'Tuesday', hours: '09:00 – 18:00', breakTime: '13:00 – 14:00 (Lunch)', active: true },
              { day: 'Wednesday', hours: '09:00 – 18:00', breakTime: '13:00 – 14:00 (Lunch)', active: true },
              { day: 'Thursday', hours: '09:00 – 18:00', breakTime: '13:00 – 14:00 (Lunch)', active: true },
              { day: 'Friday', hours: '09:00 – 18:00', breakTime: '13:00 – 14:00 (Lunch)', active: true },
              { day: 'Saturday', hours: '10:00 – 16:00', breakTime: 'None', active: true },
              { day: 'Sunday', hours: 'Off Duty', breakTime: '—', active: false },
            ].map((shift) => (
              <div
                key={shift.day}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: shift.active ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontWeight: 600, width: '110px' }}>{shift.day}</div>
                <div style={{ color: shift.active ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  {shift.hours}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  Break: {shift.breakTime}
                </div>
                <span className={shift.active ? 'badge badge-confirmed' : 'badge'} style={{ fontSize: '0.65rem' }}>
                  {shift.active ? 'Working' : 'Off'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exception Modal */}
      {isExceptionModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
              Add Time-Off Exception for {selectedStaff.name}
            </h2>

            <form onSubmit={handleAddException} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Exception Date</label>
                <input type="date" required className="input-field" value={exceptionDate} onChange={(e) => setExceptionDate(e.target.value)} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Reason</label>
                <input type="text" required className="input-field" value={exceptionReason} onChange={(e) => setExceptionReason(e.target.value)} />
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Per PRD Journey D: Future bookable slots will be removed immediately. Existing confirmed bookings will
                flag reassignment alerts.
              </p>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsExceptionModalOpen(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Confirm Time-Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
