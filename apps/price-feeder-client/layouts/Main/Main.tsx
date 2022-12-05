import { Box } from '@chakra-ui/react';
import { Banner } from '../../components/Banner/Banner';
import { NavBar } from '../../components/NavBar/NavBar';

type Props = {
  children: React.ReactNode;
};

export function Main({ children }: Props) {
  return (
    <Box as="main" bg="#171922" minHeight="100vh">
      <Box position="sticky" top={0} zIndex={1}>
        <Banner />
        <NavBar />
      </Box>
      {children}
    </Box>
  );
}
