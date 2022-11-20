// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class FeedCreated extends ethereum.Event {
  get params(): FeedCreated__Params {
    return new FeedCreated__Params(this);
  }
}

export class FeedCreated__Params {
  _event: FeedCreated;

  constructor(event: FeedCreated) {
    this._event = event;
  }

  get feedId(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get chainId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get collectionAddress(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get metric(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get createdAt(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get createdBy(): Address {
    return this._event.parameters[6].value.toAddress();
  }
}

export class FeedFunded extends ethereum.Event {
  get params(): FeedFunded__Params {
    return new FeedFunded__Params(this);
  }
}

export class FeedFunded__Params {
  _event: FeedFunded;

  constructor(event: FeedFunded) {
    this._event = event;
  }

  get feedId(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get chainId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get collectionAddress(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get metric(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get fundedAt(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get fundedBy(): Address {
    return this._event.parameters[6].value.toAddress();
  }
}

export class NFTPriceFeeder__feedQueriesResult {
  value0: BigInt;
  value1: Address;
  value2: BigInt;

  constructor(value0: BigInt, value1: Address, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }

  getChainId(): BigInt {
    return this.value0;
  }

  getCollectionAddress(): Address {
    return this.value1;
  }

  getMetric(): BigInt {
    return this.value2;
  }
}

export class NFTPriceFeeder__getAllFeedsResultValue0Struct extends ethereum.Tuple {
  get reward(): BigInt {
    return this[0].toBigInt();
  }

  get balance(): BigInt {
    return this[1].toBigInt();
  }

  get startTime(): BigInt {
    return this[2].toBigInt();
  }

  get interval(): BigInt {
    return this[3].toBigInt();
  }

  get window(): BigInt {
    return this[4].toBigInt();
  }

  get priceThreshold(): BigInt {
    return this[5].toBigInt();
  }

  get rewardIncreasePerSecond(): BigInt {
    return this[6].toBigInt();
  }

  get feedsWithFundingIndex(): BigInt {
    return this[7].toBigInt();
  }
}

export class NFTPriceFeeder__getDataAfterResult {
  value0: Bytes;
  value1: BigInt;

  constructor(value0: Bytes, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromBytes(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }

  get_value(): Bytes {
    return this.value0;
  }

  get_timestampRetrieved(): BigInt {
    return this.value1;
  }
}

export class NFTPriceFeeder__getDataBeforeResult {
  value0: Bytes;
  value1: BigInt;

  constructor(value0: Bytes, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromBytes(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }

  get_value(): Bytes {
    return this.value0;
  }

  get_timestampRetrieved(): BigInt {
    return this.value1;
  }
}

export class NFTPriceFeeder__getFeedQueriesResultValue0Struct extends ethereum.Tuple {
  get chainId(): BigInt {
    return this[0].toBigInt();
  }

  get collectionAddress(): Address {
    return this[1].toAddress();
  }

  get metric(): BigInt {
    return this[2].toBigInt();
  }
}

export class NFTPriceFeeder__getFeedsForQueryResultValue0Struct extends ethereum.Tuple {
  get reward(): BigInt {
    return this[0].toBigInt();
  }

  get balance(): BigInt {
    return this[1].toBigInt();
  }

  get startTime(): BigInt {
    return this[2].toBigInt();
  }

  get interval(): BigInt {
    return this[3].toBigInt();
  }

  get window(): BigInt {
    return this[4].toBigInt();
  }

  get priceThreshold(): BigInt {
    return this[5].toBigInt();
  }

  get rewardIncreasePerSecond(): BigInt {
    return this[6].toBigInt();
  }

  get feedsWithFundingIndex(): BigInt {
    return this[7].toBigInt();
  }
}

export class NFTPriceFeeder__getIndexForDataAfterResult {
  value0: boolean;
  value1: BigInt;

  constructor(value0: boolean, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromBoolean(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }

  get_found(): boolean {
    return this.value0;
  }

  get_index(): BigInt {
    return this.value1;
  }
}

export class NFTPriceFeeder__getIndexForDataBeforeResult {
  value0: boolean;
  value1: BigInt;

  constructor(value0: boolean, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromBoolean(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }

  get_found(): boolean {
    return this.value0;
  }

  get_index(): BigInt {
    return this.value1;
  }
}

export class NFTPriceFeeder__getMultipleValuesBeforeResult {
  value0: Array<Bytes>;
  value1: Array<BigInt>;

  constructor(value0: Array<Bytes>, value1: Array<BigInt>) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromBytesArray(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigIntArray(this.value1));
    return map;
  }

  get_values(): Array<Bytes> {
    return this.value0;
  }

  get_timestamps(): Array<BigInt> {
    return this.value1;
  }
}

export class NFTPriceFeeder__getSpotPriceResult {
  value0: BigInt;
  value1: BigInt;

  constructor(value0: BigInt, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }

  getValue0(): BigInt {
    return this.value0;
  }

  getValue1(): BigInt {
    return this.value1;
  }
}

export class NFTPriceFeeder__valueForResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromSignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }

  get_value(): BigInt {
    return this.value0;
  }

  get_timestamp(): BigInt {
    return this.value1;
  }

  get_statusCode(): BigInt {
    return this.value2;
  }
}

export class NFTPriceFeeder extends ethereum.SmartContract {
  static bind(address: Address): NFTPriceFeeder {
    return new NFTPriceFeeder("NFTPriceFeeder", address);
  }

  feedQueries(param0: BigInt): NFTPriceFeeder__feedQueriesResult {
    let result = super.call(
      "feedQueries",
      "feedQueries(uint256):(uint256,address,uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new NFTPriceFeeder__feedQueriesResult(
      result[0].toBigInt(),
      result[1].toAddress(),
      result[2].toBigInt()
    );
  }

  try_feedQueries(
    param0: BigInt
  ): ethereum.CallResult<NFTPriceFeeder__feedQueriesResult> {
    let result = super.tryCall(
      "feedQueries",
      "feedQueries(uint256):(uint256,address,uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new NFTPriceFeeder__feedQueriesResult(
        value[0].toBigInt(),
        value[1].toAddress(),
        value[2].toBigInt()
      )
    );
  }

  getAllFeeds(): Array<NFTPriceFeeder__getAllFeedsResultValue0Struct> {
    let result = super.call(
      "getAllFeeds",
      "getAllFeeds():((uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)[])",
      []
    );

    return result[0].toTupleArray<
      NFTPriceFeeder__getAllFeedsResultValue0Struct
    >();
  }

  try_getAllFeeds(): ethereum.CallResult<
    Array<NFTPriceFeeder__getAllFeedsResultValue0Struct>
  > {
    let result = super.tryCall(
      "getAllFeeds",
      "getAllFeeds():((uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)[])",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTupleArray<NFTPriceFeeder__getAllFeedsResultValue0Struct>()
    );
  }

  getDataAfter(
    _queryId: Bytes,
    _timestamp: BigInt
  ): NFTPriceFeeder__getDataAfterResult {
    let result = super.call(
      "getDataAfter",
      "getDataAfter(bytes32,uint256):(bytes,uint256)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp)
      ]
    );

    return new NFTPriceFeeder__getDataAfterResult(
      result[0].toBytes(),
      result[1].toBigInt()
    );
  }

  try_getDataAfter(
    _queryId: Bytes,
    _timestamp: BigInt
  ): ethereum.CallResult<NFTPriceFeeder__getDataAfterResult> {
    let result = super.tryCall(
      "getDataAfter",
      "getDataAfter(bytes32,uint256):(bytes,uint256)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new NFTPriceFeeder__getDataAfterResult(
        value[0].toBytes(),
        value[1].toBigInt()
      )
    );
  }

  getDataBefore(
    _queryId: Bytes,
    _timestamp: BigInt
  ): NFTPriceFeeder__getDataBeforeResult {
    let result = super.call(
      "getDataBefore",
      "getDataBefore(bytes32,uint256):(bytes,uint256)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp)
      ]
    );

    return new NFTPriceFeeder__getDataBeforeResult(
      result[0].toBytes(),
      result[1].toBigInt()
    );
  }

  try_getDataBefore(
    _queryId: Bytes,
    _timestamp: BigInt
  ): ethereum.CallResult<NFTPriceFeeder__getDataBeforeResult> {
    let result = super.tryCall(
      "getDataBefore",
      "getDataBefore(bytes32,uint256):(bytes,uint256)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new NFTPriceFeeder__getDataBeforeResult(
        value[0].toBytes(),
        value[1].toBigInt()
      )
    );
  }

  getFeedQueries(): Array<NFTPriceFeeder__getFeedQueriesResultValue0Struct> {
    let result = super.call(
      "getFeedQueries",
      "getFeedQueries():((uint256,address,uint256)[])",
      []
    );

    return result[0].toTupleArray<
      NFTPriceFeeder__getFeedQueriesResultValue0Struct
    >();
  }

  try_getFeedQueries(): ethereum.CallResult<
    Array<NFTPriceFeeder__getFeedQueriesResultValue0Struct>
  > {
    let result = super.tryCall(
      "getFeedQueries",
      "getFeedQueries():((uint256,address,uint256)[])",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTupleArray<NFTPriceFeeder__getFeedQueriesResultValue0Struct>()
    );
  }

  getFeedsForQuery(
    _chainId: BigInt,
    _collectionAddress: Address,
    _metric: BigInt
  ): Array<NFTPriceFeeder__getFeedsForQueryResultValue0Struct> {
    let result = super.call(
      "getFeedsForQuery",
      "getFeedsForQuery(uint256,address,uint256):((uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)[])",
      [
        ethereum.Value.fromUnsignedBigInt(_chainId),
        ethereum.Value.fromAddress(_collectionAddress),
        ethereum.Value.fromUnsignedBigInt(_metric)
      ]
    );

    return result[0].toTupleArray<
      NFTPriceFeeder__getFeedsForQueryResultValue0Struct
    >();
  }

  try_getFeedsForQuery(
    _chainId: BigInt,
    _collectionAddress: Address,
    _metric: BigInt
  ): ethereum.CallResult<
    Array<NFTPriceFeeder__getFeedsForQueryResultValue0Struct>
  > {
    let result = super.tryCall(
      "getFeedsForQuery",
      "getFeedsForQuery(uint256,address,uint256):((uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)[])",
      [
        ethereum.Value.fromUnsignedBigInt(_chainId),
        ethereum.Value.fromAddress(_collectionAddress),
        ethereum.Value.fromUnsignedBigInt(_metric)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTupleArray<
        NFTPriceFeeder__getFeedsForQueryResultValue0Struct
      >()
    );
  }

  getIndexForDataAfter(
    _queryId: Bytes,
    _timestamp: BigInt
  ): NFTPriceFeeder__getIndexForDataAfterResult {
    let result = super.call(
      "getIndexForDataAfter",
      "getIndexForDataAfter(bytes32,uint256):(bool,uint256)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp)
      ]
    );

    return new NFTPriceFeeder__getIndexForDataAfterResult(
      result[0].toBoolean(),
      result[1].toBigInt()
    );
  }

  try_getIndexForDataAfter(
    _queryId: Bytes,
    _timestamp: BigInt
  ): ethereum.CallResult<NFTPriceFeeder__getIndexForDataAfterResult> {
    let result = super.tryCall(
      "getIndexForDataAfter",
      "getIndexForDataAfter(bytes32,uint256):(bool,uint256)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new NFTPriceFeeder__getIndexForDataAfterResult(
        value[0].toBoolean(),
        value[1].toBigInt()
      )
    );
  }

  getIndexForDataBefore(
    _queryId: Bytes,
    _timestamp: BigInt
  ): NFTPriceFeeder__getIndexForDataBeforeResult {
    let result = super.call(
      "getIndexForDataBefore",
      "getIndexForDataBefore(bytes32,uint256):(bool,uint256)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp)
      ]
    );

    return new NFTPriceFeeder__getIndexForDataBeforeResult(
      result[0].toBoolean(),
      result[1].toBigInt()
    );
  }

  try_getIndexForDataBefore(
    _queryId: Bytes,
    _timestamp: BigInt
  ): ethereum.CallResult<NFTPriceFeeder__getIndexForDataBeforeResult> {
    let result = super.tryCall(
      "getIndexForDataBefore",
      "getIndexForDataBefore(bytes32,uint256):(bool,uint256)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new NFTPriceFeeder__getIndexForDataBeforeResult(
        value[0].toBoolean(),
        value[1].toBigInt()
      )
    );
  }

  getMultipleValuesBefore(
    _queryId: Bytes,
    _timestamp: BigInt,
    _maxAge: BigInt,
    _maxCount: BigInt
  ): NFTPriceFeeder__getMultipleValuesBeforeResult {
    let result = super.call(
      "getMultipleValuesBefore",
      "getMultipleValuesBefore(bytes32,uint256,uint256,uint256):(bytes[],uint256[])",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp),
        ethereum.Value.fromUnsignedBigInt(_maxAge),
        ethereum.Value.fromUnsignedBigInt(_maxCount)
      ]
    );

