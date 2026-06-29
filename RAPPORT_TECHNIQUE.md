# Rapport technique BadWallet Frontend

## 1. Contexte du projet

BadWallet est une interface Angular destinée à deux profils principaux :

- le client, qui consulte son portefeuille et effectue des opérations simples ;
- l’agent guichet, qui opère dans un espace privé protégé.

Le front est déjà structuré pour consommer un backend wallet et un backend d’authentification.

## 2. Architecture utilisée

### 2.1 Stack technique

- Angular 21
- composants standalone
- routing lazy-loaded
- Reactive Forms
- Signals Angular pour l’état local
- `HttpClient` pour les appels backend
- SSR et hydration via la configuration Angular de l’application

### 2.2 Découpage fonctionnel

L’application suit une architecture par couches :

- `core` : services transverses, gardes et modèles de session
- `features/public` : accès public, formulaire de connexion et création de compte
- `features/private` : tableau de bord et écrans protégés
- `layout` : shells public et privé
- `shared` : composants réutilisables

### 2.3 Routage

Le point d’entrée redirige vers `/public/login`.

Les routes privées sont protégées par :

- `isConnectGuard`
- `isConnectChildGuard`

Ces gardes vérifient uniquement la présence d’une session dans `SessionService`.

### 2.4 Gestion d’état

L’état de connexion est géré côté front par `SessionService` :

- la session est stockée en mémoire via signal ;
- la session est persistée dans `localStorage` ;
- le rôle est déduit à partir de l’email si l’API ne fournit pas explicitement le rôle.

### 2.5 Accès API

Deux bases URL sont prévues :

- `http://localhost:8081` pour l’authentification
- `http://localhost:8080` pour les wallets et factures

Le dashboard privé exploite les endpoints wallet pour charger :

- la liste des wallets
- le solde d’un wallet
- les transactions
- les factures courantes

## 3. Problème rencontré

Le symptôme principal est que l’utilisateur reste bloqué sur la page de connexion.

### 3.1 Pourquoi cela arrive

Le blocage est cohérent avec le fonctionnement actuel du code :

1. La route initiale redirige vers `/public/login`.
2. Les gardes interdisent l’accès au privé tant que `SessionService` ne contient pas une session.
3. Le formulaire de connexion appelle l’API d’authentification sur `http://localhost:8081/api/auth/login`.
4. Si cet appel échoue, aucune session n’est enregistrée.
5. Sans session, la navigation vers `/private/*` reste bloquée et l’utilisateur revient sur le login.

### 3.2 Cause la plus probable

La cause la plus probable n’est pas la page de connexion elle-même, mais le contrat backend.

Le front attend des endpoints d’authentification sur le port `8081`, alors que la documentation fournie côté backend met surtout en avant les endpoints wallet sur `8080` et les endpoints proxy/factures. Si l’API auth n’est pas disponible, pas démarrée, ou renvoie une réponse différente de celle attendue, la connexion échoue.

### 3.3 Autre point bloquant possible

Même si la requête d’authentification répond, la navigation privée reste impossible si :

- la réponse backend est incompatible avec le modèle attendu ;
- la CORS policy bloque la requête ;
- le service sur `8081` n’est pas accessible depuis le front ;
- la session n’est pas correctement persistée dans `localStorage`.

## 4. Conclusion technique

Le front n’est pas bloqué par une erreur de routing pure. Il est bloqué parce que l’accès privé dépend d’une session valide, et cette session dépend d’une authentification backend qui n’est pas garantie par le contrat actuel visible dans le projet.

En résumé :

- le design d’architecture est cohérent ;
- la protection des routes fonctionne ;
- le problème se situe principalement au niveau du backend d’authentification ou de son intégration avec le front.

## 5. Recommandations

1. Vérifier que le service d’authentification tourne bien sur `8081`.
2. Confirmer que `/api/auth/login` et `/api/auth/register-client` existent réellement.
3. Vérifier la réponse JSON attendue par `AuthApiService`.
4. Confirmer que le token ou la session reçue est bien persistée par `SessionService`.
5. Garder le dashboard branché sur `8080` séparément de l’authentification.