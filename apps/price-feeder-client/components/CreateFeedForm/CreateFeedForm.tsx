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
  Stack,
  useColorModeValue,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import {
  NFTPriceFeeder__factory,
  ERC20__factory,
} from '@price-feeder/price-feeder-contract';
import { useProvider, useSigner } from 'wagmi';
import { parseEther } from 'ethers/lib/utils';

import { AsyncSelect, chakraComponents } from 'chakra-react-select';
import { Radio, RadioGroup } from '@chakra-ui/react';
import { useIsClient } from 'usehooks-ts';

const PRICE_FEEDER_ADDRESS = '0x662410dD2c11B059F9AdF0832D870A4D4e0EA999';
const TRB_TOKEN_ADDRESS = '0xCE4e32fE9D894f8185271Aa990D2dB425DF3E6bE';

function usePriceFeederContract() {
  const provider = useProvider();
  return NFTPriceFeeder__factory.connect(PRICE_FEEDER_ADDRESS, provider);
}

function useTRBContract() {
  const provider = useProvider();
  return ERC20__factory.connect(TRB_TOKEN_ADDRESS, provider);
}

function useCreateFeedHandler() {
  const signer = useSigner();
  const feederContract = usePriceFeederContract();
  const trbContract = useTRBContract();

  const toast = useToast();

  const handler = useCallback(
    async (
      collectionAddress: string,
      collectionName: string,
      metric: number,
      fundingAmount: string
    ) => {
      try {
        const thirtyMinsInSeconds = 30 * 60;
        const fifteenMinsInSeconds = 15 * 60;

        const parsedFundingAmount = parseEther(fundingAmount);

        const approveTx = await trbContract
          .connect(signer.data)
          .approve(PRICE_FEEDER_ADDRESS, parsedFundingAmount);

        await approveTx.wait();

        const createFundTx = await feederContract
          .connect(signer.data)
          .createFeed(
            1, // uint256 _chainId,
            collectionAddress, // address _collectionAddress,
            metric, // uint256 _metric,
            parseEther('0.005'), // uint256 _trbReward,
            parseEther('0.0005'), // uint256 _rewardIncreasePerSecond,
            thirtyMinsInSeconds, // uint256 _autopayInterval,
            fifteenMinsInSeconds, // uint256 _window,
            50, // uint256 _priceVariabilityThreshold,
            parsedFundingAmount // uint256 _amount
          );

        await createFundTx.wait();
        toast({
          title: 'Feed created!',
          description: `The ${collectionName} data feed has been created :-)`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (err: unknown) {
        console.error('Something went wrong:');
        console.error(err);
        toast({
          title: 'Something went wrong :-(',
          description: 'There was an issue creating your feed',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [feederContract, signer.data, toast, trbContract]
  );

  return { handler, loading: false, error: false };
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
  const { handler, loading, error } = useCreateFeedHandler();
  const isClient = useIsClient();

  const [collectionAddress, setCollectionAddress] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [metric, setMetric] = useState('0');
  const [trbValue, setTrbValue] = useState('5.00');

  return (
    <Box
      bg="bg-surface"
      boxShadow={useColorModeValue('sm', 'sm-dark')}
      borderRadius="lg"
      color="black"
      maxWidth={600}
      width="100%"
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
                console.log(selection);
                if (
                  typeof selection.value !== 'string' ||
                  typeof selection.label !== 'string'
                ) {
                  return;
                }

                setCollectionAddress(selection.value ?? '');
                setCollectionName(selection.label ?? '');
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
              <Radio value="2">Floor Price</Radio>
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
        <Button
          type="submit"
          variant="primary"
          disabled={!collectionAddress || loading}
          onClick={() => {
            handler(
              collectionAddress,
              collectionName,
              parseInt(metric),
              trbValue
            );
          }}
        >
          Submit
        </Button>
      </Flex>
    </Box>
  );
}
