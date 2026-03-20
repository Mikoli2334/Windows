'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { AnimateIn } from '../ui/AnimateIn';
import { api, TimeSlot } from '@/lib/api';

const CITY = 'Минск';

const APPOINTMENT_TYPES = [
  { value: 'measuring', label: 'Замер', desc: 'Бесплатный выезд мастера' },
  { value: 'consultation', label: 'Консультация', desc: 'Помощь в подборе' },
  { value: 'installation', label: 'Установка', desc: 'Монтаж окон' },
];

function generateDates(): { date: Date; label: string; dayName: string }[] {
  const dates = [];
  const now = new Date();
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

  for (let i = 1; i <= 14; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    if (d.getDay() === 0) continue; // воскресенье пропускаем
    dates.push({
      date: d,
      label: `${d.getDate()} ${months[d.getMonth()]}`,
      dayName: dayNames[d.getDay()],
    });
  }
  return dates;
}

function formatApiError(err: any): string {
  const detail = err?.response?.data?.detail ?? err?.detail;

  if (Array.isArray(detail)) {
    return detail
      .map((d) => {
        const field = Array.isArray(d?.loc) ? d.loc[d.loc.length - 1] : '';
        const msg = d?.msg ?? 'Ошибка валидации';
        return field ? `${field}: ${msg}` : msg;
      })
      .join('\n');
  }

  if (typeof detail === 'string') return detail;
  if (typeof err?.message === 'string') return err.message;

  return 'Произошла ошибка. Попробуйте снова.';
}

