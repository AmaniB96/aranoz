<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use App\Models\ProductCategory;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriesController extends Controller
{
    public function index() {

        $productCat = ProductCategory::all();
        $blogCat = BlogCategory::all();
        $tags = Tag::all();
        return Inertia::render("Admin/Categories", [
            'productCat' => $productCat,
            'blogCat' => $blogCat,
            'tags' => $tags
        ]);
    }

    public function create(Request $request) {

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $type = $request->type;

        if ($type === 'product'){
            $productCat = new ProductCategory;
            $productCat->name = $request->name;
            $productCat->save();
        }
        elseif ($type === 'blog') {
            $blogCat = new BlogCategory;
            $blogCat->name = $request->name;
            $blogCat->save();
        }
        elseif ($type === 'tag') {

            $tag = new Tag();
            $tag->name = $request->name;
            $tag->save();
        }

        return redirect()->back()->with('success', ucfirst($type) . ' créé !');
    }

    public function destroy(Request $request, $id) {

        $type = $request->type;

        if ($type === 'product'){
            $productCat = ProductCategory::findOrFail($id);
            $productCat->delete();
        }
        elseif ($type === 'blog') {
            $blogCat = BlogCategory::findOrFail($id);
            $blogCat->delete();
        }
        elseif ($type === 'tag') {

            $tag = Tag::findOrFail($id);
            $tag->delete();
        }

        return redirect()->back()->with('success', ucfirst($type) . ' supprimée !');

    }
}
