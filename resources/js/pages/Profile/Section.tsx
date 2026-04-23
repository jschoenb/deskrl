// resources/js/Pages/Profile/components/Section.tsx
import React, { ReactNode } from 'react';

interface SectionProps {
    title: string;
    children: ReactNode;
    onSave: () => void;
    onCancel: () => void;
}

export function Section({ title, children, onSave, onCancel }: SectionProps) {
    return (
        <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
            <h2 className="text-2xl mb-6 font-bold">{title}</h2>
            <div className="space-y-6">
                {children}
                <div className="flex gap-4 mt-6">
                    <button
                        onClick={onSave}
                        className="px-6 py-3 bg-[#5555ff] hover:bg-[#4444ee] text-white rounded-xl transition-colors font-semibold"
                    >
                        Änderungen speichern
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl transition-colors font-semibold"
                    >
                        Abbrechen
                    </button>
                </div>
            </div>
        </div>
    );
}
