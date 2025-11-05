
const ZoneCard = ({ zone, onClick }) => {
  const getTypeColor = (type) => {
    switch(type.toLowerCase()) {
      case 'khun':
      case 'murder':
        return { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' };
      case 'dhorson':
      case 'nirzaton':
        return { bg: '#fecaca', text: '#7f1d1d', dot: '#dc2626' };
      case 'chintai':
        return { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' };
      case 'others':
        return { bg: '#d1fae5', text: '#065f46', dot: '#10b981' };
      default:
        return { bg: '#f3f4f6', text: '#374151', dot: '#6b7280' };
    }
  };

  const colors = getTypeColor(zone.type);

  const styles = {
    card: {
      padding: '12px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      marginBottom: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: 'white'
    },
    zoneName: {
      fontWeight: '600',
      color: '#1f2937',
      fontSize: '14px',
      marginBottom: '4px'
    },
    zoneSubArea: {
      fontSize: '12px',
      color: '#6b7280',
      marginBottom: '8px'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      backgroundColor: colors.bg,
      color: colors.text
    }
  };

  return (
    <div
      style={styles.card}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f9fafb';
        e.currentTarget.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'white';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <div style={styles.zoneName}>{zone.main_area}</div>
      <div style={styles.zoneSubArea}>{zone.sub_area}</div>
      <div style={styles.badge}>
        {zone.type}
      </div>
    </div>
  );
};

export default ZoneCard;