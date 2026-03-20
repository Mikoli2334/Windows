'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ruler,
  Layers,
  Sun,
  Palette,
  PlusCircle,
  MinusCircle,
  ShieldCheck,
  Calculator,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { AnimateIn } from '../ui/AnimateIn';
import { api } from '@/lib/api';

// --- Types ---
interface WindowConfig {
  windowTypeId: number;
  windowTypeName: string;
  width: number;
  height: number;
  sections: number;
  openingType: string;
  glassType: string;
  profileType: string;
  color: string;
  hasMosquitoNet: boolean;
  hasWindowsill: boolean;
  windowsillDepth: number;
  hasSlopes: boolean;
  quantity: number;
}

const DEFAULT_CONFIG: WindowConfig = {
  windowTypeId: 2,
  windowTypeName: 'Двухстворчатое',
  width: 1300,
  height: 1400,
  sections: 2,
  openingType: 'поворотно-откидное',
  glassType: 'двухкамерный',
  profileType: 'стандарт',
  color: 'white',
  hasMosquitoNet: false,
  hasWindowsill: false,
  windowsillDepth: 250,
  hasSlopes: false,
  quantity: 1,
};

const WINDOW_PRESETS = [
  { id: 1, name: 'Одностворчатое', sections: 1, defW: 700, defH: 1400 },
  { id: 2, name: 'Двухстворчатое', sections: 2, defW: 1300, defH: 1400 },
  { id: 3, name: 'Трёхстворчатое', sections: 3, defW: 2000, defH: 1400 },
  { id: 4, name: 'Балконный блок', sections: 2, defW: 2100, defH: 2100 },
  { id: 5, name: 'Панорамное', sections: 4, defW: 2800, defH: 2200 },
  { id: 6, name: 'Арочное', sections: 1, defW: 800, defH: 1400 },
];

const OPENING_TYPES = [
  { value: 'глухое', label: 'Глухое', icon: '▢' },
  { value: 'поворотное', label: 'Поворотное', icon: '↔' },
  { value: 'откидное', label: 'Откидное', icon: '↕' },
  { value: 'поворотно-откидное', label: 'Поворотно-откидное', icon: '⤡' },
];

const GLASS_TYPES = [
  { value: 'однокамерный', label: 'Однокамерный', info: '2 стекла' },
  { value: 'двухкамерный', label: 'Двухкамерный', info: '3 стекла' },
  { value: 'энергосберегающий', label: 'Энергосберегающий', info: 'i-стекло' },
  { value: 'шумозащитный', label: 'Шумозащитный', info: '45 дБ' },
];

const PROFILE_TYPES = [
  { value: 'эконом', label: 'Эконом', info: '3 камеры' },
  { value: 'стандарт', label: 'Стандарт', info: '5 камер' },
  { value: 'премиум', label: 'Премиум', info: '7 камер' },
];

const COLORS = [
  { value: 'white', label: 'Белый', hex: '#ffffff' },
  { value: 'brown', label: 'Коричневый', hex: '#6B3A2A' },
  { value: 'oak', label: 'Дуб', hex: '#B8860B' },
  { value: 'anthracite', label: 'Антрацит', hex: '#383838' },
];

