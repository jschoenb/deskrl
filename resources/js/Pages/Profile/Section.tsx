import { ReactNode, useId } from 'react';
import { useIntl } from 'react-intl';

interface SectionProps {
    title: string;
    children: ReactNode;
    onSave: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function Section({
                            title,
                            children,
                            onSave,
                            onCancel,
                            isLoading = false,
                        }: SectionProps) {
    const intl = useIntl();

    // Generate a stable heading ID for aria-labelledby.
    const headingId = useId();

    // Returns the translated text for the given translation key.
    const t = (id: string) => intl.formatMessage({ id });

    return (
        <div
            role="region"
            aria-labelledby={headingId}
            className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
        >
            {/* Section heading used for visual structure and accessibility */}
            <h2 id={headingId} className="mb-6 text-xl font-bold sm:text-2xl">
                {title}
            </h2>

            <div className="space-y-6">
                {/* Section-specific form fields */}
                {children}

                {/* Shared section actions */}
                <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={isLoading}
                        aria-busy={isLoading}
                        className="rounded-xl bg-[#5555ff] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4444ee] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? t('common.saving') : t('common.saveChanges')}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {t('common.cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
}