    return new NFTPriceFeeder__getMultipleValuesBeforeResult(
      result[0].toBytesArray(),
      result[1].toBigIntArray()
    );
  }

  try_getMultipleValuesBefore(
    _queryId: Bytes,
    _timestamp: BigInt,
    _maxAge: BigInt,
    _maxCount: BigInt
  ): ethereum.CallResult<NFTPriceFeeder__getMultipleValuesBeforeResult> {
    let result = super.tryCall(
      "getMultipleValuesBefore",
      "getMultipleValuesBefore(bytes32,uint256,uint256,uint256):(bytes[],uint256[])",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp),
        ethereum.Value.fromUnsignedBigInt(_maxAge),
        ethereum.Value.fromUnsignedBigInt(_maxCount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new NFTPriceFeeder__getMultipleValuesBeforeResult(
        value[0].toBytesArray(),
        value[1].toBigIntArray()
      )
    );
  }

  getNewValueCountbyQueryId(_queryId: Bytes): BigInt {
    let result = super.call(
      "getNewValueCountbyQueryId",
      "getNewValueCountbyQueryId(bytes32):(uint256)",
      [ethereum.Value.fromFixedBytes(_queryId)]
    );

    return result[0].toBigInt();
  }

  try_getNewValueCountbyQueryId(_queryId: Bytes): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getNewValueCountbyQueryId",
      "getNewValueCountbyQueryId(bytes32):(uint256)",
      [ethereum.Value.fromFixedBytes(_queryId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getReporterByTimestamp(_queryId: Bytes, _timestamp: BigInt): Address {
    let result = super.call(
      "getReporterByTimestamp",
      "getReporterByTimestamp(bytes32,uint256):(address)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp)
      ]
    );

    return result[0].toAddress();
  }

  try_getReporterByTimestamp(
    _queryId: Bytes,
    _timestamp: BigInt
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getReporterByTimestamp",
      "getReporterByTimestamp(bytes32,uint256):(address)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getSpotPrice(
    _chainId: BigInt,
    _collectionAddress: Address,
    _metric: BigInt
  ): NFTPriceFeeder__getSpotPriceResult {
    let result = super.call(
      "getSpotPrice",
      "getSpotPrice(uint256,address,uint256):(uint256,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_chainId),
        ethereum.Value.fromAddress(_collectionAddress),
        ethereum.Value.fromUnsignedBigInt(_metric)
      ]
    );

    return new NFTPriceFeeder__getSpotPriceResult(
      result[0].toBigInt(),
      result[1].toBigInt()
    );
  }

  try_getSpotPrice(
    _chainId: BigInt,
    _collectionAddress: Address,
    _metric: BigInt
  ): ethereum.CallResult<NFTPriceFeeder__getSpotPriceResult> {
    let result = super.tryCall(
      "getSpotPrice",
      "getSpotPrice(uint256,address,uint256):(uint256,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_chainId),
        ethereum.Value.fromAddress(_collectionAddress),
        ethereum.Value.fromUnsignedBigInt(_metric)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new NFTPriceFeeder__getSpotPriceResult(
        value[0].toBigInt(),
        value[1].toBigInt()
      )
    );
  }

  getTimestampbyQueryIdandIndex(_queryId: Bytes, _index: BigInt): BigInt {
    let result = super.call(
      "getTimestampbyQueryIdandIndex",
      "getTimestampbyQueryIdandIndex(bytes32,uint256):(uint256)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_index)
      ]
    );

    return result[0].toBigInt();
  }

  try_getTimestampbyQueryIdandIndex(
    _queryId: Bytes,
    _index: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTimestampbyQueryIdandIndex",
      "getTimestampbyQueryIdandIndex(bytes32,uint256):(uint256)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_index)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  idMappingContract(): Address {
    let result = super.call(
      "idMappingContract",
      "idMappingContract():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_idMappingContract(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "idMappingContract",
      "idMappingContract():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  isInDispute(_queryId: Bytes, _timestamp: BigInt): boolean {
    let result = super.call(
      "isInDispute",
      "isInDispute(bytes32,uint256):(bool)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp)
      ]
    );

    return result[0].toBoolean();
  }

  try_isInDispute(
    _queryId: Bytes,
    _timestamp: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isInDispute",
      "isInDispute(bytes32,uint256):(bool)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  retrieveData(_queryId: Bytes, _timestamp: BigInt): Bytes {
    let result = super.call(
      "retrieveData",
      "retrieveData(bytes32,uint256):(bytes)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp)
      ]
    );

    return result[0].toBytes();
  }

  try_retrieveData(
    _queryId: Bytes,
    _timestamp: BigInt
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "retrieveData",
      "retrieveData(bytes32,uint256):(bytes)",
      [
        ethereum.Value.fromFixedBytes(_queryId),
        ethereum.Value.fromUnsignedBigInt(_timestamp)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  tellor(): Address {
    let result = super.call("tellor", "tellor():(address)", []);

    return result[0].toAddress();
  }

  try_tellor(): ethereum.CallResult<Address> {
    let result = super.tryCall("tellor", "tellor():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  valueFor(_id: Bytes): NFTPriceFeeder__valueForResult {
    let result = super.call(
      "valueFor",
      "valueFor(bytes32):(int256,uint256,uint256)",
      [ethereum.Value.fromFixedBytes(_id)]
    );

    return new NFTPriceFeeder__valueForResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt()
    );
  }

  try_valueFor(
    _id: Bytes
  ): ethereum.CallResult<NFTPriceFeeder__valueForResult> {
    let result = super.tryCall(
      "valueFor",
      "valueFor(bytes32):(int256,uint256,uint256)",
      [ethereum.Value.fromFixedBytes(_id)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new NFTPriceFeeder__valueForResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt()
      )
    );
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _tellorAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _autopayAddress(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _playgroundAddress(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class _mockWriteToPlaygroundCall extends ethereum.Call {
  get inputs(): _mockWriteToPlaygroundCall__Inputs {
    return new _mockWriteToPlaygroundCall__Inputs(this);
  }

  get outputs(): _mockWriteToPlaygroundCall__Outputs {
    return new _mockWriteToPlaygroundCall__Outputs(this);
  }
}

export class _mockWriteToPlaygroundCall__Inputs {
  _call: _mockWriteToPlaygroundCall;

  constructor(call: _mockWriteToPlaygroundCall) {
    this._call = call;
  }

  get _queryId(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get _value(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get _nonce(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _queryData(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class _mockWriteToPlaygroundCall__Outputs {
  _call: _mockWriteToPlaygroundCall;

  constructor(call: _mockWriteToPlaygroundCall) {
    this._call = call;
  }
}

export class CreateFeedCall extends ethereum.Call {
  get inputs(): CreateFeedCall__Inputs {
    return new CreateFeedCall__Inputs(this);
  }

  get outputs(): CreateFeedCall__Outputs {
    return new CreateFeedCall__Outputs(this);
  }
}

export class CreateFeedCall__Inputs {
  _call: CreateFeedCall;

  constructor(call: CreateFeedCall) {
    this._call = call;
  }

  get _chainId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _collectionAddress(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _metric(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _trbReward(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _rewardIncreasePerSecond(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get _autopayInterval(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get _window(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }

  get _priceVariabilityThreshold(): BigInt {
    return this._call.inputValues[7].value.toBigInt();
  }

  get _amount(): BigInt {
    return this._call.inputValues[8].value.toBigInt();
  }
}

export class CreateFeedCall__Outputs {
  _call: CreateFeedCall;

  constructor(call: CreateFeedCall) {
    this._call = call;
  }
}

export class FundFeedCall extends ethereum.Call {
  get inputs(): FundFeedCall__Inputs {
    return new FundFeedCall__Inputs(this);
  }

  get outputs(): FundFeedCall__Outputs {
    return new FundFeedCall__Outputs(this);
  }
}

export class FundFeedCall__Inputs {
  _call: FundFeedCall;

  constructor(call: FundFeedCall) {
    this._call = call;
  }

  get _chainId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _collectionAddress(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _metric(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _feedId(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }

  get _amount(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }
}

export class FundFeedCall__Outputs {
  _call: FundFeedCall;

  constructor(call: FundFeedCall) {
    this._call = call;
  }
}

export class SetIdMappingContractCall extends ethereum.Call {
  get inputs(): SetIdMappingContractCall__Inputs {
    return new SetIdMappingContractCall__Inputs(this);
  }

  get outputs(): SetIdMappingContractCall__Outputs {
    return new SetIdMappingContractCall__Outputs(this);
  }
}

export class SetIdMappingContractCall__Inputs {
  _call: SetIdMappingContractCall;

  constructor(call: SetIdMappingContractCall) {
    this._call = call;
  }

  get _addy(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetIdMappingContractCall__Outputs {
  _call: SetIdMappingContractCall;

  constructor(call: SetIdMappingContractCall) {
    this._call = call;
  }
}

export class SetMinCreateFeedTRBAmountCall extends ethereum.Call {
  get inputs(): SetMinCreateFeedTRBAmountCall__Inputs {
    return new SetMinCreateFeedTRBAmountCall__Inputs(this);
  }

  get outputs(): SetMinCreateFeedTRBAmountCall__Outputs {
    return new SetMinCreateFeedTRBAmountCall__Outputs(this);
  }
}

export class SetMinCreateFeedTRBAmountCall__Inputs {
  _call: SetMinCreateFeedTRBAmountCall;

  constructor(call: SetMinCreateFeedTRBAmountCall) {
    this._call = call;
  }

  get _amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetMinCreateFeedTRBAmountCall__Outputs {
  _call: SetMinCreateFeedTRBAmountCall;

  constructor(call: SetMinCreateFeedTRBAmountCall) {
    this._call = call;
  }
}