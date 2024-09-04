import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  ButtonProps,
  Flex,
  Image,
} from "@chakra-ui/react";
import ButtonConnectWallet from "@src/components/ButtonConnectWallet";

import { Typography } from "@src/components/Typography";
import { getTokenBySymbol } from "@src/configs/tokens";
import { MAX_INT } from "@src/constants";
import { ICardPool } from "@src/constants/pool";
import { useMKTBNBPrice, useMKTPrice } from "@src/hooks/useBUSDPrice";
import { SubExplorerPath, useGetExplorer } from "@src/hooks/useGetExplorer";
import {
  useApr,
  usePublicData,
  useUsdtPoolData,
} from "@src/hooks/usePublicPoolData";
import { useWeb3React } from "@src/hooks/useWeb3React";
import { getContract } from "@src/utils/contractHelper";
import { formatBigNumber, formatNumberWithNumeral } from "@src/utils/format";
import { useAssetToWallet } from "@src/utils/useAsset";
import BigNumber from "bignumber.js";
import Link from "next/link";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import useSWR from "swr";
import { useAccount, useSigner } from "wagmi";
import erc20ABI from "../../configs/abis/erc20.json";
import StakingManagerABI from "../../configs/abis/StakingManagerABI.json";
import StakingContractAbi from "../../configs/abis/stakingContract.json";
import ActionHarvest from "../PoolPage/ActionHarvest";
import { getFirebaseApp } from "@src/configs/firebase";
import Countdown from "react-countdown";
// import {
//   getRemoteConfig,
//   fetchAndActivate,
//   getValue,
// } from "@firebase/remote-config";
// import contracts from "@src/constants/contracts";

