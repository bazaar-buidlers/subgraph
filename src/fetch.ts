import { Address, Bytes, BigInt } from '@graphprotocol/graph-ts'
import { Account, Balance, Item, Price } from '../generated/schema';

export function fetchAccount(address: Address): Account {
  const existing = Account.load(address);
  if (existing != null) return existing;

  const account = new Account(address);
  account.save();

  return account;
}

export function fetchItem(id: BigInt): Item {
  const existing = Item.load(id.toHex());
  if (existing != null) return existing;

  const item = new Item(id.toHex());
  item.vendor = Address.zero();
  item.config = BigInt.zero();
  item.uri = "";
  item.save();

  return item;
}

export function fetchPrice(erc20: Address, item: Item): Price {
  const id = erc20.toHex().concat('/').concat(item.id);
  
  const existing = Price.load(id);
  if (existing != null) return existing;

  const price = new Price(id);
  price.erc20 = erc20;
  price.item = item.id;
  price.value = BigInt.zero();
  price.save();

  return price;
}

export function fetchBalance(account: Account, item: Item): Balance {
  const id = account.id.toHex().concat('/').concat(item.id);
  
  const existing = Balance.load(id);
  if (existing != null) return existing;

  const balance = new Balance(id);
  balance.account = account.id;
  balance.item = item.id;
  balance.value = BigInt.zero();
  balance.save();

  return balance;
}

