import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import './mailbox.css';
import NavAdmin from '../components/NavAdmin';
import AdminHeader from '../components/AdminHeader';

export default function Mailbox({ mails, archivedCount, flash }) {
    const [archivingMailId, setArchivingMailId] = useState(null);
    const [deletingMailId, setDeletingMailId] = useState(null);

    const handleArchive = (mailId) => {
        setArchivingMailId(mailId);

        router.put(`/admin/mailbox/${mailId}/archive`, {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setArchivingMailId(null);
            },
            onError: (errors) => {
                console.error('Error archiving mail:', errors);
                setArchivingMailId(null);
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
        <>
            <NavAdmin/>
            <AdminHeader title="Mailbox">
                <Link href="/admin/mailbox/archived" className="archived-link">
                    View Archived ({archivedCount})
                </Link>
            </AdminHeader>
            
            <div className="mailbox-container">
                {(flash?.success) && (
                    <div className="success-message">
                        {flash.success}
                    </div>
                )}

                <div className="mails-list">
                    {mails.length === 0 ? (
                        <div className="no-mails">
                            <p>No mails in your inbox.</p>
                        </div>
                    ) : (
                        mails.map((mail) => (
                            <div key={mail.id} className="mail-item">
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
                                            onClick={() => handleArchive(mail.id)}
                                            className="action-btn archive-btn"
                                            disabled={archivingMailId === mail.id}
                                        >
                                            {archivingMailId === mail.id ? 'Archiving...' : 'Archive'}
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
        </>
    );
}
