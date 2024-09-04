import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure,
  Switch,
  Button,
} from "@chakra-ui/react";
import ButtonConnectWallet from "@src/components/ButtonConnectWallet";
import { Typography } from "@src/components/Typography";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import BigNumber from "bignumber.js";
import useSWR from "swr";
import { useAccount } from "wagmi";
import {
  SwitchIcon,
  RotateSwitchIcon,
  WalletIcon,
  GasFeeIcon,
  SettingIcon,
} from "@src/components/Icon";
import ItemSwap from "./components/ItemSwap";
import { useWeb3React } from "@src/hooks/useWeb3React";
import {
  useGasPrice,
  useUserSlippageTolerance,
} from "@src/redux/slices/user/hooks";
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapState,
} from "@src/redux/slices/swap/hooks";
import { Currency, CurrencyAmount } from "@pancakeswap/sdk";
import { useCurrency } from "@src/hooks/Tokens";
import useWrapCallback, { WrapType } from "@src/hooks/swap/useWrapCallback";
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
} from "@src/utils/exchange";
import { useSwapActionHandlers } from "@src/redux/slices/swap/useSwapActionHandlers";
import {
  ApprovalState,
  useApproveCallbackFromTrade,
} from "@src/hooks/useApproveCallback";
import { maxAmountSpend, maxAmountSpend1 } from "@src/utils/getmaxAmountSpend";
import { useIsTransactionUnsupported } from "@src/hooks/swap/Trades";
import { escapeRegExp } from "lodash";
import SelectTokens from "@src/components/SelectToken";
import { useCurrencyBalance } from "@src/hooks/wallet";
import { SwapAction } from "./components/SwapAction";

export enum Field {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
}

