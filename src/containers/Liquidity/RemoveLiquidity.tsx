import {
  Button,
  Divider,
  Flex,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { Pair } from "@pancakeswap/sdk";
import CurrencyLogo from "@src/components/CurrencyLogo";
import { Typography } from "@src/components/Typography";
import { useToast } from "@src/hooks/useToast";
import { useWeb3React } from "@src/hooks/useWeb3React";
import { Field } from "@src/redux/slices/burn/actions";
import {
  useBurnActionHandlers,
  useBurnState,
  useDerivedBurnInfo,
} from "@src/redux/slices/burn/hooks";
import {
  useUserDeadline,
  useUserSlippageTolerance,
} from "@src/redux/slices/user/hooks";
import { calculateGasMargin } from "@src/utils/calculateGasMargin";
import { calculateSlippageAmount } from "@src/utils/exchange";
import { isNativeCoin } from "@src/utils/isNativeCoin";
import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ButtonComponent } from "../PoolPage";
import useSWR from "swr";
import { getContract } from "@src/utils/contractHelper";
import contracts from "@src/constants/contracts";
import erc20ABI from "@src/configs/abis/erc20.json";
import IPancakeRouter02ABI from "@src/configs/abis/IPancakeRouter02.json";
import { useSigner } from "wagmi";
import { MAX_INT } from "@src/constants";
import { useModal } from "@src/hooks/useModal";
import { formatCurrency } from "@src/utils/formatCurrency";
import useNativeCurrency from "@src/hooks/useNativeCurrency";

