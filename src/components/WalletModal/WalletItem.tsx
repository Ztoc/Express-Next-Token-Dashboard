import { Flex, Text } from "@chakra-ui/react";
import { WalletsConfig } from "@src/configs/web3/wallets";


interface IWalletItem {
  walletConfig: WalletsConfig;
  handleLogin: (wallet: WalletsConfig) => void;
}

const WalletItem: React.FC<IWalletItem> = ({ handleLogin, walletConfig }) => {
  const { title, icon: Icon } = walletConfig;
  const handleSelectWallet = () => {
    handleLogin(walletConfig);
  };
  return (
    <Flex
      onClick={handleSelectWallet}
      className={
        "w-full cursor-pointer flex-col items-center justify-center rounded-2xl bg-[#F5F7F9] p-4"
      }
    >
      <Icon boxSize={"48px"} />
      <Text className={"mt-2 text-sm font-medium text-[#898F9C]"}>{title}</Text>
    </Flex>
  );
};

export default WalletItem;
