<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PromoController extends Controller
{
    public function index()
    {
        $promos = Promo::withCount('products')->get();

        return Inertia::render('Admin/promos/Promo', [
            'promos' => $promos
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/promos/PromoEdit', [
            'promo' => null
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'discount' => 'required|numeric|min:0|max:100',
            'active' => 'boolean'
        ]);

        Promo::create($validatedData);

        return redirect()->route('promos.index')->with('success', 'Promotion created successfully.');
    }

    public function show($id)
    {
        $promo = Promo::with('products')->findOrFail($id);

        return Inertia::render('Admin/promos/PromoShow', [
            'promo' => $promo
        ]);
    }

    public function edit($id)
    {
        $promo = Promo::findOrFail($id);

        return Inertia::render('Admin/promos/PromoEdit', [
            'promo' => $promo
        ]);
    }

    public function update(Request $request, $id)
    {
        $promo = Promo::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'discount' => 'required|numeric|min:0|max:100',
            'active' => 'boolean'
        ]);

        $promo->update($validatedData);

        return redirect()->route('promos.index')->with('success', 'Promotion updated successfully.');
    }

    public function destroy($id)
    {
        $promo = Promo::findOrFail($id);
        
        // Check if promo is used by products
        if ($promo->products()->count() > 0) {
            return redirect()->route('promos.index')->with('error', 'Cannot delete promotion that is assigned to products.');
        }

        $promo->delete();

        return redirect()->route('promos.index')->with('success', 'Promotion deleted successfully.');
    }
}
