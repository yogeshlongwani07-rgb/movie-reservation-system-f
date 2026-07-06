import { useState, useEffect } from "react";
const avatar =
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop";

import Icon from "./icon";

const MOCK_USER = {
  name: "Yogesh Longwani",
  greetingName: "Yogesh",
  email: "yogesh@example.com",
  isPremium: true,
  avatar:
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop",
  stats: [
    { key: "bookings", label: "Bookings", value: 12, icon: "ticket" },
    { key: "wishlist", label: "Wishlist", value: 8, icon: "heart" },
    { key: "reviews", label: "Reviews", value: 24, icon: "star" },
    { key: "saved", label: "Saved", value: "₹2,450", icon: "wallet" },
  ],
};

export default function Profile({ user }) {
  const stats = [
    {
      key: "bookings",
      label: "Bookings",
      value: user.bookings.length,
      icon: "ticket",
    },
    { key: "wishlist", label: "Wishlist", value: 0, icon: "heart" },
    { key: "reviews", label: "Reviews", value: 0, icon: "star" },
    { key: "saved", label: "Saved", value: 0, icon: "wallet" },
  ];
  return (
    <>
      <aside className="profile">
        <div className="profile-card">
          <div className="profile-header">
            <img className="profile-avatar" src={avatar} alt={user.name} />
            <p className="profile-name">{user.name}</p>
            <p className="profile-email">{user.email}</p>
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
