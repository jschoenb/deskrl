import { X, CheckCircle } from 'lucide-react';

interface BookingConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    spaceName: string;
    duration: 'hour' | 'day' | 'half_day' | 'week' | 'month';
    price: number;
    date?: string;
}

export function BookingConfirmationModal({
                                             isOpen,
                                             onClose,
                                             onConfirm,
                                             spaceName,
                                             duration,
                                             price,
                                             date,
                                         }: BookingConfirmationModalProps)
{
    if (!isOpen) return null;

    const durationText =
        duration === 'hour' ? 'Stunde'
            : duration === 'day' ? 'Tag'
                : duration === 'month' ? 'Monat'
                    :duration === 'week' ? 'Woche'
                        : 'Halbtag';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Modal schließen"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>

                    <h2 className="text-2xl mb-3" style={{ fontWeight: 700 }}>
                        Buchung bestätigen
                    </h2>

                    <p className="text-gray-600 leading-relaxed">
                        Bitte überprüfe deine Buchungsdetails, bevor du die Buchung abschließt.
                    </p>
                </div>

                <div className="bg-[#f5f5ff] rounded-xl p-6 mb-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Space</span>
                            <span style={{ fontWeight: 600 }}>{spaceName}</span>
                        </div>

                        {date && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Datum</span>
                                <span style={{ fontWeight: 600 }}>
                                    {new Date(date).toLocaleDateString('de-DE', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Dauer</span>
                            <span style={{ fontWeight: 600 }}>1 {durationText}</span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                            <span className="text-gray-900" style={{ fontWeight: 700 }}>
                                Gesamtpreis
                            </span>

                            <span className="text-2xl text-[#5555ff]" style={{ fontWeight: 700 }}>
                                €{price}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onConfirm}
                    className="w-full bg-[#e63cff] hover:bg-[#d12ee6] text-white py-4 rounded-xl transition-colors mb-3"
                    style={{ fontWeight: 700, fontSize: '1.125rem' }}
                >
                    Jetzt buchen
                </button>

                <button
                    onClick={onClose}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl transition-colors"
                    style={{ fontWeight: 600 }}
                >
                    Abbrechen
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                    Mit dem Klick auf „Jetzt buchen“ bestätigst du deine Buchung.
                </p>
            </div>
        </div>
    );
}

// import { X, CheckCircle } from 'lucide-react';
// import { useLanguage } from '/contexts/LanguageContext.tsx';
//
// interface BookingConfirmationModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onConfirm: () => void;
//     spaceName: string;
//     duration: 'hour' | 'day' | 'month';
//     price: number;
//     date?: string;
// }
//
// export function BookingConfirmationModal({
//                                              isOpen,
//                                              onClose,
//                                              onConfirm,
//                                              spaceName,
//                                              duration,
//                                              price,
//                                              date,
//                                          }: BookingConfirmationModalProps) {
//     const { t } = useLanguage();
//
//     if (!isOpen) return null;
//
//     const durationText = duration === 'hour' ? t.bookingConfirmationModal.hour : duration === 'day' ? t.bookingConfirmationModal.day : t.bookingConfirmationModal.month;
//
//     return (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative">
//                 <button
//                     onClick={onClose}
//                     className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                     <X className="w-6 h-6" />
//                 </button>
//
//                 <div className="text-center mb-6">
//                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <CheckCircle className="w-10 h-10 text-green-600" />
//                     </div>
//                     <h2 className="text-2xl mb-3" style={{ fontWeight: 700 }}>
//                         {t.bookingConfirmationModal.title}
//                     </h2>
//                     <p className="text-gray-600 leading-relaxed">
//                         {t.bookingConfirmationModal.subtitle}
//                     </p>
//                 </div>
//
//                 <div className="bg-[#f5f5ff] rounded-xl p-6 mb-6">
//                     <div className="space-y-3">
//                         <div className="flex items-center justify-between">
//                             <span className="text-gray-700">{t.bookingConfirmationModal.space}</span>
//                             <span style={{ fontWeight: 600 }}>{spaceName}</span>
//                         </div>
//                         {date && (
//                             <div className="flex items-center justify-between">
//                                 <span className="text-gray-700">{t.bookingConfirmationModal.date}</span>
//                                 <span style={{ fontWeight: 600 }}>
//                   {new Date(date).toLocaleDateString('de-DE', {
//                       weekday: 'long',
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric',
//                   })}
//                 </span>
//                             </div>
//                         )}
//                         <div className="flex items-center justify-between">
//                             <span className="text-gray-700">{t.bookingConfirmationModal.duration}</span>
//                             <span style={{ fontWeight: 600 }}>1 {durationText}</span>
//                         </div>
//                         <div className="flex items-center justify-between pt-3 border-t border-gray-300">
//               <span className="text-gray-900" style={{ fontWeight: 700 }}>
//                 {t.bookingConfirmationModal.totalPrice}
//               </span>
//                             <span className="text-2xl text-[#5555ff]" style={{ fontWeight: 700 }}>
//                 €{price}
//               </span>
//                         </div>
//                     </div>
//                 </div>
//
//                 <button
//                     onClick={onConfirm}
//                     className="w-full bg-[#e63cff] hover:bg-[#d12ee6] text-white py-4 rounded-xl transition-colors mb-3"
//                     style={{ fontWeight: 700, fontSize: '1.125rem' }}
//                 >
//                     {t.bookingConfirmationModal.bookNow}
//                 </button>
//
//                 <button
//                     onClick={onClose}
//                     className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl transition-colors"
//                     style={{ fontWeight: 600 }}
//                 >
//                     {t.bookingConfirmationModal.cancel}
//                 </button>
//
//                 <p className="text-xs text-gray-500 text-center mt-4">
//                     {t.bookingConfirmationModal.disclaimer}
//                 </p>
//             </div>
//         </div>
//     );
// }
