import type { ButtonProps } from "@chakra-ui/react";
import { Button, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { useWeb3React } from "@src/hooks/useWeb3React";
import WalletModal from "../WalletModal";


const ButtonConnectWallet: React.FC<
  ButtonProps & {
    isShortText?: boolean;
  }
> = ({ children, className, isShortText = false, ...rest }) => {
  const [isMobileScreen] = useMediaQuery("(max-width: 480px)");

  const { account } = useWeb3React();
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (!account) {
    return (
      <>
        <Button
          className={className}
          colorScheme="brand"
          size="md"
          bgColor="bg.brand !important"
          rounded="full"
          px={4}
          py={1}
          onClick={onOpen}
          color="bg.default"
          borderRadius={"8px"}
          {...rest}
        >
          {isMobileScreen || isShortText ? "Connect" : "Connect Wallet"}
        </Button>
        <WalletModal isOpen={isOpen} onDismiss={onClose} />
      </>
    );
  }
  return <>{children}</>; 
};

export default ButtonConnectWallet;
