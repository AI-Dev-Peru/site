import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Calendar, 
  MapPin, 
  Video, 
  Users, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreHorizontal, 
  Plus, 
  Search, 
  LayoutGrid, 
  FileText, 
  BarChart3, 
  Megaphone, 
  ChevronLeft, 
  Youtube, 
  Ticket, 
  Link as LinkIcon, 
  MessageCircle, 
  HardDrive, 
  Mic, 
  ListTodo, 
  Wand2, 
  Image as ImageIcon, 
  Trash2, 
  AlertTriangle,
  X,
  Check,
  Save,
  ArrowRight,
  Copy,
  AlertCircle,
  Mail,
  Linkedin,
  Twitter,
  Globe,
  ChevronDown,
  Edit2,
  User,
  Radio,
  Map,
  Lock,
  Sparkles,
  Phone
} from 'lucide-react';

// --- MOCK DATA ---

const MOCK_SPEAKERS = [
  { id: 's1', name: 'Diego Velazquez', role: 'Senior AI Engineer', company: 'Google', email: 'diego@google.com', twitter: '@diegov_ai', phone: '+51 999 999 999' },
  { id: 's2', name: 'Maria Rodriguez', role: 'CTO', company: 'TechPeru', email: 'maria@techperu.pe', twitter: '@mariatech', phone: '' },
  { id: 's3', name: 'Carlos Vance', role: 'DevRel', company: 'Vercel', email: 'carlos@vercel.com', twitter: '@carlosv', phone: '' },
];

const DEFAULT_CUSTOM_CHECKLIST = [
  {
    category: 'Logistics',
    items: [
      { id: 'c1', text: 'Confirm venue availability', done: true },
      { id: 'c2', text: 'Order pizza/catering', done: false },
    ]
  },
  {
    category: 'Promotion',
    items: [
      { id: 'c4', text: 'Publish on LinkedIn', done: false },
      { id: 'c5', text: 'Send WhatsApp announcement', done: false },
    ]
  }
];

const INITIAL_EVENTS = [
  {
    id: 'e1',
    title: 'AI Agents in Production',
    date: '2024-11-15',
    time: '19:00',
    status: 'Done', 
    type: 'Hybrid',
    description: 'Deep dive into building autonomous agents using LangChain and OpenAI.',
    links: {
      youtube: 'https://youtube.com/video',
      luma: 'https://lu.ma/event123',
      drive: 'https://drive.google.com/folder',
      whatsapp: 'https://chat.whatsapp.com/inv',
      streamyard: '',
      googleMaps: 'https://maps.google.com/?q=lima'
    },
    checklist: DEFAULT_CUSTOM_CHECKLIST,
    talks: [
      { id: 't1', title: 'Building Reliable Agents', speakerIds: ['s1'], slidesLink: 'https://slides.com/deck' }
    ],
    attendeeCount: 45
  },
  {
    id: 'e2',
    title: 'LLMs for Beginners',
    date: '2025-01-20',
    time: '18:30',
    status: 'In Progress',
    type: 'Remote',
    description: 'An introductory session for developers new to Large Language Models.',
    links: {
      youtube: '',
      luma: '',
      drive: '',
      whatsapp: '',
      streamyard: '',
      googleMaps: ''
    },
    checklist: DEFAULT_CUSTOM_CHECKLIST,
    talks: [
      { id: 't2', title: 'Transformers 101', speakerIds: ['s2'], slidesLink: '' }
    ],
    attendeeCount: 0
  }
];

// --- UTILS ---

const cn = (...classes) => classes.filter(Boolean).join(' ');

const getStatusColor = (status) => {
  switch (status) {
    case 'In Progress': return 'text-blue-400 border-blue-500/50';
    case 'Done': return 'text-emerald-400 border-emerald-500/50';
    default: return 'text-zinc-500 border-zinc-700';
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return { month: 'TBD', day: '--' };
  const date = new Date(dateStr);
  return {
    month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date).toUpperCase(),
    day: new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date),
    full: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date)
  };
};

// --- COMPONENTS ---

const Button = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-white text-black hover:bg-zinc-200 border border-transparent",
    secondary: "bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-900/50",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-900"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base"
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
};

const Input = ({ label, icon: Icon, className, ...props }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</label>}
    <div className="relative group">
        {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-300 transition-colors">
                <Icon size={16} />
            </div>
        )}
        <input 
            className={cn(
                "w-full bg-black/50 border border-zinc-800 rounded-lg py-2.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all", 
                Icon ? "pl-10 pr-3" : "px-3",
                className
            )} 
            {...props} 
        />
    </div>
  </div>
);

