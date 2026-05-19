<?php

namespace App\Http\Controllers;

use App\Models\Deskrl;
use App\Models\Utility;
use Illuminate\Http\Request;

class DeskrlUtilityController extends Controller
{
    public function sync(Request $request, Deskrl $deskrl)
    {
        // Validate all utilities that should be assigned to the Deskrl.
        $validated = $request->validate([
            'utilities' => ['required', 'array'],
            'utilities.*.id' => ['required', 'exists:utilities,id'],
            'utilities.*.quantity' => ['nullable', 'integer', 'min:0'],
        ]);

        // Prepare the sync data for the pivot table.
        $syncData = [];

        foreach ($validated['utilities'] as $utility) {
            $syncData[$utility['id']] = [
                'quantity' => $utility['quantity'] ?? null,
            ];
        }

        // Replace all existing utilities of this Deskrl with the submitted utilities.
        $deskrl->utilities()->sync($syncData);

        return redirect()->back()->with('success', 'Utilities were saved successfully.');
    }

    public function store(Request $request, Deskrl $deskrl)
    {
        // Validate the single utility that should be added to the Deskrl.
        $validated = $request->validate([
            'utility_id' => ['required', 'exists:utilities,id'],
            'quantity' => ['nullable', 'integer', 'min:0'],
        ]);

        // Attach the utility without removing already assigned utilities.
        $deskrl->utilities()->syncWithoutDetaching([
            $validated['utility_id'] => [
                'quantity' => $validated['quantity'] ?? null,
            ],
        ]);

        return redirect()->back()->with('success', 'Utility was added successfully.');
    }

    public function update(Request $request, Deskrl $deskrl, Utility $utility)
    {
        // Validate the updated pivot data for the selected utility.
        $validated = $request->validate([
            'quantity' => ['nullable', 'integer', 'min:0'],
        ]);

        // Update the pivot data for this utility on the given Deskrl.
        $deskrl->utilities()->updateExistingPivot($utility->id, [
            'quantity' => $validated['quantity'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Utility was updated successfully.');
    }

    public function destroy(Deskrl $deskrl, Utility $utility)
    {
        // Remove the selected utility from the Deskrl.
        $deskrl->utilities()->detach($utility->id);

        return redirect()->back()->with('success', 'Utility was removed successfully.');
    }
}
