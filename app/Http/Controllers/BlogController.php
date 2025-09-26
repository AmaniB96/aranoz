<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index() {
        $blogs = Blog::with(['blogCategory', 'user', 'tags'])->get();
        
        return Inertia::render('Admin/blogs/Blogs', [
            'blogs' => $blogs
        ]);
    }

    public function show($id) {
        $blog = Blog::with(['blogCategory', 'user', 'tags', 'blogComments.user'])->findOrFail($id);
        
        return Inertia::render('Admin/blogs/BlogShow', [
            'blog' => $blog
        ]);
    }

    public function create() {
        $categories = BlogCategory::all();
        $tags = Tag::all();
        
        return Inertia::render('Admin/blogs/BlogEdit', [
            'blog' => null,
            'categories' => $categories,
            'tags' => $tags
        ]);
    }

    public function store(Request $request) {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'article' => 'required|string',
            'image' => 'nullable|string|max:255',
            'blog_category_id' => 'required|exists:blog_categories,id',
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id'
        ]);

        $blog = Blog::create($validatedData);
        $blog->tags()->sync($request->tags ?? []);

        return redirect()->route('blogs.index')->with('success', 'Blog created successfully.');
    }

    public function edit($id) {
        $blog = Blog::with('tags')->findOrFail($id);
        $categories = BlogCategory::all();
        $tags = Tag::all();
        
        return Inertia::render('Admin/blogs/BlogEdit', [
            'blog' => $blog,
            'categories' => $categories,
            'tags' => $tags
        ]);
    }

    public function update(Request $request, $id) {
        $blog = Blog::findOrFail($id);

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'article' => 'required|string',
            'image' => 'nullable|string|max:255',
            'blog_category_id' => 'required|exists:blog_categories,id',
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id'
        ]);

        $blog->update($validatedData);
        $blog->tags()->sync($request->tags ?? []);

        return redirect()->route('blogs.show', $blog->id)->with('success', 'Blog updated successfully.');
    }

    public function destroy($id) {
        Blog::findOrFail($id)->delete();
        return redirect()->route('blogs.index')->with('success', 'Blog deleted successfully.');
    }
}
