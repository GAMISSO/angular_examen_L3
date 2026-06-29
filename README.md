# BadWallet Frontend

Interface Angular 21 pour BadWallet, organisée en zones publiques et privées, avec un dashboard branché sur les endpoints wallet.

## Architecture

Le projet utilise Angular 21 avec composants standalone, routing lazy-loaded, SSR et hydration côté navigateur.

Structure principale :

- `src/app/core` : services, gardes et modèles de session.
- `src/app/features/public` : écran de connexion et création de compte.
- `src/app/features/private` : dashboard et écrans protégés.
- `src/app/layout` : shells public et privé.
- `src/app/shared` : composants réutilisables.

## Backend attendu

- API auth : `http://localhost:8081`
- API wallets : `http://localhost:8080`

Le front appelle :

- `POST /api/auth/login`
- `POST /api/auth/register-client`
- `GET /api/wallets`
- `GET /api/wallets/{phone}/balance`
- `GET /api/wallets/{phone}/transactions`
- `GET /api/external/factures/{code}/current`

## Lancer le projet

```bash
npm install
npm start
```

Ensuite ouvrir `http://localhost:4200/`.

## Commandes utiles

```bash
npm run build
npm test
```

## Flux de navigation

- L’entrée par défaut redirige vers `/public/login`.
- Une session valide est stockée localement par `SessionService`.
- Les routes privées sont protégées par des gardes Angular.
- Le dashboard charge les wallets, le solde, les transactions et les factures courantes depuis le backend.

## Point d’attention sur la connexion

Si la connexion reste bloquée, le plus probable est que le front ne reçoive pas de réponse exploitable depuis l’API auth. Dans ce cas :

1. Vérifier que le service sur le port `8081` est démarré.
2. Vérifier que les endpoints `/api/auth/login` et `/api/auth/register-client` existent réellement.
3. Vérifier que l’API autorise les appels depuis le front Angular.

Le détail complet du diagnostic est dans [RAPPORT_TECHNIQUE.md](RAPPORT_TECHNIQUE.md).
