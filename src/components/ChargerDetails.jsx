import React from 'react';
import { MapPin, Zap, PlugZap, X, Navigation, Building2 } from 'lucide-react';
import { Price } from './ChargerList.jsx';

const numberFormat = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

export default function ChargerDetails({ charger, onClose, onShowOnMap }) {
  if (!charger) return null;
  return (
    <aside className="details-panel" aria-label={`Détails de ${charger.name}`}>
      <div className="details-top">
        <span className="eyebrow">DÉTAILS DE LA BORNE</span>
        <button className="icon-button" onClick={onClose} type="button" aria-label="Fermer les détails"><X size={17} /></button>
      </div>
      <span className={`detail-status ${charger.available ? 'status-available' : 'status-unavailable'}`}><span className={`status-dot ${charger.available ? 'available' : 'unavailable'}`} />{charger.available ? 'Disponible' : 'Indisponible'}</span>
      <h2>{charger.name}</h2>
      <p className="detail-operator"><Building2 size={15} />{charger.operator}</p>
      <div className="detail-address"><MapPin size={17} /><span>{charger.address}<small>{charger.city}, {charger.governorate}</small></span></div>
      <div className="detail-specs">
        <div><Zap size={16} /><span>Puissance</span><strong>{numberFormat.format(charger.powerKw)} kW</strong></div>
        <div><Navigation size={16} /><span>Prix du kWh</span><strong><Price value={charger.priceTnd} /></strong></div>
        <div><PlugZap size={16} /><span>Connecteurs</span><strong>{charger.connectors?.length ? charger.connectors.join(', ') : 'Non renseignés'}</strong></div>
      </div>
      <button className="primary-button" onClick={() => onShowOnMap(charger)} type="button"><MapPin size={16} />Voir sur la carte</button>
      <p className="detail-data-note">Données de démonstration fictives · disponibilité non actualisée en temps réel.</p>
    </aside>
  );
}