const RemoveLiquidity: React.FC<{ data: Pair; avail: string }> = ({
  data,
  avail,
}) => {
  const removeLiquidityModal = useModal();
  const nativeToken = useNativeCurrency();

  const tokenA: any =
    data?.token0?.symbol === "WBNB" ? nativeToken : data?.token0;

  const tokenB: any =
    data?.token1?.symbol === "WBNB" ? nativeToken : data?.token1;
  const { toastError, toastSuccess, toastProcessingTx } = useToast();
  const { independentField, typedValue } = useBurnState();
  const { parsedAmounts, error } = useDerivedBurnInfo(tokenA, tokenB);
  const [isApproved, setIsPendingApproved] = useState(false);
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);
  const { data: signer } = useSigner();
  const { account, chainId } = useWeb3React();
  const [isPendingApprover, setIsPendingApprover] = useState(false);

  const liquidityContract = useMemo(() => {
    return getContract(data?.liquidityToken.address, erc20ABI, chainId, signer);
  }, [chainId, data?.liquidityToken.address, signer]) as any;

  const routerContract = useMemo(() => {
    return getContract(
      contracts.routerPancake[chainId],
      IPancakeRouter02ABI,
      chainId,
      signer
    );
  }, [chainId, signer]) as any;

  const { data: allowance } = useSWR(["allowance", account], async () => {
    const res = await liquidityContract.allowance(
      account,
      contracts.routerPancake[chainId]
    );
    return res;
  });
  const [amount, setAmount] = useState<number | string>("");

  useEffect(() => {
    setIsPendingApproved(
      new BigNumber(allowance?._hex)
        .minus(Number(avail) * Number(amount) * 1e16)
        .isGreaterThan(0)
    );
  }, [allowance?._hex, amount, avail]);

  const { onUserInput } = useBurnActionHandlers();

  const handleChangeAmount = (e: any) => {
    const value = typeof e === "number" ? e : e.target.value;
    onUserInput(
      Field.LIQUIDITY_PERCENT,
      Math.floor(Number(value ?? "0"))?.toString() || "0"
    );
    setAmount(value);
  };

  const handleApprove = useCallback(async () => {
    try {
      setIsPendingApprover(true);
      const tx = await liquidityContract.approve(
        contracts.routerPancake[chainId],
        MAX_INT.toString()
      );

      await tx.wait();
      setIsPendingApproved(true);
      setIsPendingApprover(false);
    } catch (error) {
      setIsPendingApprover(false);
    }
  }, [chainId, liquidityContract]);

  const formattedAmounts = {
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A
        ? typedValue
        : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? "",
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B
        ? typedValue
        : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? "",
  };

  const [allowedSlippage] = useUserSlippageTolerance();
  const [deadline] = useUserDeadline();

  async function onRemove() {
    try {
      if (!chainId || (!account && !!error))
        throw new Error("missing dependencies");
      const {
        [Field.CURRENCY_A]: currencyAmountA,
        [Field.CURRENCY_B]: currencyAmountB,
      } = parsedAmounts;
      if (!currencyAmountA || !currencyAmountB) {
        throw new Error("missing currency amounts");
      }

      const amountsMin = {
        [Field.CURRENCY_A]: calculateSlippageAmount(
          currencyAmountA,
          allowedSlippage
        )[0],
        [Field.CURRENCY_B]: calculateSlippageAmount(
          currencyAmountB,
          allowedSlippage
        )[0],
      };

      if (!tokenA || !tokenB) throw new Error("missing tokens");
      const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
      if (!liquidityAmount) throw new Error("missing liquidity amount");
      const currencyBIsETH = isNativeCoin(tokenB);
      const oneCurrencyIsETH = isNativeCoin(tokenA) || currencyBIsETH;
      const deadlineFromNow = Math.ceil(Date.now() / 1000) + deadline;
      if (!tokenA || !tokenB) throw new Error("could not wrap");

      let methodNames: string[];
      let args: Array<string | string[] | number | boolean>;
      // we have approval, use normal remove liquidity
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = [
          "removeLiquidityETH",
          "removeLiquidityETHSupportingFeeOnTransferTokens",
        ];
        args = [
          currencyBIsETH ? tokenA?.address : tokenB?.address,
          liquidityAmount.quotient.toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
          ].toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
          ].toString(),
          account,
          deadlineFromNow,
        ];
      }
      // removeLiquidity
      else {
        methodNames = ["removeLiquidity"];
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadlineFromNow,
        ];
      }

      const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
        methodNames.map((methodName, index) =>
          routerContract.estimateGas[methodName](...args)
            .then(calculateGasMargin)
            .catch((e: any) => {
              console.error(`estimateGas failed`, index, methodName, args, e);
              return undefined;
            })
        )
      );

      const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(
        (safeGasEstimate) => BigNumber.isBigNumber(safeGasEstimate)
      );
      console.log("indexOfSuccessfulEstimation", indexOfSuccessfulEstimation);
      // all estimations failed...
      if (indexOfSuccessfulEstimation === -1) {
        toastError(
          "Error",
          "This transaction would fail. Please contact support."
        );
      } else {
        const methodName = methodNames[indexOfSuccessfulEstimation];
        const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation];
        setIsLoadingRemove(true);
        await routerContract[methodName](...args, {
          gasLimit: safeGasEstimate,
        })
          .then((response: any) => {
            toastProcessingTx("Remove Liquidity Processing");
            response
              .wait()
              .then(() => {
                toastSuccess("Remove Liquidity completed", response?.hash);
                setIsLoadingRemove(false);
              })
              .catch((e: any) => {
                setIsLoadingRemove(false);

                toastError(
                  "Remove Liquidity Failed",
                  e.reason || "Failed to remove liquidity"
                );
              });
          })
          .catch((e: any) => {
            setIsLoadingRemove(false);
            toastError(
              "Remove Liquidity Failed",
              e.reason || "Failed to remove liquidity"
            );
          });
      }
    } catch {
      //    empty
    }
  }

  return (
    <>
      <ButtonComponent
        background={"transparent"}
        border="1px solid"
        borderColor="bg.tertiary"
        color="text.primary"
        _hover={{
          bg: "bg.tertiary",
        }}
        mt="0px"
        w="48%"
        onClick={removeLiquidityModal.openModal}
        title="Remove"
      />
      <Modal
        autoFocus={false}
        isOpen={removeLiquidityModal?.isOpen}
        onClose={removeLiquidityModal?.closeModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg="bg.secondary" p="16px" borderRadius={"8px"}>
          <ModalCloseButton
            mt="6px"
            color="text.secondary"
            _hover={{
              color: "text.primary",
            }}
          />
          <ModalBody p="0">
            <Flex w="100%" mx="auto" bg="bg.secondary" direction={"column"}>
              <Typography
                textAlign={"center"}
                color="text.primary"
                type="headline5"
              >
                Remove{" "}
                {tokenA?.symbol?.toLowerCase() === "wbnb"
                  ? "BNB"
                  : tokenA?.symbol}{" "}
                -{" "}
                {tokenB?.symbol?.toLowerCase() === "wbnb"
                  ? "BNB"
                  : tokenB?.symbol}{" "}
                Liquidity
              </Typography>
              <Flex
                mt="24px"
                mb="8px"
                w="100%"
                justify={"space-between"}
                align={"center"}
              >
                <Typography type="caption1-r" color="text.secondary">
                  Percent to remove
                </Typography>
                <Typography as="span" type="caption1-r" color="text.secondary">
                  Avail:
                  <Typography
                    as="span"
                    px="4px"
                    type="caption1-r"
                    color="text.primary"
                  >
                    {formatCurrency(avail, 5)}
                  </Typography>
                  LP
                </Typography>
              </Flex>

              <Flex
                borderRadius={"8px"}
                direction={"column"}
                bg="bg.default"
                p="16px"
              >
                <InputGroup className="style-focus">
                  <Input
                    _hover={{
                      borderColor: "bg.brand",
                    }}
                    _active={{
                      borderColor: "bg.brand",
                    }}
                    errorBorderColor={"text.error"}
                    _focus={{
                      borderColor: "bg.brand",
                      boxShadow: "none",
                    }}
                    border="none"
                    fontSize={"28px"}
                    fontWeight={"500"}
                    onChange={handleChangeAmount}
                    value={amount}
                    placeholder="0.0"
                    p="0px"
                    color={"text.primary"}
                    _placeholder={{
                      color: "text.muted",
                    }}
                    type="number"
                  />
                </InputGroup>
                <Divider mt="10px" mb="8px" color="bg.secondary" />
                <Flex justifyContent={"space-between"} w="100%">
                  {[10, 25, 50, 75, 100].map((e) => {
                    return (
                      <Flex
                        w="60px"
                        align={"center"}
                        justify={"center"}
                        h="32px"
                        cursor={"pointer"}
                        bg="bg.secondary"
                        borderRadius={"8px"}
                        key={`percent-${e}`}
                        onClick={() => handleChangeAmount(e)}
                      >
                        <Typography type="button2" color="text.secondary">
                          {e}%
                        </Typography>
                      </Flex>
                    );
                  })}
                </Flex>
              </Flex>
              <Typography type="body1" color="text.primary" mt="24px" mb="8px">
                Receive
              </Typography>

              <Flex
                border="1px solid"
                borderColor={"#3E454B"}
                py="12px"
                direction={"column"}
                px="16px"
                borderRadius={"8px"}
              >
                <Flex
                  align={"center"}
                  w="100%"
                  justifyContent={"space-between"}
                >
                  <Flex color="white" fontWeight={600} gap="4px">
                    <CurrencyLogo currency={tokenA} /> {tokenA.symbol}
                  </Flex>
                  <Typography type="body1" color="text.primary">
                    {formattedAmounts[Field.CURRENCY_A] || "-"}
                  </Typography>
                </Flex>
                <Flex
                  mt="8px"
                  align={"center"}
                  w="100%"
                  justifyContent={"space-between"}
                >
                  <Flex color="white" fontWeight={600} gap="4px">
                    <CurrencyLogo currency={tokenB} /> {tokenB.symbol}
                  </Flex>
                  <Typography type="body1" color="text.primary">
                    {formattedAmounts[Field.CURRENCY_B] || "-"}
                  </Typography>
                </Flex>
              </Flex>
              {isApproved ? (
                <ButtonComponent
                  isDisabled={
                    amount === "" || amount === "0" || Number(amount) > 100
                  }
                  h="48px"
                  onClick={onRemove}
                  mt="24px"
                  loadingText="Remove..."
                  isLoading={isLoadingRemove}
                  title={"Remove"}
                />
              ) : (
                <ButtonComponent
                  h="48px"
                  onClick={handleApprove}
                  mt="24px"
                  isLoading={isPendingApprover}
                  loadingText={`Approve...`}
                  title={"Approve"}
                />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RemoveLiquidity;
