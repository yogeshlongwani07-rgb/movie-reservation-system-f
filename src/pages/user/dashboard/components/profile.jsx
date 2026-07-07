import { avatar } from "../../../../constants/user-contants";

import Icon from "./icon";

export default function Profile({ user }) {
  const bookingsCount = user?.bookings?.length || 0;
  const stats = [
    {
      key: "bookings",
      label: "Bookings",
      value: bookingsCount,
      icon: "ticket",
    },
    { key: "wishlist", label: "Wishlist", value: 0, icon: "heart" },
    { key: "reviews", label: "Reviews", value: 0, icon: "star" },
    {
      key: "saved",
      label: "Saved",
      value: bookingsCount * 250,
      icon: "wallet",
    },
  ];
  return (
    <>
      <aside className="profile">
        <div className="profile-card">
          <div className="profile-header">
            <img className="profile-avatar" src={avatar} alt={user?.name || "Profile"} />
            <p className="profile-name">{user?.name}</p>
            <p className="profile-email">{user?.email}</p>
          </div>

          <div className="profile-stub" aria-hidden="true">
            <span className="profile-stub-notch profile-stub-notch--left" />
            <span className="profile-stub-line" />
            <span className="profile-stub-notch profile-stub-notch--right" />
          </div>

          <div className="profile-stats">
            {stats.map((s) => (
              <div className="profile-stat" key={s.key}>
                <span className={`profile-stat-icon icon-${s.key}`}>
                  <Icon name={s.icon} size={16} />
                </span>
                <p className="profile-stat-value">{s.value}</p>
                <p className="profile-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
