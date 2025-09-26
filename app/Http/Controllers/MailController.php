<?php

namespace App\Http\Controllers;

use App\Models\Mail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MailController extends Controller
{
    public function index()
    {
        $mails = Mail::where('archived', false)->orderBy('created_at', 'desc')->get();
        $archivedCount = Mail::where('archived', true)->count();
        
        return Inertia::render('Admin/mailbox/Mailbox', [
            'mails' => $mails,
            'archivedCount' => $archivedCount
        ]);
    }

    public function archived() {
        $mails = Mail::where('archived', true)->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/mailbox/Archived', [
            'mails' => $mails
        ]);
    }

    public function show($id) {
        $mail = Mail::findOrFail($id);

        return Inertia::render('Admin/mailbox/MailShow', [
            'mail' => $mail
        ]);
    }

    public function archive($id) {
        $mail = Mail::findOrFail($id);
        $mail->update(['archived' => true]);

        return redirect()->route('mailbox.index')->with('success', 'Mail archived successfully.');
    }

    public function unarchive($id) {
        $mail = Mail::findOrFail($id);
        $mail->update(['archived' => false]);

        return redirect()->route('mailbox.archived')->with('success', 'Mail unarchived successfully.');
    }

    public function reply(Request $request, $id) {
        $mail = Mail::findOrFail($id);

        $validatedData = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        // Ici tu pourras ajouter la logique d'envoi de mail plus tard
        // Pour l'instant, on simule juste une réponse

        return redirect()->route('mailbox.show', $mail->id)->with('success', 'Reply sent successfully.');
    }

    public function destroy($id) {
        $mail = Mail::findOrFail($id);
        $mail->delete();

        return redirect()->back()->with('success', 'Mail deleted successfully.');
    }
}
