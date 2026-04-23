import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

//needed information from header
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

    // Inertia Form-Helper to communicate with AuthController
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        firstName: '',
        lastName: '',
        name: '', // firstName + lastName
        email: '',
        password: '',
        role: 'user' as 'user' | 'host',
    });

    if (!isOpen) return null;

    //toggles between login and registration and clears the form
    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        clearErrors();
        reset();
    };

    //submit form and send data to AuthController
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        //Login: sends email and password to AuthController@login
        if (mode === 'login') {
            post('/login', {
                onSuccess: () => { onClose(); reset(); },
            });
        }
        //Registration: sends data to AuthController@register
        else {
            const fullName = `${data.firstName} ${data.lastName}`.trim();
            data.name = fullName;

            post('/register', {
                onSuccess: () => { onClose(); reset(); },
            });
        }
    };

    return (
        //modal layout
        /* dark background overlay */
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            {/* modal card */}
            <div className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl overflow-y-auto max-h-[95vh]">
                {/* close button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-all hover:scale-110 z-[110]" // z-Index erhöht
                    aria-label="Schließen"
                >
                    <X className="w-8 h-8" />
                </button>

                {/* Header and title */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4 animate-bounce">😊</div>
                    <h2 className="text-3xl font-bold mb-2 text-gray-900">
                        {mode === 'login' ? 'Willkommen zurück!' : 'Jetzt registrieren'}
                    </h2>
                    <p className="text-gray-600">
                        {mode === 'login' ? 'Melden Sie sich an, um fortzufahren' : 'Erstellen Sie Ihr Deskrl-Konto'}
                    </p>
                </div>

                {/* Input form */ }
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* name */ }
                    {mode === 'register' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 ml-1">Vorname</label>
                                <input
                                    type="text"
                                    value={data.firstName}
                                    onChange={e => setData('firstName', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5555ff] outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 ml-1">Nachname</label>
                                <input
                                    type="text"
                                    value={data.lastName}
                                    onChange={e => setData('lastName', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5555ff] outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* email */ }
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 ml-1">E-Mail</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            placeholder="ihre@email.com"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5555ff] outline-none"
                            required
                        />
                        {/* displays Laravel error messages */}
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* password */ }
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 ml-1">Passwort</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            placeholder="••••••••"
                            // input border turns red if an error for 'password' exists
                            className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                                errors.password ? 'border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-[#5555ff]'
                            }`}
                            required
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* role selection in registration */}
                    {mode === 'register' && (
                        <div className="space-y-3 pt-2">
                            <p className="text-sm font-bold text-gray-700">Ich möchte...</p>
                            <div className="grid gap-3">
                                <label className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${data.role === 'user' ? 'border-[#5555ff] bg-[#f5f5ff]' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <input type="radio" name="role" className="text-[#5555ff] focus:ring-[#5555ff]" checked={data.role === 'user'} onChange={() => setData('role', 'user')} />
                                    <div>
                                        <div className="font-bold text-sm text-gray-900">Einen Workspace suchen</div>
                                        <div className="text-xs text-gray-500">Ich möchte Arbeitsräume buchen</div>
                                    </div>
                                </label>
                                <label className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${data.role === 'host' ? 'border-[#5555ff] bg-[#f5f5ff]' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <input type="radio" name="role" className="text-[#5555ff] focus:ring-[#5555ff]" checked={data.role === 'host'} onChange={() => setData('role', 'host')} />
                                    <div>
                                        <div className="font-bold text-sm text-gray-900">Workspace anbieten</div>
                                        <div className="text-xs text-gray-500">Ich möchte meine Räume vermieten</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* submit button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#e63cff] hover:bg-[#d12ee6] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {mode === 'login' ? 'Anmelden' : 'Registrieren'}
                    </button>
                </form>

                {/* switch mode (login/registration) */}
                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <button onClick={toggleMode} className="text-[#5555ff] font-bold hover:text-[#4444ee] transition-colors">
                        {mode === 'login' ? 'Noch kein Konto? Jetzt registrieren' : 'Bereits ein Konto? Zum Login'}
                    </button>
                </div>
            </div>
        </div>
    );
}
