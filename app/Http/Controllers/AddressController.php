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
     * Stores a new address for the currently logged-in account.
     */
    public function store(Request $request)
    {
        $account = $request->user();

        // Validates the submitted address and pivot data.
        $validated = $this->validateAddressData($request);

        // Creates the address itself in the addresses table.
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

        // If the new address should be the default address,
        // all other addresses of this account are set to non-default first.
        if ($request->boolean('is_default')) {
            $this->unsetOtherDefaultAddresses($account);
        }

        // If the new address should be the billing address,
        // all other billing addresses of this account are unset first.
        if ($request->boolean('is_billing_address')) {
            $this->unsetOtherBillingAddresses($account);
        }

        // Connects the new address to the logged-in account through the pivot table.
        $account->addresses()->attach($address->id, [
            'is_default' => $request->boolean('is_default'),
            'company_name' => $validated['company_name'] ?? null,
            'vat_nr' => $validated['vat_nr'] ?? null,
            'is_billing_address' => $request->boolean('is_billing_address'),
        ]);

        return redirect()
            ->route('addresses.index')
            ->with('success', 'Adresse wurde gespeichert.');
    }

    /**
     * Updates an existing address of the currently logged-in account.
     */
    public function update(Request $request, Address $address)
    {
        $account = $request->user();

        // Checks whether the given address belongs to the current account.
        abort_unless(
            $account->addresses()->where('addresses.id', $address->id)->exists(),
            403
        );

        // Validates the submitted address and pivot data.
        $validated = $this->validateAddressData($request);

        // Updates the actual address record in the addresses table.
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

        // If this address should become the default address,
        // all other addresses of this account are unset first.
        if ($request->boolean('is_default')) {
            $this->unsetOtherDefaultAddresses($account);
        }

        // If this address should become the billing address,
        // all other billing addresses of this account are unset first.
        if ($request->boolean('is_billing_address')) {
            $this->unsetOtherBillingAddresses($account);
        }

        // Updates the pivot data in account_addresses.
        $account->addresses()->updateExistingPivot($address->id, [
            'is_default' => $request->boolean('is_default'),
            'company_name' => $validated['company_name'] ?? null,
            'vat_nr' => $validated['vat_nr'] ?? null,
            'is_billing_address' => $request->boolean('is_billing_address'),
        ]);

        return redirect()
            ->route('addresses.index')
            ->with('success', 'Adresse wurde aktualisiert.');
    }

    /**
     * Removes an address from the currently logged-in account.
     */
    public function destroy(Request $request, Address $address)
    {
        $account = $request->user();

        // Checks whether the given address belongs to the current account.
        abort_unless(
            $account->addresses()->where('addresses.id', $address->id)->exists(),
            403
        );

        // Removes the connection between account and address from the pivot table.
        $account->addresses()->detach($address->id);

        // Deletes the address itself only if no account uses it anymore.
        if ($address->accounts()->doesntExist()) {
            $address->delete();
        }

        return redirect()
            ->route('addresses.index')
            ->with('success', 'Adresse wurde gelöscht.');
    }

    /**
     * Validates address data and related pivot data.
     *
     * This method is used by both store() and update(), because both methods
     * need the same validation rules.
     */
    private function validateAddressData(Request $request): array
    {
        return $request->validate([
            'country_id' => ['required', 'exists:countries,id'],
            'state' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'street' => ['required', 'string', 'max:255'],
            'house_nr' => ['required', 'string', 'max:50'],
            'postal_code' => ['required', 'string', 'max:50'],
            'stair' => ['nullable', 'string', 'max:50'],
            'door' => ['nullable', 'string', 'max:50'],

            'is_default' => ['nullable', 'boolean'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'vat_nr' => ['nullable', 'string', 'max:255'],
            'is_billing_address' => ['nullable', 'boolean'],
        ]);
    }

    /**
     * Removes the default flag from all addresses of the given account.
     */
    private function unsetOtherDefaultAddresses($account): void
    {
        $account->addresses()->updateExistingPivot(
            $account->addresses()->pluck('addresses.id')->toArray(),
            ['is_default' => false]
        );
    }

    /**
     * Removes the billing address flag from all addresses of the given account.
     */
    private function unsetOtherBillingAddresses($account): void
    {
        $account->addresses()->updateExistingPivot(
            $account->addresses()->pluck('addresses.id')->toArray(),
            ['is_billing_address' => false]
        );
    }
}
