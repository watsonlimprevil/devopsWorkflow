export default function RecentActivity({ activity }) {
  return (
    <div className="activity-container">
      <h2 className="activity-title">Recent Activity</h2>

      <ul className="activity-list">
        {activity.map(item => (
          <li key={item.id} className="activity-item">
            <span className="activity-message">{item.message}</span>
            <span className="activity-time">
              {new Date(item.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
