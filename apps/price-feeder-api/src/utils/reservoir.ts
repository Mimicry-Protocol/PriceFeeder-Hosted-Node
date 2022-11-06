/**
 * @todo Refactor each method to use different basepaths based on a collection chain id
 */
const ethMainnetBasepath = 'https://api.reservoir.tools/';

/**
 * Get NFT Collection Floor Price
 * 
 * @param collectionAddress The contract address of an NFT collection
 * @param currencyAddress The contract address of the output currency
 * @param kind `spot` or `twap`
 * @param twapSeconds Smoothing time for the twap
 * @returns The current floor price of a collection
 */
// See https://docs.reservoir.tools/reference/getoraclecollectionsflooraskv4
export async function getCollectionFloorPrice(
        collectionAddress: string, 
        currencyAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC by default
        kind = 'spot',
        twapSeconds = '0',
        collectionChainId: '1'
    ): Promise<number> {
        const response = await fetch(ethMainnetBasepath
            + 'oracle/collections/floor-ask/v4/?'
            + new URLSearchParams({
                kind: kind,
                currency: currencyAddress,
                collection: collectionAddress,
                twapSeconds: twapSeconds
            }), {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'x-api-key': process.env.RESERVOIR_API_KEY
            }
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }
        
        const json = await response.json();
        console.log('Floor price: ' + json.price);
        return json.price;
}

/**
 * Get NFT Collection Metadata
 * 
 * @param collectionAddress The contract address of an NFT collection
 * @returns An object containing metadata
 */
// See https://docs.reservoir.tools/reference/getoraclecollectionsflooraskv4
export async function getCollectionMetadata(
    collectionAddress: string
): Promise<{
    name: string;
    slug: string;
    image: string;
    openseaVerificationStatus: string;
}> {
    const response = await fetch(ethMainnetBasepath
        + 'collections/v5?'
        + new URLSearchParams({
            contract: collectionAddress
        }), {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'x-api-key': process.env.RESERVOIR_API_KEY
        }
    });

    if (response.status !== 200) {
        throw new Error(response.statusText);
    }

    const json = await response.json();

    const returnData = {
        name: json.collections[0].name,
        slug: json.collections[0].slug,
        image: json.collections[0].image,
        openseaVerificationStatus: json.collections[0].openseaVerificationStatus,
    }

    console.log(returnData);
    return returnData;
}
