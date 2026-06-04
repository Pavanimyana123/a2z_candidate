import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminLayout from '../SuperAdminLayout';
import '../SuperAdminPages.css';
import { BASE_URL } from '../../../ApiUrl';

const SuperAdminRoles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({ role_name: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${BASE_URL}api/admin/roles/`);
      const data = await response.json();
      if (response.ok) {
        const sortedRoles = (data.data || []).slice().sort((a, b) => a.id - b.id);
        setRoles(sortedRoles);
      } else {
        setError(data.message || 'Unable to load roles');
      }
    } catch (err) {
      setError(err.message || 'Unable to load roles');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formState.role_name.trim()) {
      setError('Role name is required');
      return;
    }

    setSaving(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId
      ? `${BASE_URL}api/admin/roles/${editId}/`
      : `${BASE_URL}api/admin/roles/`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formState)
      });

      const data = await response.json();

      if (response.ok) {
        setFormState({ role_name: '', description: '' });
        setEditId(null);
        setShowModal(false);
        await fetchRoles();
      } else {
        setError(data.message || 'Failed to save role');
      }
    } catch (err) {
      setError(err.message || 'Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (role) => {
    setEditId(role.id);
    setFormState({ role_name: role.role_name || '', description: role.description || '' });
    setError('');
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditId(null);
    setFormState({ role_name: '', description: '' });
    setError('');
    setShowModal(true);
  };

  const handleEditPermissions = (role) => {
    navigate(`/super-roles/${role.id}/permissions`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this role?')) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}api/admin/roles/${id}/`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchRoles();
      } else {
        const text = await response.text();
        let data = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch (parseError) {
          data = { message: text };
        }
        setError(data.message || 'Failed to delete role');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete role');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setFormState({ role_name: '', description: '' });
    setError('');
    setShowModal(false);
  };

  return (
    <SuperAdminLayout>
      <div className="sa-page-container">
        <div className="sa-page-header" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1>Roles</h1>
            <p>Manage roles available in the Super Admin system.</p>
          </div>
          <button className="sa-btn-primary" onClick={handleCreate}>
            Create Role
          </button>
        </div>

        <div className="sa-table-container">
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>Roles List</h3>
            </div>
            {loading ? (
              <p>Loading roles…</p>
            ) : (
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Role Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length === 0 ? (
                    <tr>
                      <td colSpan="4">No roles found.</td>
                    </tr>
                  ) : (
                    roles.map((role) => (
                      <tr key={role.id}>
                        <td>{role.id}</td>
                        <td>{role.role_name}</td>
                        <td>{role.description || '—'}</td>
                        <td>
                          <button className="sa-action-btn edit" onClick={() => handleEdit(role)}>
                            Edit
                          </button>
                          <button className="sa-action-btn edit" onClick={() => handleEditPermissions(role)}>
                            Edit Permissions
                          </button>
                          <button className="sa-action-btn delete" onClick={() => handleDelete(role.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {showModal && (
          <div className="sa-modal" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '520px', padding: '24px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ margin: 0 }}>{editId ? 'Edit Role' : 'Create Role'}</h2>
                  <p style={{ margin: 0, color: '#6b7280' }}>
                    {editId ? 'Update role details below.' : 'Add a new role to the system.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{ background: 'transparent', border: 'none', fontSize: '22px', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>

              {error && (
                <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="sa-form-group">
                  <label htmlFor="role_name">Role Name</label>
                  <input
                    id="role_name"
                    name="role_name"
                    type="text"
                    value={formState.role_name}
                    onChange={handleChange}
                    placeholder="Enter role name"
                  />
                </div>
                <div className="sa-form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    id="description"
                    name="description"
                    type="text"
                    value={formState.description}
                    onChange={handleChange}
                    placeholder="Enter description (optional)"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                  <button type="button" className="sa-btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="sa-btn-primary" disabled={saving}>
                    {saving ? (editId ? 'Updating...' : 'Saving...') : editId ? 'Update Role' : 'Create Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminRoles;
