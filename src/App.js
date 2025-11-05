import { useEffect, useState } from "react";
import "./App.css";
import MapView from "./MapView";

const App = () => {
  const [zones, setZones] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((json) => {
        setZones(json.zones);
        setFilteredZones(json.zones);
      })
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  useEffect(() => {
    let data = [...zones];

    if (filterType !== "All") {
      data = data.filter((z) => z.type === filterType);
    }

    if (searchQuery.trim() !== "") {
      data = data.filter(
        (z) =>
          z.main_area.toLowerCase().includes(searchQuery.toLowerCase()) ||
          z.sub_area.toLowerCase().includes(searchQuery.toLowerCase()) ||
          z.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredZones(data);
  }, [zones, filterType, searchQuery]);

  return (
    <div className="app">
      <h1 style={{ textAlign: "center" }}>🧭 DangerZone - Dhaka Map</h1>

      <div className="filter-bar">
        <div className="filter-item">
          <label>Filter by Type:</label>
          <select onChange={(e) => setFilterType(e.target.value)}>
            <option>All</option>
            <option>Khun</option>
            <option>Murder</option>
            <option>Dhorson</option>
            <option>Nirzaton</option>
            <option>Chintai</option>
            <option>Others</option>
          </select>
        </div>

        <div className="filter-item">
          <label>Search Area or Type:</label>
          <input
            type="text"
            placeholder="e.g. Mirpur or Khun"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <MapView zones={filteredZones} />
    </div>
  );
};

export default App;