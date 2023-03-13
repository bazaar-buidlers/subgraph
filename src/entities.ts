import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';

import { 
  Account,
  Balance,
  Listing,
  Price,
  Purchase,
  Review,
} from '../generated/schema';

/**
 * Return the account with the given ID or create it.
 * 
 * @param id Account Id
 */
export function fetchAccount(id: Address): Account {
  const existing = Account.load(id);
  if (existing != null) return existing;

  const account = new Account(id);
  account.save();
  return account;
}

/**
 * Return the listing with the given ID or create it.
 * 
 * @param id Listing ID 
 */
export function fetchListing(id: BigInt): Listing {
  const existing = Listing.load(id.toString());
  if (existing != null) return existing;

  const listing = new Listing(id.toString());
  listing.vendor = Address.zero();
  listing.config = BigInt.zero();
  listing.limit = BigInt.zero();
  listing.allow = BigInt.zero();
  listing.royalty = BigInt.zero();
  listing.uri = "";
  listing.save();
  return listing;
}

/**
 * Return the balance for the account and listing or create it.
 * 
 * @param account Account to fetch balance of
 * @param listing Listing to fetch balance of
 */
export function fetchBalance(account: Account, listing: Listing): Balance {
  const id = [account.id.toHex(), listing.id].join('/');
  
  const existing = Balance.load(id);
  if (existing != null) return existing;

  const balance = new Balance(id);
  balance.account = account.id;
  balance.listing = listing.id;
  balance.value = BigInt.zero();
  balance.save();
  return balance;
}

/**
 * Return the price for the given erc20 and listing or create it.
 * 
 * @param erc20 Address of erc20 token
 * @param listing Listing to fetch price of
 */
export function fetchPrice(erc20: Address, listing: Listing): Price {
  const id = [erc20.toHex(), listing.id].join('/');

  const existing = Price.load(id);
  if (existing != null) return existing;

  const price = new Price(id);
  price.listing = listing.id;
  price.erc20 = erc20;
  price.value = BigInt.zero();
  price.save();
  return price;
}

/**
 * Return the review for the listing from an account or create it.
 * 
 * @param account Account that created the review
 * @param listing Listing that was reviewed
 */
export function fetchReview(account: Account, listing: Listing): Review {
  const id = [account.id.toHex(), listing.id].join('/');

  const existing = Review.load(id);
  if (existing != null) return existing;

  const review = new Review(id);
  review.account = account.id;
  review.listing = listing.id;
  review.rating = BigInt.zero();
  review.created = BigInt.zero();
  review.updated = BigInt.zero();
  review.uri = "";
  review.save();
  return review;
}

/**
 * Create a new purchase.
 * 
 * @param listing Listing that was purchased
 * @param event Event that created the purhcase
 * @param index Unique index for batch transfers
 */
export function createPurchase(listing: Listing, event: ethereum.Event, index: number = 0): Purchase {
  const id = [event.transaction.hash.toHex(), event.transactionLogIndex.toString(), index.toString()].join('/');
  const purchase = new Purchase(id);
  purchase.listing = listing.id;
  purchase.blockTime = event.block.timestamp;
  purchase.save();
  return purchase;
}

/**
 * Update the balance of an account for the given listing.
 * 
 * @param listing Listing balance to update
 * @param account Account balance to update
 * @param value Amount to add to the balance
 */
export function updateBalance(listing: Listing, account: Account, value: BigInt): Balance {
  const balance = fetchBalance(account, listing);
  balance.value = balance.value.plus(value);
  balance.save();
  return balance;
}