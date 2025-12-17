import { type AgendaItem } from '../../features/events/types'
import { useSpeakers, useCreateSpeaker } from '../../features/speakers/hooks'
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react'
import { SpeakerSelector } from './SpeakerSelector'

interface AgendaProps {
    items: AgendaItem[]
    onChange: (items: AgendaItem[]) => void
}

export function Agenda({ items = [], onChange }: AgendaProps) {
    const { data: speakers } = useSpeakers()
    const createSpeaker = useCreateSpeaker()

    const handleAddItem = () => {
        const newItem: AgendaItem = {
            id: Math.random().toString(36).substr(2, 9),
            title: '',
        }
        onChange([...items, newItem])
    }

    const handleUpdateItem = (id: string, updates: Partial<AgendaItem>) => {
        onChange(items.map(item => item.id === id ? { ...item, ...updates } : item))
    }

    const handleDeleteItem = (id: string) => {
        onChange(items.filter(item => item.id !== id))
    }

    const handleCreateSpeaker = async (name: string, itemId: string) => {
        const speaker = await createSpeaker.mutateAsync({ name, role: 'Speaker' })
        handleUpdateItem(itemId, { speakerId: speaker.id, speakerName: speaker.name })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Agenda</h2>
                <button
                    onClick={handleAddItem}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Talk
                </button>
            </div>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={item.id} className="group relative bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all">
                        <div className="flex gap-5">
                            {/* Number */}
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-medium text-zinc-500 mt-1">
                                {String(index + 1).padStart(2, '0')}
                            </div>

                            <div className="flex-1 space-y-3">
                                {/* Title */}
                                <div>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                                        placeholder="Talk Title"
                                        className="w-full bg-transparent text-base font-medium text-white placeholder:text-zinc-600 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Speakers */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Speaker</label>
                                        <SpeakerSelector
                                            speakers={speakers || []}
                                            selectedIds={item.speakerId ? [item.speakerId] : []}
                                            onSelect={(id) => {
                                                const speaker = speakers?.find(s => s.id === id)
                                                handleUpdateItem(item.id, { speakerId: id, speakerName: speaker?.name })
                                            }}
                                            onRemove={() => {
                                                handleUpdateItem(item.id, { speakerId: undefined, speakerName: undefined })
                                            }}
                                            onCreate={(name) => handleCreateSpeaker(name, item.id)}
                                        />
                                    </div>

                                    {/* Slides URL */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Presentation Link</label>
                                        <div className="relative group/input">
                                            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-zinc-400 transition-colors">
                                                <LinkIcon size={12} />
                                            </div>
                                            <input
                                                type="url"
                                                value={item.slidesUrl || ''}
                                                onChange={(e) => handleUpdateItem(item.id, { slidesUrl: e.target.value })}
                                                placeholder="https://slides.com/..."
                                                className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 -mr-2 -mt-2 text-zinc-600 hover:text-red-400 transition-all self-start"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                        <p className="text-zinc-500 text-xs">No talks added yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
