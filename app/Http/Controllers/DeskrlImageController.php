<?php

namespace App\Http\Controllers;

use App\Models\Deskrl;
use App\Models\DeskrlImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DeskrlImageController extends Controller
{
    public function index(Deskrl $deskrl)
    {
        // Load all images for the given Deskrl and sort them by their display order.
        return Inertia::render('Deskrl/Images/Index', [
            'deskrl' => $deskrl,
            'images' => $deskrl->images()
                ->orderBy('sort_order')
                ->get(),
        ]);
    }

    public function store(Request $request, Deskrl $deskrl)
    {
        // Validate the uploaded image and the optional main-image flag.
        $validated = $request->validate([
            'image' => ['required', 'image', 'max:4096'],
            'is_main' => ['nullable', 'boolean'],
        ]);

        // Store the uploaded image in the public storage disk under the deskrls folder.
        $path = $request->file('image')->store('deskrls', 'public');

        // Set the next sort order so the new image is placed at the end.
        $nextSortOrder = ($deskrl->images()->max('sort_order') ?? 0) + 1;

        // If the new image should be the main image, reset all other images first.
        if ($request->boolean('is_main')) {
            $deskrl->images()->update(['is_main' => false]);
        }

        // Create the new image entry for the Deskrl.
        $deskrl->images()->create([
            'path' => $path,
            'is_main' => $request->boolean('is_main'),
            'sort_order' => $nextSortOrder,
        ]);

        return redirect()->back()->with('success', 'Image was uploaded successfully.');
    }

    public function destroy(Deskrl $deskrl, DeskrlImage $image)
    {
        // Ensure that the image really belongs to the given Deskrl.
        if ($image->deskrl_id !== $deskrl->id) {
            abort(404);
        }

        // Delete the physical image file from storage if it exists.
        if ($image->path && Storage::disk('public')->exists($image->path)) {
            Storage::disk('public')->delete($image->path);
        }

        // Delete the database record of the image.
        $image->delete();

        return redirect()->back()->with('success', 'Image was deleted successfully.');
    }

    public function setMain(Deskrl $deskrl, DeskrlImage $image)
    {
        // Ensure that the selected image belongs to the given Deskrl.
        if ($image->deskrl_id !== $deskrl->id) {
            abort(404);
        }

        // Reset the main-image flag for all images of this Deskrl.
        $deskrl->images()->update(['is_main' => false]);

        // Mark the selected image as the main image.
        $image->update([
            'is_main' => true,
        ]);

        return redirect()->back()->with('success', 'Main image was set successfully.');
    }

    public function reorder(Request $request, Deskrl $deskrl)
    {
        // Validate the submitted image order data.
        $validated = $request->validate([
            'images' => ['required', 'array'],
            'images.*.id' => ['required', 'exists:deskrl_images,id'],
            'images.*.sort_order' => ['required', 'integer', 'min:1'],
        ]);

        // Update the sort order only for images that belong to the given Deskrl.
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
