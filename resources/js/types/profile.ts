// ─── types/profile.ts ────────────────────────────────────────────────────────
// Zentrale Typen-Definitionen – einmal definieren, überall verwenden.
// Kein `any`, keine `string`-only-Typen für Enums.

export type UserRole = 'user' | 'host' | 'admin';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type Gender = 'male' | 'female' | 'diverse' | 'undisclosed';

// ─── Backend-Shape (Laravel → Inertia) ───────────────────────────────────────
// Spiegelt exakt die Felder wider, die der Controller mitgibt.
export interface UserFromBackend {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: UserRole;
    gender?: Gender | null;
    birthday?: string | null;
    profile_image?: string | null;
    job?: string | null;
    company?: string | null;
    about_me?: string | null;
    phone?: string | null;
    languages?: string | null;
    verification_status?: VerificationStatus | null;
    // Adresse
    country?: string | null;
    street?: string | null;
    staircase?: string | null;
    apartment?: string | null;
    door?: string | null;
    postal_code?: string | null;
    city?: string | null;
    state?: string | null;
    // Rechnungsadresse
    billing_company?: string | null;
    billing_country?: string | null;
    billing_street?: string | null;
    billing_staircase?: string | null;
    billing_apartment?: string | null;
    billing_door?: string | null;
    billing_postal_code?: string | null;
    billing_city?: string | null;
    billing_state?: string | null;
    billing_vat_number?: string | null;
    // Business
    company_name?: string | null;
    company_registration_number?: string | null;
    vat_number?: string | null;
}

// ─── Frontend-Formular-Shape ──────────────────────────────────────────────────
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
    street: string;
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

// ─── Stats ────────────────────────────────────────────────────────────────────
export interface UserStats {
    totalBookings: number;
    visitedPlaces: number;
    favorites: number;
}
