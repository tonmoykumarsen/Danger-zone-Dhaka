import FilterButtons from "../UI/FilterButtons";
import SearchInput from "../UI/SearchInput";

const Header = ({ search, onSearchChange, currentFilter, onFilterChange }) => {
  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      flexWrap: "wrap",
      padding: "12px 18px",
      background: "linear-gradient(180deg,#0d0d1c,#080810)",
      borderBottom: "1px solid #1a1a2e",
      flexShrink: 0
    }}>
      {/* Logo */}
      <div>
        <div style={{
          fontFamily: "'Bebas Neue',cursive",
          fontSize: 24,
          letterSpacing: 2,
          color: "#ff2d2d",
          textShadow: "0 0 18px #ff2d2d88",
          lineHeight: 1
        }}>
          ⚠ DANGERZONE
        </div>
        <div style={{
          fontSize: 9.5,
          color: "#475569",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginTop: 1
        }}>
          Bangladesh Crime Intelligence Map
        </div>
      </div>

      {/* Search */}
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search area or crime type…"
      />

      {/* Filters */}
      <FilterButtons
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
      />
    </header>
  );
};

export default Header;