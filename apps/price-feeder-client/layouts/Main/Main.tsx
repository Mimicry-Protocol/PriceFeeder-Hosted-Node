import { Banner } from '../../components/Banner/Banner';
import { NavBar } from '../../components/NavBar/NavBar';

type Props = {
  children: React.ReactNode;
};

export function Main({ children }: Props) {
  return (
    <div>
      <Banner />
      <NavBar />
      {children}
    </div>
  );
}
