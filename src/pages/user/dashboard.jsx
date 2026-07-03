import "../../css/userDashboard.css";
export default function UserDashboard() {
  return (
    <>
      <div className="Dashboard">
        <div className="sidebar"></div>
        <div className="main-content">
          <div className="navbar"></div>
          <div className="profile-and-poster">
            <div className="poster"></div>
            <div className="profile"></div>
          </div>
        </div>
      </div>
    </>
  );
}
