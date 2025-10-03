import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import './mailbox.css';

export default function MailShow({ mail, flash }) {
    const [replyData, setReplyData] = useState({
        subject: `Re: ${mail.title}`,
        message: ''
    });
    const [sendingReply, setSendingReply] = useState(false);
    const [archivingMailId, setArchivingMailId] = useState(null);
    const [deletingMailId, setDeletingMailId] = useState(null);

    const handleReplySubmit = (e) => {
        e.preventDefault();
        setSendingReply(true);

        router.post(`/admin/mailbox/${mail.id}/reply`, replyData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setSendingReply(false);
                setReplyData({ ...replyData, message: '' });
            },
            onError: (errors) => {
                console.error('Error sending reply:', errors);
                setSendingReply(false);
            }
        });
    };

    const handleArchive = () => {
        setArchivingMailId(mail.id);

        router.put(`/admin/mailbox/${mail.id}/archive`, {}, {
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

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this mail?')) {
            setDeletingMailId(mail.id);

            router.delete(`/admin/mailbox/${mail.id}`, {
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
                <h1 className="mailbox-title">Mail Details</h1>
                <div className="mailbox-actions">
                    <Link href="/admin/mailbox" className="back-link">
                        Back to Inbox
                    </Link>
                    <Link href="/admin/mailbox/archived" className="back-link">
                        Archived Mails
                    </Link>
                </div>
            </div>

            {(flash?.success) && (
                <div className="success-message">
                    {flash.success}
                </div>
            )}

            <div className="mail-detail">
                <div className="mail-detail-header">
                    <div className="mail-detail-info">
                        <h2 className="mail-detail-title">{mail.title}</h2>
                        <div className="mail-detail-meta">
                            <span className="mail-detail-sender">From: {mail.name} ({mail.email})</span>
                            <span className="mail-detail-date">
                                {new Date(mail.created_at).toLocaleDateString()} at {new Date(mail.created_at).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                    <div className="mail-detail-actions">
                        <button
                            onClick={handleArchive}
                            className="action-btn archive-btn"
                            disabled={archivingMailId === mail.id}
                        >
                            {archivingMailId === mail.id ? 'Archiving...' : 'Archive'}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="action-btn delete-btn"
                            disabled={deletingMailId === mail.id}
                        >
                            {deletingMailId === mail.id ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>

                <div className="mail-detail-content">
                    <p className="mail-detail-message">{mail.message}</p>
                </div>
            </div>

            <div className="reply-section">
                <h3 className="reply-title">Reply to this mail</h3>
                <form onSubmit={handleReplySubmit} className="reply-form">
                    <div className="form-group">
                        <label htmlFor="subject" className="form-label">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            value={replyData.subject}
                            onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message" className="form-label">Message</label>
                        <textarea
                            id="message"
                            value={replyData.message}
                            onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                            className="form-textarea"
                            rows="6"
                            placeholder="Type your reply here..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="reply-submit-btn"
                        disabled={sendingReply}
                    >
                        {sendingReply ? 'Sending...' : 'Send Reply'}
                    </button>
                </form>
            </div>
        </div>
    );
}