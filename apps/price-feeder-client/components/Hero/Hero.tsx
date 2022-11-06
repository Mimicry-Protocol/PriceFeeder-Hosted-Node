import { Box, Heading, Stack, Text, HStack } from '@chakra-ui/react';
import * as React from 'react';
import { CreateFeedForm } from '../CreateFeedForm/CreateFeedForm';

export function Hero() {
  return (
    <Box>
      <Box as="section" bg="gray.800" color="white" py="7.5rem">
        <Box
          maxW={{ base: 'xl', md: '5xl' }}
          mx="auto"
          px={{ base: '6', md: '8' }}
        >
          <Box textAlign="center" marginBottom={16}>
            <Heading
              as="h1"
              size="3xl"
              fontWeight="extrabold"
              maxW="48rem"
              mx="auto"
              lineHeight="1.2"
              letterSpacing="tight"
            >
              Feeds the price and is real nice
            </Heading>
            <Text fontSize="xl" mt="4" maxW="xl" mx="auto">
              Are you hungry for prices? We sure are. So create one so we can
              consume it, please.
            </Text>
          </Box>

          <HStack justify="center">
            <CreateFeedForm />
          </HStack>

          <Stack
            justify="center"
            direction={{ base: 'column', md: 'row' }}
            mt="10"
            mb="20"
            spacing="4"
          ></Stack>
        </Box>
      </Box>
    </Box>
  );
}
