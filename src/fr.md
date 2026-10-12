---
layout: home

hero:
    name: 'Documentation'
    text: 'API moxon'
    tagline: Une collection complète d'endpoints utilitaires pour les développeurs
    actions:
        - theme: brand
          text: Commencer
          link: /v6/fr/
        - theme: alt
          text: Voir sur GitHub
          link: https://github.com/moxondev/docs
---

## Démarrage rapide

<div class="version-cards">
  <a href="/v6/fr" class="version-card current">
    <span class="badge version-badge">Actuelle</span>
    <span class="version-number">v6</span>
    <span class="version-desc">Toutes les fonctionnalités</span>
  </a>
  <a href="/v5/fr" class="version-card">
    <span class="badge version-badge stable">Stable</span>
    <span class="version-number">v5</span>
    <span class="version-desc">Version précédente</span>
  </a>
  <a href="/v4/fr" class="version-card">
    <span class="badge version-badge legacy">Legacy</span>
    <span class="version-number">v4</span>
    <span class="version-desc">Ancienne version</span>
  </a>
</div>

## URL de base

Toutes les requêtes API doivent être faites vers :

```
https://api.moxon.dev
```

## Exemple

<Try method="get" path="/health" :params="[]" auto-send no-version />
