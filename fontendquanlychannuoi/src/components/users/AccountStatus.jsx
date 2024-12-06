import React from 'react';
import { ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';
import './AccountStatus.css';

const AccountStatus = ({ isActive }) => {
  return (
    <div className="account-status">
      <h2 className="status-title">Account Status</h2>
      <div className={`status-container ${isActive ? 'active' : 'inactive'}`}>
        {isActive ? (
          <ShieldCheckIcon className="status-icon active" />
        ) : (
          <ShieldExclamationIcon className="status-icon inactive" />
        )}
        <div className="status-text">
          <p className={`status-label ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? 'Account Active' : 'Account Inactive'}
          </p>
          <p className={`status-message ${isActive ? 'active' : 'inactive'}`}>
            {isActive 
              ? 'Your account is in good standing' 
              : 'Please contact support to reactivate your account'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountStatus;