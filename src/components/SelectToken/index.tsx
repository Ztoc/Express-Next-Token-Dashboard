import {
  Box,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Typography } from "../Typography";
import { AutoSizer, List, AutoSizerProps, ListProps } from "react-virtualized";
import { formatNumberWithNumeral } from "@src/utils/format";
import { useGetBalanceToken } from "@src/utils/useGetBalanceToken";
import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import listTokenJSON from "./listToken.json";
import { Currency, Token } from "@pancakeswap/sdk";
import { useAllTokens } from "@src/hooks/Tokens";
import CurrencyLogo from "../CurrencyLogo";
import useDebounce from "@src/hooks/useDebounce";
import { WrappedTokenInfo, createFilterToken } from "@pancakeswap/token-lists";
import useNativeCurrency from "@src/hooks/useNativeCurrency";
import useTokenComparator from "./sorting";
import useSortedTokensByQuery from "@src/hooks/useSortedTokensByQuery";
import {
  useAllLists,
  useInactiveListUrls,
} from "@src/redux/slices/lists/hooks";
import { useWeb3React } from "@src/hooks/useWeb3React";
import ListCurrency from "./ListCurrency";
import type { FixedSizeList } from "react-window";
import { listCommonToken } from "@src/constants/commonToken";
import { getAddress } from "@src/utils/address.utils";
import { isAddress } from "@src/utils/common";

interface SelectTokensProps {
  onSelectToken?: (token: Currency) => void;
  currency: Currency;
  isAddMore?: boolean;
}

const SelectTokens: React.FC<SelectTokensProps> = ({
  onSelectToken,
  currency,
  isAddMore,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        onClick={() => {
          if (onSelectToken) {
            onOpen();
          }
        }}
        px="12px"
        py="8px"
        borderRadius={"12px"}
        cursor={"pointer"}
        bg="bg.secondary"
        w="fit-content"
        align={"center"}
      >
        <CurrencyLogo currency={currency as any} />
        <Typography px="8px" type="body1" color="text.primary">
          {isAddMore
            ? currency?.symbol?.toLowerCase() === "wbnb"
              ? "BNB"
              : currency?.symbol
            : currency?.symbol || "SelectTokens"}
        </Typography>
        <ChevronDownIcon color="text.secondary" />
      </Flex>
      <ModalSelectTokens
        onSelectToken={onSelectToken}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

export default SelectTokens;

const ModalSelectTokens: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectToken?: (val: Currency) => void;
}> = ({ isOpen, onClose, onSelectToken }) => {
  const fixedList = useRef<FixedSizeList>();

  const [valueInput, setValueInput] = React.useState("");
  const [invertSearchOrder] = useState<boolean>(false);

  const onChange = (e: { target: { value: React.SetStateAction<string> } }) =>
    setValueInput(e.target.value);

  const allTokens = useAllTokens();

  const debouncedQuery = useDebounce(valueInput, 200);
  const filteredTokens: Token[] = useMemo(() => {
    const filterToken = createFilterToken(debouncedQuery, (address: any) =>
      Boolean(isAddress(address))
    );
    return Object.values(allTokens).filter(filterToken);
  }, [allTokens, debouncedQuery]);

  const filteredQueryTokens = useSortedTokensByQuery(
    filteredTokens,
    debouncedQuery
  );

  const native = useNativeCurrency();

  const tokenComparator = useTokenComparator(invertSearchOrder);

  const filteredSortedTokens: Token[] = useMemo(() => {
    return [...filteredQueryTokens].sort(tokenComparator);
  }, [filteredQueryTokens, tokenComparator]);

  const filteredInactiveTokens = useSearchInactiveTokenLists(debouncedQuery);

  const handleCloseModal = () => {
    onClose();
    setValueInput("");
  };

  const handleEnter = useCallback(
    (e: any) => {
      if (e.key === "Enter") {
        const s = debouncedQuery.toLowerCase().trim();
        if (s === native.symbol.toLowerCase().trim()) {
          onSelectToken && onSelectToken(native);
        } else if (
          filteredSortedTokens &&
          filteredSortedTokens.length > 0 &&
          filteredSortedTokens[0]
        ) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() ===
              debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            onSelectToken && onSelectToken(filteredSortedTokens[0]);
          }
        }
      }
    },
    [debouncedQuery, filteredSortedTokens, onSelectToken, native]
  );

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onSelectToken && onSelectToken(currency);
      onClose();
    },
    [onClose, onSelectToken]
  );

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent
        maxW="400px"
        py="16px"
        borderRadius={"12px"}
        mx="10px"
        bg="bg.secondary"
      >
        <ModalCloseButton
          mt="6px"
          color="text.secondary"
          _hover={{
            color: "text.primary",
          }}
        />{" "}
        <ModalBody p="0px">
          <Flex px="16px" direction={"column"}>
            <Typography type="headline5" color="text.primary">
              Select Tokens
            </Typography>
            <InputGroup mt="20px" className="style-focus">
              <Input
                border="1px solid"
                borderColor="bg.tertiary"
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
                  background: "bg.default",
                }}
                onChange={onChange}
                value={valueInput}
                placeholder="Search name or paste address"
                color={"text.primary"}
                _placeholder={{
                  color: "text.muted",
                }}
                paddingLeft={"16px"}
                pl="40px"
                onKeyDown={handleEnter}
              />
              <InputLeftElement>
                <SearchIcon color="text.secondary" />
              </InputLeftElement>
            </InputGroup>
          </Flex>
          <ListTokenCommon onSelectToken={onSelectToken} onClose={onClose} />
          <Box height={"340px"} className="style-scroll">
            <ListCurrency
              showNative={true}
              currencies={filteredSortedTokens}
              inactiveCurrencies={filteredInactiveTokens}
              breakIndex={
                Boolean(filteredInactiveTokens?.length) && filteredSortedTokens
                  ? filteredSortedTokens.length
                  : undefined
              }
              onCurrencySelect={handleCurrencySelect}
              // otherCurrency={otherSelectedCurrency}
              // selectedCurrency={selectedCurrency}
              fixedListRef={fixedList}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const Balance: React.FC<{ tokenAddress: string }> = ({ tokenAddress }) => {
  const balance = useGetBalanceToken(tokenAddress);

  return (
    <Typography type="body1" color="#768597">
      {formatNumberWithNumeral(balance)}
    </Typography>
  );
};

