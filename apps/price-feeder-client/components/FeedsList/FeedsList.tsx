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
import { usePolling } from '../../hooks/usePolling';

type Feed = {
  id: string;
  chainId: number;
  collectionAddress: string;
  metric: string;
};

type Collection = {
  name: string;
  image: string;
  slug: string;
  verified: boolean;
};

async function getFeedsData() {
  const graphRequest: Promise<{
    data: {
      feeds: Array<Feed>;
    };
  }> = fetch('https://api.thegraph.com/subgraphs/name/dgca/price-feeder', {
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
  }).then((res) => res.json());

  const collectionsRequest: Promise<{
    collections: Array<{
      address: string;
      name: string;
      image: string;
      slug: string;
      openseaVerificationStatus: string;
    }>;
  }> = fetch(`${process.env.NEXT_PUBLIC_API_ORIGIN}/api/collections`).then(
    (res) => res.json()
  );

  const [graphResponse, collectionsResponse] = await Promise.all([
    graphRequest,
    collectionsRequest,
  ]);

  const collectionsEntries = collectionsResponse.collections.map<
    [string, Collection]
  >((item) => [
    item.address,
    {
      name: item.name,
      image: item.image,
      slug: item.slug,
      verified: item.openseaVerificationStatus === 'verified',
    },
  ]);

  const collectionsMap = Object.fromEntries(collectionsEntries);

  return graphResponse.data.feeds.map((item) => {
    const address = item.collectionAddress;
    const collectionObject =
      address in collectionsMap ? collectionsMap[address] : undefined;
    return {
      image: collectionObject?.image ?? '',
      name: collectionObject?.name ?? 'Unknown',
      metric: {
        0: 'TAMI',
        1: 'Market Cap',
        2: 'Floor Price',
      }[item.metric],
      address,
      url: `https://opensea.io/collection/${collectionObject?.slug}`,
    };
  });
}

export function FeedsList() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const feeds = usePolling(getFeedsData, 10000) ?? [];

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
                          src={feed.image}
                          alt=""
                          marginRight={2}
                        />
                        <Box>
                          <Text fontWeight="medium">{feed.name}</Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>
                      <Text color="muted">{feed.metric}</Text>
                    </Td>
                    <Td>
                      <Text color="muted">{feed.address}</Text>
                    </Td>
                    <Td>
                      <HStack spacing="1" justify="flex-end">
                        {feed.url && (
                          <Button as="a" target="_blank" href={feed.url}>
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
