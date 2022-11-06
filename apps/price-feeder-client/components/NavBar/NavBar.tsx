import {
  Box,
  Container,
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function NavBar() {
  return (
    <Box as="section">
      <Box
        as="nav"
        bg="bg-surface"
        boxShadow={useColorModeValue('sm', 'sm-dark')}
      >
        <Container py={{ base: '3', lg: '4' }}>
          <Flex justify="space-between">
            <HStack spacing="4">
              <Text fontWeight="bold" fontSize="xl">
                Price Feeder 🍔
              </Text>
            </HStack>
            <HStack>
              <ConnectButton />
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
