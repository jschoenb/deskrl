import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

// Information passed from the header or from pages that open the modal.
interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode ?? 'login');
        }
    }, [isOpen, initialMode]);

    // Inertia form state for login and registration.
    // Registration always creates a normal user account.
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    if (!isOpen) {
        return null;
    }

    // Switches between login and registration and clears old form data/errors.
    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        clearErrors();
        reset();
    };

    // Sends either login data or registration data to the Laravel AuthController.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'login') {
            post('/login', {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });

            return;
        }

        post('/register', {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl overflow-y-auto max-h-[95vh]">
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-all hover:scale-110 z-[110]"
                    aria-label="Schließen"
                >
                    <X className="w-8 h-8" />
                </button>

                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">😊</div>

                    <h2 className="text-3xl font-bold mb-2 text-gray-900">
                        {mode === 'login' ? 'Willkommen zurück!' : 'Jetzt registrieren'}
                    </h2>

                    <p className="text-gray-600">
                        {mode === 'login'
                            ? 'Melden Sie sich an, um fortzufahren'
                            : 'Erstellen Sie Ihr Deskrl-Konto'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                                    Vorname
                                </label>

                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    placeholder="Anna"
                                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                                        errors.first_name
                                            ? 'border-red-500'
                                            : 'border-gray-200 focus:ring-2 focus:ring-[#5555ff]'
                                    }`}
                                    required
                                />

                                {errors.first_name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.first_name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                                    Nachname
                                </label>

                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    placeholder="Muster"
                                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                                        errors.last_name
                                            ? 'border-red-500'
                                            : 'border-gray-200 focus:ring-2 focus:ring-[#5555ff]'
                                    }`}
                                    required
                                />

                                {errors.last_name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.last_name}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                            E-Mail
                        </label>

                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="ihre@email.com"
                            className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                                errors.email
                                    ? 'border-red-500'
                                    : 'border-gray-200 focus:ring-2 focus:ring-[#5555ff]'
                            }`}
                            required
                        />

                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                            Passwort
                        </label>

                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                                errors.password
                                    ? 'border-red-500'
                                    : 'border-gray-200 focus:ring-2 focus:ring-[#5555ff]'
                            }`}
                            required
                        />

                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {mode === 'register' && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                                Passwort bestätigen
                            </label>

                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                                    errors.password
                                        ? 'border-red-500'
                                        : 'border-gray-200 focus:ring-2 focus:ring-[#5555ff]'
                                }`}
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#e63cff] hover:bg-[#d12ee6] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {processing
                            ? mode === 'login'
                                ? 'Anmeldung läuft...'
                                : 'Registrierung läuft...'
                            : mode === 'login'
                                ? 'Anmelden'
                                : 'Registrieren'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="text-[#5555ff] font-bold hover:text-[#4444ee] transition-colors"
                    >
                        {mode === 'login'
                            ? 'Noch kein Konto? Jetzt registrieren'
                            : 'Bereits ein Konto? Zum Login'}
                    </button>
                </div>
            </div>
        </div>
    );
}
