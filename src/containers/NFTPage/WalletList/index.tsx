import { Button, Flex } from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";
import Image from "next/image";
import { useRouter } from "next/router";
import Marquee from "react-fast-marquee";
const WalletList = () => {
  
  const router = useRouter();
  
  return (
    <Flex
      w="100%"
      mx="auto"
      justifyContent={"space-between"}

      className="xs:flex-col sm:flex-col lg:flex-row relative z-1"
    >
      <Marquee className='py-[10px] bg-[#00000056]'>
                
        <img className=' lg:px-10 px-3 h-[100px]' src="assets/images/walletlist/walletconnect.png" alt="ad"></img>
        <img className=' lg:px-10 px-3 h-[100px]' src="assets/images/walletlist/coinbasewallet.png" alt="ad"></img>        
        <img className=' lg:px-10 px-3 h-[100px]' src="assets/images/walletlist/metamask.png" alt="ad"></img>        
        <img className=' lg:px-10 px-3 h-[100px]' src="assets/images/walletlist/binancewallet.png" alt="ad"></img>        
        <img className=' lg:px-10 px-3 h-[100px]' src="assets/images/walletlist/trustwallet.png" alt="ad"></img>        
        <img className=' lg:px-10 px-3 h-[100px]' src="assets/images/walletlist/tokenpocket.png" alt="ad"></img>    
        <img className=' lg:px-10 px-3 h-[100px]' src="assets/images/walletlist/bitkeep.png" alt="ad"></img>
        <img className=' lg:px-10 px-3 h-[100px]' src="assets/images/walletlist/mathwallet.png" alt="ad"></img>
        <img className=' lg:px-10 px-3 h-[100px]' src="assets/images/walletlist/coin98.png" alt="ad"></img>   
      </Marquee>
    </Flex>
  );
};
export default WalletList;
