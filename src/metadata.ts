import { json, Bytes, dataSource } from '@graphprotocol/graph-ts';
import { ListingMetadata, ReviewMetadata } from '../generated/schema';

export function handleListing(data: Bytes): void {
  const value = json.fromBytes(data).toObject();
  if (!value) return;

  const name = value.get('name');
  const description = value.get('description');
  const image = value.get('image');
  const status = value.get('status');
  const platform = value.get('platform');
  const content = value.get('content');
  const media = value.get('media');
  const keywords = value.get('keywords');
  const allow = value.get('allow');

  const metadata = new ListingMetadata('ipfs://' + dataSource.stringParam());
  metadata.name = name ? name.toString() : '';
  metadata.description = description ? description.toString() : '';
  metadata.image = image ? image.toString() : '';
  metadata.status = status ? status.toString() : '';
  metadata.platform = platform ? platform.toString() : '';
  metadata.content = content ? content.toString() : '';
  metadata.media = media ? media.toArray().map<string>(value => value.toString()) : [];
  metadata.keywords = keywords ? keywords.toArray().map<string>(value => value.toString()) : [];
  metadata.allow = allow ? allow.toArray().map<string>(value => value.toString()) : [];
  metadata.save();
}

export function handleReview(data: Bytes): void {
  const value = json.fromBytes(data).toObject();
  if (!value) return;

  const comment = value.get('comment');

  const metadata = new ReviewMetadata('ipfs://' + dataSource.stringParam());
  metadata.comment = comment ? comment.toString() : '';
  metadata.save();
}