import { Box, Stack } from '@chakra-ui/react';
import { FeedsList } from '../components/FeedsList/FeedsList';
import { Hero } from '../components/Hero/Hero';
import { Main } from '../layouts/Main/Main';

export default function Index() {
  return (
    <Main>
      <Hero />
      <Box
        as="section"
        bg="#171922"
        py="7.5rem"
        paddingX={20}
        paddingTop={0}
        paddingBottom={20}
      >
        <FeedsList />
      </Box>
    </Main>
  );
}
