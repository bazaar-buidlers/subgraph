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
  const listing = fetchListing(event.params.id);
  const price = fetchPrice(event.params.erc20, listing);
  price.value = event.params.price;
  price.save();
}

export function handleConfigure(event: Configure): void {
  const listing = fetchListing(event.params.id);
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
  const account = fetchAccount(event.params.vendor);
  const listing = fetchListing(event.params.id);
  listing.vendor = account.id;
  listing.save();
}

export function handleURI(event: URI): void {
  const listing = fetchListing(event.params.id);
  listing.uri = event.params.value;
  listing.save();
}

function updateBalance(address: Address, id: BigInt, value: BigInt): void {
  const account = fetchAccount(address);
  const listing = fetchListing(id);
  const balance = fetchBalance(account, listing);
  balance.value = balance.value.plus(value);
  balance.save();
}

function fetchAccount(id: Address): Account {
  const existing = Account.load(id);
  if (existing != null) return existing;

  const account = new Account(id);
  account.save();
  return account;
}

function fetchListing(id: BigInt): Listing {
  const existing = Listing.load(id.toString());
  if (existing != null) return existing;

  const listing = new Listing(id.toString());
  listing.vendor = Address.zero();
  listing.config = BigInt.zero();
  listing.limit = BigInt.zero();
  listing.royalty = BigInt.zero();
  listing.uri = "";
  listing.save();
  return listing;
}

function fetchBalance(account: Account, listing: Listing): Balance {
  const id = account.id.toHex().concat('/').concat(listing.id);
  
  const existing = Balance.load(id);
  if (existing != null) return existing;

  const balance = new Balance(id);
  balance.account = account.id;
  balance.listing = listing.id;
  balance.value = BigInt.zero();
  balance.save();
  return balance;
}

function fetchPrice(erc20: Address, listing: Listing): Price {
  const id = erc20.toHex().concat('/').concat(listing.id);

  const existing = Price.load(id);
  if (existing != null) return existing;

  const price = new Price(id);
  price.listing = listing.id;
  price.erc20 = erc20;
  price.save();
  return price;
}