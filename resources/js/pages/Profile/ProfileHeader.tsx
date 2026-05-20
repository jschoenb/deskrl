// ─── Pages/Profile/ProfileHeader.tsx ─────────────────────────────────────────

import { Upload } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { VerificationBadge } from './VerificationBadge';
import type { UserRole, VerificationStatus } from '../../types/profile';

interface ProfileHeaderProps {
    user: {
        first_name: string;
        last_name: string;
        email: string;
        profileImage: string | null;
        role: UserRole;
        verificationStatus?: VerificationStatus | null;
    };
}

const ROLE_LABELS: Record<UserRole, string> = {
    host: 'Anbieter:in',
    admin: 'Admin',
    user: 'Nutzer:in',
};

const MAX_IMAGE_SIZE_MB = 5;

export function ProfileHeader({ user }: ProfileHeaderProps) {
    const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
    const displayName = fullName || user.email;
    const initial = displayName.charAt(0).toUpperCase();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
            toast.error(`Bild zu groß. Maximale Größe: ${MAX_IMAGE_SIZE_MB} MB`);
            return;
        }

        router.post(
            '/profile/image',
            { profile_image: file },
            {
                forceFormData: true,
                onSuccess: () => toast.success('Profilbild aktualisiert.'),
                onError: () => toast.error('Fehler beim Hochladen.'),
            }
        );
    };

    return (
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 sm:p-8">
            <div className="flex flex-col items-start gap-6 sm:flex-row">
                <div className="flex w-full flex-col items-center gap-3 sm:w-auto">
                    <div className="group relative">
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={`Profilbild von ${displayName}`}
                                className="h-24 w-24 rounded-2xl object-cover"
                            />
                        ) : (
                            <div
                                className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5555ff] to-[#7575ff] text-4xl font-bold text-white"
                                aria-label={`Avatar von ${displayName}`}
                            >
                                {initial}
                            </div>
                        )}

                        <label
                            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                            aria-label="Profilbild ändern"
                        >
                            <Upload className="h-6 w-6 text-white" aria-hidden="true" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>

                        <div
                            className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#5555ff] text-white shadow-lg"
                            aria-hidden="true"
                        >
                            <Upload className="h-5 w-5" />
                        </div>
                    </div>

                    <label className="cursor-pointer">
                        <span className="text-sm font-semibold text-[#5555ff] transition-colors hover:text-[#4444ee]">
                            {user.profileImage ? 'Bild ändern' : 'Bild hochladen'}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            aria-label="Profilbild hochladen"
                        />
                    </label>

                    <p className="max-w-[120px] text-center text-xs text-gray-500">
                        JPG, PNG oder WEBP, max. 5 MB
                    </p>
                </div>

                <div className="w-full flex-1 sm:w-auto">
                    <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
                        {displayName}
                    </h1>

                    <p className="mb-4 text-gray-600">
                        {user.email}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        <span
                            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                                user.role === 'host' ? 'bg-[#e63cff]' : 'bg-[#5555ff]'
                            }`}
                        >
                            {ROLE_LABELS[user.role]}
                        </span>

                        <VerificationBadge status={user.verificationStatus} />
                    </div>
                </div>
            </div>
        </div>
    );
}



// // ─── Pages/Profile/ProfileHeader.tsx ─────────────────────────────────────────
// // Gegenüber deiner Version:
// // - VerificationBadge integriert (war vorher fehlend)
// // - Upload-Handler via Inertia (router.post mit FormData)
// // - aria-label auf dem Upload-Input
//
// import { Upload } from 'lucide-react';
// import { router } from '@inertiajs/react';
// import { toast } from 'sonner';
// import { VerificationBadge } from './VerificationBadge';
// import type { UserRole, VerificationStatus } from '../../types/profile';
//
// interface ProfileHeaderProps {
//     user: {
//         first_name: string;
//         last_name: string;
//         email: string;
//         profileImage: string | null;
//         role: UserRole;
//         verificationStatus?: VerificationStatus | null;
//     };
// }
//
// const ROLE_LABELS: Record<UserRole, string> = {
//     host: '🏢 Anbieter:in',
//     admin: '🛠️ Admin',
//     user: '👤 Nutzer:in',
// };
//
// const MAX_IMAGE_SIZE_MB = 5;
//
// export function ProfileHeader({ user }: ProfileHeaderProps) {
//     const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;
//
//         if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
//             toast.error(`Bild zu groß. Maximale Größe: ${MAX_IMAGE_SIZE_MB} MB`);
//             return;
//         }
//
//         // Inertia-kompatibler Upload via FormData
//         router.post(
//             '/profile/image',
//             { profile_image: file },
//             {
//                 forceFormData: true,
//                 onSuccess: () => toast.success('Profilbild aktualisiert.'),
//                 onError: () => toast.error('Fehler beim Hochladen.'),
//             }
//         );
//     };
//
//     const initial = user.name?.charAt(0)?.toUpperCase() ?? '?';
//
//     return (
//         <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 sm:p-8">
//             <div className="flex flex-col items-start gap-6 sm:flex-row">
//
//                 {/* Profilbild + Upload */}
//                 <div className="flex w-full flex-col items-center gap-3 sm:w-auto">
//                     <div className="group relative">
//                         {user.profileImage ? (
//                             <img
//                                 src={user.profileImage}
//                                 alt={`Profilbild von ${user.name}`}
//                                 className="h-24 w-24 rounded-2xl object-cover"
//                             />
//                         ) : (
//                             <div
//                                 className="flex h-24 w-24 items-center justify-center rounded-2xl
//                                            bg-gradient-to-br from-[#5555ff] to-[#7575ff]
//                                            text-4xl font-bold text-white"
//                                 aria-label={`Avatar von ${user.name}`}
//                             >
//                                 {initial}
//                             </div>
//                         )}
//
//                         {/* Hover-Overlay zum Wechseln */}
//                         <label
//                             className="absolute inset-0 flex cursor-pointer items-center justify-center
//                                        rounded-2xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
//                             aria-label="Profilbild ändern"
//                         >
//                             <Upload className="h-6 w-6 text-white" aria-hidden="true" />
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleImageUpload}
//                                 className="hidden"
//                             />
//                         </label>
//
//                         {/* Upload-Badge */}
//                         <div
//                             className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center
//                                        rounded-full bg-[#5555ff] text-white shadow-lg"
//                             aria-hidden="true"
//                         >
//                             <Upload className="h-5 w-5" />
//                         </div>
//                     </div>
//
//                     <label className="cursor-pointer">
//                         <span className="text-sm font-semibold text-[#5555ff] transition-colors hover:text-[#4444ee]">
//                             {user.profileImage ? 'Bild ändern' : 'Bild hochladen'}
//                         </span>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageUpload}
//                             className="hidden"
//                             aria-label="Profilbild hochladen"
//                         />
//                     </label>
//                     <p className="max-w-[120px] text-center text-xs text-gray-500">
//                         JPG, PNG oder WEBP, max. 5 MB
//                     </p>
//                 </div>
//
//                 {/* Infos */}
//                 <div className="w-full flex-1 sm:w-auto">
//                     <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{user.name}</h1>
//                     <p className="mb-4 text-gray-600">{user.email}</p>
//
//                     <div className="flex flex-wrap items-center gap-3">
//                         <span
//                             className={`rounded-lg px-4 py-2 text-sm font-semibold text-white
//                                        ${user.role === 'host' ? 'bg-[#e63cff]' : 'bg-[#5555ff]'}`}
//                         >
//                             {ROLE_LABELS[user.role]}
//                         </span>
//
//                         <VerificationBadge status={user.verificationStatus} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
