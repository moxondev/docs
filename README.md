<div align="center">
  <a href="https://moxon.dev"><img src="https://moxon.dev/icon-512.png" alt="Logo" width="25%" height="auto"/></a>

# Documentation de l'API

[![Version](https://custom-icon-badges.demolab.com/badge/Version%20:-v6.0.0-6479ee?logo=moxon.dev&labelColor=23272A)](https://github.com/moxondev/docs/releases/latest)

</div>

---

## À propos de la Documentation

Voici la documentation de mon API personnelle, disponible sur le domaine [moxon.dev](https://moxon.dev).

## Développement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

### Composants Vue

| Composant        | Description                                                                   |
| ---------------- | ----------------------------------------------------------------------------- |
| `Banner.vue`     | Bannière automatique sur les anciennes versions (migration ou legacy)         |
| `Copy.vue`       | Bouton de copie pour les blocs de code avec icône animée                      |
| `Endpoint.vue`   | Affiche un endpoint API versionné automatiquement selon l'URL                 |
| `Examples.vue`   | Exemples de code multi-langages (cURL, JavaScript, Python, PHP)               |
| `Extra.vue`      | Barre d'actions avec sélecteur de langue et apparence                         |
| `Lang.vue`       | Menu déroulant pour changer de langue (EN/FR)                                 |
| `Layout.vue`     | Layout principal, traduction UI, raccourcis clavier et page 404               |
| `Method.vue`     | Badge coloré pour les méthodes HTTP (GET, POST, PUT, DELETE, PATCH)           |
| `Panel.vue`      | Moteur de test interactif (paramètres, envoi, réponse, snippets)              |
| `Playground.vue` | Playground global pour sélectionner et tester tous les endpoints              |
| `Request.vue`    | Bloc stylisé pour afficher des exemples de requêtes avec en-tête optionnel    |
| `Terminal.vue`   | Démo interactive sur la page d'accueil                                        |
| `Try.vue`        | Bloc "Try It" réutilisable dans les pages de documentation                    |
| `Version.vue`    | Menu déroulant pour naviguer entre les versions de l'API (v1, v2, v3, v4, v5) |

### Composables, données et utilitaires

| Module                           | Description                                                        |
| -------------------------------- | ------------------------------------------------------------------ |
| `composables/useVersion.ts`      | Détection de version/langue et création de chemins versionnés      |
| `composables/useCodeSnippets.ts` | Génération de snippets cURL/JavaScript/Python/PHP pour un endpoint |
| `data/endpoints.ts`              | Catalogue central des endpoints pour le Playground                 |
| `utils/i18n.ts`                  | Traductions EN/FR et helpers de langue                             |
| `utils/icons.ts`                 | SVG partagés (copy, check, search, book, arrow)                    |
| `utils/redirect.ts`              | Version courante, versions connues, redirections intelligentes     |

### Organisation CSS

| Zone                  | Modules                                        |
| --------------------- | ---------------------------------------------- |
| `main.css`            | Point d'entrée qui importe tous les styles     |
| `styles/base/*`       | Tokens, styles partagés, global, overrides     |
| `styles/components/*` | API, panel, playground, tabs, terminal, banner |
| `styles/layout/*`     | Navbar, responsive, cards, pricing             |

## Déploiement

Le site est généré en HTML statique et peut être déployé sur n'importe quel hébergement statique :

```bash
npm run build
```

Le résultat sera dans `src/.vitepress/dist/`

## Fonctionnalités

- Documentation multi-versions (v1, v2, v3, v4, v5)
- Internationalisation (Anglais, Français)
- Versionnement automatique des composants (`Endpoint`, `Try`, `Examples`, `Playground`)
- Bannières de migration/legacy selon la version consultée
- Blocs "Try It" intégrés dans les pages endpoints
- Playground interactif global
- Exemples de code multi-langages avec préférence sauvegardée
- Mode sombre
- Recherche locale
- Design responsive
- Composants personnalisés pour la documentation API

## Versioning

Les guides de versionnement et de release sont disponibles dans [`guides/`](./guides/).
