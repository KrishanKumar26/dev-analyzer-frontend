export default function Navbar({ user, setUser }) {
  return (
    <div className="navbar">
      <div className="nav-logo">DevAnalyzer</div>

      <div className="nav-user">
        <div className="avatar">{user.initials}</div>
        <span>{user.name}</span>
        <button onClick={() => setUser(null)}>Logout</button>
      </div>
    </div>
  );
}