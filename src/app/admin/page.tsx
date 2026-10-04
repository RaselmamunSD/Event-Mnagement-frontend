'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  DashboardStats,
  EventItem,
  AdmissionApplication,
  EventRegistration,
  Member,
} from '../../lib/types';
import { api } from '../../lib/api';
import {
  Shield,
  Calendar,
  Users,
  FileCheck,
  Ticket,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'admissions' | 'registrations' | 'members'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // New Event Form State
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    short_description: '',
    description: '',
    category: 'tech',
    event_type: 'in_person',
    date: new Date().toISOString().split('T')[0],
    start_time: '10:00:00',
    end_time: '17:00:00',
    venue: '',
    organizer: 'Shahjahanpur Railway Open Scout Group',
    registration_deadline: new Date(Date.now() + 10 * 86400000).toISOString(),
    capacity: 100,
    registration_fee: 0,
    is_featured: false,
    status: 'upcoming',
  });

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [sRes, evRes, admRes, regRes, memRes] = await Promise.allSettled([
        api.stats.getDashboardStats(),
        api.events.getAll({ page_size: 50 }),
        api.admissions.getAllAdmin({ page_size: 50 }),
        api.registrations.getAllAdmin({ page_size: 50 }),
        api.members.getAll({ page_size: 50 }),
      ]);

      if (sRes.status === 'fulfilled') setStats(sRes.value);
      if (evRes.status === 'fulfilled') setEvents(evRes.value.results || []);
      if (admRes.status === 'fulfilled') setAdmissions(admRes.value.results || []);
      if (regRes.status === 'fulfilled') setRegistrations(regRes.value.results || []);
      if (memRes.status === 'fulfilled') setMembers(memRes.value.results || []);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/login');
      return;
    }
    if (user && isAdmin) {
      loadAllAdminData();
    }
  }, [user, isAdmin, isLoading]);

  const handleReviewAdmission = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const note = status === 'approved' ? 'Approved by Admin.' : 'Rejected upon review.';
      const res = await api.admissions.review(id, status, note);
      setActionMsg(`Application #${id} has been ${status}. ${res.member_created ? 'Member profile automatically generated!' : ''}`);
      setTimeout(() => setActionMsg(null), 4000);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to review admission');
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.events.delete(id);
      setActionMsg(`Event #${id} deleted successfully.`);
      setTimeout(() => setActionMsg(null), 3000);
      loadAllAdminData();
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.events.create(newEvent as any);
      setIsCreatingEvent(false);
      setActionMsg('New event created successfully!');
      setTimeout(() => setActionMsg(null), 3000);
      loadAllAdminData();
    } catch (err: any) {
      alert('Error creating event: ' + err.message);
    }
  };

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-slate-500 text-sm">Authenticating admin access...</p>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrative Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Logged in as {user.name} ({user.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadAllAdminData}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <span>Refresh</span>
          </button>
          <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-semibold transition"
          >
            Django Admin Panel &rarr;
          </a>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-t-xl transition cursor-pointer border-b-2 ${
            activeTab === 'overview'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Overview & Metrics
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-t-xl transition cursor-pointer border-b-2 ${
            activeTab === 'events'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Events ({events.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('admissions')}
          className={`px-4 py-2 rounded-t-xl transition cursor-pointer border-b-2 ${
            activeTab === 'admissions'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Admissions ({admissions.filter((a) => a.status === 'pending').length} Pending)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('registrations')}
          className={`px-4 py-2 rounded-t-xl transition cursor-pointer border-b-2 ${
            activeTab === 'registrations'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Registrations ({registrations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 rounded-t-xl transition cursor-pointer border-b-2 ${
            activeTab === 'members'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Members ({members.length})
        </button>
      </div>

      {/* Tab 1: Overview & Metrics */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Members</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {stats?.total_members ?? members.length}
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Events</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {stats?.total_events ?? events.length}
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Upcoming Events</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {stats?.upcoming_events ?? 0}
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Registrations</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {stats?.total_registrations ?? registrations.length}
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pending Admissions</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
                {stats?.pending_admissions ?? 0}
              </p>
            </div>
          </div>

          {/* Quick Action Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Admissions */}
            <div className="p-7 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pending Admission Reviews
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('admissions')}
                  className="text-xs font-semibold text-emerald-600 hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {admissions.slice(0, 4).map((a) => (
                  <div
                    key={a.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{a.full_name}</p>
                      <p className="text-slate-400">{a.email} • {a.membership_type}</p>
                    </div>
                    {a.status === 'pending' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleReviewAdmission(a.id, 'approved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReviewAdmission(a.id, 'rejected')}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 dark:bg-slate-700">
                        {a.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Registrations */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Latest Event Registrations
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('registrations')}
                  className="text-xs font-semibold text-emerald-600 hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {registrations.slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{r.name}</p>
                      <p className="text-slate-400 truncate max-w-[200px]">{r.event_title}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold block">
                        {r.ticket_number}
                      </span>
                      <span className="text-[10px] text-slate-400">{r.registration_date?.slice(0, 10)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Events Management */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Events Catalog & Management
            </h2>
            <button
              type="button"
              onClick={() => setIsCreatingEvent(!isCreatingEvent)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreatingEvent ? 'Close Form' : 'Create New Event'}</span>
            </button>
          </div>

          {/* New Event Creation Modal / Drawer */}
          {isCreatingEvent && (
            <form onSubmit={handleCreateEvent} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                New Event Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                    placeholder="e.g. Bangladesh Artificial Intelligence Summit 2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.short_description}
                    onChange={(e) => setNewEvent({ ...newEvent, short_description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                  >
                    <option value="tech">Technology</option>
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="networking">Networking</option>
                    <option value="cultural">Cultural</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Venue *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                    placeholder="BICC, Dhaka"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({ ...newEvent, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                  placeholder="Detailed breakdown of the event objectives and outcomes..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingEvent(false)}
                  className="px-4 py-2 rounded-xl border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Save & Publish Event
                </button>
              </div>
            </form>
          )}

          {/* Events Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Venue</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                      {evt.title}
                    </td>
                    <td className="p-4 uppercase">{evt.category}</td>
                    <td className="p-4">{evt.date}</td>
                    <td className="p-4 truncate max-w-[150px]">{evt.venue}</td>
                    <td className="p-4">{evt.registered_count} / {evt.capacity}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {evt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Admissions Management */}
      {activeTab === 'admissions' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Membership Admission Applications
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4">App ID</th>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Profession & Org</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {admissions.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-mono font-bold">{adm.application_number}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white">{adm.full_name}</p>
                      <p className="text-slate-400">{adm.email}</p>
                    </td>
                    <td className="p-4 uppercase font-semibold">{adm.membership_type}</td>
                    <td className="p-4">
                      <p>{adm.profession}</p>
                      <p className="text-slate-400">{adm.organization}</p>
                    </td>
                    <td className="p-4">{adm.submitted_at?.slice(0, 10)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          adm.status === 'approved'
                            ? 'bg-emerald-600 text-white'
                            : adm.status === 'rejected'
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {adm.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {adm.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleReviewAdmission(adm.id, 'approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReviewAdmission(adm.id, 'rejected')}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Registrations Management */}
      {activeTab === 'registrations' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            All Event Registrations
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Ticket</th>
                  <th className="p-4">Attendee Name</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Organization</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {reg.ticket_number}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white">{reg.name}</p>
                      <p className="text-slate-400">{reg.email}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                      {reg.event_title}
                    </td>
                    <td className="p-4">{reg.phone}</td>
                    <td className="p-4">{reg.organization || '—'}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Members Management */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Registered Members Directory
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Member ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {members.map((mem) => (
                  <tr key={mem.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {mem.member_id}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white">{mem.name}</p>
                      <p className="text-slate-400">{mem.email}</p>
                    </td>
                    <td className="p-4">{mem.designation}</td>
                    <td className="p-4 uppercase">{mem.membership_type}</td>
                    <td className="p-4">{mem.joining_date}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {mem.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
