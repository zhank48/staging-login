import { useState, useEffect, useRef } from 'react';
import keycloak from './keycloak';
import UserProfile from './components/UserProfile';

const env = import.meta.env;
const config = [
  ['Server', env.VITE_KEYCLOAK_URL],
  ['Realm', env.VITE_KEYCLOAK_REALM],
  ['Client ID', env.VITE_KEYCLOAK_CLIENT_ID],
];

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
      setError(err?.message || 'Keycloak initialization failed.');
      setLoading(false);
    });
  }, []);

  const login = () => keycloak.login();

  let state, title, body;
  if (loading) {
    state = 'waiting';
    title = 'Checking session';
    body = (
      <section className="panel" aria-busy="true">
        <p>Looking for an existing SSO session on realm <code>{env.VITE_KEYCLOAK_REALM || 'unset'}</code>.</p>
        <progress aria-label="Checking SSO session" />
      </section>
    );
  } else if (error) {
    state = 'error';
    title = 'Keycloak error';
    body = (
      <section className="panel" role="alert">
        <p className="error-message">{error}</p>
        <p>
          Check <code>VITE_KEYCLOAK_URL</code>, <code>VITE_KEYCLOAK_REALM</code> and{' '}
          <code>VITE_KEYCLOAK_CLIENT_ID</code> in <code>.env</code>, then reload.
        </p>
        <ConfigList />
      </section>
    );
  } else if (authenticated) {
    state = 'ok';
    title = 'Signed in';
    body = <UserProfile keycloak={keycloak} />;
  } else {
    state = 'waiting';
    title = 'Signed out';
    body = (
      <section className="panel">
        <p>Test page for Keycloak SSO login.</p>
        <button className="btn btn-primary" onClick={login}>Sign in with Keycloak</button>
      </section>
    );
  }

  return (
    <div className="page" data-state={state}>
      <header className="app-header">Keycloak SSO test</header>
      <main className="app-main">
        <h1 className="state-word">{title}</h1>
        {body}
      </main>
    </div>
  );
}

function ConfigList() {
  return (
    <dl className="kv">
      {config.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value || <span className="missing">not set</span>}</dd>
        </div>
      ))}
    </dl>
  );
}

export default App;
