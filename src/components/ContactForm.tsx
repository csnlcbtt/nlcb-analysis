import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://YOUR_PROJECT_ID.supabase.co',
  'YOUR_PUBLIC_ANON_KEY'
);

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    // 1. Store in Supabase
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([form]);

    if (dbError) {
      setStatus('error');
      setError('Failed to save message. Please try again later.');
      return;
    }

    // 2. Call Edge Function for email
    const response = await fetch('/functions/v1/send-contact-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } else {
      setStatus('error');
      setError('Failed to send email. Please try again later.');
    }
  };

  return (
    <form className="max-w-lg mx-auto p-6 bg-card rounded shadow" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block mb-1 font-medium">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 font-medium">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full p-2 border rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="subject" className="block mb-1 font-medium">Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          className="w-full p-2 border rounded"
          value={form.subject}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="message" className="block mb-1 font-medium">Message</label>
        <textarea
          id="message"
          name="message"
          className="w-full p-2 border rounded"
          rows={5}
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>
      {status === 'success' && (
        <div className="mb-4 text-green-600">Thank you for contacting us! We'll get back to you soon.</div>
      )}
      {status === 'error' && (
        <div className="mb-4 text-red-600">{error}</div>
      )}
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
