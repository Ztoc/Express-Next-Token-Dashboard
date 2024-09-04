/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-unescaped-entities */
import {
  Image,
  Flex,
  Button,
  Input,
  TabList,
  Tabs,
  Tab,
} from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";
import { listTokenomics } from "@src/constants/home";
import { calculateProfit } from "@src/utils/Calculator";
import BigNumber from "bignumber.js";
import React, { useMemo, useState } from "react";
import useSWR from "swr";
import { erc20ABI, useAccount, useSigner } from "wagmi";
import { getContract } from "@src/utils/contractHelper";
import { useWeb3React } from "@src/hooks/useWeb3React";
import StakingContractAbi from "../../../configs/abis/stakingContract.json";
import { useMKTPrice } from "@src/hooks/useBUSDPrice";
import { useCurrencyBalances } from "@src/hooks/wallet";
import { useApr, usePublicData } from "@src/hooks/usePublicPoolData";
import { formatBigNumber } from "@src/utils/format";

const Calculator: React.FC<{
  listFarm: any;
}> = ({ listFarm }) => {
  const [stable, setStable] = useState(true);
  const [value, setValue] = React.useState(0);
  const [tabIndex, setTabIndex] = useState("day");
  const [selectTabsCalculator, setSelectTabsCalculator] = useState("Farm");
  const { address: account } = useAccount();
  const { chainId } = useWeb3React();
  const tokenPrice = useMKTPrice();
  const MKTPrice = Number(tokenPrice) ? tokenPrice : 0.000000000389;
  const farmSelected = listFarm[0];
  const publicData = usePublicData(Number(farmSelected?.pid) ?? 0);
  const { data: signer } = useSigner();

  const mktContract = useMemo(() => {
    return getContract(
      (farmSelected.mtkAddress as any)[chainId],
      erc20ABI,
      chainId,
      signer
    );
  }, [chainId, farmSelected.mtkAddress, signer]);
  const quoteContract = useMemo(() => {
    return getContract(
      (farmSelected.quoteToken as any)[chainId],
      erc20ABI,
      chainId,
      signer
    );
  }, [chainId, farmSelected.quoteToken, signer]);
  const { data: totalStaked } = useSWR(["balanceOf", account], async () => {
    const res = await mktContract.balanceOf(stakingContractAddress);
    return formatBigNumber(res);
  });
  const aprCalculated = useApr(publicData, Number((totalStaked ?? 0) * 2));
  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setValue(Number(event.target.value));

  const tabCalculator = ["day", "week", "month", "year"];
  const selectTabs = ["Farm", "Pool"];

  const contractStaking = {
    56: "0xe19b2648E7E1bACa4Ae6B2ed3573FAa23e1006c1",
    97: "0xa77defc4f623f0070578c3786990fe3cd177444a",
  };

  const stakingContractAddress = useMemo(
    () => contractStaking[chainId as keyof typeof contractStaking],
    [chainId, contractStaking]
  );

  const stakingContract = getContract(
    stakingContractAddress,
    StakingContractAbi,
    chainId,
    signer
  );

  const { data: rewardPercentage } = useSWR(
    ["getRewardPercentage", account],
    async () => {
      const res = await stakingContract.getRewardPercentage();
      return new BigNumber(res?._hex).toNumber();
    }
  );
  const apr = aprCalculated?.apr ?? 0;
  const { data: usdtBalance } = useSWR(
    ["get-usdt-balance", account],
    async () => {
      const res = await quoteContract.balanceOf(account);
      return formatBigNumber(res);
    }
  );
  return (
    <Flex w="100%" maxW="1200px" mx="auto">
      <Flex
        flexDirection={"column"}
        p="24px"
        w="100%"
        borderRadius={"12px"}
        className="bg-primary"
        position={"relative"}
      >
        <Flex
          w="50px"
          h="40px"
          borderTop={"2px"}
          borderLeft={"2px"}
          borderStyle={"solid"}
          borderColor="bg.brand"
          position={"absolute"}
          left={"0px"}
          top={"0px"}
          borderTopLeftRadius={"12px"}
        />
        <Flex
          w="50px"
          h="40px"
          borderLeft={"2px"}
          borderBottom={"2px"}
          borderStyle={"solid"}
          borderColor="bg.brand"
          position={"absolute"}
          left={"0px"}
          bottom={"0px"}
          borderBottomLeftRadius={"12px"}
        />
        <Flex
          w="50px"
          h="40px"
          borderTop={"2px"}
          borderRight={"2px"}
          borderStyle={"solid"}
          borderColor="bg.brand"
          position={"absolute"}
          right={"0px"}
          top={"0px"}
          borderTopRightRadius={"12px"}
        />
        <Flex
          w="50px"
          h="40px"
          borderRight={"2px"}
          borderBottom={"2px"}
          borderStyle={"solid"}
          borderColor="bg.brand"
          position={"absolute"}
          right={"0px"}
          bottom={"0px"}
          borderBottomRightRadius={"12px"}
        />
        <Typography
          type="headline4"
          color="text.brand"
          className="text-primary"
          mb="16px"
        >
          Calculator Now
        </Typography>
        <Tabs
          variant="soft-rounded"
          className="bg-default mb-4"
          p="4px"
          borderRadius={"8px"}
          border="1px solid #3E454B"
          width="full"
        >
          <TabList className="w-full">
            {selectTabs.map((tab, index) => (
              <Tab
                w={"100%"}
                borderRadius={"8px"}
                _selected={{ color: "black", bg: "#1ED760" }}
                key={index}
                onClick={() => setSelectTabsCalculator(tab)}
              >
                {tab}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <Typography mb="8px" type="caption1-r" className="text-read">
          APR
        </Typography>
        <Input
          value={apr.toFixed(2)}
          className="text-primary border-gray-500  focus:border-gray-500 hover:border-gray-500 active:border-gray-500"
          color="text-primary"
          borderColor={"#3E454B"}
          mb="16px"
          placeholder="Select pool to see APR"
          size="lg"
        />
        <Flex justifyContent={"space-between"} mb="8px">
          <Typography type="caption1-r" className="text-read">
            Enter Amount
          </Typography>
          <Typography type="caption1-r" className="text-read">
            Avail:{usdtBalance ?? "--"} {farmSelected.symbol}
          </Typography>
        </Flex>
        <Flex
          p="12px 16px"
          borderRadius={"8px"}
          border="1px solid"
          justifyContent={"space-between"}
          align="center"
        >
          <Flex flexDirection="column" className="w-full">
            <Typography type="body1" className="w-full text-primary">
              <Flex>
                {stable ? `$` : ``}
                <Input
                  variant="unstyled"
                  onChange={handleChange}
                  className="w-full text-primary border-transparent focus:transparent hover:transparent active:transparent"
                  color="text-primary"
                  mb="16px"
                  size="lg"
                />
              </Flex>
            </Typography>
            <Typography type="body2-r" className="text-secondary">
              {stable
                ? `~${(Number(value) / Number(MKTPrice)).toFixed(2)}. MKT`
                : `~$${(Number(value) * Number(MKTPrice)).toFixed(2)}`}
            </Typography>
          </Flex>
          {/* <Flex cursor={"pointer"} onClick={() => setStable(!stable)}>
            <Image src="/assets/images/icons/switch-vertical.svg" />
          </Flex> */}
        </Flex>
        <Tabs
          variant="soft-rounded"
          className="bg-default mt-4"
          p="4px"
          borderRadius={"8px"}
          border="1px solid #3E454B"
          width="full"
        >
          <TabList className="w-full">
            {tabCalculator.map((tab, index) => (
              <Tab
                w={"100%"}
                borderRadius={"8px"}
                _selected={{ color: "black", bg: "#1ED760" }}
                key={index}
                onClick={() => setTabIndex(tab)}
              >
                1 {tab}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <Flex
          my="40px"
          p="12px 16px"
          borderRadius={"8px"}
          border="1px solid #1ED760"
          flexDirection={"column"}
        >
          <Typography type="body2" className="text-secondary">
            Your Annual Income
          </Typography>
          <Typography type="headline5" className="text-brand">
            ${" "}
            {stable
              ? Number(
                  calculateProfit(tabIndex, Number(value), apr / 100)
                ).toFixed(2)
              : (
                  Number(calculateProfit(tabIndex, Number(value), apr / 100)) *
                  Number(MKTPrice)
                ).toFixed(2)}
          </Typography>
          <Typography type="headline5" className="text-secondary">
            ~
            {(
              Number(calculateProfit(tabIndex, Number(value), apr / 100)) /
              Number(stable ? MKTPrice : 1)
            ).toFixed(2)}{" "}
            MKT
          </Typography>
        </Flex>
        <Button
          background={"bg.brand !important"}
          borderRadius={"6px"}
          _hover={{
            bg: "bg.brand-active !important",
          }}
          _active={{
            bg: "bg.brand-active !important",
          }}
          color={"bg.default"}
          height="48px !important"
        >
          <Typography type="button1">Stake Now</Typography>
        </Button>
      </Flex>
    </Flex>
  );
};

export default Calculator;
