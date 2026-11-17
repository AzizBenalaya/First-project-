# Wattnow — recharge électrique en Tunisie

Application React + Vite pour explorer des bornes de recharge en Tunisie. Les bornes fournies dans `src/data/chargers.js` sont des **données fictives de démonstration** : elles ne représentent pas des emplacements, tarifs ou disponibilités réels ni actualisés. Remplacez ce module par votre API pour publier des données vérifiées.

## Installation

1. Installez Node.js (version 18 ou ultérieure).
2. À la racine du projet, installez les dépendances :

   ```bash
   npm install
   ```

3. Copiez `.env.example` vers `.env.local`, puis renseignez une clé Google Maps JavaScript API autorisée pour votre domaine :

   ```env
   VITE_GOOGLE_MAPS_API_KEY=votre_cle_google_maps  
   ```

   Activez l'API Maps JavaScript dans Google Cloud et configurez la facturation et les restrictions de clé. Sans clé, l'application reste consultable en mode liste.

4. Lancez le serveur de développement :

   ```bash
   npm run dev
   ```

   Pour produire et prévisualiser une version de production : `npm run build`, puis `npm run preview`.

## Données

Le format de chaque borne est défini dans `src/data/chargers.js` : identifiant, nom, opérateur, adresse, ville, gouvernorat, coordonnées, puissance, prix éventuel en TND/kWh, disponibilité et connecteurs. Les disponibilités et prix ne sont pas actualisés en temps réel.
