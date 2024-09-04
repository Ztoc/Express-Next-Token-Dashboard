import { Flex, Spinner, Text, Tooltip } from "@chakra-ui/react";
import type { Currency, CurrencyAmount, Token } from "@pancakeswap/sdk";
import type { MutableRefObject } from "react";
import React, { useCallback, useMemo } from "react";
import { FixedSizeList } from "react-window";
import CurrencyLogo from "@src/components/CurrencyLogo";
import useNativeCurrency from "@src/hooks/useNativeCurrency";
import { useWeb3React } from "@src/hooks/useWeb3React";
import { useCurrencyBalance } from "@src/hooks/wallet";
import { Typography } from "@src/components/Typography";


interface IListCurrency {
  currencies: Currency[];
  showNative: boolean;
  inactiveCurrencies: Currency[];
  breakIndex: number | undefined;
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>;
  onCurrencySelect: (currency: Currency) => void;
  selectedCurrency?: Currency | null;
  otherCurrency?: Currency | null;
}

const ListCurrency: React.FC<IListCurrency> = ({
  currencies,
  showNative,
  inactiveCurrencies,
  breakIndex,
  fixedListRef,
  selectedCurrency,
  otherCurrency,
  onCurrencySelect,
}) => {
  const native = useNativeCurrency();
  const { chainId } = useWeb3React();

  const itemData: (Currency | undefined)[] = useMemo(() => {
    let formatted: (Currency | undefined)[] = showNative
      ? [native, ...currencies, ...inactiveCurrencies]
      : [...currencies, ...inactiveCurrencies];
    if (breakIndex !== undefined) {
      formatted = [
        ...formatted.slice(0, breakIndex),
        // undefined,
        ...formatted.slice(breakIndex, formatted.length),
      ];
    }
    return formatted;
  }, [breakIndex, currencies, inactiveCurrencies, showNative, native]);

  const itemKey = useCallback(
    (index: number, data: any) => currencyKey(data[index]),
    []
  );

  const Row = useCallback(
    ({ data, index, style, key }: any) => {
      const currency: Currency = data[index];
      const isSelected = Boolean(
        selectedCurrency && currency && selectedCurrency.equals(currency)
      );
      const otherSelected = Boolean(
        otherCurrency && currency && otherCurrency.equals(currency)
      );
      const handleSelect = () => onCurrencySelect(currency);

      return (
        <div key={key} style={style}>
          <CurrencyRow
            currency={currency}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
          />
        </div>
      );
    },
    [
      selectedCurrency,
      otherCurrency,
      chainId,
      currencies.length,
      breakIndex,
      onCurrencySelect,
    ]
  );

  return (
    <FixedSizeList
      height={300}
      ref={fixedListRef as any}
      width={"100%"}
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
      className={"scrollbar-style"}
    >
      {Row}
    </FixedSizeList>
  );
};

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
}: {
  currency: Currency;
  onSelect: () => void;
  isSelected: boolean;
  otherSelected: boolean;
}) {
  const { account } = useWeb3React();
  const key = currencyKey(currency);
  // const selectedTokenList = useCombinedActiveList();
  // const isOnSelectedList = isTokenOnList(selectedTokenList, currency);
  // const customAdded = useIsUserAddedToken(currency);
  const balance = useCurrencyBalance(account ?? undefined, currency);
  return (
    <Flex
      className={`token-item-${key} w-full items-center justify-between gap-2 rounded-md py-2 hover:bg-light-gray md:px-2`}
      onClick={() => (isSelected ? null : onSelect())}
      opacity={isSelected || otherSelected ? 0.6 : 1}
      px='16px'
      cursor={isSelected || otherSelected ? "no-drop" : "pointer"}
    >
      <Flex className={"w-full items-center gap-2"}>
        <CurrencyLogo currency={currency as Token} size={24} />
        <Flex className={"flex-col"}>
          <Typography type="body2-r" color="text.secondary">
            {currency?.symbol}
          </Typography>
          <Typography type="body1" color="text.primary">
            {currency?.name}
          </Typography>
        </Flex>
      </Flex>
      <Flex className={"w-full max-w-[30%] justify-end"}>
        {/* eslint-disable-next-line no-nested-ternary */}
          <Balance balance={balance as any} />
      </Flex>
    </Flex>
  );
}

function Balance({ balance }: { balance: CurrencyAmount<Currency> }) {
  return (
    <Typography type="body1" color="#768597">
      { balance ? balance.toSignificant(4) : '0'}
    </Typography>
  );
}

function currencyKey(currency: Currency): string {
  // eslint-disable-next-line no-nested-ternary
  return currency?.isToken
    ? currency.address
    : currency?.isNative
    ? currency.symbol
    : "";
}

export default ListCurrency;