export default function Appointment() {
  const [step, setStep] = useState(0);
  const [appointmentType, setAppointmentType] = useState('measuring');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [city] = useState(CITY);

  const [formData, setFormData] = useState({
    name: '',
    phone: '+375',
    email: '',
    address: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const dates = generateDates();

  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = selectedDate.toISOString().split('T')[0];
    setLoadingSlots(true);
    setSelectedTime(null);

    api
      .getAvailableSlots(dateStr)
      .then((res) => setSlots(res.slots))
      .catch(() => {
        const fallback: TimeSlot[] = [];
        for (let h = 9; h < 19; h++) {
          fallback.push({ time: `${h.toString().padStart(2, '0')}:00`, available: true, booked_count: 0 });
        }
        setSlots(fallback);
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !formData.name || !formData.phone) return;

    setSubmitting(true);
    setError('');

    try {
      const [hours, mins] = selectedTime.split(':').map(Number);
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(hours, mins, 0, 0);

      // 1) создаём запись в БД (как было)
      await api.createAppointment({
        client_name: formData.name,
        client_phone: formData.phone,
        client_email: formData.email || undefined,
        appointment_date: appointmentDate.toISOString(),
        appointment_type: appointmentType,
        address: formData.address || undefined,
        city,
        notes: formData.notes || undefined,
      });

      // 2) шлём уведомление папе в Telegram
      await api.sendAppointmentLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        appointment_type: appointmentType,
        appointment_date: appointmentDate.toISOString(),
        city,
        address: formData.address.trim() || undefined,
        email: formData.email.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <section id="appointment" className="py-24 sm:py-32 relative gradient-bg">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto glass-card glow-border rounded-3xl p-10 text-center"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h3 className="font-display font-bold text-2xl text-gray-900 mb-3">Вы записаны!</h3>
            <p className="text-gray-600 mb-2">
              {APPOINTMENT_TYPES.find((t) => t.value === appointmentType)?.label} назначен(а) на{' '}
              <span className="text-gray-900 font-semibold">{selectedDate?.toLocaleDateString('ru-RU')}</span> в{' '}
              <span className="text-gray-900 font-semibold">{selectedTime}</span>
            </p>
            <p className="text-gray-500 text-sm">Мы перезвоним вам для подтверждения в течение 30 минут.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="appointment" className="py-24 sm:py-32 relative gradient-bg">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

      <div className="section-container">
        <AnimateIn className="text-center mb-12">
          <span className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-green-600 mb-4 block">Запись</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">Записаться на замер</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Выберите удобную дату и время — замер бесплатный</p>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <div className="max-w-3xl mx-auto glass-card glow-border rounded-3xl overflow-hidden">
            <div className="h-1 bg-gray-100">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                animate={{ width: `${((step + 1) / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* Step 0 */}
                {step === 0 && (
                  <motion.div
                    key="s0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <label className="text-xs font-display font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
                        Тип записи
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {APPOINTMENT_TYPES.map((at) => (
                          <button
                            key={at.value}
                            onClick={() => setAppointmentType(at.value)}
                            className={`p-4 rounded-xl border text-center transition-all duration-300 ${
                              appointmentType === at.value
                                ? 'bg-green-50 border-green-500/40 text-green-700'
                                : 'border-gray-200 text-gray-600 hover:border-green-300'
                            }`}
                          >
                            <div className="font-display font-semibold text-sm mb-1">{at.label}</div>
                            <div className="text-[10px] opacity-60">{at.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-display font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Выберите дату
                      </label>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {dates.map((d, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(d.date)}
                            className={`flex-shrink-0 w-16 py-3 rounded-xl border text-center transition-all duration-300 ${
                              selectedDate?.toDateString() === d.date.toDateString()
                                ? 'bg-green-50 border-green-500/50 text-green-700'
                                : 'border-gray-200 text-gray-600 hover:border-green-300'
                            }`}
                          >
                            <div className="text-[10px] opacity-50">{d.dayName}</div>
                            <div className="font-display font-semibold text-sm">{d.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedDate && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <label className="text-xs font-display font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Время
                        </label>

                        {loadingSlots ? (
                          <div className="flex items-center gap-2 text-gray-500 py-4">
                            <Loader2 className="w-4 h-4 animate-spin" /> Загружаем расписание...
                          </div>
                        ) : (
                          <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
                            {slots.map((slot) => (
                              <button
                                key={slot.time}
                                disabled={!slot.available}
                                onClick={() => setSelectedTime(slot.time)}
                                className={`py-2.5 rounded-lg text-sm font-mono transition-all duration-300 ${
                                  !slot.available
                                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                                    : selectedTime === slot.time
                                    ? 'bg-green-50 border border-green-500/50 text-green-700'
                                    : 'border border-gray-200 text-gray-600 hover:border-green-300'
                                }`}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}

                    <button
                      onClick={() => setStep(1)}
                      disabled={!selectedDate || !selectedTime}
                      className="btn-primary w-full disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Далее — контактные данные
                    </button>
                  </motion.div>
                )}

                {/* Step 1 */}
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="text-xs font-display font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Ваше имя *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Александр Иванов"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-display font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Телефон *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+375 (29) 123-45-67"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-display font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-display font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Город
                      </label>
                      <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-800 font-medium">{city}</div>
                      <p className="text-[11px] text-gray-500 mt-2">Работаем по Минску и Минской области.</p>
                    </div>

                    <div>
                      <label className="text-xs font-display font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Адрес</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="ул. Победителей, 1, кв. 10"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-display font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Комментарий</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        placeholder="Например: домофон не работает, позвонить заранее"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button onClick={() => setStep(0)} className="btn-secondary flex-1">
                        Назад
                      </button>
                      <button
                        onClick={() => setStep(2)}
                        disabled={!formData.name || !formData.phone}
                        className="btn-primary flex-1 disabled:opacity-30 disabled:pointer-events-none"
                      >
                        Далее
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="font-display font-semibold text-xl text-gray-900">Подтверждение</h3>

                    <div className="space-y-3 p-5 rounded-xl bg-green-50/50 border border-green-200/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Тип</span>
                        <span className="text-gray-900 font-medium">{APPOINTMENT_TYPES.find((t) => t.value === appointmentType)?.label}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Дата</span>
                        <span className="text-gray-900 font-medium">
                          {selectedDate?.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Время</span>
                        <span className="text-gray-900 font-medium">{selectedTime}</span>
                      </div>

                      <div className="border-t border-green-200 pt-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Имя</span>
                          <span className="text-gray-900 font-medium">{formData.name}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                          <span className="text-gray-600">Телефон</span>
                          <span className="text-gray-900 font-medium">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                          <span className="text-gray-600">Город</span>
                          <span className="text-gray-900 font-medium">{city}</span>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm whitespace-pre-line flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                        Назад
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        {submitting ? 'Отправляем...' : 'Подтвердить запись'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}