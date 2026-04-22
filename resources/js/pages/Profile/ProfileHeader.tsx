// resources/js/Pages/Profile/components/ProfileHeader.tsx
import { Upload } from 'lucide-react';

interface ProfileHeaderProps {
    user: {
        name: string;
        email: string;
        profileImage: string | null;
        role: 'user' | 'host' | 'admin';
    };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {

    const getRoleLabel = () => {
        switch (user.role) {
            case 'host':
                return '🏢 Anbieter:in';
            case 'admin':
                return '🛠️ Admin';
            default:
                return '👤 Nutzer:in';
        }
    };

    return (
        <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-200">
            <div className="flex items-start gap-6">

                {/* Profilbild */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative group">
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={user.name}
                                className="w-24 h-24 rounded-2xl object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 bg-gradient-to-br from-[#5555ff] to-[#7575ff] rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {/* Upload Icon */}
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#5555ff] rounded-full flex items-center justify-center text-white shadow-lg">
                            <Upload className="w-5 h-5" />
                        </div>
                    </div>

                    <label className="cursor-pointer">
                        <span className="text-sm text-[#5555ff] hover:text-[#4444ee] transition-colors font-semibold">
                            Profilbild hochladen
                        </span>
                        <input type="file" accept="image/*" className="hidden" />
                    </label>
                </div>

                {/* User Infos */}
                <div className="flex-1">
                    <h1 className="text-3xl mb-2 font-bold">{user.name}</h1>
                    <p className="text-gray-600 mb-4">{user.email}</p>

                    <div className="flex items-center gap-3">
                        <span className="px-4 py-2 bg-[#5555ff] text-white rounded-lg text-sm font-semibold">
                            {getRoleLabel()}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}
