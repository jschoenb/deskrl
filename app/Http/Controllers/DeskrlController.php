<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Deskrl;
use App\Models\DeskrlCategory;
use App\Models\UtilityCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DeskrlController extends Controller
{
    /**
     * Display a public overview of all active Deskrls.
     */
    public function index(Request $request): Response
    {
        $query = Deskrl::query()
            ->with([
                'hostAccount',
                'deskrlCategory',
                'images',
                'deskrlAddress.address',
            ])
            ->where('status', 'active');

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('title->de', 'like', '%' . $search . '%')
                    ->orWhere('description->de', 'like', '%' . $search . '%');
            });
        }

        if ($request->filled('deskrl_category_id')) {
            $query->where('deskrl_category_id', $request->input('deskrl_category_id'));
        }

        $deskrls = $query->latest()->get();

        return Inertia::render('Deskrls/Index', [
            'deskrls' => $deskrls,
            'filters' => $request->only([
                'search',
                'deskrl_category_id',
            ]),
            'categories' => DeskrlCategory::query()
                ->where('activated', true)
                ->get(),
        ]);
    }

    /**
     * Display a single Deskrl detail page.
     */
    public function show(Deskrl $deskrl): Response
    {
        $deskrl->load([
            'hostAccount',
            'deskrlCategory',
            'images',
            'utilities.utilityCategory',
            'availabilities',
            'specialAvailabilities',
            'specialDayPrices',
            'deskrlAddress.address',
        ]);

        return Inertia::render('Deskrls/Show', [
            'deskrl' => $deskrl,
        ]);
    }

    /**
     * Show the form for creating a new Deskrl.
     */
    public function create(): Response
    {
        return Inertia::render('Deskrls/Create', [
            'categories' => DeskrlCategory::query()
                ->where('activated', true)
                ->get(),

            'utilityCategories' => UtilityCategory::query()
                ->with('utilities')
                ->get(),
        ]);
    }

    /**
     * Store a newly created Deskrl as a draft.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateDeskrl($request);

        $hostAccountId = $this->resolveHostAccountId($request);

        if (!$hostAccountId) {
            return redirect()
                ->back()
                ->withErrors([
                    'host_account_id' => 'Es wurde kein Host-Account gefunden.',
                ]);
        }

        $deskrl = Deskrl::query()->create([
            ...$validated,
            'host_account_id' => $hostAccountId,
            //TODO später einkommentieren statt Zeile 113, sobald Auth & Controller getestet wurden
            //'host_account_id' => $request->user()->id,
            'status' => 'draft',
            'instant_bookable' => $request->boolean('instant_bookable'),
        ]);

        return redirect()
            ->route('deskrls.edit', $deskrl)
            ->with('success', 'Deskrl wurde als Entwurf erstellt.');
    }

    /**
     * Show the form for editing an existing Deskrl.
     */
    public function edit(Deskrl $deskrl): Response
    {
        $deskrl->load([
            'hostAccount',
            'deskrlCategory',
            'images',
            'utilities',
            'availabilities',
            'deskrlAddress.address',
        ]);

        return Inertia::render('Deskrls/Edit', [
            'deskrl' => $deskrl,

            'categories' => DeskrlCategory::query()
                ->where('activated', true)
                ->get(),

            'utilityCategories' => UtilityCategory::query()
                ->with('utilities')
                ->get(),
        ]);
    }

    /**
     * Update an existing Deskrl.
     */
    public function update(Request $request, Deskrl $deskrl): RedirectResponse
    {
        $validated = $this->validateDeskrl($request);

        $deskrl->update([
            ...$validated,
            'instant_bookable' => $request->boolean('instant_bookable'),
        ]);

        return redirect()
            ->route('deskrls.edit', $deskrl)
            ->with('success', 'Deskrl wurde aktualisiert.');
    }

    /**
     * Soft delete a Deskrl.
     */
    public function destroy(Deskrl $deskrl): RedirectResponse
    {
        $deskrl->delete();

        return redirect()
            ->route('deskrls.index')
            ->with('success', 'Deskrl wurde gelöscht.');
    }

    /**
     * Publish a Deskrl.
     */
    public function publish(Deskrl $deskrl): RedirectResponse
    {
        if (
            !$deskrl->deskrl_category_id ||
            !$this->hasAtLeastOneTranslation($deskrl->title) ||
            !$this->hasAtLeastOneTranslation($deskrl->description) ||
            !$deskrl->capacity ||
            !$this->hasAtLeastOnePrice($deskrl)
        ) {
            return redirect()
                ->back()
                ->withErrors([
                    'publish' => 'Der Deskrl kann erst veröffentlicht werden, wenn Kategorie, Titel,
                    Beschreibung, Kapazität und mindestens ein Preis ausgefüllt sind.',
                ]);
        }

        $deskrl->update([
            'status' => 'active',
        ]);

        return redirect()
            ->back()
            ->with('success', 'Deskrl wurde veröffentlicht.');
    }

    /**
     * Archive a Deskrl.
     */
    public function archive(Deskrl $deskrl): RedirectResponse
    {
        $deskrl->update([
            'status' => 'archived',
        ]);

        return redirect()
            ->back()
            ->with('success', 'Deskrl wurde archiviert.');
    }

    /**
     * Activate a Deskrl.
     */
    public function activate(Deskrl $deskrl): RedirectResponse
    {
        $deskrl->update([
            'status' => 'active',
        ]);

        return redirect()
            ->back()
            ->with('success', 'Deskrl wurde aktiviert.');
    }

    /**
     * Deactivate a Deskrl.
     */
    public function deactivate(Deskrl $deskrl): RedirectResponse
    {
        $deskrl->update([
            'status' => 'inactive',
        ]);

        return redirect()
            ->back()
            ->with('success', 'Deskrl wurde deaktiviert.');
    }

    /**
     * Validate Deskrl input data.
     * some fields are nullable because of Deskrl drafts
     */
    private function validateDeskrl(Request $request): array
    {
        return $request->validate([
            'deskrl_category_id' => ['nullable', 'exists:deskrl_categories,id'],

            'title' => ['nullable', 'array'],
            'title.de' => ['nullable', 'string', 'max:255'],
            'title.en' => ['nullable', 'string', 'max:255'],

            'description' => ['nullable', 'array'],
            'description.de' => ['nullable', 'string'],
            'description.en' => ['nullable', 'string'],

            'capacity' => ['nullable', 'integer', 'min:1'],

            'price_per_hour' => ['nullable', 'numeric', 'min:0'],
            'price_per_half_day' => ['nullable', 'numeric', 'min:0'],
            'price_per_day' => ['nullable', 'numeric', 'min:0'],
            'price_per_week' => ['nullable', 'numeric', 'min:0'],
            'price_per_month' => ['nullable', 'numeric', 'min:0'],

            'instant_bookable' => ['nullable', 'boolean'],

            'min_hours' => ['nullable', 'integer', 'min:1'],
            'max_hours' => ['nullable', 'integer', 'min:1', 'gte:min_hours'],

            'bookable_before_hours' => ['nullable', 'integer', 'min:0'],
            'bookable_until_months' => ['nullable', 'integer', 'min:1'],
        ]);
    }

    /**
     * Check whether at least one translation value is filled.
     */
    private function hasAtLeastOneTranslation(?array $translations): bool
    {
        if (!$translations) {
            return false;
        }

        foreach ($translations as $value) {
            if (is_string($value) && trim($value) !== '') {
                return true;
            }
        }

        return false;
    }

    /**
     * Check whether at least one price field has a valid value.
     */
    private function hasAtLeastOnePrice(Deskrl $deskrl): bool
    {
        return collect([
            $deskrl->price_per_hour,
            $deskrl->price_per_half_day,
            $deskrl->price_per_day,
            $deskrl->price_per_week,
            $deskrl->price_per_month,
        ])->contains(fn ($price) => $price !== null && (float) $price > 0);
    }

    /**
     * TODO: Temporary help function for resolving the host account id.
     * Fallback:
     * If authentication is not fully connected to Account yet,
     * use the first private or commercial host account.
     */
    private function resolveHostAccountId(Request $request): ?int
    {
        if ($request->user()) {
            return $request->user()->id;
        }

        return Account::query()
            ->whereIn('account_type', ['private_host', 'commercial_host'])
            ->value('id');
    }
}
