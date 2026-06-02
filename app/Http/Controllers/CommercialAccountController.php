<?php

namespace App\Http\Controllers;

use App\Models\CommercialAccount;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CommercialAccountController extends Controller
{
    /**
     * Redirect commercial account profile to the main user profile.
     */
    public function show(Request $request)
    {
        return redirect()->route('account.show');
    }

    /**
     * Show create page only if a separate page is needed.
     */
    public function create(Request $request)
    {
        $account = $request->user();

        if ($account->commercialAccount) {
            return redirect()->route('account.show');
        }

        return Inertia::render('CommercialAccount/Create');
    }

    /**
     * Store a new commercial account.
     */
    public function store(Request $request)
    {
        $account = $request->user();

        if ($account->commercialAccount) {
            return redirect()
                ->back()
                ->with('success', 'Unternehmensdaten wurden bereits angelegt.');
        }

        $validated = $request->validate(
            [
                'company_name' => ['required', 'string', 'max:255'],
                'company_nr' => ['required', 'string', 'max:255', 'unique:commercial_accounts,company_nr'],
                'vat_nr' => ['required', 'string', 'max:255', 'unique:commercial_accounts,vat_nr'],
            ],
            [
                'company_name.required' => 'Bitte gib einen Firmennamen ein.',
                'company_name.max' => 'Der Firmenname darf maximal 255 Zeichen lang sein.',

                'company_nr.required' => 'Bitte gib eine Firmenbuchnummer ein.',
                'company_nr.max' => 'Die Firmenbuchnummer darf maximal 255 Zeichen lang sein.',
                'company_nr.unique' => 'Diese Firmenbuchnummer wird bereits verwendet.',

                'vat_nr.required' => 'Bitte gib eine UID-Nummer ein.',
                'vat_nr.max' => 'Die UID-Nummer darf maximal 255 Zeichen lang sein.',
                'vat_nr.unique' => 'Diese UID-Nummer wird bereits verwendet.',
            ]
        );

        CommercialAccount::create([
            'account_id' => $account->id,
            'company_name' => $validated['company_name'],
            'company_nr' => $validated['company_nr'],
            'vat_nr' => $validated['vat_nr'],
            'is_verified' => false,
        ]);

        $account->update([
            'account_type' => 'commercial_host',
        ]);

        return redirect()
            ->back()
            ->with('success', 'Unternehmensdaten wurden gespeichert.');
    }

    /**
     * Redirect edit page to the main user profile.
     */
    public function edit(Request $request)
    {
        return redirect()->route('account.show');
    }

    /**
     * Update the commercial account.
     */
    public function update(Request $request)
    {
        $account = $request->user();

        $commercialAccount = $account->commercialAccount;

        if (! $commercialAccount) {
            return redirect()
                ->back()
                ->withErrors([
                    'company_name' => 'Es wurde noch kein gewerblicher Account angelegt.',
                ]);
        }

        $validated = $request->validate(
            [
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
            ],
            [
                'company_name.required' => 'Bitte gib einen Firmennamen ein.',
                'company_name.max' => 'Der Firmenname darf maximal 255 Zeichen lang sein.',

                'company_nr.required' => 'Bitte gib eine Firmenbuchnummer ein.',
                'company_nr.max' => 'Die Firmenbuchnummer darf maximal 255 Zeichen lang sein.',
                'company_nr.unique' => 'Diese Firmenbuchnummer wird bereits verwendet.',

                'vat_nr.required' => 'Bitte gib eine UID-Nummer ein.',
                'vat_nr.max' => 'Die UID-Nummer darf maximal 255 Zeichen lang sein.',
                'vat_nr.unique' => 'Diese UID-Nummer wird bereits verwendet.',
            ]
        );

        $commercialAccount->update([
            'company_name' => $validated['company_name'],
            'company_nr' => $validated['company_nr'],
            'vat_nr' => $validated['vat_nr'],
        ]);

        return redirect()
            ->back()
            ->with('success', 'Unternehmensdaten wurden gespeichert.');
    }
}
