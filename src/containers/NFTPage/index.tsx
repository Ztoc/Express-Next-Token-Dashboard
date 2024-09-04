import { Button, Flex } from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";
import Image from "next/image";
import { useRouter } from "next/router";
import Description from "./Description";
import MSNFTBuy from "./MSNFTBuy";
import GPNFTBuy from "./GPNFTBuy";
import Clippatht from "./Clippatht";
import Clippathb from "./Clippathb";
import Yield from "./Yield";
import WalletList from "./WalletList";
const NFTPage: React.FC = () => {
  const handleLinkLearnMore = () => {
    window.open("https://miketoken-io.gitbook.io/miketoken.io/");
  };
  const router = useRouter();
  const handleBuyMkt = () => {
    router.push("/swap");
  };
  return (
    <Flex direction={"column"} position={"relative"}>
      <Description/>
      <Clippatht/>
      <WalletList/>
      <Clippathb/>
      <MSNFTBuy/>
      <GPNFTBuy/>
      <Clippatht/>
      <Yield/>
      <Clippathb/>
      <Clippatht/>
    </Flex>
  );
};

export default NFTPage;


