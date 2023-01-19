import { Address, BigInt } from '@graphprotocol/graph-ts'
import { Account, Balance, Listing, Price } from '../generated/schema';

import {
  Appraise,
  Configure,
  TransferBatch,
  TransferSingle,
  TransferVendor,
  URI,
} from '../generated/Bazaar/Bazaar';

export function handleAppraise(event: Appraise): void {
  const erc20 = event.params.erc20;
  const listingId = event.params.id.toString();

  const price = fetchPrice(erc20, listingId);
  price.value = event.params.price;
  price.save();
}

export function handleConfigure(event: Configure): void {
  const listingId = event.params.id.toString();
  const listing = fetchListing(listingId);

  listing.config = event.params.config;
  listing.limit = event.params.limit;
  listing.royalty = event.params.royalty;
  listing.save();
}

export function handleTransferSingle(event: TransferSingle): void {
  const id = event.params.id;
  const value = event.params.value;
  const from = event.params.from;
  const to = event.params.to;

  if (from != Address.zero()) {
    updateBalance(from, id, value.neg());
  }
  if (to != Address.zero()) {
    updateBalance(to, id, value);
  }
}

export function handleTransferBatch(event: TransferBatch): void {
  const ids = event.params.ids;
  const values = event.params.values;
  const from = event.params.from;
  const to = event.params.to;

  for (let i = 0; i < ids.length; i++) {
    if (from != Address.zero()) {
      updateBalance(from, ids[i], values[i].neg());
    }
    if (to != Address.zero()) {
      updateBalance(to, ids[i], values[i]);
    }
  }
}

export function handleTransferVendor(event: TransferVendor): void {
  const listingId = event.params.id.toString();
  const listing = fetchListing(listingId);

  listing.vendor = event.params.vendor;
  listing.save();
}

export function handleURI(event: URI): void {
  const listingId = event.params.id.toString();
  const listing = fetchListing(listingId);

  listing.uri = event.params.value;
  listing.save();
}

function fetchListing(id: String): Listing {
  let listing = Listing.load(id);
  if (listing == null) {
    listing = new Listing(id);
    listing.vendor = Address.zero();
    listing.config = BigInt.zero();
    listing.royalty = BigInt.zero();
    listing.uri = "";
  }
  return listing as Listing;
}

function fetchBalance(accountId: Address, listingId: String): Balance {
  const balanceId = accountId.toHex().concat('/').concat(listingId);
  let balance = Balance.load(balanceId);
  if (balance == null) {
    balance = new Balance(balanceId);
    balance.account = accountId;
    balance.listing = listingId;
    balance.value = BigInt.zero();
  }
  return balance as Balance;
}

function fetchPrice(erc20: Address, listingId: String): Price {
  const priceId = erc20.toHex().concat('/').concat(listingId);
  let price = Price.load(priceId);
  if (price == null) {
    const price = new Price(priceId);
    price.listing = listingId;
    price.erc20 = erc20;
  }
  return price as Price;
}

function updateBalance(address: Address, id: BigInt, value: BigInt): void {
  let account = Account.load(address);
  if (account == null) {
    account = new Account(address);
    account.save();
  }

  const balance = fetchBalance(address, id.toString());
  balance.value = balance.value.plus(value);
  balance.save();
}