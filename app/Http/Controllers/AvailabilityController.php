<?php

namespace App\Http\Controllers;

use App\Models\Availability;
use App\Models\Deskrl;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AvailabilityController extends Controller
{
    public function index(Deskrl $deskrl)
    {
        // Load all regular weekly availabilities for the given Deskrl.
        // The custom order keeps the weekdays in a natural Monday-to-Sunday order.
        return Inertia::render('Deskrl/Availabilities/Index', [
            'deskrl' => $deskrl,
            'availabilities' => $deskrl->availabilities()
                ->orderByRaw("CASE weekday
                    WHEN 'monday' THEN 1
                    WHEN 'tuesday' THEN 2
                    WHEN 'wednesday' THEN 3
                    WHEN 'thursday' THEN 4
                    WHEN 'friday' THEN 5
                    WHEN 'saturday' THEN 6
                    WHEN 'sunday' THEN 7
                END")
                ->get(),
        ]);
    }

    public function store(Request $request, Deskrl $deskrl)
    {
        // Validate one weekday availability entry.
        $validated = $request->validate([
            'weekday' => ['required', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
        ]);

        // Create a new availability or update the existing one for this Deskrl and weekday.
        Availability::query()->updateOrCreate(
            [
                'deskrl_id' => $deskrl->id,
                'weekday' => $validated['weekday'],
            ],
            [
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
            ]
        );

        return redirect()->back()->with('success', 'Availability was saved successfully.');
    }

    public function update(Request $request, Deskrl $deskrl, Availability $availability)
    {
        // Make sure the availability belongs to the given Deskrl.
        if ($availability->deskrl_id !== $deskrl->id) {
            abort(404);
        }

        // Validate the updated availability data.
        $validated = $request->validate([
            'weekday' => ['required', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
        ]);

        // Update the selected availability entry.
        $availability->update($validated);

        return redirect()->back()->with('success', 'Availability was updated successfully.');
    }

    public function sync(Request $request, Deskrl $deskrl)
    {
        // Validate multiple weekday availability entries at once.
        $validated = $request->validate([
            'availabilities' => ['required', 'array'],
            'availabilities.*.weekday' => ['required', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'availabilities.*.start_time' => ['required', 'date_format:H:i'],
            'availabilities.*.end_time' => ['required', 'date_format:H:i'],
        ]);

        // Create or update one availability entry per submitted weekday.
        foreach ($validated['availabilities'] as $availability) {
            // Validate the time range manually because nested "after" validation is harder to read here.
            if ($availability['end_time'] <= $availability['start_time']) {
                return redirect()
                    ->back()
                    ->withErrors(['availabilities' => 'The end time must be after the start time.']);
            }

            Availability::query()->updateOrCreate(
                [
                    'deskrl_id' => $deskrl->id,
                    'weekday' => $availability['weekday'],
                ],
                [
                    'start_time' => $availability['start_time'],
                    'end_time' => $availability['end_time'],
                ]
            );
        }

        return redirect()->back()->with('success', 'Weekly availabilities were saved successfully.');
    }
}
