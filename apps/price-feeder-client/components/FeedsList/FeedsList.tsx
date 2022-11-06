import {
  Box,
  Button,
  ButtonGroup,
  Container,
  HStack,
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
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';

let hasFetched = false;

function useFeeds() {
  const [feeds, setFeeds] = useState<Array<any>>([]);

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
          feeds {
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

    setTimeout(doFetch, 5000);
  }, []);

  useEffect(() => {
    if (hasFetched) return;

    hasFetched = true;
    doFetch();
  }, [doFetch]);

  return feeds;
}

export function FeedsList() {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const feeds = useFeeds();

  console.log(feeds[0]);

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
                    <Td>
                      <HStack spacing="1" justify="flex-end">
                        <Button>Sponsor</Button>
                      </HStack>
                    </Td>
                  </Tr>
                )}
                {feeds.map((feed, i) => (
                  <Tr key={i}>
                    <Td>
                      <HStack spacing="3">
                        <Box>
                          <Text fontWeight="medium">
                            {feed.collectionAddress}
                          </Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>
                      <Text color="muted">
                        {feed.metric === '0' ? 'TAMI' : 'Market Cap'}
                      </Text>
                    </Td>
                    <Td>
                      <Text color="muted">{feed.collectionAddress}</Text>
                    </Td>
                    <Td>
                      <HStack spacing="1" justify="flex-end">
                        <Button>Sponsor</Button>
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
