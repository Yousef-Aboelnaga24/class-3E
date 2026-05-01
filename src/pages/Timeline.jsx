import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiBook, FiEdit3, FiHeart, FiMapPin, FiPlus, FiStar, FiTrash2, FiX } from 'react-icons/fi';
import { PageTransition } from '../components/layout/PageTransition';
import { useAuth } from '../auth/AuthContext';
import { useCreateEvent, useDeleteEvent, useEvents, useUpdateEvent } from '../hooks/useEvents';

const emptyForm = {
  title: '',
  description: '',
  event_date: new Date().toISOString().slice(0, 10),
  place: '',
  icon_type: 'star',
  color: 'amber',
  date_label: '',
};

const iconOptions = [
  { value: 'star', label: 'Star', icon: FiStar },
  { value: 'award', label: 'Award', icon: FiAward },
  { value: 'book', label: 'Book', icon: FiBook },
  { value: 'heart', label: 'Heart', icon: FiHeart },
];

const colorOptions = [
  { value: 'amber', label: 'Amber', className: 'bg-amber-warm' },
  { value: 'red', label: 'Red', className: 'bg-memory-danger' },
  { value: 'blue', label: 'Blue', className: 'bg-sky-soft' },
  { value: 'green', label: 'Green', className: 'bg-sage-soft' },
];

function normalizeRole(role) {
  return String(role || 'user').toLowerCase();
}

function getIcon(type) {
  return iconOptions.find((option) => option.value === type)?.icon || FiStar;
}

function getColor(color) {
  return colorOptions.find((option) => option.value === color)?.className || 'bg-amber-warm';
}

function toForm(event) {
  return {
    title: event?.title || '',
    description: event?.description || '',
    event_date: event?.event_date || new Date().toISOString().slice(0, 10),
    place: event?.place || '',
    icon_type: event?.icon_type || 'star',
    color: event?.color || 'amber',
    date_label: event?.date_label || '',
  };
}

