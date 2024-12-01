import './StatisticCard.css';

function StatisticCard({ title, value, trend, icon, details }) {
  const isTrendPositive = trend.startsWith('+');

  return (
    <div className="statistic-card">
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3>{title}</h3>
        <p className="value">{value}</p>
        <span className={`trend ${isTrendPositive ? 'positive' : 'negative'}`}>
          {trend}
        </span>
        <span className="details">{details}</span>
      </div>
    </div>
  );
}

export default StatisticCard;