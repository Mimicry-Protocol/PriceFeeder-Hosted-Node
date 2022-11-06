import {
  Box,
  BoxProps,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';

export function CreateFeedForm(props: BoxProps) {
  return (
    <Box
      as="form"
      bg="bg-surface"
      boxShadow={useColorModeValue('sm', 'sm-dark')}
      borderRadius="lg"
      color="black"
      maxWidth={600}
      width="100%"
      {...props}
    >
      <Stack
        spacing="5"
        px={{ base: '4', md: '6' }}
        py={{ base: '5', md: '6' }}
      >
        <Stack spacing="6" direction={{ base: 'column', md: 'row' }}>
          <FormControl id="firstName">
            <FormLabel>Collection Name</FormLabel>
            <Input placeholder="e.g. Crypto Coven" />
          </FormControl>
        </Stack>
        <FormControl id="street">
          <FormLabel>TRB Amount</FormLabel>
          <Input defaultValue="0" type="number" />
        </FormControl>
      </Stack>
      <Divider />
      <Flex direction="row-reverse" py="4" px={{ base: '4', md: '6' }}>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Flex>
    </Box>
  );
}
