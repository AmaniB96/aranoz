<?php

namespace App\Http\Controllers;

use App\Models\BlogComment;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlogCommentController extends Controller
{
    public function store(Request $request, $blogId)
    {
        $request->validate([
            'comment' => 'required|string|max:1000',
        ]);

        $blog = Blog::findOrFail($blogId);

        BlogComment::create([
            'blog_id' => $blog->id,
            'user_id' => Auth::id(),
            'comment' => $request->comment,
            'commented_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Comment posted successfully!'
        ]);
    }
}