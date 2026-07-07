import { useState } from "react";
import Icon from "../dashboard/components/icon";
import { avatar } from "../../../constants/user-contants";

export default function ProfilePage({ user, bookingsCount = 0 }) {
  const [form] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  return (
    <section className="page profile-page">
      <div className="page-head">
        <div>
          <h2 className="page-title">Profile Settings</h2>
          <p className="page-subtitle">
            Manage your personal information and account security
          </p>
        </div>
      </div>

      <div className="profile-settings-layout">
        <aside className="profile-side-card">
          <img
            className="profile-avatar profile-avatar-lg"
            src={avatar}
            alt={form.name || "Profile"}
          />
          <p className="profile-name">{form.name || "Movie Lover"}</p>
          <p className="profile-email">{form.email}</p>

          <div className="profile-stub" aria-hidden="true">
            <span className="profile-stub-notch profile-stub-notch--left" />
            <span className="profile-stub-line" />
            <span className="profile-stub-notch profile-stub-notch--right" />
          </div>

          <div className="side-stat-row">
            <div>
              <p className="profile-stat-value">{bookingsCount}</p>
              <p className="profile-stat-label">Bookings</p>
            </div>
          </div>
        </aside>

        <div className="profile-main-card">
          <div className="tab-row">
            <button className="tab-chip is-active">
              <Icon name="user" size={14} /> Personal Info
            </button>
          </div>

          <div className="form-grid">
            <div className="form-group form-span-2">
              <label>Full Name</label>
              <div className="input-icon">
                <Icon name="user" size={15} />
                <input type="text" value={form.name} readOnly placeholder="Your name" />
              </div>
            </div>

            <div className="form-group form-span-2">
              <label>Email Address</label>
              <div className="input-icon">
                <Icon name="mail" size={15} />
                <input
                  type="email"
                  value={form.email}
                  readOnly
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <p className="form-span-2 page-subtitle">
              Editing your profile isn't supported yet — reach out to support
              if these details need to change.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
