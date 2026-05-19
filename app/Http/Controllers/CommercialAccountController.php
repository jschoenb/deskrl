<?php

namespace App\Http\Controllers;

use App\Models\CommercialAccount;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CommercialAccountController extends Controller
{
    /**
     * Shows the commercial account profile of the currently logged-in account.
     *
     * If the authenticated account does not have a commercial account yet,
     * the user is redirected to the create page.
     */
    public function show(Request $request)
    {
        // Gets the currently authenticated account.
        $account = $request->user();

        // Loads the related commercial account.
        $commercialAccount = $account->commercialAccount;

        // If no commercial account exists yet, redirect to the create form.
        if (! $commercialAccount) {
            return redirect()->route('commercial-account.create');
        }

        // Returns the Inertia React component for showing the commercial profile.
        return Inertia::render('CommercialAccount/Show', [
            'commercialAccount' => $commercialAccount,
        ]);
    }

    /**
     * Shows the form for creating a commercial account.
     *
     * If the authenticated account already has a commercial account,
     * the user is redirected to the existing commercial account page.
     */
    public function create(Request $request)
    {
        // Gets the currently authenticated account.
        $account = $request->user();

        // Prevents creating more than one commercial account for the same account.
        if ($account->commercialAccount) {
            return redirect()->route('commercial-account.show');
        }

        // Returns the Inertia React component for creating a commercial account.
        return Inertia::render('CommercialAccount/Create');
    }

    /**
     * Stores a new commercial account for the currently logged-in account.
     *
     * The method validates the submitted company data, creates the commercial
     * account and updates the account type of the authenticated account.
     */
    public function store(Request $request)
    {
        // Gets the currently authenticated account.
        $account = $request->user();

        // Prevents creating a second commercial account for the same account.
        if ($account->commercialAccount) {
            return redirect()->route('commercial-account.show');
        }

        // Validates the submitted company data.
        // company_nr and vat_nr must be unique in the commercial_accounts table.
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'company_nr' => ['required', 'string', 'max:255', 'unique:commercial_accounts,company_nr'],
            'vat_nr' => ['required', 'string', 'max:255', 'unique:commercial_accounts,vat_nr'],
        ]);

        // Creates the commercial account and connects it to the logged-in account.
        CommercialAccount::create([
            'account_id' => $account->id,
            'company_name' => $validated['company_name'],
            'company_nr' => $validated['company_nr'],
            'vat_nr' => $validated['vat_nr'],
            'is_verified' => false,
        ]);

        // Updates the account type so the system knows that this account
        // is now a commercial host account.
        $account->update([
            'account_type' => 'commercial_host',
        ]);

        // Redirects to the commercial account profile page after creation.
        return redirect()
            ->route('commercial-account.show')
            ->with('success', 'Gewerblicher Account wurde erstellt.');
    }

    /**
     * Shows the edit form for the commercial account.
     *
     * If no commercial account exists yet, the user is redirected
     * to the create page.
     */
    public function edit(Request $request)
    {
        // Gets the currently authenticated account.
        $account = $request->user();

        // Loads the related commercial account.
        $commercialAccount = $account->commercialAccount;

        // If no commercial account exists yet, redirect to the create form.
        if (! $commercialAccount) {
            return redirect()->route('commercial-account.create');
        }

        // Returns the Inertia React component for editing the commercial account.
        return Inertia::render('CommercialAccount/Edit', [
            'commercialAccount' => $commercialAccount,
        ]);
    }

    /**
     * Updates the commercial account of the currently logged-in account.
     *
     * The method validates the submitted company data and updates
     * the existing commercial account.
     */
    public function update(Request $request)
    {
        // Gets the currently authenticated account.
        $account = $request->user();

        // Loads the related commercial account.
        $commercialAccount = $account->commercialAccount;

        // If no commercial account exists yet, redirect to the create form.
        if (! $commercialAccount) {
            return redirect()->route('commercial-account.create');
        }

        // Validates the submitted company data.
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],

            'company_nr' => [
                'required',
                'string',
                'max:255',
                Rule::unique('commercial_accounts', 'company_nr')->ignore($commercialAccount->id),
            ],

            'vat_nr' => [
                'required',
                'string',
                'max:255',
                Rule::unique('commercial_accounts', 'vat_nr')->ignore($commercialAccount->id),
            ],
        ]);

        // Updates the commercial account with the validated data.
        $commercialAccount->update($validated);

        // Redirects back to the commercial account profile page after update.
        return redirect()
            ->route('commercial-account.show')
            ->with('success', 'Gewerblicher Account wurde aktualisiert.');
    }
}
