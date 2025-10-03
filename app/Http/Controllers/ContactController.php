<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Mail\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
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

    // CORRECTION : Retourner une réponse Inertia au lieu de JSON
    public function sendMessage(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        try {
            // Récupérer l'adresse email de l'admin depuis la table contact
            $contact = Contact::first();
            $adminEmail = $contact ? $contact->email : 'bxl.superstars@gmail.com';

            // Envoyer l'email à l'admin
            Mail::to($adminEmail)->send(new ContactMessage($validated));

            Log::info('Contact message sent successfully', [
                'from' => $validated['email'],
                'to' => $adminEmail,
                'subject' => $validated['subject']
            ]);

            // RETOURNER à la page contact avec un message de succès
            return redirect()->back()->with('success', 'Votre message a été envoyé avec succès !');

        } catch (\Exception $e) {
            Log::error('Failed to send contact message', [
                'error' => $e->getMessage(),
                'data' => $validated
            ]);

            // RETOURNER à la page contact avec un message d'erreur
            return redirect()->back()->with('error', 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
        }
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
