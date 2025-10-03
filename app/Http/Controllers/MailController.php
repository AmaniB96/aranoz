<?php

namespace App\Http\Controllers;

use App\Models\Mail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail as MailFacade;
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

    // VÉRIFIER QUE LA MÉTHODE ARCHIVE EXISTE ET FONCTIONNE
    public function archive(Request $request, $id)
    {
        $mail = Mail::findOrFail($id);
        
        // Basculer l'état archived
        $mail->archived = !$mail->archived;
        $mail->save();

        $action = $mail->archived ? 'archived' : 'unarchived';
        
        Log::info("Mail {$action}", [
            'mail_id' => $mail->id,
            'action' => $action
        ]);

        return redirect()->back()->with('success', "Mail {$action} successfully!");
    }

    public function unarchive($id) {
        $mail = Mail::findOrFail($id);
        $mail->update(['archived' => false]);

        return redirect()->route('mailbox.archived')->with('success', 'Mail unarchived successfully.');
    }

    // AJOUTER LA MÉTHODE POUR RÉPONDRE AUX MAILS
    public function reply(Request $request, $id)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        $mail = Mail::findOrFail($id);

        try {
            // AJOUTER UNE SIGNATURE AUTOMATIQUE AU MESSAGE
            $messageWithSignature = $validated['message'] . "\n\n" . $this->getSignature();

            // ENVOYER LA RÉPONSE À L'UTILISATEUR
            MailFacade::raw($messageWithSignature, function ($message) use ($mail, $validated) {
                $message->to($mail->email)
                        ->subject($validated['subject'])
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });

            Log::info('Reply sent to user', [
                'original_mail_id' => $mail->id,
                'to_email' => $mail->email,
                'subject' => $validated['subject']
            ]);

            return redirect()->back()->with('success', 'Reply sent successfully!');

        } catch (\Exception $e) {
            Log::error('Failed to send reply', [
                'mail_id' => $mail->id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()->with('error', 'Failed to send reply. Please try again.');
        }
    }

    // MÉTHODE PRIVÉE POUR GÉNÉRER LA SIGNATURE
    private function getSignature()
    {
        return "--\n" .
               "Best regards,\n" .
               "Aranoz Team\n" .
               "Email: support@aranoz.com\n" .
               "Phone: +1 (555) 123-4567\n" .
               "Website: https://aranoz.com\n" .
               "\n" .
               "Please do not reply to this email directly. Use the contact form on our website for any further inquiries.";
    }

    public function destroy($id) {
        $mail = Mail::findOrFail($id);
        $mail->delete();

        return redirect()->back()->with('success', 'Mail deleted successfully.');
    }
}
