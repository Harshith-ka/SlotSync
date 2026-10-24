'use client';

import React, { useState } from 'react';
import {
  Code2,
  Key,
  Webhook,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
}

interface WebhookItem {
  id: string;
  url: string;
  events: string[];
  signingSecret: string;
}

export default function DevelopersPage() {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    {
      id: 'key_1',
      name: 'Production Website Integration',
      prefix: 'sk_live_9fa817...',
      createdAt: '2026-10-24',
    },
  ]);

  const [webhooks, setWebhooks] = useState<WebhookItem[]>([
    {
      id: 'wh_1',
      url: 'https://api.urbansalon.com/webhooks/slotsync',
      events: ['booking.confirmed', 'booking.cancelled'],
      signingSecret: 'whsec_98124fa8e9b01c382947b',
    },
  ]);

  const [newKeySecret, setNewKeySecret] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const handleGenerateKey = () => {
    const rawSecret = `sk_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    setNewKeySecret(rawSecret);
    setApiKeys([
      {
        id: `key_${Date.now()}`,
        name: 'New Platform Key',
        prefix: `${rawSecret.substring(0, 14)}...`,
        createdAt: 'Just now',
      },
      ...apiKeys,
    ]);
  };

  const embedScriptCode = `<script 
  src="https://slotsync.io/widget.js" 
  data-slotsync-slug="urban-salon" 
  async>
</script>`;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Developer Platform & Integrations</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          REST API keys, HMAC SHA-256 signed webhooks, and embeddable booking widgets.
        </p>
      </div>

      {/* Embeddable Widget Snippet Generator */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px', border: '1px solid var(--border-focus)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Code2 size={22} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Embeddable Booking Widget (1-Line Integration)</h2>
          </div>
          <a href="/embed/urban-salon" target="_blank" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            Preview Embed <ExternalLink size={14} />
          </a>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Paste this snippet into Webflow, Shopify, WordPress, or your custom static HTML to inject a high-converting
          branded SlotSync booking button.
        </p>

        <div
          style={{
            background: 'rgba(10, 12, 16, 0.95)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.875rem',
            color: '#c084fc',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <pre style={{ margin: 0, overflowX: 'auto' }}>{embedScriptCode}</pre>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(embedScriptCode);
              setCopiedEmbed(true);
              setTimeout(() => setCopiedEmbed(false), 2000);
            }}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
          >
            {copiedEmbed ? <Check size={14} color="var(--success)" /> : <Copy size={14} />} Copy Snippet
          </button>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={22} color="var(--warning)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>API Keys</h2>
          </div>

          <button onClick={handleGenerateKey} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <Plus size={16} /> Generate New Key
          </button>
        </div>

        {newKeySecret && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--success)', marginBottom: '4px' }}>
              Your New API Key (Save it securely now, it will not be displayed again):
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              <input readOnly value={newKeySecret} className="input-field" style={{ fontFamily: 'var(--font-mono)' }} />
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(newKeySecret);
                  setCopiedKey(true);
                  setTimeout(() => setCopiedKey(false), 2000);
                }}
                className="btn-primary"
                style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}
              >
                {copiedKey ? 'Copied!' : 'Copy Key'}
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {apiKeys.map((k) => (
            <div
              key={k.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{k.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {k.prefix} · Created {k.createdAt}
                </div>
              </div>

              <button
                onClick={() => setApiKeys(apiKeys.filter((item) => item.id !== k.id))}
                className="btn-secondary"
                style={{ padding: '6px 10px', color: 'var(--danger)' }}
              >
                <Trash2 size={14} /> Revoke
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Webhook size={22} color="var(--info)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Signed Webhooks (HMAC SHA-256)</h2>
          </div>

          <button onClick={() => alert('Add webhook modal')} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <Plus size={16} /> Add Endpoint
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {webhooks.map((w) => (
            <div
              key={w.id}
              style={{
                padding: '16px 20px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.95rem' }}>{w.url}</div>
                <span className="badge badge-confirmed" style={{ fontSize: '0.65rem' }}>
                  Delivering
                </span>
              </div>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                {w.events.map((evt) => (
                  <span
                    key={evt}
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {evt}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Signing Secret: <code style={{ color: 'var(--accent-primary)' }}>{w.signingSecret}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
