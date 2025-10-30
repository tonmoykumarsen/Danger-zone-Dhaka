import React, { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ zones }) => {
  const dhakaCenter = [23.75, 90.4];

  // Group subareas by main area
  const groupedByMainArea = useMemo(() => {
    const groups = {};
    zones.forEach((z) => {
      if (!groups[z.main_area]) {
        groups[z.main_area] = { subareas: [], latSum: 0, lngSum: 0, count: 0 };
      }
      groups[z.main_area].subareas.push(z);
      groups[z.main_area].latSum += z.location[0];
      groups[z.main_area].lngSum += z.location[1];
      groups[z.main_area].count += 1;
    });

    Object.keys(groups).forEach((area) => {
      const g = groups[area];
      g.location = [g.latSum / g.count, g.lngSum / g.count];
    });
    return groups;
  }, [zones]);

  // Color by total incidents
  const getColorByQuantity = (total) => {
    if (total >= 10) return "#ff4d4f"; // red
    if (total >= 5) return "#faad14"; // yellow
    return "#52c41a"; // green
  };

  return (
    <div style={{ height: "85vh", width: "100%" }}>
      <div className="legend">
        <h4>Legend (Auto Risk)</h4>
        <div><span className="legend-box red"></span> High Risk (≥10)</div>
        <div><span className="legend-box yellow"></span> Medium (5–9)</div>
        <div><span className="legend-box green"></span> Low (1–4)</div>
      </div>

      <MapContainer center={dhakaCenter} zoom={11} style={{ height: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {Object.entries(groupedByMainArea).map(([area, info], idx) => {
          const total = info.subareas.reduce((sum, s) => sum + s.quantity, 0);
          const color = getColorByQuantity(total);

          return (
            <CircleMarker
              key={idx}
              center={info.location}
              radius={10 + Math.log(total + 1)}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.7,
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div style={{ textAlign: "left" }}>
                  <strong>{area}</strong>
                  <hr style={{ margin: "4px 0" }} />
                  {info.subareas.map((sub, i) => (
                    <div key={i}>
                      <b>{sub.sub_area}</b> — {sub.type}: {sub.quantity}
                    </div>
                  ))}
                  <hr style={{ margin: "4px 0" }} />
                  <b style={{ color }}>
                    {total >= 10 ? "High Risk" : total >= 5 ? "Medium Risk" : "Low Risk"}
                  </b><br />
                  <small>Total Incidents: {total}</small>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
