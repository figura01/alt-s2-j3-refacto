# Installation

## Prérequis

- Node.js >= 18
- npm >= 9
- TypeScript
- ts-node

---

## Installer les dépendances

```bash
npm install
npm install -D typescript ts-node @types/node
npx tsc --init
```

## Utilisation

```bash
npx ts-node ./src/main.ts
```

# Générer le fichier JSON

Le programme génère automatiquement: output.json
à la racine du projet.

# Exécuter les tests

(a faire)

# Commande pour lancer tous les tests

(a faire)
Comparer avec le legacy (validation)

# 3 Choix de Refactoring

Le code a été découpé en plusieurs modules spécialisés :

- `utils/` pour la lecture et le chargement des fichiers CSV ;
- `services/` pour les calculs métier ;
- `reports/` pour le formatage du rapport texte ;
- `config/` pour centraliser les constantes métier ;
- `types/` pour définir les interfaces TypeScript.

## Choix de Refactoring

### Problèmes Identifiés dans le Legacy

Le code initial présentait plusieurs problèmes de maintenabilité :

- une fonction principale `run()` trop longue qui gérait à la fois la lecture des fichiers, le parsing CSV, les calculs métier, le formatage du rapport et l’export JSON ;
- une utilisation massive de `any`, ce qui réduisait l’intérêt de TypeScript ;
- beaucoup de constantes globales dispersées ;
- une duplication du parsing CSV dans plusieurs endroits ;
- des règles métier cachées directement dans la fonction principale ;
- des erreurs silencieuses avec des `try/catch` qui ignoraient certains problèmes ;
- un mélange entre logique métier, affichage console et écriture fichier.

### Améliorations Apportées

- remplacement des `any` par des interfaces TypeScript ;
- extraction de la configuration dans `pricingConfig` ;
- séparation entre chargement des données, calculs, formatage et export ;
- création d’une fonction `calculateCustomerReports()` dédiée aux calculs client ;
- création d’une fonction `formatReport()` dédiée à l’affichage texte ;
- création d’une fonction `exportJson()` dédiée à l’export JSON ;
- simplification de `main.ts`, qui devient uniquement un orchestrateur.

### Pourquoi ce choix ?

Le projet manipule principalement des données CSV transformées en rapports. Une architecture fonctionnelle modulaire est donc plus adaptée qu’une POO complète.

L’objectif était de rendre le code :

- plus lisible ;
- plus testable ;
- plus maintenable ;
- plus simple à faire évoluer.
