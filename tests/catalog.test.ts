import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { Config } from "../generated/schema"
import { Config as ConfigEvent } from "../generated/Catalog/Catalog"
import { handleConfig } from "../src/catalog"
import { createConfigEvent } from "./catalog-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let config = BigInt.fromI32(234)
    let id = BigInt.fromI32(234)
    let newConfigEvent = createConfigEvent(config, id)
    handleConfig(newConfigEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Config created and stored", () => {
    assert.entityCount("Config", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Config",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "config",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
