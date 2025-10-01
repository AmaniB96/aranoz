<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index() {
        $contact = Contact::first();

        return Inertia::render('Admin/contact/Contact', [
            'contact' => $contact
        ]);
    }

    public function publicIndex() {
        $contact = Contact::first();

        return Inertia::render('Contact/Contact', [
            'contact' => $contact
        ]);
    }

    public function update(Request $request, $id) {

        $data = $request->validate([
        'street' => 'nullable|string|max:255',
        'state' => 'nullable|string|max:255',
        'city' => 'nullable|string|max:255',
        'country_code' => 'nullable|string|max:10',
        'zip_code' => 'nullable|string|max:20',
        'street_number' => 'nullable|string|max:5',
        'email' => 'nullable|email|max:255',
        'phone_number' => 'nullable|string|max:50',
    ]);
        
        $contact = Contact::findOrFail($id);
        $contact->street = $request->street;
        $contact->state = $request->state;
        $contact->city = $request->city;
        $contact->country_code = $request->country_code;
        $contact->zip_code = $request->zip_code;
        $contact->street_number = $request->street_number;
        $contact->email = $request->email;
        $contact->phone_number = $request->phone_number;

        $contact->update($data);

        return redirect()->back()->with('success', 'Address Updated');

    }
}
