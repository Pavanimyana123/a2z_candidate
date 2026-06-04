import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SuperAdminLayout from '../SuperAdminLayout';
import '../SuperAdminPages.css';
import { BASE_URL } from '../../../ApiUrl';

const permissionGroups = [
  { id: 'users', label: 'Users' },
  { id: 'mentors', label: 'Mentors' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'department', label: 'Department' },
  { id: 'levels', label: 'Levels' },
  { id: 'department_level', label: 'Department Level' },
  { id: 'competency', label: 'Competency' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'learning', label: 'Learning' },
  { id: 'reports', label: 'Reports' },
  { id: 'audit', label: 'Audit' },
  { id: 'settings', label: 'Settings' },
];

const permissionColumns = [
  { key: 'view', label: 'View' },
  { key: 'add', label: 'Create' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
  { key: 'print', label: 'Print' },
];

const SuperAdminRolesPermissions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [permissionRecord, setPermissionRecord] = useState(null);
  const [originalPermissionRecord, setOriginalPermissionRecord] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchRolePermissions();
  }, [id]);

  const fetchRolePermissions = async () => {
    setLoading(true);
    setError('');

    try {
      const roleResponse = await fetch(`${BASE_URL}api/admin/roles/${id}/`);
      if (roleResponse.ok) {
        const roleData = await roleResponse.json();
        setRoleName(roleData.data?.role_name || 'Role');
      }

      const response = await fetch(`${BASE_URL}api/admin/role-permissions/?role=${id}`);
      const data = await response.json();
      if (response.ok && Array.isArray(data.data) && data.data.length > 0) {
        const loadedRecord = { ...data.data[0] };
        setPermissionRecord(loadedRecord);
        setOriginalPermissionRecord(loadedRecord);
      } else {
        const createResponse = await fetch(`${BASE_URL}api/admin/role-permissions/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: Number(id) })
        });
        const createData = await createResponse.json();
        if (createResponse.ok) {
          const loadedRecord = { ...createData.data };
          setPermissionRecord(loadedRecord);
          setOriginalPermissionRecord(loadedRecord);
        } else {
          setError(createData.message || 'Unable to initialize permissions');
        }
      }
    } catch (err) {
      setError(err.message || 'Unable to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (field) => {
    if (!permissionRecord) return;
    setPermissionRecord((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const allPermissionFields = () =>
    permissionGroups
      .flatMap((group) => permissionColumns.map((column) => `${group.id}_${column.key}`))
      .filter((field) => permissionRecord && Object.prototype.hasOwnProperty.call(permissionRecord, field));

  const isSuperAccessChecked = () => {
    const fields = allPermissionFields();
    return fields.length > 0 && fields.every((field) => Boolean(permissionRecord[field]));
  };

  const handleSuperAccessToggle = () => {
    if (!permissionRecord) return;
    const enableAll = !isSuperAccessChecked();
    if (!enableAll && originalPermissionRecord) {
      setPermissionRecord({ ...originalPermissionRecord });
      return;
    }
    setPermissionRecord((prev) => {
      const next = { ...prev };
      allPermissionFields().forEach((field) => {
        next[field] = enableAll;
      });
      return next;
    });
  };

  const getRowFields = (groupId) =>
    permissionColumns
      .map((column) => `${groupId}_${column.key}`)
      .filter((field) => Object.prototype.hasOwnProperty.call(permissionRecord, field));

  const isRowAllChecked = (groupId) => {
    const fields = getRowFields(groupId);
    return fields.length > 0 && fields.every((field) => Boolean(permissionRecord[field]));
  };

  const handleToggleAll = (groupId) => {
    if (!permissionRecord) return;
    const fields = getRowFields(groupId);
    if (fields.length === 0) return;

    const value = !isRowAllChecked(groupId);
    setPermissionRecord((prev) => {
      const next = { ...prev };
      fields.forEach((field) => {
        next[field] = value;
      });
      return next;
    });
  };

  const handleSave = async () => {
    if (!permissionRecord) return;
    setSaving(true);
    setError('');

    try {
      const payload = { ...permissionRecord };
      delete payload.role_name;

      const response = await fetch(`${BASE_URL}api/admin/role-permissions/${permissionRecord.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        const savedRecord = { ...data.data };
        setPermissionRecord(savedRecord);
        setOriginalPermissionRecord(savedRecord);
      } else {
        setError(data.message || 'Failed to save permissions');
      }
    } catch (err) {
      setError(err.message || 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="sa-page-container">
        <div className="sa-page-header" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1>Edit Permissions</h1>
            <p>Edit permissions for <strong>{roleName || `role #${id}`}</strong>.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="sa-btn-secondary" onClick={() => navigate('/super-roles')}>
              Back to Roles
            </button>
            <button className="sa-btn-primary" onClick={handleSave} disabled={saving || loading || !permissionRecord}>
              {saving ? 'Saving...' : 'Save Permissions'}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading permissions…</p>
        ) : permissionRecord ? (
          <div className="sa-table-container" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <input
                  type="checkbox"
                  checked={isSuperAccessChecked()}
                  onChange={handleSuperAccessToggle}
                />
                Super Access
              </label>
            </div>
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Permission</th>
                  <th>All</th>
                  {permissionColumns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionGroups.map((group) => (
                  <tr key={group.id}>
                    <td>{group.label}</td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isRowAllChecked(group.id)}
                        onChange={() => handleToggleAll(group.id)}
                      />
                    </td>
                    {permissionColumns.map((column) => {
                      const field = `${group.id}_${column.key}`;
                      const exists = Object.prototype.hasOwnProperty.call(permissionRecord, field);
                      return (
                        <td key={field} style={{ textAlign: 'center' }}>
                          {exists ? (
                            <input
                              type="checkbox"
                              checked={Boolean(permissionRecord[field])}
                              onChange={() => handleToggle(field)}
                            />
                          ) : (
                            <span style={{ color: '#6b7280' }}>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No permission settings available.</p>
        )}
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminRolesPermissions;
