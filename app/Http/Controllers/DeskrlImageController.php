<?php

namespace App\Http\Controllers;

use App\Models\Deskrl;
use App\Models\DeskrlImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DeskrlImageController extends Controller
{
    /**
     * Shows all images of the given Deskrl in their display order.
     */
    public function index(Deskrl $deskrl)
    {
        return Inertia::render('Deskrl/Images/Index', [
            'deskrl' => $deskrl,
            'images' => $deskrl->images()
                ->orderBy('sort_order')
                ->get(),
        ]);
    }

    /**
     * Stores a new image for the given Deskrl.
     */
    public function store(Request $request, Deskrl $deskrl)
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'max:4096'],
            'is_main' => ['nullable', 'boolean'],
        ]);

        $path = $request->file('image')->store('deskrls', 'public');

        $nextSortOrder = ($deskrl->images()->max('sort_order') ?? 0) + 1;

        if ($request->boolean('is_main')) {
            $deskrl->images()->update(['is_main' => false]);
        }

        $deskrl->images()->create([
            'path' => $path,
            'is_main' => $request->boolean('is_main'),
            'sort_order' => $nextSortOrder,
        ]);

        return redirect()->back()->with('success', 'Image was uploaded successfully.');
    }

    /**
     * Deletes an image from the given Deskrl and removes the file from storage.
     */
    public function destroy(Deskrl $deskrl, DeskrlImage $image)
    {
        if ($image->deskrl_id !== $deskrl->id) {
            abort(404);
        }

        if ($image->path && Storage::disk('public')->exists($image->path)) {
            Storage::disk('public')->delete($image->path);
        }

        $image->delete();

        return redirect()->back()->with('success', 'Image was deleted successfully.');
    }

    /**
     * Sets one image as the main image of the given Deskrl.
     */
    public function setMain(Deskrl $deskrl, DeskrlImage $image)
    {
        if ($image->deskrl_id !== $deskrl->id) {
            abort(404);
        }

        $deskrl->images()->update(['is_main' => false]);

        $image->update([
            'is_main' => true,
        ]);

        return redirect()->back()->with('success', 'Main image was set successfully.');
    }

    /**
     * Updates the display order of multiple images for the given Deskrl.
     */
    public function reorder(Request $request, Deskrl $deskrl)
    {
        $validated = $request->validate([
            'images' => ['required', 'array'],
            'images.*.id' => ['required', 'exists:deskrl_images,id'],
            'images.*.sort_order' => ['required', 'integer', 'min:1'],
        ]);

        foreach ($validated['images'] as $imageData) {
            DeskrlImage::query()
                ->where('id', $imageData['id'])
                ->where('deskrl_id', $deskrl->id)
                ->update([
                    'sort_order' => $imageData['sort_order'],
                ]);
        }

        return redirect()->back()->with('success', 'Image order was saved successfully.');
    }
}