// --- SVG Window Preview ---
function WindowPreview({ config }: { config: WindowConfig }) {
  const { sections, width, height, openingType, color } = config;
  const viewW = 280;
  const viewH = Math.round(viewW * (height / width));
  const pad = 12;
  const innerW = viewW - pad * 2;
  const innerH = viewH - pad * 2;
  const sectionW = innerW / sections;

  const frameColor =
    color === 'white' ? '#d4d8e0' : color === 'brown' ? '#6B3A2A' : color === 'oak' ? '#B8860B' : '#383838';
  const glassGrad = 'url(#glassGrad)';

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      className="w-full h-full max-h-[320px]"
      style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.15))' }}
    >
      <defs>
        <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(124,179,66,0.12)" />
          <stop offset="50%" stopColor="rgba(139,195,74,0.08)" />
          <stop offset="100%" stopColor="rgba(124,179,66,0.1)" />
        </linearGradient>
        <linearGradient id="frameGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={frameColor} />
          <stop offset="100%" stopColor={frameColor} stopOpacity="0.8" />
        </linearGradient>
      </defs>

      <rect x="2" y="2" width={viewW - 4} height={viewH - 4} rx="6" fill="url(#frameGrad)" />
      <rect x="6" y="6" width={viewW - 12} height={viewH - 12} rx="4" fill="#f5f5f5" />

      {Array.from({ length: sections }, (_, i) => {
        const x = pad + i * sectionW + 2;
        const y = pad + 2;
        const w = sectionW - 4;
        const h = innerH - 4;

        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} rx="2" fill={glassGrad} stroke={frameColor} strokeWidth="1.5" />

            {openingType === 'поворотное' && (
              <>
                <line x1={x} y1={y} x2={x + w / 2} y2={y + h / 2} stroke="#7cb342" strokeWidth="0.5" opacity="0.4" />
                <line
                  x1={x}
                  y1={y + h}
                  x2={x + w / 2}
                  y2={y + h / 2}
                  stroke="#7cb342"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
              </>
            )}
            {openingType === 'откидное' && (
              <>
                <line
                  x1={x}
                  y1={y + h}
                  x2={x + w / 2}
                  y2={y + h / 2}
                  stroke="#7cb342"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
                <line
                  x1={x + w}
                  y1={y + h}
                  x2={x + w / 2}
                  y2={y + h / 2}
                  stroke="#7cb342"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
              </>
            )}
            {openingType === 'поворотно-откидное' && (
              <>
                <line x1={x} y1={y} x2={x + w / 2} y2={y + h / 2} stroke="#7cb342" strokeWidth="0.5" opacity="0.35" />
                <line
                  x1={x}
                  y1={y + h}
                  x2={x + w / 2}
                  y2={y + h / 2}
                  stroke="#7cb342"
                  strokeWidth="0.5"
                  opacity="0.35"
                />
                <line
                  x1={x + w}
                  y1={y + h}
                  x2={x + w / 2}
                  y2={y + h / 2}
                  stroke="#7cb342"
                  strokeWidth="0.5"
                  opacity="0.35"
                />
              </>
            )}

            {openingType !== 'глухое' && i === sections - 1 && (
              <rect x={x + 4} y={y + h / 2 - 10} width="4" height="20" rx="2" fill={frameColor} opacity="0.7" />
            )}
          </g>
        );
      })}

      {Array.from({ length: sections - 1 }, (_, i) => (
        <line
          key={`div-${i}`}
          x1={pad + (i + 1) * sectionW}
          y1={pad}
          x2={pad + (i + 1) * sectionW}
          y2={viewH - pad}
          stroke={frameColor}
          strokeWidth="3"
        />
      ))}

      <text
        x={viewW / 2}
        y={viewH + 2}
        textAnchor="middle"
        fill="#7cb342"
        opacity="0.6"
        fontSize="10"
        fontFamily="JetBrains Mono"
      >
        {width} мм
      </text>
      <text
        x={viewW + 2}
        y={viewH / 2}
        textAnchor="middle"
        fill="#7cb342"
        opacity="0.6"
        fontSize="10"
        fontFamily="JetBrains Mono"
        transform={`rotate(90, ${viewW + 2}, ${viewH / 2})`}
      >
        {height} мм
      </text>
    </svg>
  );
}

// --- Option Button ---
function OptionBtn({
  selected,
  onClick,
  children,
  className = '',
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
        selected ? 'bg-green-50 border-green-500/50 text-green-700' : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
      } ${className}`}
    >
      {children}
    </button>
  );
}

// --- Toggle ---
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 ${checked ? 'bg-green-500' : 'bg-gray-200'}`}
        onClick={() => onChange(!checked)}
      >
        <motion.div
          className="w-5 h-5 rounded-full bg-white shadow-md"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
    </label>
  );
}

