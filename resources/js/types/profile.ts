// resources/js/types/profile.ts

// Central type definitions for the profile area.
// These types reflect the current Laravel database structure.

export type AccountType = 'user' | 'private_host' | 'commercial_host' | 'admin';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type Gender = 'male' | 'female' | 'diverse' | 'undefined';

export type LocalizedText = {
    de?: string;
    en?: string;
} | string | null;

export interface LanguageFromBackend {
    id: number;
    name: LocalizedText;
    icon_path?: string | null;
}

export interface CountryFromBackend {
    id: number;
    name: LocalizedText;
    symbol?: string | null;
    code?: string | null;
    currency?: string | null;
    currency_symbol?: string | null;
}

export interface AddressFromBackend {
    id: number;
    country_id: number;
    country?: CountryFromBackend | null;
    state?: string | null;
    city: string;
    street: string;
    house_nr: string;
    postal_code: string;
    stair?: string | null;
    door?: string | null;
}

export interface AccountAddressFromBackend {
    id: number;
    account_id: number;
    address_id: number;
    is_default: boolean;
    company_name?: string | null;
    vat_nr?: string | null;
    is_billing_address: boolean;
    address?: AddressFromBackend | null;
}

export interface CommercialAccountFromBackend {
    id: number;
    account_id: number;
    company_name: string;
    company_nr: string;
    vat_nr: string;
    is_verified: boolean;
}

// Backend shape: Laravel/Inertia -> React
export interface UserFromBackend {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;

    email_verified: boolean;
    account_type: AccountType;

    phone?: string | null;
    profile_image?: string | null;
    status: 'active' | 'deactivated' | 'deleted';

    birthdate?: string | null;
    gender?: Gender | null;
    about_me?: LocalizedText;

    languages?: LanguageFromBackend[];
    account_addresses?: AccountAddressFromBackend[];
    commercial_account?: CommercialAccountFromBackend | null;
}

// Frontend form shape
export interface PersonalFormData {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    dateOfBirth: string;
    phone: string;
    languages: string[];
    profession: string;
    company: string;
    aboutMe: string;
}

export interface AddressFormData {
    country: string;
    countryId?: number | null;
    street: string;
    houseNumber: string;
    staircase: string;
    apartment: string;
    door: string;
    postalCode: string;
    city: string;
    state: string;
}

export interface BillingFormData extends AddressFormData {
    billingCompany: string;
    billingVatNumber: string;
}

export interface BusinessFormData {
    companyName: string;
    companyRegistrationNumber: string;
    vatNumber: string;
}

// Stats
export interface UserStats {
    totalBookings: number;
    visitedPlaces: number;
    favorites: number;
}