function TimelineForm({ event, onCancel }) {
  const [form, setForm] = useState(() => toForm(event));
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const isEditing = Boolean(event?.id);
  const isSaving = createEvent.isPending || updateEvent.isPending;

  useEffect(() => {
    setForm(toForm(event));
  }, [event]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();

    const payload = {
      ...form,
      place: form.place.trim() || null,
      date_label: form.date_label.trim() || null,
    };

    if (isEditing) {
      await updateEvent.mutateAsync({ id: event.id, payload });
    } else {
      await createEvent.mutateAsync(payload);
    }

    setForm(emptyForm);
    onCancel();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="p-5 space-y-4 glass-panel rounded-3xl"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">{isEditing ? 'Edit Event' : 'Add Event'}</h2>
          <p className="text-sm text-memory-muted">Timeline details</p>
        </div>
        {isEditing && (
          <button type="button" onClick={onCancel} className="grid bg-white border rounded-full size-10 place-items-center border-memory-border">
            <FiX />
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2 md:col-span-2">
          <span className="ml-1 text-sm font-semibold">Title</span>
          <input className="input-field" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />
        </label>

        <label className="block space-y-2 md:col-span-2">
          <span className="ml-1 text-sm font-semibold">Description</span>
          <textarea className="min-h-28 input-field" value={form.description} onChange={(e) => handleChange('description', e.target.value)} required />
        </label>

        <label className="block space-y-2">
          <span className="ml-1 text-sm font-semibold">Date</span>
          <input type="date" className="input-field" value={form.event_date} onChange={(e) => handleChange('event_date', e.target.value)} required />
        </label>

        <label className="block space-y-2">
          <span className="ml-1 text-sm font-semibold">Place</span>
          <input className="input-field" value={form.place} onChange={(e) => handleChange('place', e.target.value)} placeholder="Classroom, library, trip..." />
        </label>

        <label className="block space-y-2">
          <span className="ml-1 text-sm font-semibold">Date Label</span>
          <input className="input-field" value={form.date_label} onChange={(e) => handleChange('date_label', e.target.value)} placeholder="First term, Graduation day..." />
        </label>

        <label className="block space-y-2">
          <span className="ml-1 text-sm font-semibold">Icon</span>
          <select className="input-field" value={form.icon_type} onChange={(e) => handleChange('icon_type', e.target.value)}>
            {iconOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {colorOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleChange('color', option.value)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold transition bg-white border rounded-full ${
              form.color === option.value ? 'border-memory-text shadow-card' : 'border-memory-border'
            }`}
          >
            <span className={`block rounded-full size-4 ${option.className}`} />
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 btn-primary">
          <FiPlus />
          {isEditing ? 'Save' : 'Add'}
        </button>
      </div>
    </motion.form>
  );
}

export default function Timeline() {
  const { user } = useAuth();
  const { data: eventsData, isLoading } = useEvents();
  const deleteEvent = useDeleteEvent();
  const [editingEvent, setEditingEvent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const canManage = ['admin', 'student'].includes(normalizeRole(user?.role));
  const timelineEvents = useMemo(() => eventsData?.data || eventsData || [], [eventsData]);

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setIsFormOpen(false);
  };

  const handleDelete = (event) => {
    if (!window.confirm(`Delete "${event.title}" from the timeline?`)) return;
    deleteEvent.mutate(event.id);
  };

  return (
    <PageTransition>
      <div className="max-w-5xl px-4 py-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-5 mb-10 md:flex-row md:items-end"
        >
          <div>
            <h1 className="mb-3 text-4xl font-bold font-display text-memory-text">Our Journey</h1>
            <p className="max-w-2xl text-lg text-memory-muted">A timeline of the moments that made 3E unforgettable.</p>
          </div>

          {canManage && !isFormOpen && (
            <button onClick={() => setIsFormOpen(true)} className="inline-flex items-center justify-center gap-2 btn-primary">
              <FiPlus />
              Event
            </button>
          )}
        </motion.div>

        {canManage && isFormOpen && (
          <div className="mb-12">
            <TimelineForm event={editingEvent} onCancel={handleCancel} />
          </div>
        )}

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-memory-border -translate-x-1/2" />

          {isLoading ? (
            <div className="space-y-12">
              {[1, 2].map((i) => (
                <div key={i} className="relative flex items-center animate-pulse">
                  <div className="absolute z-10 w-10 h-10 -translate-x-1/2 rounded-full left-4 md:left-1/2 bg-cream-200" />
                  <div className="ml-12 md:ml-0 md:w-1/2 md:pr-12">
                    <div className="w-full h-32 p-6 glass-panel rounded-3xl bg-cream-50" />
                  </div>
                </div>
              ))}
            </div>
          ) : timelineEvents.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-memory-muted">No journey events recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {timelineEvents.map((event, index) => {
                const Icon = getIcon(event.icon_type);
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className={`relative flex items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className={`absolute left-4 md:left-1/2 w-10 h-10 -translate-x-1/2 rounded-full border-4 border-cream-50 ${getColor(event.color)} flex items-center justify-center text-white shadow-md z-10`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className={`ml-12 md:ml-0 md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                      <div className="relative p-6 glass-panel rounded-3xl">
                        <div className={`hidden md:block absolute top-6 w-4 h-4 bg-white border-t border-r border-white/40 transform ${isEven ? '-left-2 -rotate-135' : '-right-2 rotate-45'}`} />

                        <div className="flex items-start justify-between gap-4 mb-3">
                          <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full bg-amber-warm/10 text-amber-deep">
                            {event.date_label}
                          </span>

                          {canManage && (
                            <div className="flex gap-2">
                              <button onClick={() => handleEdit(event)} className="grid bg-white border rounded-full size-9 place-items-center border-memory-border hover:text-amber-deep" aria-label="Edit event">
                                <FiEdit3 />
                              </button>
                              <button onClick={() => handleDelete(event)} disabled={deleteEvent.isPending} className="grid bg-white border rounded-full size-9 place-items-center border-memory-border hover:text-memory-danger" aria-label="Delete event">
                                <FiTrash2 />
                              </button>
                            </div>
                          )}
                        </div>

                        <h3 className="mb-2 text-xl font-bold font-display text-memory-text">{event.title}</h3>
                        {event.place && (
                          <p className="inline-flex items-center gap-2 mb-3 text-sm font-semibold text-memory-muted">
                            <FiMapPin className="text-amber-deep" />
                            {event.place}
                          </p>
                        )}
                        <p className="leading-relaxed text-memory-muted">{event.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
