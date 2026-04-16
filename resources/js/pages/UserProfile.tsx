// resources/js/Pages/UserProfile.tsx
import {Head} from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {useState} from 'react';

// Komponenten importieren
import {Section} from './Profile/Section';
import {InputField} from './Profile/InputField';
import {ProfileHeader} from './Profile/ProfileHeader';
import {StatsGrid} from './Profile/StatsGrid';
import {VerificationSection} from './Profile/VerificationSection';
import {ProviderUpgrade} from './Profile/ProviderUpgrade';

// Mock-User basierend auf deinen Seedern (Sophie, Daniel, Lea)
const users = [
    {
        id: 1,
        name: 'Sophie Berger',
        email: 'sophie@deskrl.test',
        role: 'user',
        verificationStatus: 'unverified',
        profileImage: null,
        profile: {
            gender: 'female',
            dateOfBirth: '1990-01-01',
            phone: '+43 660 1234567',
            languages: 'Deutsch, Englisch',
            profession: 'Softwareentwicklerin',
            aboutMe: 'Ich bin eine leidenschaftliche Entwicklerin mit Fokus auf Frontend-Technologien.',
            country: 'AT',
            street: 'Hauptstraße 1',
            staircase: '1',
            apartment: '12',
            door: '3',
            postalCode: '1010',
            city: 'Wien',
            state: 'Wien',
        },
    },
    {
        id: 2,
        name: 'Daniel Hofer',
        email: 'daniel@deskrl.test',
        role: 'provider',
        verificationStatus: 'verified',
        profileImage: null,
        profile: {
            gender: 'male',
            dateOfBirth: '1985-05-15',
            phone: '+43 660 7654321',
            languages: 'Deutsch, Englisch, Spanisch',
            profession: 'Raumanbieter',
            aboutMe: 'Ich biete moderne Arbeitsplätze und Räume in Wien.',
            country: 'AT',
            street: 'Seestraße 10',
            staircase: '2',
            apartment: '4',
            door: 'B',
            postalCode: '1020',
            city: 'Wien',
            state: 'Wien',
        },
    },
    {
        id: 3,
        name: 'Lea Mayer',
        email: 'lea@deskrl.test',
        role: 'user',
        verificationStatus: 'unverified',
        profileImage: null,
        profile: {
            gender: 'female',
            dateOfBirth: '1992-11-30',
            phone: '+43 660 1122334',
            languages: 'Deutsch, Französisch',
            profession: 'Designerin',
            aboutMe: 'Ich arbeite remote und nutze flexible Arbeitsplätze.',
            country: 'AT',
            street: 'Gartenstraße 5',
            staircase: '1',
            apartment: '6',
            door: '1',
            postalCode: '4020',
            city: 'Linz',
            state: 'Oberösterreich',
        },
    },
];

export default function UserProfile() {
    // Aktuellen Nutzer auswählen (z. B. Sophie als Standard)
    const [currentUser] = useState(users[0]);

    // Formular-State
    const [formData, setFormData] = useState({
        firstName: currentUser.name.split(' ')[0] || '',
        lastName: currentUser.name.split(' ')[1] || '',
        email: currentUser.email || '',
        gender: currentUser.profile?.gender || '',
        dateOfBirth: currentUser.profile?.dateOfBirth || '',
        phone: currentUser.profile?.phone || '',
        languages: currentUser.profile?.languages || '',
        profession: currentUser.profile?.profession || '',
        aboutMe: currentUser.profile?.aboutMe || '',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData({...formData, [field]: value});
    };

    const handleSavePersonalInfo = () => {
        console.log('Gespeichert:', formData);
        alert('Änderungen gespeichert!');
    };

    return (
        <><Head title="Mein Profil"/>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <ProfileHeader user={currentUser}/>
                    <StatsGrid/>
                    <ProviderUpgrade user={currentUser}/>

                    <Section
                        title="Persönliche Informationen"
                        onSave={handleSavePersonalInfo}
                        onCancel={() => setFormData({
                            firstName: currentUser.name.split(' ')[0] || '',
                            lastName: currentUser.name.split(' ')[1] || '',
                            email: currentUser.email || '',
                            gender: currentUser.profile?.gender || '',
                            dateOfBirth: currentUser.profile?.dateOfBirth || '',
                            phone: currentUser.profile?.phone || '',
                            languages: currentUser.profile?.languages || '',
                            profession: currentUser.profile?.profession || '',
                            aboutMe: currentUser.profile?.aboutMe || '',
                        })}
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            <InputField
                                label="Vorname"
                                value={formData.firstName}
                                onChange={(value) => handleInputChange('firstName', value)}/>
                            <InputField
                                label="Nachname"
                                value={formData.lastName}
                                onChange={(value) => handleInputChange('lastName', value)}/>
                            <InputField
                                label="E-Mail"
                                value={formData.email}
                                onChange={(value) => handleInputChange('email', value)}
                                type="email"/>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600 font-semibold">Geschlecht</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5555ff]"
                                >
                                    <option value="">Bitte wählen</option>
                                    <option value="male">Männlich</option>
                                    <option value="female">Weiblich</option>
                                    <option value="other">Anderes</option>
                                </select>
                            </div>
                            <InputField
                                label="Geburtsdatum"
                                value={formData.dateOfBirth}
                                onChange={(value) => handleInputChange('dateOfBirth', value)}
                                type="date"/>
                            <InputField
                                label="Telefon"
                                value={formData.phone}
                                onChange={(value) => handleInputChange('phone', value)}
                                type="tel"/>
                            <InputField
                                label="Sprachen"
                                value={formData.languages}
                                onChange={(value) => handleInputChange('languages', value)}/>
                            <InputField
                                label="Beruf"
                                value={formData.profession}
                                onChange={(value) => handleInputChange('profession', value)}/>
                        </div>
                        <div className="space-y-2 mt-4">
                            <label className="text-sm text-gray-600 font-semibold">Über mich</label>
                            <textarea
                                value={formData.aboutMe}
                                onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5555ff] resize-none"/>
                        </div>
                    </Section>

                    <VerificationSection user={currentUser}/>
                </div>
            </div>
        </>
)
    ;
}
