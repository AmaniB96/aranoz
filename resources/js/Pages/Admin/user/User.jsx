import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import './user.css';

export default function User({ users, roles, flash }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [updatingUserId, setUpdatingUserId] = useState(null);

    const handleRoleChange = (userId, newRoleId) => {
        setUpdatingUserId(userId);
        
        // CORRECTION : La syntaxe correcte pour router.put avec Inertia
        router.put(`/admin/user/${userId}`, 
            { role_id: newRoleId }, // données à envoyer
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSuccessMessage('Rôle mis à jour avec succès !');
                    setTimeout(() => setSuccessMessage(''), 3000);
                    setUpdatingUserId(null);
                },
                onError: (errors) => {
                    console.error('Erreur lors de la mise à jour:', errors);
                    setUpdatingUserId(null);
                }
            }
        );
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedUser(null);
    };

    const handleDelete = () => {
        router.delete(`/admin/user/${selectedUser.id}`, {
            onSuccess: () => {
                closeDeleteModal();
                setSuccessMessage('Utilisateur supprimé avec succès !');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        });
    };

    return (
        <div className="users-container">
            <h1 className="users-title">Gestion des Utilisateurs</h1>
            
            {(flash?.success || successMessage) && (
                <div className="success-message">
                    {flash?.success || successMessage}
                </div>
            )}

            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Pseudo</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.first_name}</td>
                                <td>{user.pseudo}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        value={user.role_id || ''}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className={`role-dropdown ${updatingUserId === user.id ? 'updating' : ''}`}
                                        disabled={updatingUserId === user.id}
                                    >
                                        <option value="">Aucun rôle</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    {updatingUserId === user.id && (
                                        <span className="updating-text">Mise à jour...</span>
                                    )}
                                </td>
                                <td>
                                    <button 
                                        onClick={() => openDeleteModal(user)} 
                                        className="delete-button"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de suppression */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirmer la suppression</h3>
                        <p>
                            Êtes-vous sûr de vouloir supprimer l'utilisateur 
                            <strong> {selectedUser?.name} {selectedUser?.first_name}</strong> ?
                        </p>
                        <div className="modal-buttons">
                            <button onClick={handleDelete} className="confirm-button">
                                Oui, supprimer
                            </button>
                            <button onClick={closeDeleteModal} className="cancel-button">
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}