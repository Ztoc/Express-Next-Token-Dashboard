import { useEagerConnect } from "@src/hooks/useEagerConnect";
import { usePollBlockNumber } from "@src/redux/slices/block/hooks";
import MulticallUpdater from "@src/redux/slices/multicall/updater";
import ListsUpdater from "@src/redux/slices/lists/updater";

const GlobalHook = () => {
  useEagerConnect();
  usePollBlockNumber();

  return (
    <>
      <ListsUpdater />
      <MulticallUpdater />
    </>
  );
};

export default GlobalHook;