export default function WindowConstructor() {
  const [config, setConfig] = useState<WindowConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState(0);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '+375' });

  // UI states
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>('');

  const updateConfig = useCallback((partial: Partial<WindowConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const buildNotes = () => {
    const notes: string[] = [];
    if (config.hasMosquitoNet) notes.push('Москитная сетка');
    if (config.hasWindowsill) notes.push(`Подоконник (глубина ${config.windowsillDepth} мм)`);
    if (config.hasSlopes) notes.push('Откосы');
    return notes.length ? `Опции: ${notes.join(', ')}` : undefined;
  };

  const handleSubmitForm = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      await api.sendConstructorLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        window_type: config.windowTypeName,
        width: config.width,
        height: config.height,
        quantity: config.quantity,
        profile_type: config.profileType,
        glass_type: config.glassType,
        opening_type: config.openingType,
        color: config.color,
        notes: buildNotes(),
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Не удалось отправить. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setShowForm(false);
    setError('');
    setFormData({ name: '', phone: '+375' });
  };

  const TABS = [
    { label: 'Тип и размер', icon: Ruler },
    { label: 'Стеклопакет', icon: Layers },
    { label: 'Открывание', icon: Sun },
    { label: 'Дополнения', icon: ShieldCheck },
  ];

  return (
    <section id="constructor" className="py-24 sm:py-32 relative gradient-bg">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

      <div className="section-container">
        <AnimateIn className="text-center mb-12">
          <span className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-green-600 mb-4 block">Интерактивный</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">Конструктор окон</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Настройте каждый параметр и мгновенно увидите результат</p>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <div className="glass-card glow-border rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-[1fr,380px]">
              {/* Left: Preview */}
              <div className="p-8 lg:p-12 flex flex-col bg-gradient-to-br from-gray-50 to-white">
                <div className="flex-1 flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
                  <motion.div
                    key={`${config.windowTypeId}-${config.sections}-${config.color}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-xs"
                  >
                    <WindowPreview config={config} />
                  </motion.div>
                </div>

                {/* Contact Form */}
                <div className="mt-8 p-6 rounded-2xl bg-white border border-gray-200">
                  {submitted ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">Спасибо за заявку!</h3>
                      <p className="text-gray-600 text-sm">Мы скоро с вами свяжемся для уточнения деталей и расчета стоимости.</p>

                      <button type="button" onClick={resetForm} className="btn-secondary mt-6">
                        Отправить ещё раз
                      </button>
                    </motion.div>
                  ) : !showForm ? (
                    <button
                      onClick={() => setShowForm(true)}
                      className="btn-primary w-full !py-4 text-base flex items-center justify-center gap-2"
                    >
                      <Calculator className="w-5 h-5" />
                      Узнать цену
                    </button>
                  ) : (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                      <h3 className="font-display font-semibold text-gray-900 mb-2">Заполните форму для расчета</h3>

                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-2 block">Ваше имя *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Александр"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-2 block">Номер телефона *</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+375 (XX) XXX-XX-XX"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                        />
                      </div>

                      {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 mt-0.5" />
                          <span>{error}</span>
                        </div>
                      )}

                      <button
                        onClick={handleSubmitForm}
                        disabled={submitting || !formData.name.trim() || !formData.phone.trim()}
                        className="btn-primary w-full !py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {submitting ? 'Отправляем...' : 'Отправить заявку'}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right: Configuration panel */}
              <div className="border-t lg:border-t-0 lg:border-l border-gray-200 bg-white">
                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-gray-200">
                  {TABS.map((tab, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(i)}
                      className={`flex-1 min-w-0 px-3 py-4 text-xs font-medium text-center transition-all duration-300 border-b-2 ${
                        activeTab === i ? 'border-green-500 text-green-700 bg-green-50' : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 mx-auto mb-1" />
                      <span className="hidden sm:block">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Panel content */}
                <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {activeTab === 0 && (
                      <motion.div
                        key="tab0"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="text-xs font-display font-semibold text-gray-600 uppercase tracking-wider mb-3 block">Тип окна</label>
                          <div className="grid grid-cols-2 gap-2">
                            {WINDOW_PRESETS.map((wp) => (
                              <OptionBtn
                                key={wp.id}
                                selected={config.windowTypeId === wp.id}
                                onClick={() =>
                                  updateConfig({
                                    windowTypeId: wp.id,
                                    windowTypeName: wp.name,
                                    sections: wp.sections,
                                    width: wp.defW,
                                    height: wp.defH,
                                  })
                                }
                              >
                                {wp.name}
                              </OptionBtn>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-display font-semibold text-gray-600 uppercase tracking-wider">Ширина</label>
                            <span className="font-mono text-sm text-green-600">{config.width} мм</span>
                          </div>
                          <input
                            type="range"
                            min={300}
                            max={3000}
                            step={10}
                            value={config.width}
                            onChange={(e) => updateConfig({ width: +e.target.value })}
                            className="relative z-10"
                            style={{ pointerEvents: 'auto' }}
                          />
                          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                            <span>300</span>
                            <span>3000</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-display font-semibold text-gray-600 uppercase tracking-wider">Высота</label>
                            <span className="font-mono text-sm text-green-600">{config.height} мм</span>
                          </div>
                          <input
                            type="range"
                            min={300}
                            max={2500}
                            step={10}
                            value={config.height}
                            onChange={(e) => updateConfig({ height: +e.target.value })}
                            className="relative z-10"
                            style={{ pointerEvents: 'auto' }}
                          />
                          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                            <span>300</span>
                            <span>2500</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-display font-semibold text-gray-600 uppercase tracking-wider mb-3 block">Количество</label>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => updateConfig({ quantity: Math.max(1, config.quantity - 1) })}
                              className="p-1.5 text-gray-600 hover:text-green-600 transition-colors"
                              aria-label="Минус"
                            >
                              <MinusCircle className="w-6 h-6" />
                            </button>
                            <span className="font-display font-bold text-xl text-gray-900 w-8 text-center">{config.quantity}</span>
                            <button
                              onClick={() => updateConfig({ quantity: Math.min(20, config.quantity + 1) })}
                              className="p-1.5 text-gray-600 hover:text-green-600 transition-colors"
                              aria-label="Плюс"
                            >
                              <PlusCircle className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 1 && (
                      <motion.div
                        key="tab1"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="text-xs font-display font-semibold text-gray-600 uppercase tracking-wider mb-3 block">Стеклопакет</label>
                          <div className="space-y-2">
                            {GLASS_TYPES.map((gt) => (
                              <OptionBtn
                                key={gt.value}
                                selected={config.glassType === gt.value}
                                onClick={() => updateConfig({ glassType: gt.value })}
                                className="w-full text-left flex items-center justify-between"
                              >
                                <span>{gt.label}</span>
                                <span className="text-xs opacity-60">{gt.info}</span>
                              </OptionBtn>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-display font-semibold text-gray-600 uppercase tracking-wider mb-3 block">Профиль</label>
                          <div className="space-y-2">
                            {PROFILE_TYPES.map((pt) => (
                              <OptionBtn
                                key={pt.value}
                                selected={config.profileType === pt.value}
                                onClick={() => updateConfig({ profileType: pt.value })}
                                className="w-full text-left flex items-center justify-between"
                              >
                                <span>{pt.label}</span>
                                <span className="text-xs opacity-60">{pt.info}</span>
                              </OptionBtn>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 2 && (
                      <motion.div
                        key="tab2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="text-xs font-display font-semibold text-gray-600 uppercase tracking-wider mb-3 block">Тип открывания</label>
                          <div className="grid grid-cols-2 gap-2">
                            {OPENING_TYPES.map((ot) => (
                              <OptionBtn key={ot.value} selected={config.openingType === ot.value} onClick={() => updateConfig({ openingType: ot.value })}>
                                <div className="text-lg mb-1">{ot.icon}</div>
                                <div className="text-xs">{ot.label}</div>
                              </OptionBtn>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-display font-semibold text-gray-600 uppercase tracking-wider mb-3 block">
                            <Palette className="w-4 h-4 inline mr-1" /> Цвет профиля
                          </label>
                          <div className="flex gap-3">
                            {COLORS.map((c) => (
                              <button key={c.value} onClick={() => updateConfig({ color: c.value })} className="group flex flex-col items-center gap-2 transition-all duration-300">
                                <div
                                  className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                                    config.color === c.value ? 'border-green-500 scale-110 shadow-lg' : 'border-gray-300 hover:border-green-400'
                                  }`}
                                  style={{ backgroundColor: c.hex }}
                                />
                                <span className={`text-[10px] transition-colors ${config.color === c.value ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                                  {c.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 3 && (
                      <motion.div
                        key="tab3"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                      >
                        <label className="text-xs font-display font-semibold text-gray-600 uppercase tracking-wider block">Дополнительные опции</label>

                        <div className="space-y-5">
                          <Toggle checked={config.hasMosquitoNet} onChange={(v) => updateConfig({ hasMosquitoNet: v })} label="Москитная сетка" />

                          <Toggle checked={config.hasWindowsill} onChange={(v) => updateConfig({ hasWindowsill: v })} label="Подоконник" />

                          {config.hasWindowsill && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-14"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <label className="text-xs text-gray-600">Глубина подоконника</label>
                                <span className="font-mono text-xs text-green-600">{config.windowsillDepth} мм</span>
                              </div>
                              <input
                                type="range"
                                min={150}
                                max={700}
                                step={10}
                                value={config.windowsillDepth}
                                onChange={(e) => updateConfig({ windowsillDepth: +e.target.value })}
                                className="relative z-10"
                                style={{ pointerEvents: 'auto' }}
                              />
                            </motion.div>
                          )}

                          <Toggle checked={config.hasSlopes} onChange={(v) => updateConfig({ hasSlopes: v })} label="Откосы" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              {/* /Right */}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}