<?php

namespace App\Http\Controllers;

use App\Models\Deskrl;
use App\Models\Utility;
use Illuminate\Http\Request;

class DeskrlUtilityController extends Controller
{
    /**
     * Synchronizes all submitted utilities for the given Deskrl.
     */
    public function sync(Request $request, Deskrl $deskrl)
    {
        $validated = $request->validate([
            'utilities' => ['required', 'array'],
            'utilities.*.id' => ['required', 'exists:utilities,id'],
            'utilities.*.quantity' => ['nullable', 'integer', 'min:0'],
        ]);

        $syncData = [];

        foreach ($validated['utilities'] as $utility) {
            $syncData[$utility['id']] = [
                'quantity' => $utility['quantity'] ?? null,
            ];
        }

        $deskrl->utilities()->sync($syncData);

        return redirect()->back()->with('success', 'Utilities were saved successfully.');
    }

    /**
     * Adds one utility to the given Deskrl without removing existing utilities.
     */
    public function store(Request $request, Deskrl $deskrl)
    {
        $validated = $request->validate([
            'utility_id' => ['required', 'exists:utilities,id'],
            'quantity' => ['nullable', 'integer', 'min:0'],
        ]);

        $deskrl->utilities()->syncWithoutDetaching([
            $validated['utility_id'] => [
                'quantity' => $validated['quantity'] ?? null,
            ],
        ]);

        return redirect()->back()->with('success', 'Utility was added successfully.');
    }

    /**
     * Updates the quantity of one assigned utility for the given Deskrl.
     */
    public function update(Request $request, Deskrl $deskrl, Utility $utility)
    {
        $validated = $request->validate([
            'quantity' => ['nullable', 'integer', 'min:0'],
        ]);

        $deskrl->utilities()->updateExistingPivot($utility->id, [
            'quantity' => $validated['quantity'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Utility was updated successfully.');
    }

    /**
     * Removes one utility from the given Deskrl.
     */
    public function destroy(Deskrl $deskrl, Utility $utility)
    {
        $deskrl->utilities()->detach($utility->id);

        return redirect()->back()->with('success', 'Utility was removed successfully.');
    }
}