const Select = ({ label, options, className, ...props }) => (
    <div className="space-y-1.5 w-full">
        {label && <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</label>}
        <div className="relative">
            <select
                className={cn(
                    "w-full bg-black/50 border border-zinc-800 rounded-lg pl-3 pr-10 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 appearance-none transition-all cursor-pointer",
                    className
                )}
                {...props}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
        </div>
    </div>
);

const TextArea = ({ label, className, ...props }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</label>}
    <textarea 
      className={cn(
        "w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all resize-none", 
        className
      )} 
      {...props} 
    />
  </div>
);

const Badge = ({ children, className }) => (
  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wide", className)}>
    {children}
  </span>
);

const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = "max-w-sm" }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className={cn("bg-zinc-950 border border-zinc-800 rounded-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200", maxWidth)}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-white">{title}</h3>
                        <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={18}/></button>
                    </div>
                    {children}
                </div>
                {footer && (
                    <div className="bg-zinc-900/30 p-4 flex justify-end gap-3 border-t border-zinc-800/50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

const TopNav = ({ activeTab, onTabChange }) => {
    const navItems = [
      { id: 'dashboard', label: 'Events' },
      { id: 'speakers', label: 'Speakers' },
      { id: 'marketing', label: 'Marketing' },
      { id: 'analytics', label: 'Analytics' },
    ];
  
    return (
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('dashboard')}>
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                    <span className="font-bold text-black text-sm">PE</span>
                </div>
                <span className="font-semibold text-white tracking-tight hidden sm:block">AI Dev Peru</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                            activeTab === item.id 
                                ? "text-white bg-white/10" 
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                        )}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-zinc-800 ring-1 ring-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                JD
             </div>
          </div>
        </div>
      </header>
    );
};

// --- CUSTOM INPUT COMPONENTS ---

