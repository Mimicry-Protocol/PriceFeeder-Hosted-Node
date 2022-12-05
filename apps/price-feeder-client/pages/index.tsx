import { Box } from '@chakra-ui/react';
import { FeedsList } from '../components/FeedsList/FeedsList';
import { Hero } from '../components/Hero/Hero';
import { Main } from '../layouts/Main/Main';

export default function Index() {
  return (
    <Main>
      <Hero />
      <Box as="section" py="7.5rem" paddingBottom={8}>
        <FeedsList />
      </Box>
    </Main>
  );
}
