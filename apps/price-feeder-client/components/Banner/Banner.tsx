import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export function Banner() {
  return (
    <Box as="section">
      <Box
        bg="#F8ADDE"
        boxShadow={useColorModeValue('sm', 'sm-dark')}
        position="relative"
      >
        <Container py={{ base: '4', md: '3.5' }}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justify="center"
            spacing={{ base: '0.5', md: '1.5' }}
            pe={{ base: '4', sm: '0' }}
          >
            <Text fontWeight="bold">This project is a work in progress.</Text>
            <Text fontWeight="medium">
              Feed data is being written to Polygon Mumbai.
            </Text>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
