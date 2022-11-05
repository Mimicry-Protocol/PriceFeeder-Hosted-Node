import { ConnectButton } from '@rainbow-me/rainbowkit';

type Props = {
  children: React.ReactNode;
};

export function Main({ children }: Props) {
  return (
    <div>
      <ConnectButton />
      {children}
    </div>
  );
}
