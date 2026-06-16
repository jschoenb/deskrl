<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Country;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AddressController extends Controller
{
    /**
     * Shows all addresses of the currently logged-in account.
     */
    public function index(Request $request)
    {
        $account = $request->user()->load('addresses.country');

        $countries = Country::orderBy('code')->get();

        return Inertia::render('Addresses/Index', [
            'addresses' => $account->addresses,
            'countries' => $countries,
        ]);
    }

    /**
     * Stores a new address and attaches it to the currently logged-in account.
     */
    public function store(Request $request)
    {
        $account = $request->user();

        $validated = $this->validateAddressData($request);

        $address = Address::create([
            'country_id' => $validated['country_id'],
            'state' => $validated['state'] ?? null,
            'city' => $validated['city'],
            'street' => $validated['street'],
            'house_nr' => $validated['house_nr'],
            'postal_code' => $validated['postal_code'],
            'stair' => $validated['stair'] ?? null,
            'door' => $validated['door'] ?? null,
        ]);

        if ($request->boolean('is_default')) {
            $this->unsetOtherDefaultAddresses($account);
        }

        if ($request->boolean('is_billing_address')) {
            $this->unsetOtherBillingAddresses($account);
        }

        $account->addresses()->attach($address->id, [
            'is_default' => $request->boolean('is_default'),
            'company_name' => $validated['company_name'] ?? null,
            'vat_nr' => $validated['vat_nr'] ?? null,
            'is_billing_address' => $request->boolean('is_billing_address'),
        ]);

        return redirect()
            ->back()
            ->with('success', 'Adresse wurde gespeichert.');
    }

    /**
     * Updates an existing address of the currently logged-in account.
     */
    public function update(Request $request, Address $address)
    {
        $account = $request->user();

        abort_unless(
            $account->addresses()->where('addresses.id', $address->id)->exists(),
            403
        );

        $validated = $this->validateAddressData($request);

        $address->update([
            'country_id' => $validated['country_id'],
            'state' => $validated['state'] ?? null,
            'city' => $validated['city'],
            'street' => $validated['street'],
            'house_nr' => $validated['house_nr'],
            'postal_code' => $validated['postal_code'],
            'stair' => $validated['stair'] ?? null,
            'door' => $validated['door'] ?? null,
        ]);

        if ($request->boolean('is_default')) {
            $this->unsetOtherDefaultAddresses($account);
        }

        if ($request->boolean('is_billing_address')) {
            $this->unsetOtherBillingAddresses($account);
        }

        $account->addresses()->updateExistingPivot($address->id, [
            'is_default' => $request->boolean('is_default'),
            'company_name' => $validated['company_name'] ?? null,
            'vat_nr' => $validated['vat_nr'] ?? null,
            'is_billing_address' => $request->boolean('is_billing_address'),
        ]);

        return redirect()
            ->back()
            ->with('success', 'Adresse wurde aktualisiert.');
    }

    /**
     * Removes an address from the currently logged-in account.
     */
    public function destroy(Request $request, Address $address)
    {
        $account = $request->user();

        abort_unless(
            $account->addresses()->where('addresses.id', $address->id)->exists(),
            403
        );

        $account->addresses()->detach($address->id);

        if ($address->accounts()->doesntExist()) {
            $address->delete();
        }

        return redirect()
            ->back()
            ->with('success', 'Adresse wurde gelöscht.');
    }

    /**
     * Validates address data and related account-address pivot data.
     */
    private function validateAddressData(Request $request): array
    {
        return $request->validate(
            [
                'country_id' => ['required', 'exists:countries,id'],

                'state' => ['nullable', 'string', 'max:255', 'regex:/^[\pL\s\-]*$/u'],
                'city' => ['required', 'string', 'max:255', 'regex:/^[\pL\s\-]+$/u'],

                // Allows common street names with letters, numbers, spaces, dots and hyphens.
                'street' => ['required', 'string', 'max:255', 'regex:/^[\pL0-9\s\.\-]+$/u'],

                // Current MVP rule: house numbers contain digits only.
                'house_nr' => ['required', 'string', 'max:20', 'regex:/^[0-9]+$/'],

                // Current MVP rule: postal codes contain digits only.
                'postal_code' => ['required', 'string', 'max:10', 'regex:/^[0-9]+$/'],

                'stair' => ['nullable', 'string', 'max:50'],
                'door' => ['nullable', 'string', 'max:50'],

                'is_default' => ['nullable', 'boolean'],
                'company_name' => ['nullable', 'string', 'max:255'],
                'vat_nr' => ['nullable', 'string', 'max:255'],
                'is_billing_address' => ['nullable', 'boolean'],
            ],
            [
                'country_id.required' => 'Bitte wähle ein Land aus.',
                'country_id.exists' => 'Das ausgewählte Land ist ungültig.',

                'state.max' => 'Das Bundesland darf maximal 255 Zeichen lang sein.',
                'state.regex' => 'Das Bundesland darf nur Buchstaben, Leerzeichen und Bindestriche enthalten.',

                'city.required' => 'Bitte gib eine Stadt ein.',
                'city.max' => 'Die Stadt darf maximal 255 Zeichen lang sein.',
                'city.regex' => 'Die Stadt darf nur Buchstaben, Leerzeichen und Bindestriche enthalten.',

                'street.required' => 'Bitte gib eine Straße ein.',
                'street.max' => 'Die Straße darf maximal 255 Zeichen lang sein.',
                'street.regex' => 'Die Straße darf nur Buchstaben, Zahlen, Leerzeichen, Punkte und Bindestriche enthalten.',

                'house_nr.required' => 'Bitte gib eine Hausnummer ein.',
                'house_nr.max' => 'Die Hausnummer darf maximal 20 Zeichen lang sein.',
                'house_nr.regex' => 'Die Hausnummer darf nur Zahlen enthalten.',

                'postal_code.required' => 'Bitte gib eine Postleitzahl ein.',
                'postal_code.max' => 'Die Postleitzahl darf maximal 10 Zeichen lang sein.',
                'postal_code.regex' => 'Die Postleitzahl darf nur Zahlen enthalten.',

                'stair.max' => 'Die Stiege darf maximal 50 Zeichen lang sein.',
                'door.max' => 'Die Türnummer darf maximal 50 Zeichen lang sein.',

                'company_name.max' => 'Der Firmenname darf maximal 255 Zeichen lang sein.',
                'vat_nr.max' => 'Die UID-Nummer darf maximal 255 Zeichen lang sein.',
            ]
        );
    }

    /**
     * Removes the default flag from all addresses of the given account.
     */
    private function unsetOtherDefaultAddresses($account): void
    {
        $addressIds = $account->addresses()->pluck('addresses.id')->toArray();

        foreach ($addressIds as $addressId) {
            $account->addresses()->updateExistingPivot($addressId, [
                'is_default' => false,
            ]);
        }
    }

    /**
     * Removes the billing address flag from all addresses of the given account.
     */
    private function unsetOtherBillingAddresses($account): void
    {
        $addressIds = $account->addresses()->pluck('addresses.id')->toArray();

        foreach ($addressIds as $addressId) {
            $account->addresses()->updateExistingPivot($addressId, [
                'is_billing_address' => false,
            ]);
        }
    }
}
