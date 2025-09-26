import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import './mailbox.css';

export default function Archived({ mails, flash }) {
    const [unarchivingMailId, setUnarchivingMailId] = useState(null);
    const [deletingMailId, setDeletingMailId] = useState(null);

    const handleUnarchive = (mailId) => {
        setUnarchivingMailId(mailId);

        router.put(`/admin/mailbox/${mailId}/unarchive`, {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setUnarchivingMailId(null);
            },
            onError: (errors) => {
                console.error('Error unarchiving mail:', errors);
                setUnarchivingMailId(null);
            }
        });
    };

    const handleDelete = (mailId) => {
        if (confirm('Are you sure you want to delete this mail?')) {
            setDeletingMailId(mailId);

            router.delete(`/admin/mailbox/${mailId}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setDeletingMailId(null);
                },
                onError: (errors) => {
                    console.error('Error deleting mail:', errors);
                    setDeletingMailId(null);
                }
            });
        }
    };

    return (
        <div className="mailbox-container">
            <div className="mailbox-header">
                <h1 className="mailbox-title">Archived Mails</h1>
                <div className="mailbox-actions">
                    <Link href="/admin/mailbox" className="back-link">
                        Back to Inbox
                    </Link>
                </div>
            </div>

            {(flash?.success) && (
                <div className="success-message">
                    {flash.success}
                </div>
            )}

            <div className="mails-list">
                {mails.length === 0 ? (
                    <div className="no-mails">
                        <p>No archived mails.</p>
                    </div>
                ) : (
                    mails.map((mail) => (
                        <div key={mail.id} className="mail-item archived">
                            <div className="mail-header">
                                <div className="mail-info">
                                    <h3 className="mail-sender">{mail.name}</h3>
                                    <span className="mail-date">
                                        {new Date(mail.created_at).toLocaleDateString()} at {new Date(mail.created_at).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="mail-actions">
                                    <Link href={`/admin/mailbox/${mail.id}`} className="action-btn view-btn">
                                        Read
                                    </Link>
                                    <button
                                        onClick={() => handleUnarchive(mail.id)}
                                        className="action-btn unarchive-btn"
                                        disabled={unarchivingMailId === mail.id}
                                    >
                                        {unarchivingMailId === mail.id ? 'Unarchiving...' : 'Unarchive'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(mail.id)}
                                        className="action-btn delete-btn"
                                        disabled={deletingMailId === mail.id}
                                    >
                                        {deletingMailId === mail.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                            <div className="mail-preview">
                                <h4 className="mail-title">{mail.title}</h4>
                                <p className="mail-message-preview">
                                    {mail.message.length > 100 ? mail.message.substring(0, 100) + '...' : mail.message}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}