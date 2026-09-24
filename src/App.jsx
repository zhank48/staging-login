import React, { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import keycloak from './keycloak';
import UserProfile from './components/UserProfile';
import './index.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
    })
    .then((auth) => {
      setAuthenticated(auth);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Keycloak initialization error', err);
      setError('Failed to initialize Keycloak. Please check your configuration.');
      setLoading(false);
    });
  }, []);

  const login = () => keycloak.login();

  if (loading) {
    return (
      <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader-box">
          <Loader2 className="spinner" size={40} />
          <p className="body-medium">Initializing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="error-box">
          <AlertCircle className="error-icon" size={40} />
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 600 }}>Initialization Error</h2>
          <p className="body-medium">{error}</p>
          <p className="body-medium" style={{ marginTop: '1rem' }}>
            Make sure <code style={{ padding: '0.1em 0.4em', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', fontSize: '0.8125rem' }}>src/keycloak.js</code> is configured with valid Keycloak settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section">
          <span>/auth</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!authenticated && (
            <button className="btn btn-primary" onClick={login}>
              Login
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {authenticated ? (
          <UserProfile keycloak={keycloak} />
        ) : (
          <>
            <h1 className="title-hero">Secure access.<br />Zero generic slop.</h1>
            <p className="subtitle-hero">
              A cinematic authentication gateway. Clean UI, real credentials, no hardcoded values.
            </p>
            <button className="btn btn-primary" onClick={login} style={{ margin: '0 auto' }}>
              Sign in with Keycloak
            </button>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>antislop auth is a gateway, not magic. A beautiful UI is DESIGN.md's job, and yours.</p>
      </footer>
    </div>
  );
}

export default App;
