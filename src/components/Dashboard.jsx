import React from 'react';
import { Activity, Zap, CircleCheck, CircleX, Wallet } from 'lucide-react';

const numberFormat = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });
const priceFormat = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

function Metric({ icon: Icon, label, value, suffix, tone }) {
  return (
    <article className="metric-card">
      <span className={`metric-icon ${tone}`}><Icon size={19} strokeWidth={2} /></span>
      <div className="metric-copy">
        <span className="metric-label">{label}</span>
        <strong className="metric-value">{value}{suffix && <small>{suffix}</small>}</strong>
      </div>
    </article>
  );
}

export default function Dashboard({ chargers }) {
  const available = chargers.filter((charger) => charger.available).length;
  const totalPower = chargers.reduce((sum, charger) => sum + charger.powerKw, 0);
  const priced = chargers.filter((charger) => charger.priceTnd != null);
  const average = priced.length ? `${priceFormat.format(priced.reduce((sum, charger) => sum + charger.priceTnd, 0) / priced.length)} TND` : 'Non renseigné';

  return (
    <section className="metrics-grid" aria-label="Statistiques des bornes filtrées">
      <Metric icon={Activity} label="Bornes affichées" value={numberFormat.format(chargers.length)} tone="tone-blue" />
      <Metric icon={CircleCheck} label="Disponibles" value={numberFormat.format(available)} tone="tone-green" />
      <Metric icon={CircleX} label="Indisponibles" value={numberFormat.format(chargers.length - available)} tone="tone-red" />
      <Metric icon={Zap} label="Puissance installée" value={numberFormat.format(totalPower)} suffix="kW" tone="tone-amber" />
      <Metric icon={Wallet} label="Prix moyen / kWh" value={average} tone="tone-violet" />
    </section>
  );
}
