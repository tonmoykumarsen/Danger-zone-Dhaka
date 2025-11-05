import React, { useEffect, useRef, useState } from 'react';
import ZoneCard from './ZoneCard';

const MapView = ({ zones = [] }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Leaflet CSS and JS
  useEffect(() => {
    // Add CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // Check if Leaflet is already loaded
    if (window.L) {
      setIsLoaded(true);
      return;
    }

    // Add JS
    if (!document.querySelector('script[src*="leaflet.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.async = false;
      
      script.onload = () => {
        setIsLoaded(true);
      };

      script.onerror = () => {
        console.error('Failed to load Leaflet');
      };
      
      document.body.appendChild(script);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    try {
      const map = window.L.map(mapRef.current, {
        center: [23.8103, 90.4125],
        zoom: 12,
        zoomControl: true,
      });
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Small delay to ensure map is ready
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          console.error('Error cleaning up map:', error);
        }
      }
    };
  }, [isLoaded]);

  // Update markers when zones change
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !window.L) return;

    // Clear old markers
    markersRef.current.forEach(marker => {
      try {
        marker.remove();
      } catch (error) {
        // Ignore errors
      }
    });
    markersRef.current = [];

    if (zones.length === 0) return;

    // Add new markers
    const newMarkers = [];
    
    zones.forEach(zone => {
      try {
        // Get lat/lng from location array
        const lat = zone.location ? zone.location[0] : (zone.lat || 0);
        const lng = zone.location ? zone.location[1] : (zone.lng || 0);

        if (!lat || !lng) return;

        const getColor = (type) => {
          switch(type?.toLowerCase()) {
            case 'khun':
            case 'murder':
              return '#ef4444';
            case 'dhorson':
            case 'nirzaton':
              return '#dc2626';
            case 'chintai':
              return '#f59e0b';
            case 'others':
              return '#10b981';
            default:
              return '#6b7280';
          }
        };

        const color = getColor(zone.type);
        
        const icon = window.L.divIcon({
          className: 'custom-marker',
          html: `
            <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z" 
                    fill="${color}" 
                    stroke="white" 
                    stroke-width="2"/>
              <circle cx="16" cy="14" r="5" fill="white"/>
            </svg>
          `,
          iconSize: [32, 40],
          iconAnchor: [16, 40],
          popupAnchor: [0, -40],
        });

        const marker = window.L.marker([lat, lng], { icon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div style="font-family: system-ui; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #1f2937;">${zone.main_area || 'Unknown'}</h3>
              <p style="margin: 4px 0; font-size: 13px; color: #6b7280;">${zone.sub_area || ''}</p>
              <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 4px 0; font-size: 12px; color: #374151;">
                  <strong>Type:</strong> <span style="color: ${color}; font-weight: 600;">${zone.type || 'N/A'}</span>
                </p>
                <p style="margin: 4px 0; font-size: 12px; color: #374151;">
                  <strong>Incidents:</strong> ${zone.quantity || 'N/A'}
                </p>
              </div>
            </div>
          `);
        
        newMarkers.push(marker);
      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });

    markersRef.current = newMarkers;

    // Fit bounds
    if (newMarkers.length > 0) {
      try {
        const group = window.L.featureGroup(newMarkers);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      } catch (error) {
        console.error('Error fitting bounds:', error);
      }
    }
  }, [isLoaded, zones]);

  const handleZoneClick = (index) => {
    if (mapInstanceRef.current && markersRef.current[index]) {
      const zone = zones[index];
      try {
        // Get lat/lng from location array
        const lat = zone.location ? zone.location[0] : (zone.lat || 0);
        const lng = zone.location ? zone.location[1] : (zone.lng || 0);
        mapInstanceRef.current.setView([lat, lng], 15);
        markersRef.current[index].openPopup();
      } catch (error) {
        console.error('Error navigating to zone:', error);
      }
    }
  };

  const styles = {
    container: {
      display: 'flex',
      gap: '20px',
      height: '600px',
      marginTop: '20px'
    },
    mapContainer: {
      flex: 1,
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      backgroundColor: '#e5e7eb'
    },
    map: {
      width: '100%',
      height: '100%'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#6b7280',
      fontSize: '14px'
    },
    legend: {
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '16px',
      zIndex: 1000
    },
    legendTitle: {
      fontWeight: '600',
      fontSize: '14px',
      marginBottom: '10px',
      color: '#374151'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '6px'
    },
    legendDot: {
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      border: '2px solid white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
    },
    legendText: {
      fontSize: '13px',
      color: '#6b7280'
    },
    sidebar: {
      width: '320px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      overflowY: 'auto',
      padding: '16px'
    },
    sidebarTitle: {
      fontWeight: '600',
      fontSize: '16px',
      marginBottom: '12px',
      color: '#1f2937',
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
      paddingBottom: '8px',
      borderBottom: '2px solid #e5e7eb',
      zIndex: 1
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#9ca3af'
    }
  };

  return (
    <div style={styles.container}>
      {/* Map Container */}
      <div style={styles.mapContainer}>
        {!isLoaded ? (
          <div style={styles.loading}>Loading map...</div>
        ) : (
          <div ref={mapRef} style={styles.map} />
        )}
        
        {/* Legend */}
        {isLoaded && (
          <div style={styles.legend}>
            <h3 style={styles.legendTitle}>Crime Types</h3>
            <div>
              <div style={styles.legendItem}>
                <div style={{...styles.legendDot, backgroundColor: '#ef4444'}}></div>
                <span style={styles.legendText}>Khun/Murder</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{...styles.legendDot, backgroundColor: '#dc2626'}}></div>
                <span style={styles.legendText}>Dhorson/Nirzaton</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{...styles.legendDot, backgroundColor: '#f59e0b'}}></div>
                <span style={styles.legendText}>Chintai</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{...styles.legendDot, backgroundColor: '#10b981'}}></div>
                <span style={styles.legendText}>Others</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar with Zone List */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>
          📍 Locations ({zones.length})
        </h2>
        {zones.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No zones found</p>
            <p style={{fontSize: '12px', marginTop: '8px'}}>Try adjusting your filters</p>
          </div>
        ) : (
          <div>
            {zones.map((zone, index) => (
              <ZoneCard 
                key={`zone-${index}-${zone.main_area}`}
                zone={zone} 
                onClick={() => handleZoneClick(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;