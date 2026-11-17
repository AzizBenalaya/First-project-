import React, { useEffect, useMemo, useState } from 'react';
import { Activity, BatteryCharging, Leaf, MapPin, RadioTower } from 'lucide-react';
import { chargers } from './data/chargers.js';
import Dashboard from './components/Dashboard.jsx';
import Filters from './components/Filters.jsx';
import ChargerList from './components/ChargerList.jsx';
import ChargerMap from './components/ChargerMap.jsx';
import ChargerDetails from './components/ChargerDetails.jsx';

const INITIAL_FILTERS = { query: '', city: '', governorate: '', status: '', operator: '', power: '', price: '' };
const normalize = (value) => value.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function App() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedCharger, setSelectedCharger] = useState(null);
  const options = useMemo(() => ({
    cities: [...new Set(chargers.map((charger) => charger.city))].sort((a, b) => a.localeCompare(b, 'fr')),
    governorates: [...new Set(chargers.map((charger) => charger.governorate))].sort((a, b) => a.localeCompare(b, 'fr')),
    operators: [...new Set(chargers.map((charger) => charger.operator))].sort((a, b) => a.localeCompare(b, 'fr')),
  }), []);
  const filteredChargers = useMemo(() => chargers.filter((charger) => {
    const haystack = normalize([charger.name, charger.operator, charger.city, charger.governorate, charger.address].join(' '));
    if (filters.query && !haystack.includes(normalize(filters.query))) return false;
    if (filters.city && charger.city !== filters.city) return false;
    if (filters.governorate && charger.governorate !== filters.governorate) return false;
    if (filters.operator && charger.operator !== filters.operator) return false;
    if (filters.status === 'Disponible' && !charger.available) return false;
    if (filters.status === 'Indisponible' && charger.available) return false;
    if (filters.power === '22 kW' && charger.powerKw !== 22) return false;
    if (filters.power === '50 kW' && charger.powerKw !== 50) return false;
    if (filters.power === '60 kW et plus' && charger.powerKw < 60) return false;
    if (filters.price === 'Prix renseigné' && charger.priceTnd == null) return false;
    if (filters.price === 'Prix non renseigné' && charger.priceTnd != null) return false;
    if (filters.price === '≤ 0,800 TND' && (charger.priceTnd == null || charger.priceTnd > 0.8)) return false;
    if (filters.price === '> 0,800 TND' && (charger.priceTnd == null || charger.priceTnd <= 0.8)) return false;
    return true;
  }), [filters]);
  useEffect(() => {
    if (selectedCharger && !filteredChargers.some((charger) => charger.id === selectedCharger.id)) {
      setSelectedCharger(null);
    }
  }, [filteredChargers, selectedCharger]);

  const selectCharger = (charger) => setSelectedCharger(charger);
  const resetFilters = () => setFilters(INITIAL_FILTERS);

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#" aria-label="Wattnow, accueil">
          <span className="brand-icon"><BatteryCharging size={23} strokeWidth={2.2} /></span>
          <span className="brand-name">watt<span>now</span><small>TUNISIE</small></span>
        </a>
        <div className="header-note"><span className="live-dot" />Mobilité électrique, partout en Tunisie</div>
        <a className="header-location" href="#explorer"><MapPin size={15} /> Explorer la carte</a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="hero-kicker"><span /> LE RÉSEAU DE RECHARGE TUNISIEN</span>
            <h1>La route électrique<br /><span>commence ici.</span></h1>
            <p>Repérez les bornes, comparez leur disponibilité et prenez la route en toute sérénité.</p>
            <div className="hero-meta"><span><MapPin size={14} /> Toute la Tunisie</span><span><Activity size={14} /> {chargers.length} points de recharge</span></div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-ring ring-one" /><div className="art-ring ring-two" /><div className="art-route" />
            <span className="art-pin pin-one"><MapPin size={17} /></span><span className="art-pin pin-two"><MapPin size={17} /></span>
            <span className="art-bolt"><BatteryCharging size={34} /></span>
            <div className="art-caption"><Leaf size={14} /> Vers une Tunisie plus verte</div>
          </div>
          <div className="hero-stamp"><RadioTower size={15} /> EXPLORER LE RÉSEAU <span>↘</span></div>
        </section>

        <Dashboard chargers={filteredChargers} />

        <div className="demo-banner"><span className="demo-banner-icon">i</span><p><strong>Mode démonstration :</strong> les bornes, adresses, coordonnées, prix et disponibilités affichés sont fictifs et ne sont pas actualisés en temps réel.</p></div>

        <div className="explorer-layout" id="explorer">
          <div className="explorer-left">
            <Filters filters={filters} setFilters={setFilters} options={options} onReset={resetFilters} />
            <ChargerList chargers={filteredChargers} selectedId={selectedCharger?.id} onSelect={selectCharger} />
          </div>
          <div className="explorer-right">
            <ChargerMap chargers={filteredChargers} selectedCharger={selectedCharger} onSelect={selectCharger} />
            <ChargerDetails charger={selectedCharger} onClose={() => setSelectedCharger(null)} onShowOnMap={(charger) => { setSelectedCharger(charger); document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' }); }} />
          </div>
        </div>
      </main>
      <footer><span className="footer-brand"><BatteryCharging size={17} /> wattnow</span><span>Explorer la mobilité électrique en Tunisie</span><span className="footer-demo">Données de démonstration · TND</span></footer>
    </div>
  );
}
