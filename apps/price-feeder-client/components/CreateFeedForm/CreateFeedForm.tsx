import {
  Box,
  BoxProps,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Input,
  Stack,
  Icon,
  useColorModeValue,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { FormEventHandler, useCallback, useState } from 'react';
import { NFTPriceFeeder__factory } from '@price-feeder/price-feeder-contract';
import { useAccount, useProvider, useSigner } from 'wagmi';
import { useAsync } from 'react-async-hook';
import { parseEther } from 'ethers/lib/utils';

import { AsyncSelect, chakraComponents } from 'chakra-react-select';
import { Radio, RadioGroup } from '@chakra-ui/react';
import { useIsClient } from 'usehooks-ts';

function usePriceFeeder() {
  const provider = useProvider();
  return NFTPriceFeeder__factory.connect(
    '0x634de06f7bb9c05772de985e613b010b6dc2473e',
    provider
  );
}

function useCreateFeedHandler() {
  const account = useAccount();
  const signer = useSigner();
  const feederContract = usePriceFeeder();

  return useCallback(
    (collectionAddress: string, metric: number, fundingAmount: string) => {
      const thirtyMins = 30 * 60;

      const args = [
        1, // uint256 _chainId,
        collectionAddress, // address _collectionAddress,
        metric, // uint256 _metric,
        parseEther('0.005'), // uint256 _trbReward,
        parseEther('0.0005'), // uint256 _rewardIncreasePerSecond,
        thirtyMins, // uint256 _autopayInterval,
        50, // uint256 _priceVariabilityThreshold,
        parseEther(fundingAmount), // uint256 _amount
      ] as const;

      console.log(args);

      // feederContract.createFeed(
      //   ...args
      // );
    },
    []
  );
}

type CollectionItem = {
  collectionId: string;
  name: string;
  contract: string;
  image: string;
  allTimeVolume: number;
  floorAskPrice: number;
  openseaVerificationStatus: string;
};

const customComponents = {
  Option: ({ children, ...props }) => {
    return (
      // eslint-disable-next-line
      // @ts-ignore doing it live
      <chakraComponents.Option {...props}>
        {props.data.icon} {children}
      </chakraComponents.Option>
    );
  },
};

const format = (val) => val + ' TRB';
const parse = (val) => val.replace(/\sTRB$/, '');

export function CreateFeedForm(props: BoxProps) {
  const handler = useCreateFeedHandler();
  const isClient = useIsClient();

  const [collection, setCollection] = useState('');
  const [metric, setMetric] = useState('0');
  const [trbValue, setTrbValue] = useState('5.00');

  console.log({
    collection,
    metric,
    trbValue,
  });

  return (
    <Box
      bg="bg-surface"
      boxShadow={useColorModeValue('sm', 'sm-dark')}
      borderRadius="lg"
      color="black"
      maxWidth={600}
      width="100%"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handler('0x0', 0, '10');
          const blah = e;
          debugger;
        }}
      >
        <Stack
          spacing="5"
          px={{ base: '4', md: '6' }}
          py={{ base: '5', md: '6' }}
        >
          <FormControl>
            <FormLabel>Choose Collection</FormLabel>
            {isClient && (
              <AsyncSelect
                name="colors"
                placeholder="e.g. Crypto Coven"
                components={customComponents}
                onChange={(selection: Record<string, unknown>) => {
                  if (typeof selection.value !== 'string') return '';

                  setCollection(selection.value ?? '');
                }}
                noOptionsMessage={({ inputValue }) => {
                  if (inputValue === '') {
                    return 'What are you looking for?';
                  }
                  return 'No results found';
                }}
                loadOptions={async (query) => {
                  const results = await fetch(
                    `/api/search-collections?name=${query}`
                  ).then((res) => res.json());

                  const collections =
                    results?.collections ?? ([] as CollectionItem[]);

                  return collections.map((item) => ({
                    value: item.collectionId,
                    label: item.name,
                    icon: (
                      <Image
                        borderRadius="full"
                        boxSize="30px"
                        src={item.image}
                        alt=""
                        marginRight={2}
                      />
                    ),
                  }));
                }}
              />
            )}
          </FormControl>
          <FormControl>
            <FormLabel>What stat would you like?</FormLabel>
            <RadioGroup
              value={metric}
              onChange={(nextValue) => setMetric(nextValue)}
            >
              <HStack spacing={8}>
                <Radio value="0">TAMI</Radio>
                <Radio value="1">Market Cap</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Amount to sponsor</FormLabel>
            <NumberInput
              value={format(trbValue)}
              onChange={(nextValue) => {
                setTrbValue(parse(nextValue));
              }}
              min={1}
              precision={2}
              step={0.5}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </Stack>
        <Divider />
        <Flex direction="row-reverse" py="4" px={{ base: '4', md: '6' }}>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
