import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { Config, URI, Vendor } from "../generated/Catalog/Catalog"

export function createConfigEvent(config: BigInt, id: BigInt): Config {
  let configEvent = changetype<Config>(newMockEvent())

  configEvent.parameters = new Array()

  configEvent.parameters.push(
    new ethereum.EventParam("config", ethereum.Value.fromUnsignedBigInt(config))
  )
  configEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return configEvent
}

export function createURIEvent(uri: string, id: BigInt): URI {
  let uriEvent = changetype<URI>(newMockEvent())

  uriEvent.parameters = new Array()

  uriEvent.parameters.push(
    new ethereum.EventParam("uri", ethereum.Value.fromString(uri))
  )
  uriEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return uriEvent
}

export function createVendorEvent(vendor: Address, id: BigInt): Vendor {
  let vendorEvent = changetype<Vendor>(newMockEvent())

  vendorEvent.parameters = new Array()

  vendorEvent.parameters.push(
    new ethereum.EventParam("vendor", ethereum.Value.fromAddress(vendor))
  )
  vendorEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return vendorEvent
}
