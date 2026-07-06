import Icon from "./icon";


export default function Navbar({ user }) {
  return (
    <>
      <header className="navbar">
        <button className="navbar-menu" aria-label="Toggle menu">
          <Icon name="menu" size={20} />
        </button>

        <div className="navbar-greeting">
          <h1>
            Hello, {user.greetingName}! <span>👋</span>
          </h1>
          <p>What movie adventure are you planning today?</p>
        </div>

        <div className="navbar-search">
          <Icon name="search" size={18} />
          <input
            type="text"
            placeholder="Search for movies, theatres or shows..."
          />
        </div>

        <div className="navbar-actions">
          <button className="navbar-bell" aria-label="Notifications">
            <Icon name="bell" size={19} />
            <span className="navbar-badge">3</span>
          </button>
          <button className="navbar-avatar">
            <img src={user.avatar} alt={user.name} />
            <Icon name="chevron" size={16} />
          </button>
        </div>
      </header>
    </>
  );
}
