import { useState, useRef, useEffect } from 'react'
import { Search, X, Plus } from 'lucide-react'
import { type Speaker } from '../../features/speakers/types'

interface SpeakerSelectorProps {
    speakers: Speaker[]
    selectedIds: string[]
    onSelect: (id: string) => void
    onRemove?: (id: string) => void
    onCreate: (name: string) => void
}

export function SpeakerSelector({ speakers, selectedIds, onSelect, onRemove, onCreate }: SpeakerSelectorProps) {
    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [wrapperRef])

    const filteredSpeakers = speakers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) &&
        !selectedIds.includes(s.id)
    )

    const handleSelect = (id: string) => {
        onSelect(id)
        setSearch('')
        setIsOpen(false)
    }

    const handleCreate = () => {
        if (!search) return
        onCreate(search)
        setSearch('')
        setIsOpen(false)
    }

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative">
                <div className="flex items-center border border-zinc-800 rounded-lg bg-black/50 focus-within:ring-1 focus-within:ring-zinc-600 focus-within:border-zinc-600 transition-all">
                    <Search size={14} className="ml-2.5 text-zinc-500" />
                    <input
                        className="w-full bg-transparent border-none pl-2 pr-3 py-2 text-xs text-zinc-300 placeholder:text-zinc-700 focus:outline-none font-mono"
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

            {selectedIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedIds.map(id => {
                        const s = speakers.find(sp => sp.id === id)
                        if (!s) return null
                        return (
                            <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700">
                                {s.name}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onRemove) {
                                            onRemove(id);
                                        }
                                    }}
                                    className="hover:text-red-400 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
