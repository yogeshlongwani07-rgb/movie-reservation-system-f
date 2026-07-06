import { useState } from "react";
import Icon from "../dashboard/components/icon";
import { avatar } from "../../../constants/user-contants";

export default function ProfilePage({ user, bookingsCount = 0 }) {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

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
            alt={form.name}
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
            <button className={`tab-chip`}>
              <Icon name="user" size={14} /> Personal Info
            </button>
          </div>

          <form className="form-grid" onSubmit={handleSave}>
            <div className="form-group form-span-2">
              <label>Full Name</label>
              <div className="input-icon">
                <Icon name="user" size={15} />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="form-group form-span-2">
              <label>Email Address</label>
              <div className="input-icon">
                <Icon name="mail" size={15} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            {/* 
            <div className="form-span-2 form-actions">
              <button className="btn btn-primary" type="submit">
                Save Changes
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </section>
  );
}
