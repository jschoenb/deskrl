// resources/js/hooks/useProfileForm.ts

// This hook contains the complete profile form logic.
// It maps the current Laravel database structure to the existing profile form UI.

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

// Reads translated JSON fields like { de: "...", en: "..." }.
// It also supports JSON strings because some backend values may arrive as strings.
function getLocalizedText(value: any, fallback = ''): string {
    if (!value) {
        return fallback;
    }

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);

            return parsed?.de ?? parsed?.en ?? value;
        } catch {
            return value;
        }
    }

    return value.de ?? value.en ?? fallback;
}

// Converts a date value from Laravel into an input[type="date"] compatible string.
function formatDateForInput(value?: string | null): string {
    if (!value) {
        return '';
    }

    return String(value).slice(0, 10);
}

// Normalizes Inertia validation errors so they can be shown next to form fields.
function normalizeErrors(errors: Record<string, string | string[]>): Record<string, string> {
    return Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [
            key,
            Array.isArray(value) ? value[0] : value,
        ])
    );
}

export function useProfileForm(user: UserFromBackend) {
    // Split the account name into first name and last name.
    const initialName = useMemo(() => {
        return {
            firstName: user.first_name ?? '',
            lastName: user.last_name ?? '',
        };
    }, [user.first_name, user.last_name]);

    // Find the default account address from the new account_addresses relation.
    const defaultAddressRelation = useMemo(() => {
        return user.account_addresses?.find((item) => item.is_default)
            ?? user.account_addresses?.[0]
            ?? null;
    }, [user.account_addresses]);

    // Find the billing address from the new account_addresses relation.
    const billingAddressRelation = useMemo(() => {
        return user.account_addresses?.find((item) => item.is_billing_address)
            ?? null;
    }, [user.account_addresses]);

    // Check whether the default address and billing address are the same database entry.
    const initialBillingSameAsAddress = useMemo(() => {
        if (!defaultAddressRelation || !billingAddressRelation) {
            return true;
        }

        return defaultAddressRelation.address_id === billingAddressRelation.address_id;
    }, [defaultAddressRelation, billingAddressRelation]);

    // Prepare the initial personal profile form state.
    const initialPersonal: PersonalFormData = useMemo(
        () => ({
            firstName: initialName.firstName,
            lastName: initialName.lastName,
            email: user.email ?? '',
            gender: user.gender ?? 'undefined',
            dateOfBirth: formatDateForInput(user.birthdate),
            phone: user.phone ?? '',

            // Languages are now loaded as related language objects.
            languages: Array.isArray(user.languages)
                ? user.languages
                    .map((language) => getLocalizedText(language.name))
                    .filter(Boolean)
                : [],

            // Profession is currently not stored in the new accounts table.
            profession: '',

            // Company data now belongs to commercial_account.
            company: user.commercial_account?.company_name ?? '',

            // about_me is stored as JSON, for example { de: "..." }.
            aboutMe: getLocalizedText(user.about_me),
        }),
        [initialName, user]
    );

    // Prepare the initial main address form state.
    const initialAddress: AddressFormData = useMemo(
        () => ({
            country: getLocalizedText(defaultAddressRelation?.address?.country?.name),
            countryId: defaultAddressRelation?.address?.country_id ?? null,
            street: defaultAddressRelation?.address?.street ?? '',
            houseNumber: defaultAddressRelation?.address?.house_nr ?? '',
            staircase: defaultAddressRelation?.address?.stair ?? '',
            apartment: '',
            door: defaultAddressRelation?.address?.door ?? '',
            postalCode: defaultAddressRelation?.address?.postal_code ?? '',
            city: defaultAddressRelation?.address?.city ?? '',
            state: defaultAddressRelation?.address?.state ?? '',
        }),
        [defaultAddressRelation]
    );

    // Prepare the initial billing address form state.
    const initialBilling: BillingFormData = useMemo(
        () => ({
            billingCompany: billingAddressRelation?.company_name ?? '',
            billingVatNumber: billingAddressRelation?.vat_nr ?? '',
            country: getLocalizedText(billingAddressRelation?.address?.country?.name),
            countryId: billingAddressRelation?.address?.country_id ?? null,
            street: billingAddressRelation?.address?.street ?? '',
            houseNumber: billingAddressRelation?.address?.house_nr ?? '',
            staircase: billingAddressRelation?.address?.stair ?? '',
            apartment: '',
            door: billingAddressRelation?.address?.door ?? '',
            postalCode: billingAddressRelation?.address?.postal_code ?? '',
            city: billingAddressRelation?.address?.city ?? '',
            state: billingAddressRelation?.address?.state ?? '',
        }),
        [billingAddressRelation]
    );

    // Prepare the initial business form state from commercial_account.
    const initialBusiness: BusinessFormData = useMemo(
        () => ({
            companyName: user.commercial_account?.company_name ?? '',
            companyRegistrationNumber: user.commercial_account?.company_nr ?? '',
            vatNumber: user.commercial_account?.vat_nr ?? '',
        }),
        [user.commercial_account]
    );

    // Store all form states in one hook.
    const [personal, setPersonal] = useState<PersonalFormData>(initialPersonal);
    const [address, setAddress] = useState<AddressFormData>(initialAddress);
    const [billing, setBilling] = useState<BillingFormData>(initialBilling);
    const [business, setBusiness] = useState<BusinessFormData>(initialBusiness);
    const [isBillingSameAsAddress, setIsBillingSameAsAddress] = useState(initialBillingSameAsAddress);

    // Store validation errors for address forms.
    const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
    const [billingErrors, setBillingErrors] = useState<Record<string, string>>({});

    // Update a single field in the personal form.
    const updatePersonal = useCallback(
        <K extends keyof PersonalFormData>(field: K, value: PersonalFormData[K]) =>
            setPersonal((prev) => ({ ...prev, [field]: value })),
        []
    );

    // Update a single field in the main address form and remove its error message.
    const updateAddress = useCallback(
        <K extends keyof AddressFormData>(field: K, value: AddressFormData[K]) => {
            setAddress((prev) => ({ ...prev, [field]: value }));

            setAddressErrors((prev) => {
                const next = { ...prev };

                if (field === 'countryId') {
                    delete next.country_id;
                }

                if (field === 'houseNumber') {
                    delete next.house_nr;
                }

                if (field === 'postalCode') {
                    delete next.postal_code;
                }

                if (field === 'city') {
                    delete next.city;
                }

                if (field === 'street') {
                    delete next.street;
                }

                return next;
            });
        },
        []
    );

    // Update a single field in the billing address form and remove its error message.
    const updateBilling = useCallback(
        <K extends keyof BillingFormData>(field: K, value: BillingFormData[K]) => {
            setBilling((prev) => ({ ...prev, [field]: value }));

            setBillingErrors((prev) => {
                const next = { ...prev };

                if (field === 'countryId') {
                    delete next.country_id;
                }

                if (field === 'houseNumber') {
                    delete next.house_nr;
                }

                if (field === 'postalCode') {
                    delete next.postal_code;
                }

                if (field === 'city') {
                    delete next.city;
                }

                if (field === 'street') {
                    delete next.street;
                }

                if (field === 'billingCompany') {
                    delete next.company_name;
                }

                if (field === 'billingVatNumber') {
                    delete next.vat_nr;
                }

                return next;
            });
        },
        []
    );

    // Update a single field in the business form.
    const updateBusiness = useCallback(
        <K extends keyof BusinessFormData>(field: K, value: BusinessFormData[K]) =>
            setBusiness((prev) => ({ ...prev, [field]: value })),
        []
    );

    // Save personal account data to AccountController@update.
    const handleSavePersonal = useCallback(() => {
        router.put(
            '/profile',
            {
                first_name: personal.firstName,
                last_name: personal.lastName,
                email: personal.email,
                gender: personal.gender || 'undefined',
                birthdate: personal.dateOfBirth || null,
                phone: personal.phone || null,
                about_me: {
                    de: personal.aboutMe || '',
                },
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => toast.success('Persönliche Informationen wurden gespeichert.'),
                onError: () => toast.error('Persönliche Informationen konnten nicht gespeichert werden.'),
            }
        );
    }, [personal]);

    // Save or update the default address through the new AddressController structure.
    const handleSaveAddress = useCallback(() => {
        const payload = {
            country_id: address.countryId,
            state: address.state || null,
            city: address.city,
            street: address.street,
            house_nr: address.houseNumber,
            postal_code: address.postalCode,
            stair: address.staircase || null,
            door: address.door || null,
            is_default: true,
            is_billing_address: isBillingSameAsAddress,
            company_name: isBillingSameAsAddress ? billing.billingCompany || null : null,
            vat_nr: isBillingSameAsAddress ? billing.billingVatNumber || null : null,
        };

        const options = {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setAddressErrors({});
                toast.success('Adresse wurde gespeichert.');

                // If billing address is the same as the main address,
                // keep the local billing form in sync with the address form.
                if (isBillingSameAsAddress) {
                    setBilling((prev) => ({
                        ...prev,
                        country: address.country,
                        countryId: address.countryId,
                        street: address.street,
                        houseNumber: address.houseNumber,
                        staircase: address.staircase,
                        apartment: address.apartment,
                        door: address.door,
                        postalCode: address.postalCode,
                        city: address.city,
                        state: address.state,
                    }));

                    setBillingErrors({});
                }
            },
            onError: (errors: Record<string, string | string[]>) => {
                setAddressErrors(normalizeErrors(errors));
                toast.error('Adresse konnte nicht gespeichert werden. Bitte prüfe die markierten Felder.');
            },
        };

        if (defaultAddressRelation?.address_id) {
            router.put(`/addresses/${defaultAddressRelation.address_id}`, payload, options);
            return;
        }

        router.post('/addresses', payload, options);
    }, [address, billing, defaultAddressRelation, isBillingSameAsAddress]);

    // Save or update the billing address through the new AddressController structure.
    const handleSaveBilling = useCallback(() => {
        const payload = {
            country_id: billing.countryId,
            state: billing.state || null,
            city: billing.city,
            street: billing.street,
            house_nr: billing.houseNumber,
            postal_code: billing.postalCode,
            stair: billing.staircase || null,
            door: billing.door || null,
            is_default: false,
            is_billing_address: true,
            company_name: billing.billingCompany || null,
            vat_nr: billing.billingVatNumber || null,
        };

        const options = {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setBillingErrors({});

                // Keep the billing address section open after saving.
                setIsBillingSameAsAddress(false);

                toast.success('Rechnungsadresse wurde gespeichert.');
            },
            onError: (errors: Record<string, string | string[]>) => {
                setBillingErrors(normalizeErrors(errors));

                // Keep the billing address section open even if validation fails.
                setIsBillingSameAsAddress(false);

                toast.error('Rechnungsadresse konnte nicht gespeichert werden. Bitte prüfe die markierten Felder.');
            },
        };

        if (billingAddressRelation?.address_id) {
            router.put(`/addresses/${billingAddressRelation.address_id}`, payload, options);
            return;
        }

        router.post('/addresses', payload, options);
    }, [billing, billingAddressRelation]);

    // Save or update commercial account data.
    const handleSaveBusiness = useCallback(() => {
        const payload = {
            company_name: business.companyName,
            company_nr: business.companyRegistrationNumber,
            vat_nr: business.vatNumber,
        };

        if (user.commercial_account) {
            router.put('/commercial-account', payload, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => toast.success('Unternehmensdaten wurden gespeichert.'),
                onError: () => toast.error('Unternehmensdaten konnten nicht gespeichert werden.'),
            });

            return;
        }

        router.post('/commercial-account', payload, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => toast.success('Unternehmensdaten wurden gespeichert.'),
            onError: () => toast.error('Unternehmensdaten konnten nicht gespeichert werden.'),
        });
    }, [business, user.commercial_account]);

    // Reset personal form changes.
    const handleCancelPersonal = useCallback(() => {
        setPersonal(initialPersonal);
        toast.info('Änderungen wurden verworfen.');
    }, [initialPersonal]);

    // Reset main address form changes.
    const handleCancelAddress = useCallback(() => {
        setAddress(initialAddress);
        setAddressErrors({});
        toast.info('Änderungen wurden verworfen.');
    }, [initialAddress]);

    // Reset billing address form changes.
    const handleCancelBilling = useCallback(() => {
        setBilling(initialBilling);
        setBillingErrors({});
        toast.info('Änderungen wurden verworfen.');
    }, [initialBilling]);

    // Reset business form changes.
    const handleCancelBusiness = useCallback(() => {
        setBusiness(initialBusiness);
        toast.info('Änderungen wurden verworfen.');
    }, [initialBusiness]);

    return {
        // Form states
        personal,
        address,
        billing,
        business,
        isBillingSameAsAddress,

        // Validation errors
        addressErrors,
        billingErrors,

        // Field update functions
        updatePersonal,
        updateAddress,
        updateBilling,
        updateBusiness,
        setIsBillingSameAsAddress,

        // Save and cancel handlers
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
