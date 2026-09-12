---
layout: home

hero:
    name: 'Hyperion API'
    text: 'Documentation'
    tagline: A comprehensive collection of utility endpoints for developers
    actions:
        - theme: brand
          text: Get Started
          link: /v6/en/
        - theme: alt
          text: View on GitHub
          link: https://github.com/20syldev/docs
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
https://api.sylvain.sh
```

## Example

<Try method="get" path="/health" :params="[]" auto-send no-version />
