import React from 'react';
import { Search, SlidersHorizontal, RotateCcw, MapPin } from 'lucide-react';

function SelectFilter({ label, value, onChange, options, placeholder }) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        <option value="">{placeholder}</option>
        {options.map((option) => <option value={option} key={option}>{option}</option>)}
      </select>
    </label>
  );
}

export default function Filters({ filters, setFilters, options, onReset }) {
  const update = (key) => (value) => setFilters((current) => ({ ...current, [key]: value }));
  return (
    <section className="filter-panel" aria-label="Recherche et filtres">
      <div className="panel-title-row">
        <h2><SlidersHorizontal size={17} /> Recherche & filtres</h2>
        <button className="text-button" type="button" onClick={onReset}><RotateCcw size={14} /> Tout effacer</button>
      </div>
      <label className="search-field">
        <Search size={17} />
        <input value={filters.query} onChange={(event) => update('query')(event.target.value)} placeholder="Borne, opérateur, ville, adresse…" aria-label="Rechercher une borne" />
        {filters.query && <button type="button" aria-label="Effacer la recherche" onClick={() => update('query')('')}>×</button>}
      </label>
      <div className="filters-grid">
        <SelectFilter label="Ville" value={filters.city} onChange={update('city')} options={options.cities} placeholder="Toutes les villes" />
        <SelectFilter label="Gouvernorat" value={filters.governorate} onChange={update('governorate')} options={options.governorates} placeholder="Tous les gouvernorats" />
        <SelectFilter label="Disponibilité" value={filters.status} onChange={update('status')} options={['Disponible', 'Indisponible']} placeholder="Tous les statuts" />
        <SelectFilter label="Opérateur" value={filters.operator} onChange={update('operator')} options={options.operators} placeholder="Tous les opérateurs" />
        <SelectFilter label="Puissance" value={filters.power} onChange={update('power')} options={['22 kW', '50 kW', '60 kW et plus']} placeholder="Toutes puissances" />
        <SelectFilter label="Prix du kWh" value={filters.price} onChange={update('price')} options={['Prix renseigné', 'Prix non renseigné', '≤ 0,800 TND', '> 0,800 TND']} placeholder="Tous les prix" />
      </div>
      <p className="filter-hint"><MapPin size={13} /> Les filtres s’appliquent à la liste, à la carte et aux statistiques.</p>
    </section>
  );
}
