import {
  Config as ConfigEvent,
  URI as URIEvent,
  Vendor as VendorEvent
} from "../generated/Catalog/Catalog"
import { Config, URI, Vendor } from "../generated/schema"

export function handleConfig(event: ConfigEvent): void {
  let entity = new Config(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.config = event.params.config
  entity.id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleURI(event: URIEvent): void {
  let entity = new URI(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.uri = event.params.uri
  entity.id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVendor(event: VendorEvent): void {
  let entity = new Vendor(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.vendor = event.params.vendor
  entity.id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