const ListTokenCommon: React.FC<{
  onSelectToken?: (val: Currency) => void;
  onClose: () => void;
}> = ({ onSelectToken, onClose }) => {
  const nativeToken = useNativeCurrency();

  return (
    <Flex
      w="100%"
      flexWrap={"wrap"}
      mt="4px"
      pb="16px"
      borderBottom="1px solid"
      borderColor="bg.muted"
      px="16px"
    >
      {listCommonToken.map((item, idx) => {
        return (
          <TokenItemListCommon
            token={item}
            onClose={onClose}
            isLastItem={idx === listCommonToken.length - 1}
            key={`item-common-${idx}`}
            onCurrencySelect={onSelectToken}
          />
        );
      })}
    </Flex>
  );
};

const TokenItemListCommon: React.FC<{
  token: any;
  isLastItem: boolean;
  onClose: () => void;
  onCurrencySelect?: (cur: Currency) => void;
}> = ({ token, isLastItem, onCurrencySelect, onClose }) => {
  const { chainId } = useWeb3React();
  const nativeToken = useNativeCurrency();
  const handleSelect = () => {
    const newToken = token.address
      ? new Token(
          chainId,
          token.address
            ? getAddress(token.address, chainId)
            : (undefined as any),
          token?.decimals || 18,
          token.symbol,
          token.name,
          token.projectLink
        )
      : nativeToken;

    onCurrencySelect && onCurrencySelect(newToken);
    onClose();
  };
  return (
    <>
      <Flex
        align={"center"}
        mr="12px"
        px="8px"
        py="6px"
        border="1px solid"
        borderColor="bg.tertiary"
        borderRadius={"8px"}
        mt="12px"
        cursor={"pointer"}
        onClick={handleSelect}
      >
        <CurrencyLogo currency={token as any} />
        <Typography pl="8px" type="body1" color="text.primary">
          {token?.symbol}
        </Typography>
      </Flex>
    </>
  );
};

function useSearchInactiveTokenLists(
  search: string | undefined,
  minResults = 10
): WrappedTokenInfo[] {
  const lists = useAllLists();
  const inactiveUrls = useInactiveListUrls();
  const { chainId } = useWeb3React();
  const activeTokens = useAllTokens();
  return useMemo(() => {
    if (!search || search.trim().length === 0) return [];
    const filterToken = createFilterToken(search, (address) =>
      Boolean(isAddress(address))
    );
    const exactMatches: WrappedTokenInfo[] = [];
    const rest: WrappedTokenInfo[] = [];
    const addressSet: { [address: string]: true } = {};
    const trimmedSearchQuery = search.toLowerCase().trim();
    // eslint-disable-next-line no-restricted-syntax
    for (const url of inactiveUrls) {
      const list = lists[url]?.current;
      // eslint-disable-next-line no-continue
      if (!list) continue;
      // eslint-disable-next-line no-restricted-syntax
      for (const tokenInfo of list.tokens) {
        if (
          tokenInfo.chainId === chainId &&
          !(tokenInfo.address in activeTokens) &&
          !addressSet[tokenInfo.address] &&
          filterToken(tokenInfo)
        ) {
          const wrapped: WrappedTokenInfo = new WrappedTokenInfo({
            ...tokenInfo,
            address: isAddress(tokenInfo.address) || (tokenInfo.address as any),
          });
          addressSet[wrapped.address] = true;
          if (
            tokenInfo.name?.toLowerCase() === trimmedSearchQuery ||
            tokenInfo.symbol?.toLowerCase() === trimmedSearchQuery
          ) {
            exactMatches.push(wrapped);
          } else {
            rest.push(wrapped);
          }
        }
      }
    }
    return [...exactMatches, ...rest].slice(0, minResults);
  }, [activeTokens, chainId, inactiveUrls, lists, minResults, search]);
}
