<?php

namespace App\Http\Controllers\User;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Imagick\Driver;
use Intervention\Image\ImageManager;

class MyNodeAvatarController
{
    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,gif,webp', 'max:2048', 'dimensions:max_width=2000,max_height=2000'],
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $manager = new ImageManager(new Driver());
        $image   = $manager->read($request->file('avatar')->getRealPath());
        $image->cover(200, 200);
        $encoded = $image->toWebp(quality: 90);

        $filename = Str::random(40) . '.webp';
        Storage::disk('public')->put('avatars/' . $filename, (string) $encoded);

        if ($user->avatar_filename) {
            Storage::disk('public')->delete('avatars/' . $user->avatar_filename);
        }

        $user->update(['avatar_filename' => $filename]);

        return response()->json([
            'url' => Storage::disk('public')->url('avatars/' . $filename),
        ]);
    }

    public function delete(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->avatar_filename) {
            Storage::disk('public')->delete('avatars/' . $user->avatar_filename);
            $user->update(['avatar_filename' => null]);
        }

        return response()->json([
            'url' => $user->getAvatarUrl(),
        ]);
    }
}
