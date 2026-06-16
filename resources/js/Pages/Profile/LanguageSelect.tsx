// Reusable multi-select dropdown for profile languages.
// The dropdown keeps its open state, search state and outside-click handling locally.

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { useIntl } from 'react-intl';

const AVAILABLE_LANGUAGES = [
    { value: 'Deutsch', labelKey: 'language.de' },
    { value: 'English', labelKey: 'language.en' },
    { value: 'Español', labelKey: 'language.es' },
    { value: 'Français', labelKey: 'language.fr' },
    { value: 'Italiano', labelKey: 'language.it' },
    { value: 'Nederlands', labelKey: 'language.nl' },
    { value: 'Polski', labelKey: 'language.pl' },
    { value: 'Português', labelKey: 'language.pt' },
    { value: 'Русский', labelKey: 'language.ru' },
    { value: '中文', labelKey: 'language.zh' },
    { value: '日本語', labelKey: 'language.ja' },
    { value: '한국어', labelKey: 'language.ko' },
] as const;

interface LanguageSelectProps {
    selected: string[];
    onChange: (languages: string[]) => void;
}

export function LanguageSelect({ selected, onChange }: LanguageSelectProps) {
    const intl = useIntl();

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Returns the translated text for the given translation key.
    const t = (id: string, values?: Record<string, string | number>) =>
        intl.formatMessage({ id }, values);

    // Returns the visible label for a language value.
    const getLanguageLabel = (language: string) => {
        const foundLanguage = AVAILABLE_LANGUAGES.find((item) => item.value === language);

        return foundLanguage ? t(foundLanguage.labelKey) : language;
    };

    // Close the dropdown when the user clicks outside of it.
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close the dropdown when the user presses Escape.
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Add or remove a language from the selected language list.
    const toggleLanguage = (language: string) => {
        const updatedLanguages = selected.includes(language)
            ? selected.filter((selectedLanguage) => selectedLanguage !== language)
            : [...selected, language];

        onChange(updatedLanguages);
    };

    // Filter available languages by the current search value.
    const filteredLanguages = AVAILABLE_LANGUAGES.filter((language) =>
        t(language.labelKey).toLowerCase().includes(search.toLowerCase()),
    );

    // Build the visible button label based on the current selection.
    const label =
        selected.length === 0
            ? t('profile.languages.placeholder')
            : t('profile.languages.selectedCount', { count: selected.length });

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">
                {t('profile.languages.label')}
            </label>

            <div ref={dropdownRef} className="relative">
                {/* Dropdown trigger */}
                <button
                    type="button"
                    onClick={() => setIsOpen((previousValue) => !previousValue)}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                >
                    <span className="text-gray-600">
                        {label}
                    </span>

                    <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                    />
                </button>

                {/* Dropdown content */}
                {isOpen && (
                    <div
                        role="listbox"
                        aria-multiselectable="true"
                        aria-label={t('profile.languages.placeholder')}
                        className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
                    >
                        {/* Search input */}
                        <div className="border-b border-gray-200 p-3">
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder={t('profile.languages.searchPlaceholder')}
                                autoFocus
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                            />
                        </div>

                        {/* Language options */}
                        <div className="max-h-60 overflow-y-auto">
                            {filteredLanguages.length === 0 ? (
                                <p className="px-4 py-3 text-sm text-gray-500">
                                    {t('profile.languages.noResults')}
                                </p>
                            ) : (
                                filteredLanguages.map((language) => {
                                    const isSelected = selected.includes(language.value);

                                    return (
                                        <button
                                            key={language.value}
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            onClick={() => toggleLanguage(language.value)}
                                            className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                                                isSelected ? 'bg-gray-50 text-[#5555ff]' : ''
                                            }`}
                                        >
                                            <span className="font-semibold">
                                                {t(language.labelKey)}
                                            </span>

                                            {isSelected && (
                                                <Check
                                                    className="h-4 w-4 text-[#5555ff]"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Selected language tags */}
            {selected.length > 0 && (
                <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-label={t('profile.languages.selectedGroupAria')}
                >
                    {selected.map((language) => {
                        const languageLabel = getLanguageLabel(language);

                        return (
                            <span
                                key={language}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#5555ff] px-3 py-1.5 text-sm text-white"
                            >
                                {languageLabel}

                                <button
                                    type="button"
                                    onClick={() => toggleLanguage(language)}
                                    aria-label={t('profile.languages.removeAria', { language: languageLabel })}
                                    className="rounded-full p-0.5 transition-colors hover:bg-white/20"
                                >
                                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
