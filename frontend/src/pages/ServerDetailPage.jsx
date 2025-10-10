import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AddUserForm from '../components/AddUserForm';
import ConfirmModal from '../components/ConfirmModal';
import EditUserModal from '../components/EditUserModal';

function ServerDetailPage() {
  const { id } = useParams();
  const [server, setServer] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for modals
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);

  const fetchPageData = async () => {
    try {
      // We start loading before the fetch
      setLoading(true);
      const serverDetailsPromise = axios.get(`http://localhost:3001/api/servers/${id}`);
      const userListPromise = axios.get(`http://localhost:3001/api/users/server/${id}`);
      
      const [serverResponse, usersResponse] = await Promise.all([serverDetailsPromise, userListPromise]);
      
      setServer(serverResponse.data);
      setUsers(usersResponse.data);
      setError('');
    } catch (err) {
      console.error("Error fetching data:", err);
      setError('Failed to load server data.');
    } finally {
      // We stop loading whether the fetch succeeded or failed
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/users/${userToDelete.id}`);
      setUserToDelete(null); // Close modal
      fetchPageData(); // Refresh list
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleSave = () => {
    setUserToEdit(null); // Close modal
    fetchPageData(); // Refresh list
  };

  if (loading) {
    return <div className="app-container">Loading...</div>;
  }
  
  if (error) {
    return <div className="app-container">{error}</div>;
  }

  return (
    <>
      <div className="header">
        <h1>{server?.server_name}</h1>
        <Link to="/" className="back-link">&larr; Back to Dashboard</Link>
      </div>
      
      <div className="page-content">
        <div className="user-list-container">
          <h2>User Accounts</h2>
          {users.length > 0 ? (
            <ul className="user-list">
              {users.map(user => (
                <li key={user.id} className="user-list-item">
                  <div className="user-info">
                    <span className="user-name">{user.account_name}</span>
                    <span className="user-details">Type: {user.account_type} | Expires: {new Date(user.expire_date).toLocaleDateString()}</span>
                  </div>
                  <div className="user-actions">
                    <button onClick={() => setUserToEdit(user)} className="edit-btn">Edit</button>
                    <button onClick={() => setUserToDelete(user)} className="delete-btn">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found for this server.</p>
          )}
        </div>

        <div className="user-form-container">
          <AddUserForm serverId={id} onUserAdded={fetchPageData} />
        </div>
      </div>
      
      <ConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
      >
        Are you sure you want to delete user "{userToDelete?.account_name}"?
      </ConfirmModal>

      <EditUserModal
        user={userToEdit}
        onClose={() => setUserToEdit(null)}
        onSave={handleSave}
      />
    </>
  );
}

export default ServerDetailPage;