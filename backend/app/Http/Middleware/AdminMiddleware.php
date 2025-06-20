<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
{
    \Log::debug('AdminMiddleware Check', [
        'user_id' => auth()->id(),
        'is_admin' => auth()->user()?->is_admin
    ]);

    if (!auth()->user() || !auth()->user()->is_admin) {
        return response()->json([
            'message' => 'Forbidden: Admin rights required',
            'user_is_admin' => auth()->user()?->is_admin ?? false
        ], 403);
    }

    return $next($request);
}
}
