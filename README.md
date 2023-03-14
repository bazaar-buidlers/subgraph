# Bazaar Subgraph

## Networks

- Arbitrum One `https://api.thegraph.com/subgraphs/name/bazaar-buidlers/bazaar-arbitrum-one`
- Arbitrum Goerli `https://api.thegraph.com/subgraphs/name/bazaar-buidlers/arbitrum-goerli`

## Build

```
pnpm install
pnpm run codegen
pnpm run build
```

## Deploy

```
pnpm install -g @graphprotocol/graph-cli
pnpm exec graph auth --product hosted-service <access-token>
pnpm exec graph deploy --product hosted-service --network arbitrum-one bazaar-buidlers/bazaar-arbitrum-one
```

## Docker

```
docker-compose up

# in new terminal
pnpm run create-local
pnpm run deploy-local
```
