// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "usingtellor/contracts/UsingTellor.sol";

import "hardhat/console.sol";

string constant DATA_SPEC_NAME = "MimicryCollectionStat";
uint256 constant TRB_REWARD = 0.005 ether;
uint256 constant REWARD_INCREASE_PER_SECOND = 0.0005 ether;
uint256 constant AUTOPAY_INTERVAL = 1 hours;
uint256 constant PRICE_VARIABILITY_THRESHOLD = 50; // 0.5%

struct Feed {
  uint256 chainId;
  address collectionAddress;
  uint256 metric;
  uint256 createdAt;
}

error FeedExists();
error FeedNotFound();
error MinimumTRBNotMet();

contract NFTPriceFeeder is UsingTellor {
  Feed[] public feeds;
  mapping(bytes32 => Feed) queryIdToFeedMap;

  constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) {}

  function createFeed(
    uint256 _chainId,
    address _collectionAddress,
    uint256 _metric,
    uint256 _amount
  ) external {
    if (_amount < 50) {
      revert MinimumTRBNotMet();
    }

    (bytes memory _queryData, bytes32 _queryId) = _buildQuery(
      _chainId,
      _collectionAddress,
      _metric
    );

    if (queryIdToFeedMap[_queryId].createdAt == 0) {
      revert FeedExists();
    }

    Feed memory _feed = Feed(
      _chainId,
      _collectionAddress,
      _metric,
      block.timestamp
    );

    queryIdToFeedMap[_queryId] = _feed;

    feeds.push(_feed);

    tellor.setupDataFeed(
      _queryId,
      TRB_REWARD,
      block.timestamp,
      AUTOPAY_INTERVAL,
      AUTOPAY_INTERVAL,
      PRICE_VARIABILITY_THRESHOLD,
      REWARD_INCREASE_PER_SECOND,
      _queryData,
      _amount
    );
  }

  function fundFeed(
    uint256 _chainId,
    address _collectionAddress,
    uint256 _metric,
    uint256 _amount
  ) external {
    (, bytes32 _queryId) = _buildQuery(_chainId, _collectionAddress, _metric);

    Feed memory _feed = queryIdToFeedMap[_queryId];

    if (_feed.createdAt == 0) {
      revert FeedNotFound();
    }

    bytes32 _feedId = keccak256(
      abi.encode(
        _queryId,
        TRB_REWARD,
        _feed.createdAt,
        AUTOPAY_INTERVAL,
        AUTOPAY_INTERVAL,
        PRICE_VARIABILITY_THRESHOLD,
        REWARD_INCREASE_PER_SECOND
      )
    );

    tellor.fundFeed(_feedId, _queryId, _amount);
  }

  function getSpotPrice(
    uint256 _chainId,
    address _collectionAddress,
    uint256 _metric
  ) external view returns (uint256) {
    (, bytes32 _queryId) = _buildQuery(_chainId, _collectionAddress, _metric);

    if (queryIdToFeedMap[_queryId].createdAt == 0) {
      revert FeedNotFound();
    }

    uint256 _timestamp;
    bytes memory _value;

    (_value, _timestamp) = getDataBefore(_queryId, block.timestamp - 1 hours);
    return abi.decode(_value, (uint256));
  }

  function getFeeds() external view returns (Feed[] memory) {
    return feeds;
  }

  function _buildQuery(
    uint256 _chainId,
    address _collectionAddress,
    uint256 _metric
  ) internal pure returns (bytes memory, bytes32) {
    bytes memory _queryData = abi.encode(
      DATA_SPEC_NAME,
      abi.encode(_chainId, _collectionAddress, _metric)
    );
    bytes32 _queryId = keccak256(_queryData);
    return (_queryData, _queryId);
  }
}
