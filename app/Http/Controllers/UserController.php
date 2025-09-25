<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index() {
        $users = User::with('role')->get(); // Charger la relation role
        $roles = Role::all();
        return Inertia::render('Admin/user/User', [
            'users' => $users,
            'roles' => $roles
        ]);
    }

    public function update(Request $request, $id) {
        $user = User::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'first_name' => 'sometimes|required|string|max:255',
            'pseudo' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'role_id' => 'sometimes|required|exists:roles,id',
        ]);

        $user->update($validatedData);

        return redirect()->back()->with('success', 'Utilisateur mis à jour avec succès.');
    }

    public function destroy($id) {
        User::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Utilisateur supprimé avec succès.');
    }
}
