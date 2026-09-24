import React from 'react';
import { User, Mail, ShieldCheck, LogOut } from 'lucide-react';

const UserProfile = ({ keycloak }) => {
  const {
    name,
    given_name,
    family_name,
    preferred_username,
    email
  } = keycloak.tokenParsed || {};

  const handleLogout = () => keycloak.logout();

  const displayName = name || preferred_username || 'User';
  const fullName = [given_name, family_name].filter(Boolean).join(' ') || '—';

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="avatar">
          <ShieldCheck size={24} />
        </div>
        <div className="profile-header-text">
          <h2>{displayName}</h2>
          <p className="label-caps">Session active</p>
        </div>
      </div>

      <div className="profile-details">
        <div className="list-item">
          <div className="list-item-icon">
            <User size={16} />
          </div>
          <div className="list-item-text">
            <span className="list-item-supporting">Username</span>
            <span className="list-item-label">{preferred_username || '—'}</span>
          </div>
        </div>

        <div className="list-item">
          <div className="list-item-icon">
            <User size={16} />
          </div>
          <div className="list-item-text">
            <span className="list-item-supporting">Full Name</span>
            <span className="list-item-label">{fullName}</span>
          </div>
        </div>

        <div className="list-item">
          <div className="list-item-icon">
            <Mail size={16} />
          </div>
          <div className="list-item-text">
            <span className="list-item-supporting">Email</span>
            <span className="list-item-label">{email || '—'}</span>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn btn-logout" onClick={handleLogout}>
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
