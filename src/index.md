---
layout: home

hero:
    name: 'moxon API'
    text: 'Documentation'
    tagline: A comprehensive collection of utility endpoints for developers
    actions:
        - theme: brand
          text: Get Started
          link: /v6/en/
        - theme: alt
          text: View on GitHub
          link: https://github.com/moxondev/docs
---

## Quick Start

<div class="version-cards">
  <a href="/v6/en" class="version-card current">
    <span class="badge version-badge">Current</span>
    <span class="version-number">v6</span>
    <span class="version-desc">All features</span>
  </a>
  <a href="/v5/en" class="version-card">
    <span class="badge version-badge stable">Stable</span>
    <span class="version-number">v5</span>
    <span class="version-desc">Previous version</span>
  </a>
  <a href="/v4/en" class="version-card">
    <span class="badge version-badge legacy">Legacy</span>
    <span class="version-number">v4</span>
    <span class="version-desc">Legacy version</span>
  </a>
</div>

## Base URL

All API requests should be made to:

```
https://api.moxon.dev
```

## npm Package

The same utilities are available straight from Node.js with the **`@moxon/api`** package, without going through the network:

```bash
npm install @moxon/api
```

See [Using the npm package](/v6/en/#using-the-npm-package) for the available imports.

## Example

<Try method="get" path="/health" :params="[]" auto-send no-version />
