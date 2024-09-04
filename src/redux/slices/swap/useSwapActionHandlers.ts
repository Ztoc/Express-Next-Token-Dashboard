import type { Currency } from "@pancakeswap/sdk";
import { useCallback } from "react";


import type { Field } from "./actions";
import {
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
} from "./actions";
import { useAppDispatch } from "@src/redux/store";

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void;
  onSwitchTokens: () => void;
  onUserInput: (field: Field, typedValue: string) => void;
  onChangeRecipient: (recipient: string | null) => void;
} {
  const dispatch = useAppDispatch();

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies());
  }, [dispatch]);

  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          // eslint-disable-next-line no-nested-ternary
          currencyId: currency?.isToken
            ? currency.address
            : currency?.isNative
            ? currency.symbol
            : "",
        })
      );
    },
    [dispatch]
  );

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }));
    },
    [dispatch]
  );

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }));
    },
    [dispatch]
  );

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  };
}
