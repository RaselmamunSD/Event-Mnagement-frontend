'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { EventItem, EventRegistration } from '../lib/types';
import { api } from '../lib/api';
import { X, CheckCircle, Ticket, AlertCircle, Copy, Check } from 'lucide-react';

interface RegistrationModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RegistrationModal({
  event,
  isOpen,
  onClose,
  onSuccess,
}: RegistrationModalProps) {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    member_id: '',
    organization: '',
    address: '',
    additional_info: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedRegistration, setConfirmedRegistration] = useState<EventRegistration | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const reg = await api.registrations.create({
        event: event.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        member_id: formData.member_id || undefined,
        organization: formData.organization || undefined,
        address: formData.address || undefined,
        additional_info: formData.additional_info || undefined,
      });

      setConfirmedRegistration(reg);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check inputs and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicket = () => {
    if (confirmedRegistration?.ticket_number) {
      navigator.clipboard.writeText(confirmedRegistration.ticket_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setConfirmedRegistration(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl p-0.5 shadow-xs flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                {event.category.toUpperCase()}
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[300px]">
                {confirmedRegistration ? t('reg_success_title') : event.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {confirmedRegistration ? (
            <div className="text-center py-4 space-y-5">
              <div className="w-20 h-20 bg-white rounded-3xl p-1.5 shadow-lg border border-emerald-500/20 flex items-center justify-center mx-auto">
                <img
                  src="/logo.png"
                  alt="Shahjahanpur Railway Open Scout Group Logo"
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t('reg_success_title')}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {t('reg_success_desc')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-left">
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  {t('reg_success_ticket')}
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xl font-mono font-bold text-emerald-900 dark:text-emerald-200">
                    {confirmedRegistration.ticket_number}
                  </span>
                  <button
                    type="button"
                    onClick={copyTicket}
                    className="p-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200/50 dark:hover:bg-emerald-900/60 rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 space-y-1 border-t border-emerald-500/20 pt-2">
                  <p><strong>Name:</strong> {confirmedRegistration.name}</p>
                  <p><strong>Event:</strong> {event.title}</p>
                  <p><strong>Date & Time:</strong> {event.date} at {event.start_time}</p>
                  <p><strong>Venue:</strong> {event.venue}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="whitespace-pre-line">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('form_fullname')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('form_email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('form_phone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="+880 1..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('form_member_id')}
                  </label>
                  <input
                    type="text"
                    value={formData.member_id}
                    onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. MEM-2026-001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('form_org')}
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Organization or institute"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('form_address')}
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="City or district"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('form_additional')}
                </label>
                <textarea
                  rows={2}
                  value={formData.additional_info}
                  onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Any requirements or queries..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  {isSubmitting ? 'Registering...' : t('btn_submit_reg')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
