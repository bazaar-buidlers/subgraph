import { Config, URI, Vendor } from '../generated/Catalog/Catalog';
import { fetchItem, fetchAccount } from './fetch';

export function handleConfig(event: Config): void {
  const item = fetchItem(event.params.id);
  item.config = event.params.config;
  item.save();
}

export function handleURI(event: URI): void {
  const item = fetchItem(event.params.id);
  item.uri = event.params.uri;
  item.save();
}

export function handleVendor(event: Vendor): void {
  const account = fetchAccount(event.params.vendor)
  const item = fetchItem(event.params.id);
  item.vendor = account.id;
  item.save();
}
