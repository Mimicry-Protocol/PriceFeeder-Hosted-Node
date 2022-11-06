import {
  FeedCreated,
  FeedFunded,
} from '../generated/NFTPriceFeeder/NFTPriceFeeder';
import { Feed, FundingEvent, FundingEventCounter } from '../generated/schema';

export function handleFeedCreated(event: FeedCreated): void {
  let feed = Feed.load(event.params.feedId.toString());

  if (!feed) {
    feed = new Feed(event.params.feedId.toString());
    feed.chainId = event.params.chainId.toI32();
    feed.collectionAddress = event.params.collectionAddress;
    feed.metric = event.params.metric.toString();
    feed.createdAt = event.params.createdAt;
    feed.createdBy = event.params.createdBy;
  }

  feed.save();
}

export function handleFeedFunded(event: FeedFunded): void {
  let counter = FundingEventCounter.load('COUNTER');
  if (!counter) {
    counter = new FundingEventCounter('COUNTER');
    counter.count = 0;
  }

  const fundingEvent = new FundingEvent(counter.count.toString());
  counter.count += 1;
  counter.save();

  fundingEvent.chainId = event.params.chainId.toI32();
  fundingEvent.collectionAddress = event.params.collectionAddress;
  fundingEvent.metric = event.params.metric.toString();
  fundingEvent.amount = event.params.amount;
  fundingEvent.fundedAt = event.params.fundedAt;
  fundingEvent.fundedBy = event.params.fundedBy;
  fundingEvent.feed = event.params.feedId.toString();

  fundingEvent.save();
}