import moment from "moment";
import ActionStakePoolClassic from "../PoolPage/Classic/ActionStakePoolClassic";
import { useSingleContractMultipleData } from "@src/redux/slices/multicall/hooks";
import ActionUnstakeClassic from "../PoolPage/Classic/ActionUnstakeClassic";
import {
  useGetRewardFarmByPid,
  useGetUserInfoFarm,
} from "@src/hooks/useGetUerInfoFarm";
import Calculator from "../PoolPage/Calculator";
import MikeTokenSlide from "../PoolPage/MikeToken";
const FarmPage: React.FC = () => {
  const [idxFilter, setIdxFilter] = useState(0);
  const listFarm = [
    // {
    //   pid: 1,
    //   stakedSymbol: "LP",
    //   isClassic: false,
    //   title: "MIKE-USDT",
    //   symbol: "USDT",
    //   // LP with farm
    //   tokenAddress: {
    //     "56": "0x29D7CEB261bb24298B9f7bee6fDE2D8Bbd68B88a",
    //     "97": "0x29D7CEB261bb24298B9f7bee6fDE2D8Bbd68B88a",
    //   },
    //   contractStaking: {
    //     "56": "0xe1113bccd15dc31d2ad711b982a4990f76B1A47c",
    //     "97": "0xAc577384dd31485a900b44B45F8Edc3D993EbB07",
    //   },
    //   mtkAddress: {
    //     "56": "0xf542ac438cf8cd4477a1fc7ab88adda5426d55ed",
    //     "97": "0x6C62F8a8deDd262beA9351C9bCAA56ADC558d05D",
    //   },
    //   quoteToken: {
    //     "56": "0x55d398326f99059ff775485246999027b3197955",
    //     "97": "0x8545f2473324124c5371F831075A3163AF22f34F",
    //   },
    //   startTime: Math.max(),
    //   depositEnd: Math.max(),
    //   endTime: Math.max(),
    //   image: "/images/logo-pool-mkt.svg",
    //   tokenEarn: {
    //     symbol: "MKT",
    //   },
    //   background:
    //     "radial-gradient(38.94% 41.23% at -1.91% 32.86%, #354B85 0%, rgba(50, 78, 119, 0.00) 100%), radial-gradient(122.59% 128.68% at 16.22% 0.00%, #148888 0%, #11353A 28.28%, #151616 56.99%)",
    // },
    {
      pid: 0,
      stakedSymbol: "MKT",
      isClassic: true,
      title: "Mike Boost",
      symbol: "USDT",
      // LP with farm
      tokenAddress: {
        "56": "0xf542ac438cf8cd4477a1fc7ab88adda5426d55ed",
        "97": "0x29D7CEB261bb24298B9f7bee6fDE2D8Bbd68B88a",
      },
      contractStaking: {
        "56": "0xe1113bccd15dc31d2ad711b982a4990f76B1A47c",
        "97": "0xAc577384dd31485a900b44B45F8Edc3D993EbB07",
      },
      mtkAddress: {
        "56": "0xf542ac438cf8cd4477a1fc7ab88adda5426d55ed",
        "97": "0x6C62F8a8deDd262beA9351C9bCAA56ADC558d05D",
      },
      quoteToken: {
        "56": "0xf542ac438cf8cd4477a1fc7ab88adda5426d55ed",
        "97": "0x8545f2473324124c5371F831075A3163AF22f34F",
      },
      startTime: Math.max(),
      depositEnd: Math.max(),
      endTime: Math.max(),
      image: "/images/logo-pool-mkt.svg",
      tokenEarn: {
        symbol: "MKT",
      },
      background:
        "radial-gradient(38.94% 41.23% at -1.91% 32.86%, #354B85 0%, rgba(50, 78, 119, 0.00) 100%), radial-gradient(122.59% 128.68% at 16.22% 0.00%, #148888 0%, #11353A 28.28%, #151616 56.99%)",
    },
    {
      pid: 1,
      stakedSymbol: "MKT-BNB LP",
      isClassic: false,
      title: "Mike LP Boost",
      symbol: "MKT",
      // LP with farm
      tokenAddress: {
        "56": "0x59AC232DFC668BCf34C447649420e14c54fFFD3d",
        "97": "0x29D7CEB261bb24298B9f7bee6fDE2D8Bbd68B88a",
      },
      contractStaking: {
        "56": "0xe1113bccd15dc31d2ad711b982a4990f76B1A47c",
        "97": "0xAc577384dd31485a900b44B45F8Edc3D993EbB07",
      },
      mtkAddress: {
        "56": "0x59AC232DFC668BCf34C447649420e14c54fFFD3d",
        "97": "0x6C62F8a8deDd262beA9351C9bCAA56ADC558d05D",
      },
      quoteToken: {
        "56": "0xf542ac438cf8cd4477a1fc7ab88adda5426d55ed",
        "97": "0x8545f2473324124c5371F831075A3163AF22f34F",
      },
      startTime: Math.max(),
      depositEnd: Math.max(),
      endTime: Math.max(),
      image: "/images/logo-pool-mkt.svg",
      tokenEarn: {
        symbol: "MKT",
      },
      background:
        "radial-gradient(38.94% 41.23% at -1.91% 32.86%, #354B85 0%, rgba(50, 78, 119, 0.00) 100%), radial-gradient(122.59% 128.68% at 16.22% 0.00%, #148888 0%, #11353A 28.28%, #151616 56.99%)",
    },
  ];
  // console.log("listPool :>> ", listPool);
  // useEffect(() => {
  //   const firebaseApp = getFirebaseApp();
  //   // console.log("firebaseApp :>> ", firebaseApp);
  //   const remoteConfigData = getRemoteConfig(firebaseApp);
  //   remoteConfigData.settings = {
  //     fetchTimeoutMillis: 60000,
  //     minimumFetchIntervalMillis: 60000 * 5,
  //   };
  //   fetchAndActivate(remoteConfigData)
  //     .then(() => {
  //       const data = getValue(remoteConfigData, "poolConfig");
  //       const jsonData = JSON.parse(data.asString());
  //       setListPool(jsonData);
  //     })
  //     .catch(() => {
  //       console.log("firebase err");
  //     });
  // }, []);

  const listFilter = ["Active", "Finished"];

  const listPoolFilter = listFarm.filter((e) => {
    if (idxFilter === 1 && moment().isSameOrAfter(moment.unix(e?.endTime))) {
      return e;
    }

    if (idxFilter === 0 && !moment().isSameOrAfter(moment.unix(e?.endTime))) {
      return e;
    }
  });
  return (
    <Flex
      w="100%"
      direction={"column"}
      pb="100px"
      px={{
        base: "16px",
        lg: "24px",
        "2xl": 0,
      }}
      pt={{
        base: "32px",
        md: "48px",
        xl: "80px",
      }}
    >
      <Flex maxW="1200px" mx="auto" w="100%">
        <Typography type="headline2" color={"text.primary"}>
          Farms
        </Typography>
      </Flex>

      <Flex
        maxW="1200px"
        mx="auto"
        w="100%"
        direction={{
          base: "column",
          lg: "row",
        }}
        justifyContent={"space-between"}
      >
        <Flex
          direction={{
            base: "column",
            md: "row",
          }}
        >
          <Typography as="span" type="body1-r" color="text.read">
            Stake LP and MKT tokens to earn MKT
          </Typography>

          <Flex cursor={"pointer"}>
            <Typography
              pl={{
                base: 0,
                md: "12px",
              }}
              as="span"
              type="body1-r"
              color="text.brand"
            >
              Learn more
            </Typography>

            <Image
              ml="4px"
              boxSize="20px"
              src="arrow-expand.svg"
              alt="arrow expand"
            />
          </Flex>
        </Flex>
        <Flex
          mt={{
            base: "24px",
            lg: 0,
          }}
          borderRadius={"6px"}
          bg="bg.primary"
          w="fit-content"
        >
          {listFilter.map((e, idx) => {
            return (
              <Flex
                h="32px"
                justify={"center"}
                align={"center"}
                bg={idx === idxFilter ? "bg.brand" : "bg.secondary"}
                key={`item-filter-${idx}`}
                w="107px"
                borderRadius={"6px"}
                onClick={() => setIdxFilter(idx)}
                cursor={"pointer"}
              >
                <Typography
                  type="button3"
                  color={idx === idxFilter ? "bg.secondary" : "text.secondary"}
                >
                  {e}
                </Typography>
              </Flex>
            );
          })}
        </Flex>
      </Flex>

      <Flex justifyContent={"center"} gap={10} flexWrap={"wrap"}>
        {listPoolFilter && listPoolFilter.length > 0 ? (
          listPoolFilter?.map((e, idx) => {
            return (
              <CardPoolClassic
                isFinished={idxFilter === 1}
                data={e}
                key={`card-pool-classic-${idx}`}
              />
            );
          })
        ) : (
          <Flex direction={"column"}>
            <Image
              width={"200px"}
              height={"200px"}
              mx="auto"
              mt="100px"
              src={"/images/search-not-found.svg"}
              alt=""
            />
            <Typography
              mt="20px"
              textAlign="center"
              type="headline5"
              color="text.primary"
            >
              Not Found
            </Typography>
          </Flex>
        )}
      </Flex>
      {/* <MikeTokenSlide /> */}
      <Flex
        maxW="1200px"
        mx="auto"
        className="w-full flex max-xl:flex-col"
        align={"center"}
        mt={{
          base: "48px",
          md: "80px",
          lg: "112px",
        }}
        display="none"
      >
        <div className="w-1/2 max-xl:w-full pr-[48px] max-xl:pr-[0px]">
          <Typography
            mb="16px"
            bgGradient="linear-gradient(132deg, #1ED760 0%, #FFF 100%)"
            bgClip="text"
            type="headline2"
          >
            Lorem ipsum dolor sit amet consectetur
          </Typography>
          <Typography type="paragraph1" className="text-secondary">
            Lorem ipsum dolor sit amet consectetur. Dictum amet tristique urna
            arcu. Nulla sit quam enim nulla consectetur dictumst diam nunc.
            Molestie at
          </Typography>
          <Flex justifyContent={"flex-end"}>
            <Image
              src="./assets/images/bg-caculator.svg"
              width={450}
              height={450}
              alt=""
            />
          </Flex>
        </div>
        <div className="w-1/2 max-xl:w-full">
          <Calculator listFarm={listFarm} />
        </div>
      </Flex>
    </Flex>
  );
};

