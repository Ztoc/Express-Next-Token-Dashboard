import { Flex } from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";
import React, { useMemo } from "react";
import { ButtonComponent } from "../PoolPage";
import { AddIcon } from "@chakra-ui/icons";
import { useWeb3React } from "@src/hooks/useWeb3React";
import { toV2LiquidityToken } from "@src/utils/user";
import { CurrencyAmount, ERC20Token, Pair, Token } from "@pancakeswap/sdk";
import {
  useTokenBalance,
  useTokenBalancesWithLoadingIndicator,
} from "@src/hooks/wallet";
import { usePairs } from "@src/hooks/usePairs";
import { useTrackedTokenPairs } from "@src/redux/slices/user/hooks";
import CurrencyLogo from "@src/components/CurrencyLogo";
import { formatCurrency } from "@src/utils/formatCurrency";
import useTotalSupply from "@src/hooks/useTotalSupply";
import Image from "next/image";
import ButtonConnectWallet from "@src/components/ButtonConnectWallet";
import RemoveLiquidity from "./RemoveLiquidity";
import Link from "next/link";
import AddMoreLiquidity from "./ModalAddMore";

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

const MyLiquidity: React.FC = () => {
  const { account } = useWeb3React();
  const trackedTokenPairs = useTrackedTokenPairs();

  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens,
      })),
    [trackedTokenPairs]
  );

  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  );

  const [v2PairsBalances, fetchingV2PairBalances] =
    useTokenBalancesWithLoadingIndicator(account ?? undefined, liquidityTokens);

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan("0")
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  );
  const v2Pairs = usePairs(
    liquidityTokensWithBalances.map(({ tokens }) => tokens)
  );

  const allV2PairsWithLiquidity =
    v2Pairs && v2Pairs.length > 0
      ? v2Pairs
          ?.filter(
            ([pairState, pair]) =>
              pairState === PairState.EXISTS && Boolean(pair)
          )
          .map(([, pair]) => pair)
      : [];

  return (
    <Flex
      px={{
        base: "16px",
        lg: "24px",
        "2xl": 0,
      }}
      py="48px"
      direction={"column"}
      w="100%"
      mx="auto"
      maxW="1200px"
      minHeight={"100vh"}
    >
      <Typography type="headline2" color="text.primary">
        My Liquidity
      </Typography>
      <Flex
        mb={"16px"}
        direction={{
          base: "column",
          lg: "row",
        }}
        w="100%"
        justifyContent={"space-between"}
      >
        <Typography mt="16px" type="body1-r" color="text.read">
          Add liquidity to earn fees shared and staking-LP rewards.
        </Typography>
        <Link href={"/liquidity/add"}>
          <ButtonComponent
            background={"transparent"}
            border="1px solid"
            borderColor="text.brand"
            color="text.brand"
            _hover={{
              color: "text.primary",
              bg: "bg.brand",
            }}
            w="fit-content"
            mt={{
              base: "16px",
              lg: 0,
            }}
            title={
              <Flex align={"center"}>
                <AddIcon mr="12px" boxSize="10px" />
                <Typography type="button1">Add Liquidity</Typography>
              </Flex>
            }
          />
        </Link>
      </Flex>

      <Flex w="100%" flexWrap={"wrap"} justifyContent={"space-around"}>
        {allV2PairsWithLiquidity && allV2PairsWithLiquidity.length > 0 ? (
          allV2PairsWithLiquidity.map((e, idx) => {
            return (
              <CardLiquidity data={e as Pair} key={`card-liquidity-${idx}`} />
            );
          })
        ) : (
          <Flex mt="120px">
            <Flex direction={"column"}>
              <Image
                width={200}
                height={100}
                style={{
                  margin: "0 auto",
                }}
                src={
                  account
                    ? "/images/search-not-found.svg"
                    : "/images/connect-wallet-empty.svg"
                }
                alt=""
              />
              <Typography mt="20px" type="button1" color="text.primary">
                {account
                  ? " You have no added liquidity!"
                  : "Connect Wallet to view your liquidity"}
              </Typography>

              <ButtonConnectWallet mt="24px" maxW="166px" mx="auto" />
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default MyLiquidity;

const CardLiquidity: React.FC<{ data: Pair }> = ({ data }) => {
  const { account } = useWeb3React();
  const tokenA = data.token0;
  const tokenB = data.token1;

  const userPoolBalance = useTokenBalance(
    account ?? undefined,
    data.liquidityToken
  ) as CurrencyAmount<ERC20Token>;

  const totalPoolTokens = useTotalSupply(data.liquidityToken);

  const useTokensDeposited = () => {
    return useMemo(() => {
      return !!data &&
        !!totalPoolTokens &&
        !!userPoolBalance &&
        totalPoolTokens.quotient >= userPoolBalance.quotient
        ? [
            data.getLiquidityValue(
              data.token0,
              totalPoolTokens,
              userPoolBalance,
              false
            ),
            data.getLiquidityValue(
              data.token1,
              totalPoolTokens,
              userPoolBalance,
              false
            ),
          ]
        : [undefined, undefined];
    }, [totalPoolTokens, userPoolBalance, data]);
  };

  const [token0Deposited, token1Deposited] = useTokensDeposited();

  return (
    <Flex p="1px" maxW="378px" mt="24px" w="100%" borderRadius="16px">
      <Flex
        borderRadius="16px"
        direction={"column"}
        w="100%"
        p="8px"
        bg="radial-gradient(141.40% 131.74% at 91.77% -7.16%, rgba(10, 89, 61, 0.66) 0%, rgba(17, 58, 51, 0.54) 22.33%, #151616 45.48%)"
      >
        <Flex direction={"column"} p="16px">
          <Flex align={"center"}>
            <DoubleLogo tokenB={tokenB} tokenA={tokenA} />
            <Typography
              pl="12px"
              color="text.primary"
              type="body1"
              fontSize={"20px"}
              fontWeight={700}
              lineHeight={"28px"}
            >
              {tokenA?.symbol?.toLowerCase() === "wbnb"
                ? "BNB"
                : tokenA?.symbol}{" "}
              -{" "}
              {tokenB?.symbol?.toLowerCase() === "wbnb"
                ? "BNB"
                : tokenB?.symbol}{" "}
              LP
            </Typography>
          </Flex>
          <Flex w="100%" mt="34px" justifyContent={"space-between"}>
            <Flex direction={"column"}>
              <Typography type="paragraph1" color="text.secondary">
                LP token amount
              </Typography>
              <Typography type="headline3" color="text.primary">
                {userPoolBalance
                  ? formatCurrency(userPoolBalance.toExact(), 4)
                  : "-"}{" "}
                LP
              </Typography>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          direction={"column"}
          p="16px"
          bg="rgba(255, 255, 255, 0.05)"
          borderRadius={"12px"}
        >
          <Flex align="center" w="100%" justifyContent={"space-between"}>
            <CurrencyLogo currency={tokenA} />
            <Flex direction={"column"}>
              <Typography type="body1" color="text.primary">
                {token0Deposited?.toSignificant(6)}
              </Typography>
            </Flex>
          </Flex>
          <Flex
            mt="16px"
            align="center"
            w="100%"
            justifyContent={"space-between"}
          >
            <CurrencyLogo currency={tokenB} />

            <Flex direction={"column"}>
              <Typography type="body1" color="text.primary">
                {token1Deposited?.toSignificant(6)}
              </Typography>
            </Flex>
          </Flex>
          <Flex mt="24px" w="100%" justifyContent={"space-between"}>
            <RemoveLiquidity
              avail={userPoolBalance.toExact()}
              data={data}
            />
            <AddMoreLiquidity data={data} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

interface DoubleLogoProps {
  tokenB: Token;
  tokenA: Token;
}

const DoubleLogo: React.FC<DoubleLogoProps> = ({ tokenA, tokenB }) => {
  return (
    <Flex>
      <CurrencyLogo currency={tokenA} />
      <CurrencyLogo
        style={{
          marginLeft: "-4px",
        }}
        currency={tokenB}
      />
    </Flex>
  );
};