const SpeakerSelector = ({ speakers, selectedIds, onSelect, onCreate }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const filteredSpeakers = speakers.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) && 
        !selectedIds.includes(s.id)
    );

    const handleSelect = (id) => {
        onSelect(id);
        setSearch('');
        setIsOpen(false);
    };

    const handleCreate = () => {
        if (!search) return;
        onCreate(search);
        setSearch('');
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedIds.map(id => {
                    const s = speakers.find(sp => sp.id === id);
                    if (!s) return null;
                    return (
                        <span key={id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700">
                            {s.name}
                            <button onClick={() => onSelect(id)} className="ml-1.5 hover:text-red-400"><X size={12} /></button>
                        </span>
                    );
                })}
            </div>
            
            <div className="relative">
                <div className="flex items-center border border-zinc-800 rounded-lg bg-black/50 focus-within:ring-1 focus-within:ring-zinc-600 focus-within:border-zinc-600 transition-all">
                    <Search size={14} className="ml-3 text-zinc-500" />
                    <input 
                        className="w-full bg-transparent border-none px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
                        placeholder="Search or add speaker..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
                        onFocus={() => setIsOpen(true)}
                    />
                </div>

                {isOpen && search && (
                    <div className="absolute top-full mt-1 w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden">
                        {filteredSpeakers.length > 0 ? (
                             <ul className="max-h-48 overflow-y-auto">
                                {filteredSpeakers.map(s => (
                                    <li 
                                        key={s.id}
                                        onClick={() => handleSelect(s.id)}
                                        className="px-4 py-2 hover:bg-zinc-800 cursor-pointer text-sm text-zinc-300 flex justify-between items-center"
                                    >
                                        <span>{s.name}</span>
                                        <span className="text-xs text-zinc-600">{s.company}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                         <button 
                            onClick={handleCreate}
                            className="w-full text-left px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border-t border-zinc-800 text-sm text-blue-400 font-medium flex items-center gap-2"
                        >
                            <Plus size={14} /> Create "{search}"
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- MODALS ---

const CreateEventModal = ({ isOpen, onClose, onCreate }) => {
    // Helper to get today in YYYY-MM-DD format
    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState({
        title: '',
        date: getTodayString(),
        time: '19:00',
        type: 'Hybrid'
    });

    const handleSubmit = () => {
        if (!formData.title) return;
        onCreate(formData);
        // Reset to defaults for next time
        setFormData({ 
            title: '', 
            date: getTodayString(), 
            time: '19:00', 
            type: 'Hybrid' 
        });
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Plan New Event"
            maxWidth="max-w-md"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!formData.title}>Create Draft</Button>
                </>
            }
        >
            <div className="space-y-4">
                <Input 
                    label="Event Title" 
                    placeholder="e.g. AI Agents Workshop" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    autoFocus
                />
                <div className="grid grid-cols-2 gap-4">
                     <Input 
                        label="Date" 
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                     <Input 
                        label="Time" 
                        type="time"
                        value={formData.time}
                        onChange={e => setFormData({...formData, time: e.target.value})}
                    />
                </div>
                <Select 
                    label="Format"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    options={[
                        { value: 'In-Person', label: 'In-Person' },
                        { value: 'Remote', label: 'Remote' },
                        { value: 'Hybrid', label: 'Hybrid' }
                    ]}
                />
            </div>
        </Modal>
    );
};

// --- VIEW COMPONENTS ---

const DashboardView = ({ events, onEventClick, onCreateEvent, yearFilter, setYearFilter, statusFilter, setStatusFilter }) => {
    const filteredEvents = events.filter(e => {
        const yearMatch = yearFilter === 'All' || (e.date && e.date.startsWith(yearFilter));
        const statusMatch = statusFilter === 'All' || e.status === statusFilter;
        return yearMatch && statusMatch;
    });

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Events</h1>
                    <p className="text-zinc-500">Manage your community gatherings.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-end">
                    <div className="w-32">
                         <Select 
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            options={[
                                { value: 'All', label: 'All Years' },
                                { value: '2024', label: '2024' },
                                { value: '2025', label: '2025' }
                            ]}
                         />
                    </div>
                    <div className="w-40">
                         <Select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={[
                                { value: 'All', label: 'All Status' },
                                { value: 'In Progress', label: 'In Progress' },
                                { value: 'Done', label: 'Done' }
                            ]}
                         />
                    </div>
                     <Button onClick={onCreateEvent} size="md" className="bg-white hover:bg-zinc-200 text-black border-0 h-[42px]">
                        <Plus size={16} className="mr-2" /> New Event
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEvents.map(event => {
                    const dateObj = formatDate(event.date);
                    return (
                        <div 
                            key={event.id}
                            onClick={() => onEventClick(event.id)}
                            className={cn(
                                "group relative bg-zinc-900/30 hover:bg-zinc-900/60 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all cursor-pointer flex gap-6",
                                event.status === 'Done' ? "opacity-60" : ""
                            )}
                        >
                            {/* Date Block */}
                            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 transition-colors shrink-0">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{dateObj.month}</span>
                                <span className="text-xl font-bold text-white">{dateObj.day}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                     <Badge className={cn("bg-transparent border", getStatusColor(event.status))}>
                                        {event.status}
                                    </Badge>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {event.links.luma && <Ticket size={14} className="text-zinc-400" />}
                                        {event.links.youtube && <Youtube size={14} className="text-zinc-400" />}
                                    </div>
                                </div>
                                
                                <h3 className="text-lg font-semibold text-white mb-2 truncate pr-4">{event.title}</h3>
                                
                                <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={12} /> {event.time || 'TBD'}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        {event.type === 'Remote' ? <Video size={12} /> : event.type === 'Hybrid' ? <Globe size={12} /> : <MapPin size={12} />}
                                        {event.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SpeakersView = ({ speakers, events, onAddSpeaker, onEditSpeaker }) => {
    const getSpeakerEvents = (speakerId) => {
        return events.filter(e => 
            e.talks.some(t => t.speakerIds.includes(speakerId))
        );
    };

    return (
         <div className="max-w-6xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Speakers</h1>
                    <p className="text-zinc-500">Community experts and presenters.</p>
                </div>
                <Button variant="secondary" size="sm" onClick={onAddSpeaker}><Plus size={14} className="mr-2"/> Add Speaker</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {speakers.map(speaker => {
                    const speakerEvents = getSpeakerEvents(speaker.id);
                    return (
                        <div 
                            key={speaker.id} 
                            onClick={() => onEditSpeaker(speaker.id)}
                            className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-all group cursor-pointer relative"
                        >
                             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-zinc-800 p-1.5 rounded-lg text-zinc-400">
                                    <ArrowRight size={14} />
                                </div>
                            </div>

                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium text-white border border-zinc-700">
                                        {speaker.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium">{speaker.name}</h3>
                                        <p className="text-xs text-zinc-500">{speaker.role} at {speaker.company}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mb-6" onClick={(e) => e.stopPropagation()}>
                                {speaker.email && (
                                    <a href={`mailto:${speaker.email}`} className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                                        <Mail size={14} />
                                    </a>
                                )}
                                {speaker.twitter && (
                                    <a href={`https://twitter.com/${speaker.twitter.replace('@','')}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-blue-400 transition-colors">
                                        <Twitter size={14} />
                                    </a>
                                )}
                            </div>

                            <div>
                                <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider mb-3">Speaking History</p>
                                {speakerEvents.length > 0 ? (
                                    <ul className="space-y-2">
                                        {speakerEvents.map(e => (
                                            <li key={e.id} className="text-xs text-zinc-400 flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-zinc-600" />
                                                <span className="truncate">{e.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-zinc-700 italic">No events yet.</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
         </div>
    );
};

// --- WORKSPACE COMPONENT (Full Page Speaker Details) ---

const SpeakerDetailWorkspace = ({ speakerId, speakers, events, onUpdateSpeaker, onBack }) => {
    const [localSpeaker, setLocalSpeaker] = useState(speakers.find(s => s.id === speakerId));
    
    useEffect(() => {
        onUpdateSpeaker(localSpeaker);
    }, [localSpeaker]);

    if (!localSpeaker) return null;

    const speakerEvents = events.filter(e => e.talks.some(t => t.speakerIds.includes(speakerId)));

    return (
        <div className="flex flex-col h-full bg-zinc-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-zinc-950 to-black">
             {/* Header */}
            <div className="border-b border-white/10 bg-black/30 backdrop-blur w-full">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                            <button onClick={onBack} className="p-2 -ml-2 text-zinc-500 hover:text-white transition-colors"><ChevronLeft /></button>
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">{localSpeaker.name}</h1>
                                <p className="text-sm text-zinc-500 font-mono">Speaker Profile</p>
                            </div>
                        </div>
                        <Button onClick={onBack} variant="primary" size="sm">Done</Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Profile Info</h3>
                        <Input 
                            label="Full Name" 
                            value={localSpeaker.name} 
                            onChange={e => setLocalSpeaker({...localSpeaker, name: e.target.value})}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input 
                                label="Role" 
                                value={localSpeaker.role} 
                                onChange={e => setLocalSpeaker({...localSpeaker, role: e.target.value})}
                            />
                            <Input 
                                label="Company" 
                                value={localSpeaker.company} 
                                onChange={e => setLocalSpeaker({...localSpeaker, company: e.target.value})}
                            />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Social Media</h3>
                        <div className="grid grid-cols-2 gap-4">
                             <Input 
                                label="Email" 
                                icon={Mail}
                                value={localSpeaker.email} 
                                onChange={e => setLocalSpeaker({...localSpeaker, email: e.target.value})}
                            />
                             <Input 
                                label="Phone" 
                                icon={Phone}
                                placeholder="+1 555 000 000"
                                value={localSpeaker.phone || ''} 
                                onChange={e => setLocalSpeaker({...localSpeaker, phone: e.target.value})}
                            />
                             <Input 
                                label="Twitter" 
                                icon={Twitter}
                                value={localSpeaker.twitter} 
                                onChange={e => setLocalSpeaker({...localSpeaker, twitter: e.target.value})}
                            />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Speaking History</h3>
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
                            {speakerEvents.length > 0 ? (
                                <div className="divide-y divide-zinc-800">
                                    {speakerEvents.map(e => (
                                        <div key={e.id} className="p-4 flex justify-between items-center hover:bg-zinc-900/50">
                                            <div>
                                                <p className="text-white font-medium text-sm">{e.title}</p>
                                                <p className="text-xs text-zinc-500">{formatDate(e.date).full}</p>
                                            </div>
                                            <Badge className={getStatusColor(e.status)}>{e.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-zinc-500 text-sm">No events yet.</div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

// --- WORKSPACE COMPONENT (Event Context View) ---

const EventWorkspace = ({ eventId, events, speakers, onUpdateEvent, onBack, onDelete, onCreateSpeaker }) => {
    const [localEvent, setLocalEvent] = useState(events.find(e => e.id === eventId));
    const [tab, setTab] = useState('details');
    const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
    const [validationModalOpen, setValidationModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [attendeeInput, setAttendeeInput] = useState(localEvent?.attendeeCount || 0);

    useEffect(() => {
        onUpdateEvent(localEvent);
    }, [localEvent]);

    if (!localEvent) return null;

    const validateForCompletion = () => {
        const errors = [];
        if (!localEvent.date) errors.push("Missing Date");
        if (!localEvent.description) errors.push("Missing Description");
        if (localEvent.talks.length === 0) errors.push("Agenda is empty");
        const missingSlides = localEvent.talks.some(t => !t.slidesLink);
        if (missingSlides) errors.push("Missing Slides Link for one or more talks");
        return { valid: errors.length === 0, errors };
    };

    const handleMarkDone = () => {
        const { valid, errors } = validateForCompletion();
        if (!valid) {
            setValidationErrors(errors);
            setValidationModalOpen(true);
            return;
        }
        setIsCompletionModalOpen(true);
    };

    const confirmCompletion = () => {
        setLocalEvent({ ...localEvent, status: 'Done', attendeeCount: parseInt(attendeeInput) });
        setIsCompletionModalOpen(false);
    };

    // Sub-renderers
    const renderDetails = () => (
        <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <section className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Event Basics</h3>
                <Input 
                    label="Event Title"
                    value={localEvent.title} 
                    onChange={e => setLocalEvent({...localEvent, title: e.target.value})}
                    className="text-lg font-medium"
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input icon={Calendar} label="Date" type="date" value={localEvent.date} onChange={e => setLocalEvent({...localEvent, date: e.target.value})} />
                    <Input icon={Clock} label="Time" type="time" value={localEvent.time} onChange={e => setLocalEvent({...localEvent, time: e.target.value})} />
                </div>
                <Select 
                    label="Format"
                    value={localEvent.type}
                    onChange={e => setLocalEvent({...localEvent, type: e.target.value})}
                    options={[
                        { value: 'In-Person', label: 'In-Person' },
                        { value: 'Remote', label: 'Remote' },
                        { value: 'Hybrid', label: 'Hybrid' }
                    ]}
                />
                <TextArea 
                    label="Description"
                    rows={4} 
                    value={localEvent.description}
                    onChange={e => setLocalEvent({...localEvent, description: e.target.value})}
                />
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Important Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                        icon={Ticket}
                        label="Luma / Registration" 
                        placeholder="https://lu.ma/..."
                        value={localEvent.links.luma}
                        onChange={e => setLocalEvent({...localEvent, links: {...localEvent.links, luma: e.target.value}})}
                    />
                    <Input 
                        icon={Youtube}
                        label="YouTube URL" 
                        placeholder="https://youtube.com/..."
                        value={localEvent.links.youtube}
                        onChange={e => setLocalEvent({...localEvent, links: {...localEvent.links, youtube: e.target.value}})}
                    />
                    <Input 
                        icon={HardDrive}
                        label="Google Drive" 
                        placeholder="https://drive.google.com/..."
                        value={localEvent.links.drive}
                        onChange={e => setLocalEvent({...localEvent, links: {...localEvent.links, drive: e.target.value}})}
                    />
                    <Input 
                        icon={Video}
                        label="StreamYard / Live" 
                        placeholder="https://streamyard.com/..."
                        value={localEvent.links.streamyard}
                        onChange={e => setLocalEvent({...localEvent, links: {...localEvent.links, streamyard: e.target.value}})}
                    />
                     <Input 
                        icon={Map}
                        label="Google Maps" 
                        placeholder="https://maps.google.com/..."
                        value={localEvent.links.googleMaps}
                        onChange={e => setLocalEvent({...localEvent, links: {...localEvent.links, googleMaps: e.target.value}})}
                    />
                    <Input 
                        icon={MessageCircle}
                        label="WhatsApp Group" 
                        placeholder="https://chat.whatsapp.com/..."
                        value={localEvent.links.whatsapp}
                        onChange={e => setLocalEvent({...localEvent, links: {...localEvent.links, whatsapp: e.target.value}})}
                    />
                </div>
            </section>
        </div>
    );

    const renderAgenda = () => (
        <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Agenda</h3>
                <Button variant="secondary" size="sm" onClick={() => setLocalEvent({...localEvent, talks: [...localEvent.talks, { id: `t${Date.now()}`, title: '', speakerIds: [], slidesLink: '' }]})}>
                    <Plus size={14} className="mr-2"/> Add Talk
                </Button>
            </div>
            {localEvent.talks.map((talk, idx) => (
                <div key={talk.id} className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 space-y-4 relative z-10">
                     <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-mono text-zinc-500 shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start gap-4">
                                <Input 
                                    placeholder="Talk Title" 
                                    className="font-medium"
                                    value={talk.title}
                                    onChange={e => {
                                        const newTalks = [...localEvent.talks];
                                        newTalks[idx].title = e.target.value;
                                        setLocalEvent({...localEvent, talks: newTalks});
                                    }}
                                />
                                <button onClick={() => setLocalEvent({...localEvent, talks: localEvent.talks.filter(t => t.id !== talk.id)})} className="text-zinc-600 hover:text-red-400 p-2"><Trash2 size={16}/></button>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Speakers</label>
                                <SpeakerSelector 
                                    speakers={speakers}
                                    selectedIds={talk.speakerIds}
                                    onSelect={(id) => {
                                        const newTalks = [...localEvent.talks];
                                        const currentIds = newTalks[idx].speakerIds;
                                        newTalks[idx].speakerIds = currentIds.includes(id) ? currentIds.filter(sid => sid !== id) : [...currentIds, id];
                                        setLocalEvent({...localEvent, talks: newTalks});
                                    }}
                                    onCreate={(name) => {
                                        const newSpeakerId = onCreateSpeaker(name);
                                        const newTalks = [...localEvent.talks];
                                        newTalks[idx].speakerIds.push(newSpeakerId);
                                        setLocalEvent({...localEvent, talks: newTalks});
                                    }}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <LinkIcon size={14} className="text-zinc-600" />
                                <input 
                                    className="bg-transparent text-xs text-zinc-300 placeholder:text-zinc-700 w-full focus:outline-none"
                                    placeholder="Paste Slides URL here (Required for Done)"
                                    value={talk.slidesLink}
                                    onChange={e => {
                                        const newTalks = [...localEvent.talks];
                                        newTalks[idx].slidesLink = e.target.value;
                                        setLocalEvent({...localEvent, talks: newTalks});
                                    }}
                                />
                            </div>
                        </div>
                     </div>
                </div>
            ))}
        </div>
    );

    const renderChecklist = () => {
        // Dynamic "Requirements" List based on Event Status
        const requirements = [
            { id: 'req_title', text: 'Set Event Title', done: !!localEvent.title },
            { id: 'req_date', text: 'Set Event Date & Time', done: !!localEvent.date && !!localEvent.time },
            { id: 'req_desc', text: 'Add Description', done: !!localEvent.description },
            { id: 'req_type', text: 'Select Format', done: !!localEvent.type },
            { id: 'req_link_luma', text: 'Add Registration Link (Luma)', done: !!localEvent.links.luma },
            { id: 'req_talks', text: 'Add at least one talk', done: localEvent.talks.length > 0 },
        ];

        const toggleCustomItem = (catIdx, itemId) => {
             const newChecklist = [...localEvent.checklist];
             const item = newChecklist[catIdx].items.find(i => i.id === itemId);
             item.done = !item.done;
             setLocalEvent({...localEvent, checklist: newChecklist});
        };

        const updateCustomItemText = (catIdx, itemId, newText) => {
            const newChecklist = [...localEvent.checklist];
            const item = newChecklist[catIdx].items.find(i => i.id === itemId);
            item.text = newText;
            setLocalEvent({...localEvent, checklist: newChecklist});
        };

        const addCustomItem = (catIdx) => {
             const newChecklist = [...localEvent.checklist];
             // Add an empty item that can be edited immediately
             newChecklist[catIdx].items.push({ id: `i${Date.now()}`, text: '', done: false });
             setLocalEvent({...localEvent, checklist: newChecklist});
        };

        const removeCustomItem = (catIdx, itemId) => {
             const newChecklist = [...localEvent.checklist];
             newChecklist[catIdx].items = newChecklist[catIdx].items.filter(i => i.id !== itemId);
             setLocalEvent({...localEvent, checklist: newChecklist});
        };

        return (
            <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* System Requirements Section */}
                <div className="space-y-3">
                     <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider pl-2 flex items-center gap-2">
                        <Sparkles size={12} /> Event Readiness
                     </h3>
                     <div className="bg-zinc-900/20 border border-zinc-800 rounded-lg divide-y divide-zinc-800/50">
                        {requirements.map(req => (
                            <div key={req.id} className="flex items-center gap-3 p-3 opacity-75">
                                 <div className={cn(
                                     "w-5 h-5 rounded border flex items-center justify-center transition-colors", 
                                     req.done ? "bg-emerald-900/20 border-emerald-500/50 text-emerald-500" : "border-zinc-700 bg-zinc-800"
                                 )}>
                                     {req.done && <Check size={12} strokeWidth={3} />}
                                 </div>
                                 <span className={cn("text-sm flex-1", req.done ? "text-zinc-500" : "text-zinc-300")}>{req.text}</span>
                            </div>
                        ))}
                     </div>
                </div>

                {/* Custom Checklists */}
                {localEvent.checklist.map((category, catIdx) => (
                     <div key={catIdx} className="space-y-3">
                         <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider pl-2">{category.category}</h3>
                         <div className="space-y-1">
                             {category.items.map(item => (
                                 <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-zinc-900/40 rounded-lg group transition-colors">
                                     <button 
                                        onClick={() => toggleCustomItem(catIdx, item.id)}
                                        className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0", item.done ? "bg-emerald-500 border-emerald-500 text-black" : "border-zinc-700 hover:border-zinc-500")}
                                     >
                                         {item.done && <Check size={12} strokeWidth={3} />}
                                     </button>
                                     <input 
                                        className={cn(
                                            "flex-1 bg-transparent border-none text-sm focus:outline-none p-0", 
                                            item.done ? "text-zinc-500 line-through" : "text-zinc-300 placeholder:text-zinc-600"
                                        )}
                                        value={item.text}
                                        onChange={(e) => updateCustomItemText(catIdx, item.id, e.target.value)}
                                        placeholder="Type task name..."
                                        autoFocus={!item.text} // Auto-focus if it's a new empty item
                                     />
                                     <button 
                                        onClick={() => removeCustomItem(catIdx, item.id)}
                                        className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                     >
                                        <X size={14} />
                                     </button>
                                 </div>
                             ))}
                              <button onClick={() => addCustomItem(catIdx)} className="w-full text-left p-2 pl-10 text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-2">
                               <Plus size={12} /> Add Item
                             </button>
                         </div>
                     </div>
                 ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-zinc-950 to-black">
            {/* Header Area (Fixed) */}
            <div className="border-b border-white/10 bg-black/30 backdrop-blur w-full">
                <div className="max-w-7xl mx-auto px-6 pt-6">
                    <div className="flex justify-between items-start mb-6">
                         <div className="flex gap-4 items-center">
                            <button onClick={onBack} className="p-2 -ml-2 text-zinc-500 hover:text-white transition-colors"><ChevronLeft /></button>
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">{localEvent.title || 'Untitled Event'}</h1>
                                <p className="text-sm text-zinc-500 font-mono">{localEvent.date || 'No Date Set'}</p>
                            </div>
                         </div>
                         <div className="flex gap-3">
                            <Badge className={cn("px-3 py-1", getStatusColor(localEvent.status))}>{localEvent.status}</Badge>
                            {localEvent.status !== 'Done' && (
                                <Button size="sm" onClick={handleMarkDone} className="bg-white text-black hover:bg-zinc-200 border-0">
                                    Mark as Done
                                </Button>
                            )}
                         </div>
                    </div>

                    {/* Secondary Tabs */}
                    <div className="flex gap-8">
                        {['details', 'agenda', 'checklist', 'tools', 'settings'].map(t => (
                            <button 
                                key={t}
                                onClick={() => setTab(t)}
                                className={cn(
                                    "pb-3 text-sm font-medium border-b-2 transition-colors capitalize",
                                    tab === t ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {tab === 'details' && renderDetails()}
                    {tab === 'agenda' && renderAgenda()}
                    {tab === 'checklist' && renderChecklist()}
                    {tab === 'tools' && (
                         <div className="max-w-2xl text-center py-12">
                            <Wand2 className="mx-auto text-zinc-600 mb-4" size={48} />
                            <h3 className="text-zinc-300 font-medium">AI Tools</h3>
                            <p className="text-zinc-500 text-sm">Social Generator & Asset Creator available in v0.2</p>
                        </div>
                    )}
                    {tab === 'settings' && (
                        <div className="max-w-xl border border-red-900/30 bg-red-950/10 rounded-xl p-6">
                            <h3 className="text-red-400 font-medium mb-2">Delete Event</h3>
                            <p className="text-sm text-zinc-500 mb-4">Permanently remove this event and all its data. This action cannot be undone.</p>
                            <Button variant="danger" onClick={() => onDelete(localEvent.id)}>Delete Event</Button>
                        </div>
                    )}
                </div>
            </div>

             {/* Modals */}
             <Modal 
                isOpen={validationModalOpen} 
                onClose={() => setValidationModalOpen(false)} 
                title="Requirements Checklist"
                footer={<Button onClick={() => setValidationModalOpen(false)}>Okay, fixing it</Button>}
            >
                <ul className="space-y-2">
                    {validationErrors.map((err, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-red-400 bg-red-950/20 p-2 rounded">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" /> {err}
                        </li>
                    ))}
                </ul>
            </Modal>

            <Modal 
                isOpen={isCompletionModalOpen} 
                onClose={() => setIsCompletionModalOpen(false)} 
                title="Event Wrap Up"
                footer={<Button onClick={confirmCompletion} variant="success">Confirm Completion</Button>}
            >
                <div className="space-y-4">
                     <p className="text-sm text-zinc-400">The event is over. How many people showed up?</p>
                     <Input 
                        label="Final Attendee Count"
                        type="number" 
                        min="0"
                        value={attendeeInput} 
                        onChange={e => setAttendeeInput(e.target.value)} 
                    />
                </div>
            </Modal>
        </div>
    );
};

// --- APP ROOT ---

const App = () => {
    const [view, setView] = useState('dashboard');
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const [speakers, setSpeakers] = useState(MOCK_SPEAKERS);
    const [activeEventId, setActiveEventId] = useState(null);
    const [activeSpeakerId, setActiveSpeakerId] = useState(null);

    // Filter States
    const [yearFilter, setYearFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    // Modal States
    const [createEventModalOpen, setCreateEventModalOpen] = useState(false);

    const handleCreateEvent = (formData) => {
        const newEvent = {
            id: `e${Date.now()}`,
            title: formData.title,
            date: formData.date,
            time: formData.time,
            type: formData.type,
            status: 'In Progress',
            description: '',
            links: { youtube: '', luma: '', drive: '', whatsapp: '', streamyard: '', googleMaps: '' },
            checklist: JSON.parse(JSON.stringify(DEFAULT_CUSTOM_CHECKLIST)),
            talks: [],
            attendeeCount: 0
        };
        setEvents([newEvent, ...events]);
        setCreateEventModalOpen(false);
        setActiveEventId(newEvent.id);
        setView('workspace');
    };

    const handleUpdateEvent = (updatedEvent) => {
        setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    };

    const handleDeleteEvent = (id) => {
        setEvents(events.filter(e => e.id !== id));
        setView('dashboard');
    };

    const handleAddSpeaker = () => {
        const newSpeaker = { id: `s${Date.now()}`, name: 'New Speaker', role: '', company: '', email: '', twitter: '' };
        setSpeakers([...speakers, newSpeaker]);
        setActiveSpeakerId(newSpeaker.id);
        setView('speaker-detail');
    };

    const handleEditSpeaker = (id) => {
        setActiveSpeakerId(id);
        setView('speaker-detail');
    };

    const handleUpdateSpeaker = (updatedSpeaker) => {
        setSpeakers(speakers.map(s => s.id === updatedSpeaker.id ? updatedSpeaker : s));
    };

    const handleCreateSpeakerFromAgenda = (name) => {
        const newSpeaker = { 
            id: `s${Date.now()}`, 
            name: name, 
            role: '', 
            company: '', 
            email: '', 
            twitter: '' 
        };
        setSpeakers([...speakers, newSpeaker]);
        return newSpeaker.id;
    };

    return (
        <div className="min-h-screen bg-zinc-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-zinc-950 to-black text-zinc-200 font-sans selection:bg-indigo-500/30 flex flex-col">
            <TopNav activeTab={view} onTabChange={(tab) => { setView(tab); setActiveEventId(null); setActiveSpeakerId(null); }} />
            
            <main className="flex-1 overflow-hidden flex flex-col relative">
                {view === 'dashboard' && (
                    <div className="flex-1 overflow-y-auto">
                        <DashboardView 
                            events={events} 
                            onEventClick={(id) => { setActiveEventId(id); setView('workspace'); }}
                            onCreateEvent={() => setCreateEventModalOpen(true)}
                            yearFilter={yearFilter}
                            setYearFilter={setYearFilter}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                        />
                    </div>
                )}
                
                {view === 'speakers' && (
                    <div className="flex-1 overflow-y-auto">
                        <SpeakersView 
                            speakers={speakers} 
                            events={events} 
                            onAddSpeaker={handleAddSpeaker}
                            onEditSpeaker={handleEditSpeaker}
                        />
                    </div>
                )}
                
                {view === 'speaker-detail' && (
                    <SpeakerDetailWorkspace 
                        speakerId={activeSpeakerId}
                        speakers={speakers}
                        events={events}
                        onUpdateSpeaker={handleUpdateSpeaker}
                        onBack={() => setView('speakers')}
                    />
                )}
                
                {view === 'marketing' && (
                     <div className="flex-1 overflow-y-auto flex items-center justify-center">
                         <div className="text-center p-8">
                             <Megaphone size={48} className="mx-auto text-zinc-700 mb-4"/>
                             <h3 className="text-zinc-400 font-medium">Marketing</h3>
                         </div>
                     </div>
                )}

                 {view === 'analytics' && (
                     <div className="flex-1 overflow-y-auto flex items-center justify-center">
                         <div className="text-center p-8">
                             <BarChart3 size={48} className="mx-auto text-zinc-700 mb-4"/>
                             <h3 className="text-zinc-400 font-medium">Analytics</h3>
                         </div>
                     </div>
                )}

                {view === 'workspace' && (
                    <EventWorkspace 
                        eventId={activeEventId}
                        events={events}
                        speakers={speakers}
                        onUpdateEvent={handleUpdateEvent}
                        onBack={() => setView('dashboard')}
                        onDelete={handleDeleteEvent}
                        onCreateSpeaker={handleCreateSpeakerFromAgenda}
                    />
                )}
            </main>

            <CreateEventModal 
                isOpen={createEventModalOpen} 
                onClose={() => setCreateEventModalOpen(false)} 
                onCreate={handleCreateEvent}
            />
        </div>
    );
};

export default App;