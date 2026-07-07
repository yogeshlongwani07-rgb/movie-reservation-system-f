import Icon from "./icon";

export default function ComingSoon({ label, icon = "settings" }) {
  return (
    <section className="panel admin-empty-panel">
      <div className="admin-empty-state">
        <span className="admin-empty-icon">
          <Icon name={icon} size={26} />
        </span>
        <h2>{label}</h2>
        <p>
          This section isn't wired up yet — the backend doesn't expose an API
          for {label.toLowerCase()} right now. Once those endpoints exist,
          this page is ready to plug them in.
        </p>
      </div>
    </section>
  );
}
