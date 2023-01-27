# Bazaar Subgraph

## Build

```
pnpm install
pnpm run codegen
pnpm run build
```

## Deploy

```
graph auth --product hosted-service <access-token>
graph deploy --product hosted-service --network arbitrum-goerli bazaar-buidlers/arbitrum-goerli
```

## Docker

```
docker-compose up

# in new terminal
pnpm run create-local
pnpm run deploy-local
```