const listOptionsAmount = [
  { value: 25, label: "25%" },
  { value: 50, label: "50%" },
  // { value: 75, label: "75%" },
  { value: 100, label: "Max" },
];
const SwapPage: React.FC = () => {
  const [isApproved, setIsPendingApproved] = useState(false);
  const { account, chainId } = useWeb3React();
  const [allowedSlippage, setAllowedSlippage] = useUserSlippageTolerance();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  useDefaultsFromURLSearch();
  // let tokenContract = account;
  // const { data: allowance, error } = useSWR(
  //   ["allowance", account],
  //   async () => {
  //     const res = await tokenContract.allowance(
  //       account,
  //       0xce5bacb6f5f93724e59f5d8362df2c249d55b293
  //     );
  //     return res;
  //   }
  // );
  // useEffect(() => {
  //   setIsPendingApproved(new BigNumber(allowance?._hex).isGreaterThan(0));
  // }, [allowance?._hex]);
  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState();
  const [percent, setPercent] = useState<number | string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const tabSetting = [0.1, 0.2, 0.8, 1, 2];
  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency ?? undefined,
      [Field.OUTPUT]: outputCurrency ?? undefined,
    }),
    [inputCurrency, outputCurrency]
  );
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    inputError: swapInputError,
  } = useDerivedSwapInfo(
    independentField,
    typedValue,
    inputCurrency as any,
    outputCurrency as any,
    recipient as any
  );
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  );
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const gasPrice = useGasPrice();
  const trade = showWrap ? undefined : v2Trade;
  const slippageAdjustedAmounts = trade
    ? computeSlippageAdjustedAmounts(v2Trade, allowedSlippage)
    : undefined;
  const { priceImpactWithoutFee, realizedLPFee } =
    computeTradePriceBreakdown(v2Trade);

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]:
          independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]:
          independentField === Field.OUTPUT
            ? parsedAmount
            : trade?.outputAmount,
      };

  const { onSwitchTokens, onCurrencySelection, onUserInput } =
    useSwapActionHandlers();

  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ""
      : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };
  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(
    trade,
    allowedSlippage,
    chainId
  );
  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);
  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);
  const needApproval = approval === ApprovalState.NOT_APPROVED;

  const handleInputSelect = useCallback(
    (newCurrencyInput: Currency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, newCurrencyInput);
    },
    [onCurrencySelection]
  );
  const balanceInput = currencyBalances[Field.INPUT];
  const balanceOutput = currencyBalances[Field.OUTPUT];
  const handleMaxInput = useCallback(() => {
    if (balanceInput) {
      onUserInput(Field.INPUT, balanceInput.toExact());
    }
  }, [balanceInput, onUserInput]);

  const handleMaxOutput = useCallback(() => {
    if (balanceOutput) {
      onUserInput(Field.OUTPUT, balanceOutput.toExact());
    }
  }, [balanceOutput, onUserInput]);
  const handleOutputSelect = useCallback(
    (newCurrencyOutput: any) => {
      onCurrencySelection(Field.OUTPUT, newCurrencyOutput);
    },

    [onCurrencySelection]
  );

  const swapIsUnsupported = useIsTransactionUnsupported(
    currencies?.INPUT,
    currencies?.OUTPUT
  );

  const [slippageInput, setSlippageInput] = useState("");
  const inputRegex = /^\d*(?:\\[.])?\d*$/; // match escaped "." characters via in a non-capturing group
  const parseCustomSlippage = (value: string) => {
    if (value === "" || inputRegex.test(escapeRegExp(value))) {
      setSlippageInput(value);

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt(
          (Number.parseFloat(value) * 100).toString(),
          10
        );
        if (
          !Number.isNaN(valueAsIntFromRoundedFloat) &&
          valueAsIntFromRoundedFloat < 5000
        ) {
          setAllowedSlippage(valueAsIntFromRoundedFloat);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const defaultInput = useCurrency("bnb");
  const defaultOutput = useCurrency(
    "0xf542ac438cf8cd4477a1fc7ab88adda5426d55ed"
  );

  const titleButton = useMemo(() => {
    if (swapInputError) {
      return swapInputError;
    }
    if (needApproval) {
      return "Approve";
    }
    return "Swap";
  }, [needApproval, swapInputError]);
  const handleChangeAmount = (e: any) => {
    setPercent(e);
    if (e === 100) {
      return onUserInput(Field.INPUT, balanceInput?.toExact() ?? "");
    } else {
      {
        onUserInput(
          Field.INPUT,
          Number((Number(balanceInput?.toExact()) * e) / 100).toString()
        );
      }
    }
  };
  // let newList
  // if (Number(balanceInput?.toFixed() ?? 0) < 100000) {
  //   console.log("object :>> ");
  //   listOptionsAmount.filter((e) => e.value !== 75);
  // }
  return (
    <>
      <Flex
        className="max-w-[1200px] w-full mx-auto h-full item-center"
        align={"center"}
      >
        <Flex
          borderRadius={"12px"}
          className="bg-secondary "
          flexDirection={"column"}
          h="fit-content"
          px="16px"
          w="100%"
          maxWidth="480px"
          mx="auto"
        >
          <Flex justifyContent={"space-between"} align={"center"} my="16px">
            <Typography type="headline5" className="text-primary">
              Swap
            </Typography>
            <Flex>
              <SettingIcon
                onClick={onOpen}
                cursor={"pointer"}
                boxSize={"24px"}
              />
            </Flex>
          </Flex>
          <Flex flexDirection="column">
            <Flex
              borderTopRadius={"12px"}
              p="24px 16px 28px 16px"
              className="bg-default"
              flexDirection={"column"}
              position={"relative"}
            >
              <Flex align={"center"} justifyContent={"space-between"}>
                <SelectTokens
                  onSelectToken={handleInputSelect}
                  currency={currencies[Field.INPUT] ?? (defaultInput as any)}
                />
                <Typography type="headline3" w="70%" className="text-secondary">
                  <Input
                    sx={{
                      fontSize: {
                        xs: "24px",
                        md: "26px",
                        lg: "28px",
                      },
                    }}
                    variant="unstyled"
                    placeholder="0.0"
                    value={formattedAmounts[Field.INPUT]}
                    onChange={(e) => handleTypeInput(e.target.value ?? "")}
                    color="text.primary"
                    textAlign={"right"}
                    type="number"
                  />
                </Typography>
              </Flex>
              <Flex justifyContent={"space-between"} align={"center"} mt="16px">
                <Flex align={"center"}>
                  <Typography type="caption1-r" className="text-primary mr-2">
                    <WalletIcon boxSize={"20px"} /> {balanceInput?.toFixed(3)}{" "}
                  </Typography>
                  {/* <Typography
                    type="paragraph2"
                    className="text-brand"
                    cursor={"pointer"}
                    onClick={handleMaxInput}
                  >
                    MAX{" "}
                  </Typography> */}
                </Flex>
                <Flex
                  sx={{
                    // width:"100%"
                    gap: "10px",
                  }}
                >
                  {listOptionsAmount.map((item) => (
                    <Button
                      variant={"unstyled"}
                      key={item.value}
                      onClick={() => handleChangeAmount(item.value)}
                      sx={{
                        h: "24px",
                        borderRadius: "10px",
                        width: "60px",
                        fontSize: "12px",
                        fontWeight: "medium",
                      }}
                      border="1px solid"
                      borderColor={
                        item.value === percent ? "text.brand" : "text.secondary"
                      }
                      color={
                        item.value === percent ? "text.brand" : "text.secondary"
                      }
                      fontSize={"sm"}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Flex>
                {/* <Typography type="body2" className="text-secondary">
                  $.00
                </Typography> */}
              </Flex>
              <SwitchIcon
                position={"absolute"}
                boxSize={"36px"}
                bottom={"-18px"}
                left={"46%"}
                onClick={onSwitchTokens}
              />
            </Flex>
            <Flex
              borderBottomRadius={"12px"}
              p="24px 16px 16px 16px"
              className="bg-default"
              flexDirection={"column"}
              mt="4px"
            >
              <Flex align={"center"} justifyContent={"space-between"}>
                <SelectTokens
                  onSelectToken={handleOutputSelect}
                  currency={currencies[Field.OUTPUT] ?? (defaultInput as any)}
                />
                <Input
                  sx={{
                    fontSize: {
                      xs: "24px",
                      md: "26px",
                      lg: "28px",
                    },
                  }}
                  variant="unstyled"
                  placeholder="0.0"
                  value={formattedAmounts[Field.OUTPUT]}
                  onChange={(e) => handleTypeOutput(e.target.value)}
                  color="text.primary"
                  textAlign={"right"}
                />
              </Flex>
              <Flex justifyContent={"space-between"} align={"center"} mt="9px">
                <Flex>
                  <Typography type="caption1-r" className="text-primary mr-2">
                    <WalletIcon boxSize={"20px"} />{" "}
                    {balanceOutput?.toFixed(3) ?? "0.000"}{" "}
                  </Typography>
                  {/* <Typography
                    type="paragraph2"
                    className="text-brand"
                    cursor={"pointer"}
                    onClick={handleMaxOutput}
                  >
                    MAX{" "}
                  </Typography> */}
                </Flex>
                {/* <Typography type="body2" className="text-secondary">
                  $.00
                </Typography> */}
              </Flex>
            </Flex>
          </Flex>
          <Flex my="24px">
            <SwapAction
              trade={trade}
              titleButton={titleButton}
              swapInputError={swapInputError}
              allowedSlippage={allowedSlippage}
              recipient={recipient}
              approveCallback={approveCallback}
              needApproval={needApproval}
            />
          </Flex>
          {account && (
            <Flex w="100%" mb="24px">
              <Accordion w="100%" allowMultiple>
                <AccordionItem border="0">
                  <h2>
                    <AccordionButton
                      p="0"
                      _expanded={{
                        borderBottom: "1px solid #36414B",
                        p: "0 0 16px 0",
                      }}
                    >
                      <Flex
                        as="span"
                        flex="1"
                        textAlign="left"
                        justifyContent={"space-between"}
                      >
                        <Typography type="body2">
                          <Flex className="text-primary">
                            1 {currencies[Field.INPUT]?.symbol}{" "}
                            <RotateSwitchIcon boxSize={"20px"} mx="8px" />{" "}
                            {trade?.executionPrice?.toSignificant(6)}{" "}
                            {currencies[Field.OUTPUT]?.symbol}{" "}
                            {/* <Text ml="12px" className="text-secondary">
                              ($620.22)
                            </Text> */}
                          </Flex>
                        </Typography>
                        <Typography type="body2" className="text-secondary">
                          <GasFeeIcon boxSize={"20px"} /> $0.5
                        </Typography>
                      </Flex>
                      <AccordionIcon boxSize={"24px"} color="#778092" />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel className="text-primary" p="0" mt="16px">
                    <ItemSwap
                      title="Price Impact"
                      content={`${allowedSlippage / 1000} %`}
                    />
                    <ItemSwap
                      title="Minimum Output"
                      content={
                        (slippageAdjustedAmounts && (
                          <>
                            <b>
                              {slippageAdjustedAmounts &&
                                slippageAdjustedAmounts[
                                  Field.OUTPUT
                                ]?.toSignificant(4)}
                            </b>
                            {` ${currencies[Field.OUTPUT]?.symbol || ""}`}
                          </>
                        )) ??
                        "---"
                      }
                    />
                    <ItemSwap
                      title="Expect Output"
                      content={`${formattedAmounts[Field.OUTPUT]}  ${
                        currencies[Field.OUTPUT]?.symbol || ""
                      }`}
                    />
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Flex>
          )}
        </Flex>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="#232325" p="16px">
          <ModalCloseButton />
          <Typography type="headline5" className="text-primary">
            Settings
          </Typography>
          <Flex p="8px" flexDirection={"column"}>
            <Typography type="paragraph1" pb="16px" className="text-secondary">
              Slippage Tolerance
            </Typography>
            <Tabs variant="soft-rounded" mb="12px" w="100%">
              <TabList w="100%">
                {tabSetting.map((item, index) => {
                  return (
                    <Tab
                      h="32px"
                      border="1px solid #414E5A"
                      color="#F6F6FF"
                      borderRadius={"6px"}
                      _selected={{
                        border: "1px solid #1ED760",
                        color: "#1ED760",
                      }}
                      p="6px 12px"
                      w={"inherit"}
                      key={`${item}-${index}`}
                      mr={index === tabSetting.length - 1 ? "" : "8px"}
                      onClick={() => parseCustomSlippage(item.toString())}
                    >
                      {item}%
                    </Tab>
                  );
                })}
              </TabList>
            </Tabs>
            <InputGroup size="md">
              <Input
                className="text-primary"
                _placeholder={{ color: "#555C6D" }}
                borderColor={"#414E5A"}
                pr="4.5rem"
                placeholder="Default"
                onBlur={(e) => parseCustomSlippage(e.target.value)}
              />
              <InputRightElement width="2.5rem" className="text-secondary">
                %
              </InputRightElement>
            </InputGroup>
            <Typography
              type="paragraph1"
              pt="24px"
              pb="8px"
              className="text-secondary"
            >
              Transaction Deadline
            </Typography>
            <InputGroup size="md">
              <Input
                className="text-primary"
                pr="4.5rem"
                _placeholder={{ color: "#555C6D" }}
                placeholder="Minutes"
                borderColor={"#414E5A"}
              />
              <InputRightElement width="5rem" className="text-secondary">
                Minutes
              </InputRightElement>
            </InputGroup>
            <Flex
              align={"center"}
              pt="24px"
              pb="8px"
              justifyContent={"space-between"}
            >
              <Typography type="paragraph1" className="text-secondary">
                Transaction Deadline
              </Typography>
              <Switch />
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SwapPage;
