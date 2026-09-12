# Chart

L'endpoint `/chart` génère des graphiques à partir de données. Il supporte les types bar, line, pie et donut, et retourne soit une image SVG, soit des données JSON brutes.

<Endpoint method="post" path="/chart" baseUrl="https://api.sylvain.sh" />

## Paramètres

Le corps de la requête doit être en JSON :

| Paramètre | Requis | Description                                                                    |
| --------- | ------ | ------------------------------------------------------------------------------ |
| `type`    | Oui    | Type de graphique : `bar`, `line`, `pie` ou `donut`                            |
| `data`    | Oui    | Objet de données (voir structure ci-dessous)                                   |
| `title`   | Non    | Titre du graphique affiché en haut                                             |
| `width`   | Non    | Largeur SVG en pixels (responsive si omis)                                     |
| `height`  | Non    | Hauteur SVG en pixels (responsive si omis)                                     |
| `colors`  | Non    | Tableau de couleurs hexadécimales pour les datasets (palette par défaut sinon) |
| `bg`      | Non    | Couleur de fond (hex, transparent si omis)                                     |
| `legend`  | Non    | Afficher la légende : `true` (défaut) ou `false`                               |
| `mode`    | Non    | Format de réponse : `"svg"` (défaut, retourne SVG) ou `"data"` (retourne JSON) |

## Format des données

`data` doit être un **objet JSON** (pas une chaîne) dans le corps de la requête. La structure dépend du type de graphique.

**Graphiques bar et line :**

```json
{
    "labels": ["Jan", "Fév", "Mar"],
    "datasets": [
        { "label": "Ventes", "values": [120, 200, 150] },
        { "label": "Coûts", "values": [80, 95, 110] }
    ]
}
```

**Graphiques pie et donut :**

```json
{
    "labels": ["Jan", "Fév", "Mar"],
    "values": [120, 200, 150]
}
```

- `labels` : tableau de chaînes — max **20** labels
- `datasets` (bar/line) : tableau d'objets — max **5** datasets, chacun avec un `label` et un tableau `values` de même longueur que `labels`
- `values` (pie/donut) : tableau unique de nombres non négatifs de même longueur que `labels`

> Le champ `data` doit être un objet JSON, pas une chaîne. Envoyer la requête avec `Content-Type: application/json`.

## Réponse

- Quand `mode` est `"svg"` (défaut) : retourne `Content-Type: image/svg+xml` avec le corps SVG
- Quand `mode` est `"data"` : retourne un objet JSON avec les données du graphique

## Exemples de code

<Examples method="post" path="/chart" :body="{ type: 'bar', data: { labels: ['Jan','Fév','Mar'], datasets: [{ label: 'Ventes', values: [120,200,150] }] }, title: 'Ventes mensuelles' }" />

## Essayer

<Try name="Chart" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                                  | Description                                  |
| ----------------------------------------------------------------- | -------------------------------------------- |
| `Please provide a valid chart type (?type=bar\|line\|pie\|donut)` | Le paramètre `type` est manquant ou invalide |
| `data must contain a labels array`                                | Le champ `data.labels` est manquant          |
| `data must contain a datasets array`                              | Le champ `data.datasets` est manquant        |
| `Too many labels (max 20)`                                        | Le tableau labels dépasse 20 entrées         |
| `Too many datasets (max 5)`                                       | Le tableau datasets dépasse 5 entrées        |
| `Each dataset must have the same number of values as labels`      | Incompatibilité de longueur des datasets     |
