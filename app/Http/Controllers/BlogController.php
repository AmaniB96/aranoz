<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\Tag;
use Illuminate\Http\Request;
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

    public function publicIndex()
    {
        $blogs = Blog::with(['user', 'blogCategory', 'blogComments', 'tags'])
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($blog) {
                return [
                    'id' => $blog->id,
                    'title' => $blog->title,
                    'article' => $blog->article,
                    'image' => $blog->image ? "/storage/{$blog->image}" : null,
                    'date' => $blog->date,
                    'user' => $blog->user ? ['name' => $blog->user->name] : null,
                    'category' => $blog->blogCategory ? ['name' => $blog->blogCategory->name] : null,
                    'comments_count' => $blog->blogComments->count(),
                    'tags' => $blog->tags->map(fn($tag) => ['id' => $tag->id, 'name' => $tag->name])
                ];
            });

        $categories = BlogCategory::withCount('blogs')->get();
        
        $tags = Tag::with('blogs')->get()->map(function ($tag) {
            return [
                'id' => $tag->id,
                'name' => $tag->name,
                'count' => $tag->blogs->count()
            ];
        });

        $recentPosts = Blog::with('user')
            ->orderBy('date', 'desc')
            ->take(4)
            ->get()
            ->map(function ($blog) {
                return [
                    'id' => $blog->id,
                    'title' => $blog->title,
                    'date' => $blog->date
                ];
            });

        return Inertia::render('Blog/Blog', [
            'blogs' => $blogs,
            'categories' => $categories,
            'tags' => $tags,
            'recentPosts' => $recentPosts
        ]);
    }

    public function publicShow($id)
    {
        $blog = Blog::with(['user', 'blogCategory', 'blogComments.user', 'tags'])
            ->findOrFail($id);

        // Récupérer les blogs récents pour la sidebar
        $recentPosts = Blog::with('user')
            ->where('id', '!=', $id)
            ->orderBy('date', 'desc')
            ->take(4)
            ->get()
            ->map(function ($blog) {
                return [
                    'id' => $blog->id,
                    'title' => $blog->title,
                    'date' => $blog->date
                ];
            });

        $categories = BlogCategory::withCount('blogs')->get();
        
        $tags = Tag::with('blogs')->get()->map(function ($tag) {
            return [
                'id' => $tag->id,
                'name' => $tag->name,
                'count' => $tag->blogs->count()
            ];
        });

        return Inertia::render('Blog/Show', [
            'blog' => [
                'id' => $blog->id,
                'title' => $blog->title,
                'article' => $blog->article,
                'image' => $blog->image ? "/storage/{$blog->image}" : null,
                'date' => $blog->date,
                'user' => $blog->user ? ['name' => $blog->user->name] : null,
                'category' => $blog->blogCategory ? ['name' => $blog->blogCategory->name] : null,
                'comments' => $blog->blogComments->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'comment' => $comment->comment,
                        'user' => $comment->user ? ['name' => $comment->user->name] : null,
                        'created_at' => $comment->created_at
                    ];
                }),
                'tags' => $blog->tags->map(fn($tag) => ['id' => $tag->id, 'name' => $tag->name])
            ],
            'categories' => $categories,
            'tags' => $tags,
            'recentPosts' => $recentPosts
        ]);
    }

    public function publicByCategory($id)
    {
        $category = BlogCategory::findOrFail($id);
        
        $blogs = Blog::with(['user', 'blogCategory', 'blogComments', 'tags'])
            ->where('blog_category_id', $id)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($blog) {
                return [
                    'id' => $blog->id,
                    'title' => $blog->title,
                    'article' => $blog->article,
                    'image' => $blog->image ? "/storage/{$blog->image}" : null,
                    'date' => $blog->date,
                    'user' => $blog->user ? ['name' => $blog->user->name] : null,
                    'category' => $blog->blogCategory ? ['name' => $blog->blogCategory->name] : null,
                    'comments_count' => $blog->blogComments->count(),
                    'tags' => $blog->tags->map(fn($tag) => ['id' => $tag->id, 'name' => $tag->name])
                ];
            });

        return Inertia::render('Blog/Blog', [
            'blogs' => $blogs,
            'categories' => BlogCategory::withCount('blogs')->get(),
            'tags' => Tag::with('blogs')->get(),
            'recentPosts' => Blog::orderBy('date', 'desc')->take(4)->get()->map(function ($blog) {
                return [
                    'id' => $blog->id,
                    'title' => $blog->title,
                    'date' => $blog->date
                ];
            }),
            'currentCategory' => $category
        ]);
    }

    public function publicByTag($id)
    {
        $tag = Tag::findOrFail($id);
        
        $blogs = Blog::with(['user', 'blogCategory', 'blogComments', 'tags'])
            ->whereHas('tags', function($query) use ($id) {
                $query->where('tag_id', $id);
            })
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($blog) {
                return [
                    'id' => $blog->id,
                    'title' => $blog->title,
                    'article' => $blog->article,
                    'image' => $blog->image ? "/storage/{$blog->image}" : null,
                    'date' => $blog->date,
                    'user' => $blog->user ? ['name' => $blog->user->name] : null,
                    'category' => $blog->blogCategory ? ['name' => $blog->blogCategory->name] : null,
                    'comments_count' => $blog->blogComments->count(),
                    'tags' => $blog->tags->map(fn($tag) => ['id' => $tag->id, 'name' => $tag->name])
                ];
            });

        return Inertia::render('Blog/Blog', [
            'blogs' => $blogs,
            'categories' => BlogCategory::withCount('blogs')->get(),
            'tags' => Tag::with('blogs')->get(),
            'recentPosts' => Blog::orderBy('date', 'desc')->take(4)->get()->map(function ($blog) {
                return [
                    'id' => $blog->id,
                    'title' => $blog->title,
                    'date' => $blog->date
                ];
            }),
            'currentTag' => $tag
        ]);
    }
}
