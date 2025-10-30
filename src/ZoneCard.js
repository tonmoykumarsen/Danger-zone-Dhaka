import React, { useState } from "react";

const ZoneCard = ({ zone }) => {
  const [hover, setHover] = useState(false);

  const colors = {
    red: "#ff4d4f",
    yellow: "#faad14",
    green: "#52c41a"
  };

  return (
    <div
      className="zone-card"
      style={{ backgroundColor: colors[zone.level] }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <h3>{zone.type}</h3>
      {hover && <p>Quantity: {zone.quantity}</p>}
    </div>
  );
};

export default ZoneCard;
