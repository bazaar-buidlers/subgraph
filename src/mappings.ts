import { Address, BigInt } from '@graphprotocol/graph-ts';
import { ListingMetadata, ReviewMetadata } from '../generated/templates';

import {
  createPurchase,
  fetchAccount,
  fetchListing,
  fetchPrice,
  fetchReview,
  updateBalance,
} from './entities';

import {
  Appraise,
  Configure,
  Review,
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
  listing.allow = event.params.allow;
  listing.royalty = event.params.royalty;
  listing.save();
}

export function handleTransferSingle(event: TransferSingle): void {
  const listing = fetchListing(event.params.id);
  const from = fetchAccount(event.params.from);
  const to = fetchAccount(event.params.to);
  const value = event.params.value;

  if (from.id != Address.zero()) {
    updateBalance(listing, from, value.neg());
  }
  if (to.id != Address.zero()) {
    updateBalance(listing, to, value);
  }
  if (from.id == Address.zero()) {
    createPurchase(listing, event);
  }
}

export function handleTransferBatch(event: TransferBatch): void {
  const from = fetchAccount(event.params.from);
  const to = fetchAccount(event.params.to);
  const ids = event.params.ids;
  const values = event.params.values;

  for (let i = 0; i < ids.length; i++) {
    const listing = fetchListing(ids[i]);
    const value = values[i];

    if (from.id != Address.zero()) {
      updateBalance(listing, from, value.neg());
    }
    if (to.id != Address.zero()) {
      updateBalance(listing, to, value);
    }
    if (from.id == Address.zero()) {
      createPurchase(listing, event, i);
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
  const uri = event.params.value;
  if (uri.startsWith('ipfs://')) {
    ListingMetadata.create(uri.substring(7));
  }

  const listing = fetchListing(event.params.id);
  listing.uri = uri;
  listing.metadata = uri;
  listing.save();
}

export function handleReview(event: Review): void {
  const uri = event.params.uri;
  if (uri.startsWith('ipfs://')) {
    ReviewMetadata.create(uri.substring(7));
  }

  const account = fetchAccount(event.params.sender);
  const listing = fetchListing(event.params.id);
  const review = fetchReview(account, listing);

  if (review.created == BigInt.zero()) {
    review.created = event.block.timestamp;
  } else {
    review.updated = event.block.timestamp;
  }

  review.metadata = event.params.uri;
  review.uri = event.params.uri;
  review.rating = event.params.rating;
  review.save();
}
