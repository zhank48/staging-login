const UserProfile = ({ keycloak }) => {
  const token = keycloak.tokenParsed || {};
  const fullName = [token.given_name, token.family_name].filter(Boolean).join(' ');

  const claims = [
    ['Username', token.preferred_username],
    ['Full name', fullName],
    ['Email', token.email],
    ['Subject', token.sub],
    ['Expires', token.exp && new Date(token.exp * 1000).toLocaleString()],
  ];

  return (
    <section className="panel">
      <h2>{token.name || token.preferred_username || 'Unnamed user'}</h2>

      <dl className="kv">
        {claims.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value || <span className="missing">not in token</span>}</dd>
          </div>
        ))}
      </dl>

      <details>
        <summary>Full token payload</summary>
        <pre>{JSON.stringify(token, null, 2)}</pre>
      </details>

      <button className="btn" onClick={() => keycloak.logout()}>Sign out</button>
    </section>
  );
};

export default UserProfile;
