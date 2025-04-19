// src/components/DebugUserContext.jsx
import React from 'react';
import { useUser } from '../context/UserContext';

export default function DebugUserContext() {
  const { user, loading, error, isAuthenticated, isAdmin } = useUser();

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      padding: '10px',
      background: 'rgba(255,255,255,0.9)',
      border: '1px solid #ccc',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      overflow: 'auto'
    }}>
      <strong>🛠 UserContext Debug</strong>
      <pre>
        {JSON.stringify({
          user,
          loading,
          error,
          isAuthenticated: isAuthenticated(),
          isAdmin: isAdmin()
        }, null, 2)}
      </pre>
    </div>
  );
}
