// ─── Pages/Profile/LanguageSelect.tsx ────────────────────────────────────────
// Extrahiert aus dem Figma-Code – war inline in der Page.
// - useRef + useEffect für Click-Outside bleibt hier lokal (betrifft nur diese Komponente)
// - Keyboard-Navigation: Escape schließt Dropdown

import { useEffect, useRef } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

const AVAILABLE_LANGUAGES = [
    'Deutsch', 'English', 'Español', 'Français', 'Italiano',
    'Nederlands', 'Polski', 'Português', 'Русский', '中文', '日本語', '한국어',
] as const;

interface LanguageSelectProps {
    selected: string[];
    onChange: (languages: string[]) => void;
}

export function LanguageSelect({ selected, onChange }: LanguageSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click-Outside schließt Dropdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Escape-Taste schließt Dropdown
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const toggleLanguage = (lang: string) => {
        onChange(
            selected.includes(lang)
                ? selected.filter((l) => l !== lang)
                : [...selected, lang]
        );
    };

    const filtered = AVAILABLE_LANGUAGES.filter((lang) =>
        lang.toLowerCase().includes(search.toLowerCase())
    );

    const label =
        selected.length === 0
            ? 'Sprachen auswählen'
            : `${selected.length} ${selected.length === 1 ? 'Sprache' : 'Sprachen'} ausgewählt`;

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Sprachen</label>

            <div ref={dropdownRef} className="relative">
                {/* Trigger */}
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200
                               bg-white px-4 py-3 transition-colors hover:border-gray-300
                               focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                >
                    <span className="text-gray-600">{label}</span>
                    <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                    />
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div
                        role="listbox"
                        aria-multiselectable="true"
                        aria-label="Sprachen auswählen"
                        className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80
                                   overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
                    >
                        {/* Suche */}
                        <div className="border-b border-gray-200 p-3">
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Sprache suchen…"
                                autoFocus
                                className="w-full rounded-lg border border-gray-200 px-3 py-2
                                           focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                            />
                        </div>

                        {/* Liste */}
                        <div className="max-h-60 overflow-y-auto">
                            {filtered.length === 0 ? (
                                <p className="px-4 py-3 text-sm text-gray-500">Keine Sprache gefunden.</p>
                            ) : (
                                filtered.map((lang) => {
                                    const isSelected = selected.includes(lang);
                                    return (
                                        <button
                                            key={lang}
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            onClick={() => toggleLanguage(lang)}
                                            className={`flex w-full items-center justify-between px-4 py-3
                                                       text-left transition-colors hover:bg-gray-50
                                                       ${isSelected ? 'bg-gray-50 text-[#5555ff]' : ''}`}
                                        >
                                            <span className="font-semibold">{lang}</span>
                                            {isSelected && (
                                                <Check className="h-4 w-4 text-[#5555ff]" aria-hidden="true" />
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Ausgewählte Tags */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-2" role="group" aria-label="Ausgewählte Sprachen">
                    {selected.map((lang) => (
                        <span
                            key={lang}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#5555ff] px-3 py-1.5 text-sm text-white"
                        >
                            {lang}
                            <button
                                type="button"
                                onClick={() => toggleLanguage(lang)}
                                aria-label={`${lang} entfernen`}
                                className="rounded-full p-0.5 transition-colors hover:bg-white/20"
                            >
                                <X className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
