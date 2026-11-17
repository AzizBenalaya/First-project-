import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { LocateFixed, Search, Map as MapIcon, AlertTriangle } from 'lucide-react';

const TUNISIA_CENTER = { lat: 34.0, lng: 9.5 };

export default function ChargerMap({ chargers, selectedCharger, onSelect }) {
  const mapElement = useRef(null);
  const map = useRef(null);
  const clusterer = useRef(null);
  const markers = useRef([]);
  const geocoder = useRef(null);
  const chargersRef = useRef(chargers);
  chargersRef.current = chargers;
  const [mapStatus, setMapStatus] = useState('loading');
  const [mapError, setMapError] = useState('');
  const [placeQuery, setPlaceQuery] = useState('');
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setMapStatus('missing-key');
      return undefined;
    }
    let active = true;
    const loader = new Loader({ apiKey, version: 'weekly' });
    loader.importLibrary('maps').then(({ Map }) => loader.importLibrary('marker').then(({ AdvancedMarkerElement }) => {
      if (!active || !mapElement.current) return;
      map.current = new Map(mapElement.current, {
        center: TUNISIA_CENTER,
        zoom: 6,
        mapId: 'DEMO_MAP_ID',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        gestureHandling: 'greedy',
        restriction: { latLngBounds: { north: 38.0, south: 30.0, west: 7.0, east: 12.5 }, strictBounds: false },
      });
      geocoder.current = new google.maps.Geocoder();
      markers.current = chargersRef.current.map((charger) => {
        const pin = document.createElement('div');
        pin.className = `map-pin ${charger.available ? 'pin-available' : 'pin-unavailable'}`;
        pin.innerHTML = `<span></span>`;
        const marker = new AdvancedMarkerElement({ map: map.current, position: { lat: charger.lat, lng: charger.lng }, title: `${charger.name} — ${charger.available ? 'Disponible' : 'Indisponible'}`, content: pin });
        marker.addListener('click', () => onSelect(charger));
        marker.chargerId = charger.id;
        return marker;
      });
      clusterer.current = new MarkerClusterer({ map: map.current, markers: markers.current });
      setMapStatus('ready');
    })).catch((error) => {
      if (!active) return;
      setMapError(error?.message || 'Vérifiez votre clé API et la configuration Google Maps.');
      setMapStatus('error');
    });
    return () => { active = false; clusterer.current?.clearMarkers(); };
  // Map initialization intentionally happens once; marker updates are handled separately.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  useEffect(() => {
    if (!map.current || !clusterer.current) return;
    const visibleIds = new Set(chargers.map((charger) => charger.id));
    const visibleMarkers = markers.current.filter((marker) => visibleIds.has(marker.chargerId));
    clusterer.current.clearMarkers();
    clusterer.current.addMarkers(visibleMarkers);
  }, [chargers]);

  useEffect(() => {
    if (!map.current || !selectedCharger) return;
    map.current.panTo({ lat: selectedCharger.lat, lng: selectedCharger.lng });
    map.current.setZoom(14);
  }, [selectedCharger]);

  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      setMapError('La géolocalisation n’est pas prise en charge par ce navigateur.');
      setMapStatus('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      map.current?.panTo({ lat: coords.latitude, lng: coords.longitude });
      map.current?.setZoom(13);
      setMapError('');
      setMapStatus('ready');
    }, () => {
      setMapError('Position inaccessible. Vérifiez les autorisations de localisation de votre navigateur.');
      setMapStatus('error');
    }, { enableHighAccuracy: true, timeout: 10000 });
  }, []);

  const searchPlace = (event) => {
    event.preventDefault();
    if (!placeQuery.trim() || !geocoder.current) return;
    geocoder.current.geocode({ address: placeQuery.trim(), componentRestrictions: { country: 'TN' } }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        map.current?.panTo(results[0].geometry.location);
        map.current?.setZoom(12);
        setMapError('');
        setMapStatus('ready');
      } else {
        setMapError('Lieu introuvable en Tunisie. Essayez avec le nom d’une autre ville.');
        setMapStatus('error');
      }
    });
  };

  const mapReady = Boolean(map.current);
  return (
    <section className="map-panel" aria-label="Carte interactive des bornes">
      <div className="map-toolbar">
        <form className="map-search" onSubmit={searchPlace}>
          <Search size={16} />
          <input value={placeQuery} onChange={(event) => setPlaceQuery(event.target.value)} placeholder="Rechercher une ville…" aria-label="Rechercher une ville en Tunisie" disabled={!mapReady} />
          <button type="submit" disabled={!mapReady || !placeQuery.trim()}>Rechercher</button>
        </form>
        <button className="locate-button" type="button" onClick={locateUser} disabled={!mapReady} aria-label="Centrer la carte sur ma position"><LocateFixed size={16} /><span>Ma position</span></button>
      </div>
      <div className="map-canvas-wrap">
        <div className={`map-canvas ${!mapReady ? 'map-hidden' : ''}`} ref={mapElement} />
        {!mapReady && <div className="map-message">
          <span className="map-message-icon">{mapStatus === 'error' ? <AlertTriangle size={25} /> : <MapIcon size={25} />}</span>
          <strong>{mapStatus === 'loading' ? 'Chargement de la carte…' : mapStatus === 'missing-key' ? 'Carte Google Maps non configurée' : 'Carte momentanément indisponible'}</strong>
          <p>{mapStatus === 'missing-key' ? 'Ajoutez VITE_GOOGLE_MAPS_API_KEY dans votre fichier .env.local pour activer la carte. La liste des bornes reste disponible.' : mapStatus === 'error' ? mapError : 'La carte va apparaître dans un instant.'}</p>
        </div>}
        {mapReady && mapStatus === 'error' && <div className="map-toast" role="status">{mapError}</div>}
        <div className="map-legend"><span><i className="legend-dot green" />Disponible</span><span><i className="legend-dot red" />Indisponible</span></div>
        <span className="map-demo-label">Positions fictives de démonstration</span>
      </div>
    </section>
  );
}
