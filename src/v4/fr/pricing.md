# Tarification

L'API moxon est gratuite et permet un maximum de **2 000 requêtes par heure**.

Si vous souhaitez dépasser cette limite, vous devez utiliser un token d'authentification. Le token d'authentification est unique, attribué à votre email, et vous permet de dépasser cette limite.

## Offres

<div class="pricing-grid">
  <div class="pricing-card">
    <span class="pricing-badge">GRATUIT</span>
    <div class="pricing-price">Gratuit</div>
    <ul class="pricing-features">
      <li><strong>2 000</strong> requêtes/heure</li>
      <li><strong>48 000</strong> requêtes/jour</li>
      <li><strong>336 000</strong> requêtes/semaine</li>
      <li><strong>~1.4M</strong> requêtes/mois</li>
    </ul>
    <a href="https://api.moxon.dev" class="pricing-button" target="_blank">Commencer</a>
  </div>

  <div class="pricing-card">
    <span class="pricing-badge">ADVANCED</span>
    <div class="pricing-price">2.99€<span>/mois</span></div>
    <ul class="pricing-features">
      <li><strong>3 500</strong> requêtes/heure</li>
      <li><strong>84 000</strong> requêtes/jour</li>
      <li><strong>588 000</strong> requêtes/semaine</li>
      <li><strong>~2.5M</strong> requêtes/mois</li>
    </ul>
    <a href="https://store.moxon.dev/join" class="pricing-button" target="_blank">Acheter</a>
  </div>

  <div class="pricing-card recommended">
    <span class="badge card-badge">Recommandé</span>
    <span class="pricing-badge">PRO</span>
    <div class="pricing-price">4.99€<span>/mois</span></div>
    <ul class="pricing-features">
      <li><strong>6 000</strong> requêtes/heure</li>
      <li><strong>144 000</strong> requêtes/jour</li>
      <li><strong>1 008 000</strong> requêtes/semaine</li>
      <li><strong>~4.2M</strong> requêtes/mois</li>
    </ul>
    <a href="https://store.moxon.dev/join" class="pricing-button" target="_blank">Acheter</a>
  </div>

  <div class="pricing-card">
    <span class="pricing-badge">BUSINESS</span>
    <div class="pricing-price">9.99€<span>/mois</span></div>
    <ul class="pricing-features">
      <li><strong>10 000</strong> requêtes/heure</li>
      <li><strong>240 000</strong> requêtes/jour</li>
      <li><strong>1 680 000</strong> requêtes/semaine</li>
      <li><strong>~7M</strong> requêtes/mois</li>
    </ul>
    <a href="https://store.moxon.dev/join" class="pricing-button" target="_blank">Acheter</a>
  </div>
</div>

::: tip Limite de burst
Chaque offre inclut également une limite de burst (requêtes par 10 secondes) pour éviter le spam. Voir la page [Authentification](/v4/fr/authentication#limites-de-requetes) pour les détails.
:::

## Offres personnalisées

Si vous souhaitez un nombre de requêtes supérieur à 10 000 par heure ou un tarif personnalisé, envoyez un email à [contact@sylvain.sh](mailto:contact@sylvain.sh).

## Authentification

Pour utiliser votre clé API, incluez-la dans l'en-tête `Authorization` :

```bash
curl -H "Authorization: Bearer VOTRE_CLE_API" https://api.moxon.dev/v4/infos
```

### Réponse d'erreur

Si le token fourni est incorrect ou expiré, vous obtiendrez une erreur 401 :

```json
{
    "message": "Unauthorized",
    "error": "Invalid token.",
    "status": "401"
}
```

::: warning Note
Si aucun token n'est fourni, la requête est traitée comme non authentifiée et utilise les limites de l'offre [GRATUIT](#offres).
:::
