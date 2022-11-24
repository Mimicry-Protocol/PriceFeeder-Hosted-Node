import {
  Box,
  Button,
  Container,
  HStack,
  Image,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Icon,
} from '@chakra-ui/react';
import { BiLink } from 'react-icons/bi';
import { useCallback, useEffect, useState } from 'react';

let hasFetched = false;

function useFeedsData() {
  const [feeds, setFeeds] = useState<Array<any>>([]);
  const [collections, setCollections] = useState<Array<any>>([]);

  const doFetch = useCallback(async () => {
    const response = await fetch(
      'https://api.thegraph.com/subgraphs/name/dgca/price-feeder',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `{
          feeds(orderBy:createdAt) {
            id
            chainId
            collectionAddress
            metric
          }
        }`,
        }),
      }
    ).then((res) => res.json());
    setFeeds(response.data.feeds);

    const collectionsResponse = await fetch(
      'http://localhost:3000/api/collections'
    ).then((res) => res.json());

    console.log({ collectionsResponse });

    const collectionsMap = collectionsResponse.collections.reduce(
      (acc, collection) => {
        acc[collection.address] = {
          name: collection.name,
          image: collection.image,
          slug: collection.slug,
          verified: collection.openseaVerificationStatus === 'verified',
        };

        return acc;
      },
      {}
    );

    setCollections(collectionsMap);

    setTimeout(doFetch, 5000);
  }, []);

  useEffect(() => {
    if (hasFetched) return;

    hasFetched = true;
    doFetch();
  }, [doFetch]);

  return [feeds, collections];
}

export function FeedsList() {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [feeds, collectionsMap] = useFeedsData();

  console.log(feeds, collectionsMap);

  return (
    <Container py={{ base: '4', md: '8' }} px={{ base: '0', md: 8 }}>
      <Box
        bg="bg-surface"
        boxShadow={{ base: 'none', md: useColorModeValue('sm', 'sm-dark') }}
        borderRadius={useBreakpointValue({ base: 'none', md: 'lg' })}
      >
        <Stack spacing="5">
          <Box px={{ base: '4', md: '6' }} pt="5">
            <Stack
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
            >
              <Text fontSize="lg" fontWeight="medium">
                Price Feeds
              </Text>
            </Stack>
          </Box>
          <Box overflowX="auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Collection</Th>
                  <Th>Metric</Th>
                  <Th>Contract Address</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {feeds.length === 0 && (
                  <Tr>
                    <Td>
                      <HStack spacing="3">
                        <Box>
                          <Text fontWeight="medium">Loading...</Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>
                      <Text color="muted">...</Text>
                    </Td>
                    <Td>
                      <Text color="muted">0xYeEd1n0</Text>
                    </Td>
                    <Td></Td>
                  </Tr>
                )}
                {feeds.map((feed, i) => (
                  <Tr key={i}>
                    <Td>
                      <HStack spacing="2">
                        <Image
                          borderRadius="full"
                          boxSize="30px"
                          src={collectionsMap[feed.collectionAddress]?.image}
                          alt=""
                          marginRight={2}
                        />
                        <Box>
                          <Text fontWeight="medium">
                            {collectionsMap[feed.collectionAddress]?.name}
                          </Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>
                      <Text color="muted">
                        {
                          {
                            0: 'TAMI',
                            1: 'Market Cap',
                            2: 'Floor Price',
                          }[feed.metric]
                        }
                      </Text>
                    </Td>
                    <Td>
                      <Text color="muted">{feed.collectionAddress}</Text>
                    </Td>
                    <Td>
                      <HStack spacing="1" justify="flex-end">
                        {collectionsMap[feed.collectionAddress]?.slug && (
                          <Button
                            as="a"
                            target="_blank"
                            href={`https://opensea.io/collection/${
                              collectionsMap[feed.collectionAddress]?.slug
                            }`}
                          >
                            <Icon as={BiLink} />
                          </Button>
                        )}
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Box px={{ base: '4', md: '6' }} pb="5">
            <HStack spacing="3" justify="space-between">
              {!isMobile && (
                <Text color="muted" fontSize="sm">
                  Found {feeds.length} results
                </Text>
              )}
            </HStack>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