export default FarmPage;

interface ButtonComponentProps extends ButtonProps {
  title: string | ReactNode | any;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  title,
  ...rest
}) => {
  return (
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
      {...rest}
    >
      {typeof title === "string" ? (
        <Typography type="button1">{title}</Typography>
      ) : (
        title
      )}
    </Button>
  );
};

const CardPoolClassic: React.FC<{
  data: ICardPool;
  isFinished: boolean;
}> = ({ data, isFinished }) => {
  const [isApproved, setIsPendingApproved] = useState(false);
  const { address: account } = useAccount();
  const { chainId } = useWeb3React();
  const { addAssetToWallet } = useAssetToWallet();
  const {
    image,
    title,
    symbol,
    background,
    pid,
    tokenEarn,
    isClassic,
    stakedSymbol,
  } = data ?? {};
  const { data: signer } = useSigner();
  const [isPendingApprover, setIsPendingApprover] = useState(false);

  const { address, decimals, logoUrl } =
    getTokenBySymbol(symbol, chainId) ?? ({} as any);
  const viewContractLink = useGetExplorer(
    SubExplorerPath.ADDRESS,
    data.contractStaking[chainId]
  );
  const stakingContractAddress = useMemo(
    () => data.contractStaking[chainId],
    [chainId, data.contractStaking]
  );
  const tokenStakedContract = useMemo(() => {
    return getContract(data.tokenAddress[chainId], erc20ABI, chainId, signer);
  }, [chainId, data.tokenAddress, signer]);

  const stakingContract = getContract(
    stakingContractAddress,
    StakingManagerABI,
    chainId,
    signer
  );
  const mktContract = useMemo(() => {
    return getContract(
      (data.mtkAddress as any)[chainId],
      erc20ABI,
      chainId,
      signer
    );
  }, [chainId, data.mtkAddress, signer]);

  const { data: allowance, error } = useSWR(
    ["allowance-pool-classic", account, pid, stakingContractAddress],
    async () => {
      const res = await tokenStakedContract.allowance(
        account,
        stakingContractAddress
      );
      return res;
    }
  );

  const bnbPrice = 240;
  const MKTPrice = useMKTPrice();
  const priceTokens = Number(MKTPrice) * bnbPrice;
  const { data: stakedAmountData } = useSWR(
    ["getDepositedAmount", account, stakingContractAddress],
    async () => {
      const res = await stakingContract.getDepositedAmount(account);
      return res;
    }
  );
  const { data: totalMktStaked } = useSWR(
    ["getTotalStaked", account, stakingContractAddress, pid],
    async () => {
      const res = await stakingContract.getTotalStaked(pid);
      return formatBigNumber(res);
    }
  );
  const { data: rewardPercentage } = useSWR(
    ["getRewardPercentage", account, stakingContractAddress],
    async () => {
      const res = await stakingContract.getRewardPercentage();
      return new BigNumber(res?._hex).toNumber();
    }
  );

  const stakedAmount = useMemo(() => {
    if (!stakedAmountData) {
      return 0;
    }
    return formatBigNumber(stakedAmountData[0]);
  }, [stakedAmountData]);
  const mktLocked = useMemo(() => {
    if (!stakedAmountData) {
      return 0;
    }
    return formatBigNumber(stakedAmountData[1]);
  }, [stakedAmountData]);
  // const { data: earnAmount } = useSWR(["earned", account], async () => {
  //   const res = await stakingContract.earned(account);
  //   return formatBigNumber(res.toString());
  // });

  const { data: totalStaked } = useSWR(["balanceOf", account], async () => {
    const res = await mktContract.balanceOf(stakingContractAddress);
    return formatBigNumber(res);
  });
  useEffect(() => {
    setIsPendingApproved(new BigNumber(allowance?._hex).isGreaterThan(0));
  }, [allowance?._hex]);
  const apr = rewardPercentage && (rewardPercentage * 365) / 7;
  const tvlAmount = Number(totalStaked) * Number(priceTokens);
  const harvestLockup = 24;

  const handleAddTokenToWallet = () => {
    addAssetToWallet(address, symbol, decimals, logoUrl);
  };

  const handleApprove = useCallback(async () => {
    try {
      setIsPendingApprover(true);
      const tx = await tokenStakedContract.approve(
        stakingContractAddress,
        MAX_INT.toString()
      );

      await tx.wait();
      setIsPendingApproved(true);
      setIsPendingApprover(false);
    } catch (error) {
      setIsPendingApprover(false);
    }
  }, [stakingContractAddress, tokenStakedContract]);

  const stakeAmount = useGetUserInfoFarm(
    stakingContractAddress,
    pid?.toString() as any
  );
  const rewardAmount = useGetRewardFarmByPid(
    stakingContractAddress,
    pid?.toString() as any
  );
  const estRewardDollar = useMemo(() => {
    if (tokenEarn.symbol === "MKT") {
      return rewardAmount * Number(MKTPrice);
    }
  }, [MKTPrice, rewardAmount, tokenEarn.symbol]);
  const lpPrice = useMKTBNBPrice();
  const mktPrice = useMKTPrice();
  const totalMktLock = isClassic
    ? Number(totalMktStaked ?? 0)
    : Number(
        ((totalMktStaked ?? 0) * Number(lpPrice ?? 1)) / Number(mktPrice ?? 1)
      );
  const publicData = usePublicData(Number(data?.pid) ?? 0);
  const aprCalculated = useApr(publicData, totalMktLock);
  const renderButton = () => {
    if (!account) {
      return (
        <ButtonConnectWallet w="100%" mt="30px" height={"48px !important"} />
      );
    }

    if (!isApproved) {
      return (
        <ButtonComponent
          isLoading={isPendingApprover}
          loadingText={`Approve...`}
          title={`Approve`}
          w="100%"
          onClick={handleApprove}
        />
      );
    }

    if (!Number(stakeAmount) && isApproved) {
      return (
        <ActionStakePoolClassic
          priceToken={priceTokens}
          apr={apr ?? 0}
          data={data}
          w="100%"
          totalStake={totalStaked || 0}
          tokenContract={tokenStakedContract}
          stakingContract={stakingContract}
          mktContract={mktContract}
        />
      );
    }

    return (
      <Flex w="100%" justifyContent={"space-between"}>
        <ActionUnstakeClassic
          data={data}
          w="48%"
          border="1px solid"
          borderRadius={"6px"}
          borderColor="bg.brand"
          _hover={{
            bg: "bg.brand",
            color: "bg.default",
          }}
          _active={{
            bg: "bg.brand",
            color: "text.primary",
          }}
          background={"transparent"}
          _disabled={{
            bg: "transparent",
            _hover: {
              bg: "bg.muted",
            },
            _active: {
              bg: "bg.muted",
            },
            color: "text.muted",
            borderColor: "bg.muted",
            cursor: "not-allowed",
          }}
          color={"text.brand"}
          tokenContract={tokenStakedContract}
          stakingContract={stakingContract}
          stakedAmount={stakeAmount as any}
        />
        <ActionStakePoolClassic
          priceToken={priceTokens}
          apr={apr ?? 0}
          data={data}
          w="48%"
          totalStake={totalStaked || 0}
          tokenContract={tokenStakedContract}
          stakingContract={stakingContract}
          mktContract={mktContract}
        />
      </Flex>
    );
  };
  const earnAmount = useMemo(() => {
    if (!stakedAmount || !rewardPercentage) {
      return 0;
    }
    return (stakedAmount * rewardPercentage) / 100;
  }, [rewardPercentage, stakedAmount]);

  return (
    <Flex
      maxW="473px"
      w="100%"
      boxShadow={"0px 4px 4px 0px rgba(0, 0, 0, 0.25)"}
      borderRadius={"12px"}
      p={{
        base: "16px",
        md: "24px",
      }}
      mt="40px"
      height={"fit-content"}
      direction={"column"}
      bg={isFinished ? "bg.primary" : background}
      position={"relative"}
      overflow={"hidden"}
    >
      <Flex
        w="150px"
        transform={"rotate(45deg)"}
        align={"center"}
        bg="#3E454B"
        h="28px"
        top="20px"
        zIndex={99}
        right="-40px"
        position={"absolute"}
        hidden={!isFinished}
      >
        <Typography
          textAlign="center"
          mx="auto"
          type="body2"
          color="text.primary"
        >
          Finished
        </Typography>
      </Flex>
      <Flex position={"relative"}>
        <Flex
          position={"absolute"}
          direction={"column"}
          top={{
            base: "32px",
            md: "24px",
          }}
          left="24px"
        >
          <Typography type="body1" color="text.read">
            {stakedSymbol} Staked
          </Typography>
          <Typography type="headline6" color="text.primary">
            {formatNumberWithNumeral(stakeAmount || "0")}
          </Typography>
        </Flex>
        <Flex
          position={"absolute"}
          direction={"column"}
          top={{
            base: "32px",
            md: "24px",
          }}
          right="24px"
        >
          <Typography textAlign={"right"} type="body1" color="text.read">
            APR
          </Typography>
          <Typography textAlign={"right"} type="headline6" color="text.brand">
            {formatNumberWithNumeral(aprCalculated?.apr ?? 0, 2)}%
          </Typography>
        </Flex>
        <Flex>
          <Image
            bottom={{
              base: "-10px",
              md: "-20px",
            }}
            left={{
              base: "40%",
              md: "42%",
            }}
            boxSize={{
              base: "55px",
              md: "auto",
            }}
            position={"absolute"}
            src={image}
            alt={`logo ${symbol} pool`}
          />
        </Flex>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="425"
          height="119"
          viewBox="0 0 425 119"
          fill="none"
        >
          <g filter="url(#filter0_b_394_13644)">
            <path
              d="M0 12C0 5.37258 5.37258 0 12 0H413C419.627 0 425 5.37258 425 12V90.7585C425 97.0111 420.199 102.216 413.967 102.719L212.5 119L11.0334 102.719C4.80112 102.216 0 97.0111 0 90.7585V12Z"
              fill="black"
              fill-opacity="0.3"
            />
          </g>
          <defs>
            <filter
              id="filter0_b_394_13644"
              x="-8"
              y="-8"
              width="441"
              height="135"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="4" />
              <feComposite
                in2="SourceAlpha"
                operator="in"
                result="effect1_backgroundBlur_394_13644"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_backgroundBlur_394_13644"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </Flex>
      <Typography
        mt="24px"
        type="headline4"
        color="text.primary"
        textAlign={"center"}
      >
        {title}
      </Typography>
      <Flex
        mt="24px"
        w="100%"
        justifyContent={"space-between"}
        align={"center"}
      >
        <Flex direction={"column"}>
          <Typography type="caption1-r" color="text.read">
            {tokenEarn?.symbol} Earned
          </Typography>
          <Typography type="headline6" color="text.primary">
            {formatNumberWithNumeral(rewardAmount || "0")}
          </Typography>
          <Typography type="paragraph2" color="text.secondary">
            ~$ {formatNumberWithNumeral(estRewardDollar || "0", 6)}
          </Typography>
          {/* <Typography type="body1" color="text.read">
              ~$
              {formatNumberWithNumeral(Number(earnAmount) * Number(priceTokens))}
            </Typography> */}
        </Flex>

        {/* <Flex></Flex> */}
        {/* <Flex direction={"column"}>
            <Typography textAlign="right" type="caption1-r" color="text.read">
              APR
            </Typography>
            <Typography type="headline6" textAlign={"right"} color="text.success">
              ~{formatNumberWithNumeral(apr ?? 0, 2)}%
            </Typography>
          </Flex> */}

        <ActionHarvest
          stakingContract={stakingContract}
          isDisabled={!account || Number(rewardAmount) === 0}
          pid={Number(pid)}
        />
      </Flex>

      <Flex mt="24px" w="100%">
        {renderButton()}
      </Flex>
      <Accordion allowToggle>
        <AccordionItem border="none" p="0">
          {({ isExpanded }) => (
            <>
              <AccordionButton pt="12px" pb="0" px="20px">
                <Flex mx="auto" align={"center"}>
                  <Typography pr="12px" type="button1" color="text.primary">
                    {" "}
                    {isExpanded ? "Hide" : "Detail"}
                  </Typography>
                  <AccordionIcon color="text.primary" />
                </Flex>
              </AccordionButton>
              <AccordionPanel p="0">
                <Flex direction={"column"}>
                  {/* <Flex w="100%" justifyContent={"space-between"}>
                      <Typography type="paragraph1" color="text.secondary">
                        Total Staked
                      </Typography>
                      <Typography type="paragraph1" color="text.primary">
                        {formatNumberWithNumeral(totalStaked || "0")} {symbol}{" "}
                      </Typography>
                    </Flex> */}
                  {/* <Flex my="8px" w="100%" justifyContent={"space-between"}>
                      <Typography type="paragraph1" color="text.secondary">
                        TVl
                      </Typography>
                      <Typography type="paragraph1" color="text.primary">
                        $43,264.23{" "}
                      </Typography>
                    </Flex> */}
                  {/* <Flex w="100%" justifyContent={"space-between"}>
                    <Typography type="paragraph1" color="text.secondary">
                      Harvest Lockup time{" "}
                    </Typography>
                    <Typography type="paragraph1" color="text.primary">
                      {harvestLockup} hours
                    </Typography>
                  </Flex> */}
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography type="paragraph1" color="text.secondary">
                      Total Staked
                    </Typography>
                    <Flex>
                      <Typography type="paragraph1" color="white">
                        {formatNumberWithNumeral(
                          Number(totalMktStaked ?? 0),
                          3
                        )}{" "}
                        {data.stakedSymbol}
                      </Typography>
                    </Flex>
                  </Flex>
                  <Flex
                    onClick={handleAddTokenToWallet}
                    my="8px"
                    w="fit-content"
                    cursor={"pointer"}
                  >
                    <Typography pr="8px" type="paragraph1" color="text.info">
                      Add MKT to Metamask{" "}
                    </Typography>
                    <Image src="/external-link.svg" alt="external link" />
                  </Flex>

                  <Link href={viewContractLink} target="_blank">
                    <Flex w="fit-content" cursor={"pointer"}>
                      <Typography pr="8px" type="paragraph1" color="text.info">
                        View Contract{" "}
                      </Typography>
                      <Image src="/external-link.svg" alt="external link" />
                    </Flex>
                  </Link>
                </Flex>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};
