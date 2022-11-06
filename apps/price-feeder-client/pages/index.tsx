import { FeedsList } from '../components/FeedsList/FeedsList';
import { Hero } from '../components/Hero/Hero';
import { Main } from '../layouts/Main/Main';

export default function Index() {
  return (
    <Main>
      <Hero />
      <FeedsList />
    </Main>
  );
}
