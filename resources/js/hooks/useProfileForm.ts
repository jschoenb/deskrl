// ─── hooks/useProfileForm.ts ──────────────────────────────────────────────────
// Extrahiert die gesamte Formular-Logik aus der Page-Komponente.
// Vorher: 30+ useState-Calls direkt in UserProfile.tsx
// Nachher: Ein Hook, ein State-Objekt, klare Handler.

import { useCallback, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import type {
    AddressFormData,
    BillingFormData,
    BusinessFormData,
    PersonalFormData,
    UserFromBackend,
} from '../types/profile';

export function useProfileForm(user: UserFromBackend) {
    // ─── Name splitten ────────────────────────────────────────────────────────
    const initialName = useMemo(() => {
        return {
            firstName: user.first_name ?? '',
            lastName: user.last_name ?? '',
        };
    }, [user.first_name, user.last_name]);

    // ─── Initial States ───────────────────────────────────────────────────────
    const initialPersonal: PersonalFormData = useMemo(
        () => ({
            firstName: initialName.firstName,
            lastName: initialName.lastName,
            email: user.email ?? '',
            gender: user.gender ?? '',
            dateOfBirth: user.birthday ?? '',
            phone: user.phone ?? '',
            // Languages als Array – Figma-Code speichert als kommagetrennte Strings
            languages: user.languages
                ? user.languages.split(',').map((l) => l.trim()).filter(Boolean)
                : [],
            profession: user.job ?? '',
            company: user.company ?? '',
            aboutMe: user.about_me ?? '',
        }),
        [initialName, user]
    );

    const initialAddress: AddressFormData = useMemo(
        () => ({
            country: user.country ?? '',
            street: user.street ?? '',
            staircase: user.staircase ?? '',
            apartment: user.apartment ?? '',
            door: user.door ?? '',
            postalCode: user.postal_code ?? '',
            city: user.city ?? '',
            state: user.state ?? '',
        }),
        [user]
    );

    const initialBilling: BillingFormData = useMemo(
        () => ({
            billingCompany: user.billing_company ?? '',
            billingVatNumber: user.billing_vat_number ?? '',
            country: user.billing_country ?? '',
            street: user.billing_street ?? '',
            staircase: user.billing_staircase ?? '',
            apartment: user.billing_apartment ?? '',
            door: user.billing_door ?? '',
            postalCode: user.billing_postal_code ?? '',
            city: user.billing_city ?? '',
            state: user.billing_state ?? '',
        }),
        [user]
    );

    const initialBusiness: BusinessFormData = useMemo(
        () => ({
            companyName: user.company_name ?? '',
            companyRegistrationNumber: user.company_registration_number ?? '',
            vatNumber: user.vat_number ?? '',
        }),
        [user]
    );

    // ─── State ────────────────────────────────────────────────────────────────
    const [personal, setPersonal] = useState<PersonalFormData>(initialPersonal);
    const [address, setAddress] = useState<AddressFormData>(initialAddress);
    const [billing, setBilling] = useState<BillingFormData>(initialBilling);
    const [business, setBusiness] = useState<BusinessFormData>(initialBusiness);
    const [isBillingSameAsAddress, setIsBillingSameAsAddress] = useState(true);

    // ─── Generic Field Updater ────────────────────────────────────────────────
    const updatePersonal = useCallback(
        <K extends keyof PersonalFormData>(field: K, value: PersonalFormData[K]) =>
            setPersonal((prev) => ({ ...prev, [field]: value })),
        []
    );

    const updateAddress = useCallback(
        <K extends keyof AddressFormData>(field: K, value: string) =>
            setAddress((prev) => ({ ...prev, [field]: value })),
        []
    );

    const updateBilling = useCallback(
        <K extends keyof BillingFormData>(field: K, value: string) =>
            setBilling((prev) => ({ ...prev, [field]: value })),
        []
    );

    const updateBusiness = useCallback(
        <K extends keyof BusinessFormData>(field: K, value: string) =>
            setBusiness((prev) => ({ ...prev, [field]: value })),
        []
    );

    // ─── Save Handler ─────────────────────────────────────────────────────────
    const handleSavePersonal = useCallback(() => {
        router.put(
            '/profile',
            {
                first_name: personal.firstName,
                last_name: personal.lastName,
                email: personal.email,
                gender: personal.gender || null,
                birthday: personal.dateOfBirth || null,
                phone: personal.phone || null,
                // Array → kommagetrennte Strings für Backend
                languages: personal.languages.length ? personal.languages.join(', ') : null,
                job: personal.profession || null,
                company: personal.company || null,
                about_me: personal.aboutMe || null,
            },
            {
                onSuccess: () => toast.success('Persönliche Informationen gespeichert.'),
                onError: () => toast.error('Fehler beim Speichern.'),
            }
        );
    }, [personal]);

    const handleSaveAddress = useCallback(() => {
        // Billing-Daten aus Adress-Daten übernehmen wenn gleich
        const billingPayload = isBillingSameAsAddress
            ? {
                billing_country: address.country,
                billing_street: address.street,
                billing_staircase: address.staircase,
                billing_apartment: address.apartment,
                billing_door: address.door,
                billing_postal_code: address.postalCode,
                billing_city: address.city,
                billing_state: address.state,
            }
            : {};

        router.put(
            '/profile/address',
            {
                country: address.country,
                street: address.street,
                staircase: address.staircase || null,
                apartment: address.apartment || null,
                door: address.door || null,
                postal_code: address.postalCode,
                city: address.city,
                state: address.state || null,
                ...billingPayload,
            },
            {
                onSuccess: () => {
                    toast.success('Adresse gespeichert.');
                    if (isBillingSameAsAddress) {
                        // Lokalen Billing-State synchronisieren
                        setBilling((prev) => ({
                            ...prev,
                            country: address.country,
                            street: address.street,
                            staircase: address.staircase,
                            apartment: address.apartment,
                            door: address.door,
                            postalCode: address.postalCode,
                            city: address.city,
                            state: address.state,
                        }));
                    }
                },
                onError: () => toast.error('Fehler beim Speichern.'),
            }
        );
    }, [address, isBillingSameAsAddress]);

    const handleSaveBilling = useCallback(() => {
        router.put(
            '/profile/billing',
            {
                billing_company: billing.billingCompany || null,
                billing_vat_number: billing.billingVatNumber || null,
                billing_country: billing.country,
                billing_street: billing.street,
                billing_staircase: billing.staircase || null,
                billing_apartment: billing.apartment || null,
                billing_door: billing.door || null,
                billing_postal_code: billing.postalCode,
                billing_city: billing.city,
                billing_state: billing.state || null,
            },
            {
                onSuccess: () => toast.success('Rechnungsadresse gespeichert.'),
                onError: () => toast.error('Fehler beim Speichern.'),
            }
        );
    }, [billing]);

    const handleSaveBusiness = useCallback(() => {
        router.put(
            '/profile/business',
            {
                company_name: business.companyName,
                company_registration_number: business.companyRegistrationNumber || null,
                vat_number: business.vatNumber || null,
            },
            {
                onSuccess: () => toast.success('Unternehmensdaten gespeichert.'),
                onError: () => toast.error('Fehler beim Speichern.'),
            }
        );
    }, [business]);

    // ─── Cancel Handler ───────────────────────────────────────────────────────
    const handleCancelPersonal = useCallback(() => {
        setPersonal(initialPersonal);
        toast.info('Änderungen verworfen.');
    }, [initialPersonal]);

    const handleCancelAddress = useCallback(() => {
        setAddress(initialAddress);
        toast.info('Änderungen verworfen.');
    }, [initialAddress]);

    const handleCancelBilling = useCallback(() => {
        setBilling(initialBilling);
        toast.info('Änderungen verworfen.');
    }, [initialBilling]);

    const handleCancelBusiness = useCallback(() => {
        setBusiness(initialBusiness);
        toast.info('Änderungen verworfen.');
    }, [initialBusiness]);

    return {
        // State
        personal,
        address,
        billing,
        business,
        isBillingSameAsAddress,
        // Updater
        updatePersonal,
        updateAddress,
        updateBilling,
        updateBusiness,
        setIsBillingSameAsAddress,
        // Handlers
        handleSavePersonal,
        handleCancelPersonal,
        handleSaveAddress,
        handleCancelAddress,
        handleSaveBilling,
        handleCancelBilling,
        handleSaveBusiness,
        handleCancelBusiness,
    };
}
