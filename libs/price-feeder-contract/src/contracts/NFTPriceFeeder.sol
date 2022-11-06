// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "usingtellor/contracts/UsingTellor.sol";
import "usingtellor/contracts/TellorPlayground.sol";
import "usingtellor/contracts/interface/ITellor.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

string constant DATA_SPEC_NAME = "MimicryCollectionStat";

struct FeedQuery {
  uint256 chainId;
  address collectionAddress;
  uint256 metric;
}

error OnlyOwner();
error FeedQueryNotFound();
error MinimumTRBNotMet();
error InsufficientAllowance();

contract NFTPriceFeeder is UsingTellor {
  address owner;

  mapping(bytes32 => bool) existingQueryIdMap;
  FeedQuery[] public feedQueries;

  uint256 minCreateFeedTRBAmount = 1 ether;

  ITellor autopay;
  TellorPlayground playground;

  event FeedCreated(
    uint256 chainId,
    address collectionAddress,
    uint256 metric,
    uint256 amount,
    uint256 createdAt,
    address createdBy
  );
  event FeedFunded(
    bytes32 feedId,
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

  constructor(
    address payable _tellorAddress,
    address _autopayAddress,
    address _playgroundAddress
  ) UsingTellor(_tellorAddress) {
    owner = msg.sender;
    autopay = ITellor(_autopayAddress);
    playground = TellorPlayground(_playgroundAddress);
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
    uint256 _window,
    uint256 _priceVariabilityThreshold,
    uint256 _amount
  ) external {
    if (_amount < minCreateFeedTRBAmount) {
      revert MinimumTRBNotMet();
    }

    if (
      IERC20(autopay.token()).allowance(msg.sender, address(this)) < _amount
    ) {
      revert InsufficientAllowance();
    }

    IERC20(autopay.token()).transferFrom(msg.sender, address(this), _amount);
    IERC20(autopay.token()).approve(address(autopay), _amount);

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

    autopay.setupDataFeed(
      _queryId,
      _trbReward,
      block.timestamp,
      _autopayInterval,
      _window,
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
    if (
      IERC20(autopay.token()).allowance(msg.sender, address(this)) < _amount
    ) {
      revert InsufficientAllowance();
    }

    IERC20(autopay.token()).transferFrom(msg.sender, address(this), _amount);
    IERC20(autopay.token()).approve(address(autopay), _amount);

    (, bytes32 _queryId) = _buildQuery(_chainId, _collectionAddress, _metric);

    emit FeedFunded(
      _feedId,
      _chainId,
      _collectionAddress,
      _metric,
      _amount,
      block.timestamp,
      msg.sender
    );

    autopay.fundFeed(_feedId, _queryId, _amount);
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

    /// @notice This is using the playground to read values
    (, _value, _timestamp) = playground.getDataBefore(
      _queryId,
      block.timestamp - 1 hours
    );
    uint256 _decodedValue = abi.decode(_value, (uint256));

    return (_decodedValue, _timestamp);
  }

  function getFeedQueries() external view returns (FeedQuery[] memory) {
    return feedQueries;
  }

  function getFeedsForQuery(
    uint256 _chainId,
    address _collectionAddress,
    uint256 _metric
  ) public view returns (Autopay.FeedDetails[] memory) {
    (, bytes32 _queryId) = _buildQuery(_chainId, _collectionAddress, _metric);
    bytes32[] memory _feedIds = tellor.getCurrentFeeds(_queryId);
    uint256 _feedsCount = _feedIds.length;

    Autopay.FeedDetails[] memory _feedDetailsArray = new Autopay.FeedDetails[](
      _feedsCount
    );

    for (uint256 i = 0; i < _feedsCount; i++) {
      bytes32 _feedId = _feedIds[i];
      _feedDetailsArray[i] = tellor.getDataFeed(_feedId);
    }

    return _feedDetailsArray;
  }

  function getAllFeeds() external view returns (Autopay.FeedDetails[] memory) {
    uint256 _feedCount = _getCountOfFeeds();

    Autopay.FeedDetails[] memory _allFeeds = new Autopay.FeedDetails[](
      _feedCount
    );

    uint256 _allFeedsIndex = 0;

    for (uint256 i = 0; i < feedQueries.length; i++) {
      Autopay.FeedDetails[] memory _feedsForQuery = getFeedsForQuery(
        feedQueries[i].chainId,
        feedQueries[i].collectionAddress,
        feedQueries[i].metric
      );

      for (uint256 j = 0; j < _feedsForQuery.length; j++) {
        _allFeeds[_allFeedsIndex] = _feedsForQuery[j];
        _allFeedsIndex += 1;
      }
    }

    return _allFeeds;
  }

  function _getCountOfFeeds() internal view returns (uint256) {
    uint256 _feedCount = 0;

    for (uint256 i = 0; i < feedQueries.length; i++) {
      Autopay.FeedDetails[] memory _feeds = getFeedsForQuery(
        feedQueries[i].chainId,
        feedQueries[i].collectionAddress,
        feedQueries[i].metric
      );

      _feedCount += _feeds.length;
    }

    return _feedCount;
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

  function _mockWriteToPlayground(
    bytes32 _queryId,
    bytes calldata _value,
    uint256 _nonce,
    bytes memory _queryData
  ) external {
    playground.submitValue(_queryId, _value, _nonce, _queryData);
  }
}
