<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Deskrl;
use App\Models\DeskrlAddress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DeskrlAddressController extends Controller
{
    /**
     * Store or replace the address link for a Deskrl.
     */
    public function store(Request $request, Deskrl $deskrl): RedirectResponse
    {
        $validated = $this->validateAddress($request);

        $address = Address::query()->create($validated);

        DeskrlAddress::query()->updateOrCreate(
            [
                'deskrl_id' => $deskrl->id,
            ],
            [
                'address_id' => $address->id,
            ]
        );

        return redirect()
            ->back()
            ->with('success', 'Adresse wurde gespeichert.');
    }

    /**
     * Update the existing address of a Deskrl.
     * If no address link exists yet, a new address and link are created.
     */
    public function update(Request $request, Deskrl $deskrl): RedirectResponse
    {
        $validated = $this->validateAddress($request);

        $deskrlAddress = $deskrl->deskrlAddress()
            ->with('address')
            ->first();

        if (!$deskrlAddress) {
            $address = Address::query()->create($validated);

            DeskrlAddress::query()->create([
                'deskrl_id' => $deskrl->id,
                'address_id' => $address->id,
            ]);

            return redirect()
                ->back()
                ->with('success', 'Adresse wurde erstellt.');
        }

        $deskrlAddress->address->update($validated);

        return redirect()
            ->back()
            ->with('success', 'Adresse wurde aktualisiert.');
    }

    /**
     * Remove the address link from a Deskrl.
     * The address itself is not deleted because it may be reused.
     */
    public function destroy(Deskrl $deskrl): RedirectResponse
    {
        $deskrlAddress = $deskrl->deskrlAddress()->first();

        if (!$deskrlAddress) {
            return redirect()
                ->back()
                ->withErrors([
                    'address' => 'Für diesen Deskrl ist keine Adresse hinterlegt.',
                ]);
        }

        $deskrlAddress->delete();

        return redirect()
            ->back()
            ->with('success', 'Adresse wurde vom Deskrl entfernt.');
    }

    /**
     * Validate address input data.
     */
    private function validateAddress(Request $request): array
    {
        return $request->validate([
            'country_id' => ['required', 'exists:countries,id'],
            'state' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'street' => ['required', 'string', 'max:255'],
            'house_nr' => ['required', 'string', 'max:50'],
            'postal_code' => ['required', 'string', 'max:20'],
            'stair' => ['nullable', 'string', 'max:50'],
            'door' => ['nullable', 'string', 'max:50'],
        ]);
    }
}
