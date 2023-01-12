import { Address, BigInt } from '@graphprotocol/graph-ts'
import { Appraise, TransferBatch, TransferSingle } from '../generated/Bazaar/Bazaar';

import {
  fetchAccount,
  fetchBalance,
  fetchItem,
  fetchPrice,
} from './fetch';

export function handleAppraise(event: Appraise): void {
  const item = fetchItem(event.params.id);
  const price = fetchPrice(event.params.erc20, item);
  
  price.value = event.params.price;
  price.save();
}

export function handleTransferSingle(event: TransferSingle): void {
  updateBalance(event.params.from, event.params.to, event.params.id, event.params.value);
}

export function handleTransferBatch(event: TransferBatch): void {
  for (let i = 0; i < event.params.ids.length; i++) {
    updateBalance(event.params.from, event.params.to, event.params.ids[i], event.params.values[i]);
  }
}

function updateBalance(from: Address, to: Address, id: BigInt, value: BigInt): void {
  const item = fetchItem(id);

  const fromAccount = fetchAccount(from);
  const fromBalance = fetchBalance(fromAccount, item);

  const toAccount = fetchAccount(to);
  const toBalance = fetchBalance(toAccount, item);

  fromBalance.value.minus(value);
  fromBalance.save();

  toBalance.value.plus(value);
  toBalance.save();
}