import React from 'react';
import { MapPin, Zap, ArrowUpRight, PlugZap } from 'lucide-react';

const numberFormat = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
const priceFormat = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

export function Price({ value }) {
  return value == null ? <span>Prix non renseigné</span> : <span>{priceFormat.format(value)} TND/kWh</span>;
}

function ChargerCard({ charger, selected, onSelect }) {
  return (
    <button className={`charger-card ${selected ? 'selected' : ''}`} onClick={() => onSelect(charger)} type="button" aria-pressed={selected}>
      <div className="charger-card-top">
        <span className={`status-dot ${charger.available ? 'available' : 'unavailable'}`} />
        <span className={`status-text ${charger.available ? 'available-text' : 'unavailable-text'}`}>{charger.available ? 'Disponible' : 'Indisponible'}</span>
        <span className="charger-id">{charger.id}</span>
      </div>
      <div className="charger-title-row"><h3>{charger.name}</h3><ArrowUpRight size={16} className="card-arrow" /></div>
      <p className="charger-operator">{charger.operator}</p>
      <p className="charger-address"><MapPin size={14} /><span>{charger.city}, {charger.governorate} · {charger.address}</span></p>
      <div className="charger-card-bottom">
        <span className="charger-detail"><Zap size={14} />{numberFormat.format(charger.powerKw)} kW</span>
        <span className="charger-detail price-detail"><span className="price-bullet" /><Price value={charger.priceTnd} /></span>
      </div>
      {charger.connectors?.length > 0 && <div className="connector-list"><PlugZap size={13} />{charger.connectors.join(' · ')}</div>}
    </button>
  );
}

export default function ChargerList({ chargers, selectedId, onSelect }) {
  return (
    <section className="list-panel" aria-label="Liste des bornes">
      <div className="list-heading">
        <div><h2>Bornes à proximité</h2><p>{chargers.length} résultat{chargers.length !== 1 ? 's' : ''} correspondant à votre recherche</p></div>
        <span className="result-count">{chargers.length.toString().padStart(2, '0')}</span>
      </div>
      <div className="charger-list">
        {chargers.length ? chargers.map((charger) => <ChargerCard key={charger.id} charger={charger} selected={selectedId === charger.id} onSelect={onSelect} />) : (
          <div className="empty-state"><span className="empty-icon"><MapPin size={22} /></span><strong>Aucune borne trouvée</strong><p>Modifiez votre recherche ou effacez les filtres pour afficher plus de résultats.</p></div>
        )}
      </div>
    </section>
  );
}
