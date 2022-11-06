// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "usingtellor/contracts/UsingTellor.sol";
import "usingtellor/contracts/interface/ITellor.sol";

import "hardhat/console.sol";

string constant DATA_SPEC_NAME = "MimicryCollectionStat";

struct FeedQuery {
  uint256 chainId;
  address collectionAddress;
  uint256 metric;
}

error OnlyOwner();
error FeedQueryNotFound();
error MinimumTRBNotMet();

contract NFTPriceFeeder is UsingTellor {
  address owner;

  mapping(bytes32 => bool) existingQueryIdMap;
  FeedQuery[] public feedQueries;

  uint256 minCreateFeedTRBAmount = 1 ether;

  event FeedCreated(
    uint256 chainId,
    address collectionAddress,
    uint256 metric,
    uint256 amount,
    uint256 createdAt,
    address createdBy
  );
  event FeedFunded(
    uint256 chainId,
    address collectionAddress,
    uint256 metric,
    uint256 amount,
    uint256 fundedAt,
    address fundedBy
  );

  modifier onlyOwner() {
    if (msg.sender != owner) {
      revert OnlyOwner();
    }
    _;
  }

  constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) {
    owner = msg.sender;
  }

  function setMinCreateFeedTRBAmount(uint256 _amount) external onlyOwner {
    minCreateFeedTRBAmount = _amount;
  }

  function createFeed(
    uint256 _chainId,
    address _collectionAddress,
    uint256 _metric,
    uint256 _trbReward,
    uint256 _rewardIncreasePerSecond,
    uint256 _autopayInterval,
    uint256 _priceVariabilityThreshold,
    uint256 _amount
  ) external {
    if (_amount < minCreateFeedTRBAmount) {
      revert MinimumTRBNotMet();
    }

    (bytes memory _queryData, bytes32 _queryId) = _buildQuery(
      _chainId,
      _collectionAddress,
      _metric
    );

    // If we don't have an entry for this query in the mapping, add it
    if (existingQueryIdMap[_queryId] == false) {
      existingQueryIdMap[_queryId] = true;

      FeedQuery memory _feedQuery = FeedQuery(
        _chainId,
        _collectionAddress,
        _metric
      );

      feedQueries.push(_feedQuery);
    }

    tellor.setupDataFeed(
      _queryId,
      _trbReward,
      block.timestamp,
      _autopayInterval,
      _autopayInterval,
      _priceVariabilityThreshold,
      _rewardIncreasePerSecond,
      _queryData,
      _amount
    );

    emit FeedCreated(
      _chainId,
      _collectionAddress,
      _metric,
      _amount,
      block.timestamp,
      msg.sender
    );
  }

  function fundFeed(
    uint256 _chainId,
    address _collectionAddress,
    uint256 _metric,
    bytes32 _feedId,
    uint256 _amount
  ) external {
    (, bytes32 _queryId) = _buildQuery(_chainId, _collectionAddress, _metric);

    emit FeedFunded(
      _chainId,
      _collectionAddress,
      _metric,
      _amount,
      block.timestamp,
      msg.sender
    );

    tellor.fundFeed(_feedId, _queryId, _amount);
  }

  function getSpotPrice(
    uint256 _chainId,
    address _collectionAddress,
    uint256 _metric
  ) external view returns (uint256, uint256) {
    (, bytes32 _queryId) = _buildQuery(_chainId, _collectionAddress, _metric);

    if (existingQueryIdMap[_queryId] == false) {
      revert FeedQueryNotFound();
    }

    uint256 _timestamp;
    bytes memory _value;

    (_value, _timestamp) = getDataBefore(_queryId, block.timestamp - 1 hours);
    uint256 _decodedValue = abi.decode(_value, (uint256));

    return (_decodedValue, _timestamp);
  }

  function getSpotPriceDetails(
    uint256 _chainId,
    address _collectionAddress,
    uint256 _metric
  ) external {}

  function getFeedQueries() external view returns (FeedQuery[] memory) {
    return feedQueries;
  }

  function getFeedsForQuery(
    uint256 _chainId,
    address _collectionAddress,
    uint256 _metric
  ) external view returns (Autopay.FeedDetails[] memory) {
    (, bytes32 _queryId) = _buildQuery(_chainId, _collectionAddress, _metric);
    bytes32[] memory _feedIds = tellor.getCurrentFeeds(_queryId);
    uint256 _feedsCount = _feedIds.length;

    Autopay.FeedDetails[] memory _feedDetailsArray;

    for (uint256 i = 0; i < _feedsCount; i++) {
      bytes32 _feedId = _feedIds[i];
      _feedDetailsArray[i] = tellor.getDataFeed(_feedId);
    }

    return _feedDetailsArray;
  }

  function getAllFeeds() external returns (Autopay.FeedDetails[] memory) {}

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
