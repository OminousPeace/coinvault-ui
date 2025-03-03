
import React from 'react';
import InfoTooltip from './InfoTooltip';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string | number;
  tooltip?: string;
  isAnimated?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  tooltip,
  isAnimated = false,
}) => {
  return (
    <div className={`stat-card ${isAnimated ? 'animate-fade-up' : ''}`}>
      <div className="stat-label">
        {label}
        {tooltip && <InfoTooltip content={tooltip} />}
      </div>
      <div className="stat-value">{value}</div>
      {subValue && (
        <div className="text-xs text-muted-foreground">
          {subValue}
        </div>
      )}
    </div>
  );
};

export default StatCard;
