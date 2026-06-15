import { Upload } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useIntl } from 'react-intl';
import { VerificationBadge } from './VerificationBadge';
import type { AccountType, VerificationStatus } from '@/types/profile';

interface ProfileHeaderProps {
    user: {
        first_name: string;
        last_name: string;
        email: string;
        profileImage: string | null;
        role: AccountType;
        verificationStatus?: VerificationStatus | null;
    };
}

const ROLE_LABEL_KEYS: Record<AccountType, string> = {
    user: 'profile.role.user',
    private_host: 'profile.role.privateHost',
    commercial_host: 'profile.role.commercialHost',
    admin: 'profile.role.admin',
};

const MAX_IMAGE_SIZE_MB = 5;

export function ProfileHeader({ user }: ProfileHeaderProps) {
    const intl = useIntl();

    const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
    const displayName = fullName || user.email;
    const initial = displayName.charAt(0).toUpperCase();

    // Returns the translated text for the given translation key.
    const t = (id: string, values?: Record<string, string | number>) =>
        intl.formatMessage({ id }, values);

    // Check whether the current profile belongs to a host account.
    const isHost =
        user.role === 'private_host' ||
        user.role === 'commercial_host';

    // Upload the selected profile image through an Inertia POST request.
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        // Prevent files that are too large from being uploaded.
        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
            toast.error(t('profile.header.imageTooLarge', { maxSize: MAX_IMAGE_SIZE_MB }));
            return;
        }

        router.post(
            '/profile/image',
            { profile_image: file },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => toast.success(t('profile.header.imageUpdated')),
                onError: () => toast.error(t('profile.header.imageUploadError')),
            },
        );
    };

    return (
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 sm:p-8">
            <div className="flex flex-col items-start gap-6 sm:flex-row">
                {/* Profile image area */}
                <div className="flex w-full flex-col items-center gap-3 sm:w-auto">
                    <div className="group relative">
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={t('profile.header.profileImageAlt', { name: displayName })}
                                className="h-24 w-24 rounded-2xl object-cover"
                            />
                        ) : (
                            <div
                                className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5555ff] to-[#7575ff] text-4xl font-bold text-white"
                                aria-label={t('profile.header.avatarAria', { name: displayName })}
                            >
                                {initial}
                            </div>
                        )}

                        {/* Hover overlay for changing the profile image */}
                        <label
                            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                            aria-label={t('profile.header.changeProfileImageAria')}
                        >
                            <Upload className="h-6 w-6 text-white" aria-hidden="true" />

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>

                        {/* Small upload icon badge */}
                        <div
                            className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#5555ff] text-white shadow-lg"
                            aria-hidden="true"
                        >
                            <Upload className="h-5 w-5" />
                        </div>
                    </div>

                    {/* Separate upload trigger for better accessibility */}
                    <label className="cursor-pointer">
                        <span className="text-sm font-semibold text-[#5555ff] transition-colors hover:text-[#4444ee]">
                            {user.profileImage
                                ? t('profile.header.changeImage')
                                : t('profile.header.uploadImage')}
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            aria-label={t('profile.header.uploadProfileImageAria')}
                        />
                    </label>

                    <p className="max-w-[120px] text-center text-xs text-gray-500">
                        {t('profile.header.imageHint', { maxSize: MAX_IMAGE_SIZE_MB })}
                    </p>
                </div>

                {/* Profile information area */}
                <div className="w-full flex-1 sm:w-auto">
                    <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
                        {displayName}
                    </h1>

                    <p className="mb-4 text-gray-600">
                        {user.email}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Role badge */}
                        <span
                            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                                isHost ? 'bg-[#e63cff]' : 'bg-[#5555ff]'
                            }`}
                        >
                            {t(ROLE_LABEL_KEYS[user.role])}
                        </span>

                        {/* Verification status badge */}
                        <VerificationBadge status={user.verificationStatus} />
                    </div>
                </div>
            </div>
        </div>
    );
}
