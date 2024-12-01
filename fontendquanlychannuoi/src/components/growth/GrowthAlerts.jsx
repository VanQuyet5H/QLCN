import { format } from 'date-fns';
import { FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './GrowthAlerts.css';

function GrowthAlerts({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="growth-alerts">
      {alerts.map((alert, index) => (
        <div key={index} className={`alert-item ${alert.type}`}>
          <div className="alert-icon">
            {alert.type === 'warning' ? <FaExclamationTriangle /> : <FaInfoCircle />}
          </div>
          <div className="alert-content">
            <p>{alert.message}</p>
            <span className="alert-date">
              {format(alert.date, 'HH:mm dd/MM/yyyy')}
            </span>
          </div>
          <button className="alert-close">
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
}

export default GrowthAlerts;