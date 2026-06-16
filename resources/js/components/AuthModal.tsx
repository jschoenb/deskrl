import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useIntl } from 'react-intl';

// Information passed from the header or from pages that open the modal.
interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const intl = useIntl();

    const [mode, setMode] = useState<'login' | 'register'>(initialMode);

    // Returns the translated text for the given translation key.
    const t = (id: string) => intl.formatMessage({ id });

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
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

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
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-all hover:scale-110 z-[110]"
                    aria-label={t('auth.close')}
                >
                    <X className="w-8 h-8" aria-hidden="true" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-gray-900">
                        {mode === 'login' ? t('auth.login.title') : t('auth.register.title')}
                    </h2>

                    <p className="text-gray-600">
                        {mode === 'login'
                            ? t('auth.login.description')
                            : t('auth.register.description')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                                    {t('auth.firstName.label')}
                                </label>

                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={(event) => setData('first_name', event.target.value)}
                                    placeholder={t('auth.firstName.placeholder')}
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
                                    {t('auth.lastName.label')}
                                </label>

                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={(event) => setData('last_name', event.target.value)}
                                    placeholder={t('auth.lastName.placeholder')}
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
                            {t('auth.email.label')}
                        </label>

                        <input
                            type="email"
                            value={data.email}
                            onChange={(event) => setData('email', event.target.value)}
                            placeholder={t('auth.email.placeholder')}
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
                            {t('auth.password.label')}
                        </label>

                        <input
                            type="password"
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                            placeholder={t('auth.password.placeholder')}
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
                                {t('auth.passwordConfirmation.label')}
                            </label>

                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(event) => setData('password_confirmation', event.target.value)}
                                placeholder={t('auth.password.placeholder')}
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
                                ? t('auth.login.processing')
                                : t('auth.register.processing')
                            : mode === 'login'
                                ? t('auth.login.submit')
                                : t('auth.register.submit')}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="text-[#5555ff] font-bold hover:text-[#4444ee] transition-colors"
                    >
                        {mode === 'login'
                            ? t('auth.switchToRegister')
                            : t('auth.switchToLogin')}
                    </button>
                </div>
            </div>
        </div>
    );
}
