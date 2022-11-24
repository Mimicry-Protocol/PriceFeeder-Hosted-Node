import delay from 'delay';

const basepath = 'https://api.dune.com/api/v1/';
const queryId = '1528412'; // https://dune.com/queries/1528412

/**
 * Get NFT Collection Sales
 *
 * @param address An NFT collection's smart contract address
 * @param limit The number of results to return
 * @param offset Where to start in the list of returned results
 * @param params The fields to return (see: https://dune.com/spellbook#!/model/model.spellbook.nft_trades)
 * @param sortDirection ASC or DESC
 * @returns An execution ID
 * @see https://dune.com/docs/api/api-reference/execute-query-id
 */
export async function getNFTCollectionSales(
  address: string,
  limit = 50000,
  offset = 0,
  params = 'block_time,nft_token_id,usd_amount',
  sortDirection = 'ASC'
): Promise<Record<string, unknown>[]> {
  const id = await query(address, limit, offset, params, sortDirection);
  let ready = false;
  do {
    const isReady = await isQueryReady(id);
    if (isReady === false) {
      await delay(3000);
    } else {
      ready = true;
    }
  } while (ready === false);

  return await getQueryResults(id);
}

/**
 * Query Dune for NFT Collection Sales History
 *
 * @param address An NFT collection's smart contract address
 * @param limit The number of results to return
 * @param offset Where to start in the list of returned results
 * @param params The fields to return (see: https://dune.com/spellbook#!/model/model.spellbook.nft_trades)
 * @param sortDirection ASC or DESC
 * @returns An execution ID
 * @see https://dune.com/docs/api/api-reference/execute-query-id
 * @todo Refactor this method so it accepts a queryId: number and params: object
 */
export async function query(
  address: string,
  limit = 50000,
  offset = 0,
  params = 'block_time,nft_token_id,usd_amount',
  sortDirection = 'ASC'
): Promise<string> {
  const body = {
    query_parameters: {
      contract_address: address,
      params: params,
      limit: limit,
      offset: offset,
      sort_direction: sortDirection,
    },
  };

  const response = await fetch(basepath + 'query/' + queryId + '/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-dune-api-key': process.env.DUNE_API_KEY,
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();
  console.log('Query Execution ID: ' + json.execution_id);
  return json.execution_id;
}

/**
 * Get Query Results from Dune
 *
 * @param executionId A query execution ID
 * @returns True if the query is ready to return a response
 * @see https://dune.com/docs/api/api-reference/execution-status/
 */
export async function isQueryReady(executionId: string): Promise<boolean> {
  const response = await fetch(
    basepath + 'execution/' + executionId + '/status',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-dune-api-key': process.env.DUNE_API_KEY,
      },
    }
  );

  const json = await response.json();
  console.log('Query State: ' + json.state);
  return json.state === 'QUERY_STATE_COMPLETED' ? true : false;
}

/**
 * Get Query Results from Dune
 *
 * @param executionId A query execution ID
 * @returns A list of results
 * @see https://dune.com/docs/api/api-reference/execution-results/
 */
export async function getQueryResults(
  executionId: string
): Promise<Record<string, unknown>[]> {
  const response = await fetch(
    basepath + 'execution/' + executionId + '/results',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-dune-api-key': process.env.DUNE_API_KEY,
      },
    }
  );

  const json = await response.json();
  return json.result.rows;
}
