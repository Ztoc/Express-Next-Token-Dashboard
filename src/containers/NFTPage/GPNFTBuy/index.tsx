import { Button, Flex } from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import Image from "next/image";
import PrimeNFT from '../../../configs/abis/PrimeNFT.json'
import tUSDT from '../../../configs/abis/tUSDT.json';
import { useEffect } from "react";
import { ethers } from "ethers";
import { cursorTo } from "readline";



const GPNFTBuy = () => {
  const tUSDTAddress='0x337610d27c682E347C9cD60BD4b3b107C9d34dDd'; // USDT address on BSC testnet
  const tMintPrice = 0.1; //NFT Price : 0.1USDT
  //0xa31a9537FB28cF09e06CD2e609ef650fE7ACCca3
  // const tNFTContractAddress='0x2272B491ba07E90FC98e8Ba79aFB388c9611ed4f'; //tNFTContractAddress on BSC testnet
  const tNFTContractAddress='0xA71f208B6B8446e34cB0004f8Aea912741bD116b'; //tNFTContractAddress on BSC testnet
  
//Approve for USDT transaction
const {config} = usePrepareContractWrite({
  abi: tUSDT,
  address: tUSDTAddress,
  functionName: 'approve',
  args:[
   tNFTContractAddress,
   BigInt(tMintPrice*10**18).toString(), //If use USDT (not tUSDT) 18 must be changed 6
  ]
})
const { write : approveWrite, data, error, isLoading, isError } = useContractWrite(config);
const {
 data: receipt,
 isLoading: isApproveLoading,
 isSuccess: approveSuccess,
} = useWaitForTransaction({ hash: data?.hash })

//BuyNFT
const {config:NFTConfig} = usePrepareContractWrite({
  abi: PrimeNFT,
  address: tNFTContractAddress,
  functionName: 'buyNFT',
})
const { write : NFTWrite, data : NFTData} = useContractWrite(NFTConfig);

const {data:tokenid, refetch:refrechTokenID} = useContractRead({
abi: PrimeNFT,
address: tNFTContractAddress,
functionName: 'currentToken',
onSuccess: () => {
 console.log('GPNFT');
//  tokenIndex=""+tokenid;
},
});
let tokenIndex:String = ""+tokenid;
// console.log("-------------------"+(parseInt(tokenid?._hex,16)-1));
console.log("-------GPNFT tokenid-----", (parseInt(tokenid+"",10)));
// console.log("---public flag--", flag);
const {
 data : NFTreceipt,
 isLoading: isNFTLoading,
 isSuccess: NFTSuccess,
} = useWaitForTransaction({ hash: NFTData?.hash, onSuccess: (data)=>{
}});
// const setFlags = (temp : boolean) => {

//   flag = temp;
//   console.log("---setflag--", flag);
// }
useEffect(()=>{
// console.log("----flag---", flag);
if(NFTSuccess) {
setTimeout(() => {
 addNFT();
}, 10000);
// setFlags(false)
}}, [tokenid]);

const checkConfirm = () => {
(window as any).ethereum.on('confirmation', (confirmationNumber: number, receipt: ethers.providers.TransactionReceipt) => {
if (receipt.status === 1) {
 // Transaction confirmed
 alert('Transaction confirmed!');
} else {
 // Transaction failed
 alert('Transaction failed!');
}
});
}
const addNFT=async() =>{

// await refrechTokenID?.();
// console.log("--------token id after mint nft-----------"+parseInt(tokenid?._hex,16));

try {
 // 'wasAdded' is a boolean. Like any RPC method, an error can be thrown.
 console.log("----------------------------");
 const tid=parseInt(""+tokenid,10);
 console.log("--------token id after mint MSNFT-----------"+tid);
 const wasAdded = await (window as any).ethereum.request({
     method: "wallet_watchAsset",
     params: {
         // or 'ERC1155'
         type: "ERC721",
         options: {
             // The address of the token.
             address: tNFTContractAddress,
             // ERC-721 or ERC-1155 token ID.
             tokenId: ""+(tid-1),
             
         },
     },
 });

 if (wasAdded) {
     console.log("User successfully added the token!");
 } else {
     console.log("User did not add the token.");
 }
} catch (error) {
 console.log(error);
}
}
useEffect( () => { 

 if(isApproveLoading){
   console.log('--Loading--');
 }
 if(approveSuccess){
   console.log('--Approved--');
   NFTWrite?.();//call buyNFT function on contract
 }
}, [approveSuccess,isApproveLoading]);

useEffect( () => { 
if(isNFTLoading){
 console.log('--Pending--');
}
if(NFTSuccess){
 console.log('--Success--');
 // addNFT?.();
 // checkConfirm();
 refrechTokenID();
 
}
}, [isNFTLoading, NFTSuccess]);
  
  return (
    <Flex
      w="100%"
      maxW={"1200px"}
      mx="auto"
      justifyContent={"space-between"}
      mt={["3em"]}
      p={["24px"]}
      
      //   flexDirection={["column", "column", "row"]}
      className="xs:flex-col sm:flex-col-reverse lg:flex-row relative z-1"
    >
      
      <Flex flexDirection={"column"} className="xs:mb-[28px] xl:mb-[0px] lg:max-w-[600px] ">
        <Typography
          type="headline1"
          as="span"
          lineHeight={"64px"}
          color="text.success"
        >
          Generation Prime{" "}
          {/* <Typography type="headline1" as="span" color="text.success">
            CoinAI
          </Typography> */}
        </Typography>
        
        <Flex background={
          "radial-gradient(213.29% 109.87% at 8.93% -0.00%, rgba(36, 100, 125, 0.50) 0%, rgba(28, 34, 37, 0.50) 34.76%, rgba(19, 19, 20, 0.50) 63.42%)"
        }
         flexDirection={"column"} className=" border-[1px] border-gray-500 rounded-lg py-2 pl-5 pr-2 my-1 border-l-4 border-l-green-400">
          <Typography type="headline4" as="span" color="text.primary">
            Benefit:          
          </Typography>
          <Typography type="body1" color="text.read" mb="8px">
            Holders of Generation Prime NFTs enjoy exclusive benefits such as extra $MKT tokens as a bonus with each MKT purchase, tax exemption on deposits made to CoinAI Pools, extra CoinAI Pool deposit allowance of up to 20,000 USDT, governance vote power, access to private social channels, and vanity profile pictures and Discord role.
          </Typography>
        </Flex>

        <Flex flexDirection={"column"} className=" border-[1px] border-gray-500 rounded-lg py-2 pl-5 pr-2 my-1 border-l-4 border-l-green-400">
          <Typography type="headline4" as="span" color="text.primary">
            Deposit Allowance:          
          </Typography>
          <Typography type="body1" color="text.read" mb="8px">
            Each Generation Prime NFT allows the holder to deposit up to 10,000 USDT.
          </Typography>
        </Flex>
        <Flex flexDirection={"column"} className=" border-[1px] border-gray-500 rounded-lg py-2 pl-5 pr-2 my-1 border-l-4 border-l-green-400">

          <Typography type="headline4" as="span" color="text.primary">
            Additional Yield:        
          </Typography>
          <Typography type="body1" color="text.read" mb="8px" >
            Generation Prime NFTs offer additional yield up to 365% APR.
          </Typography>
        </Flex>
        <Flex className=" border-[1px] border-gray-500 rounded-lg py-2 pl-5 pr-2 my-1 border-l-4 border-l-green-400">
          <Flex className="flex-col">
            <Typography type="headline4" as="span" color="text.primary" >
              3000 {" "}
              <Typography type="body1" as="span" color="text.primary">
                USDT       
              </Typography>          
            </Typography>
            <Typography type="body1" as="span" color="text.success">
              Minting Price        
            </Typography>
          </Flex>
          
          <Flex className="flex-col mx-auto">
            <Typography type="headline4" as="span" color="text.primary" >
              99          
            </Typography>
            <Typography type="body1" as="span" color="text.success">
              Total Unique Copies      
            </Typography>
          </Flex>
          <Button
            // className={className}
            colorScheme="brand"
            size="md"
            bgColor="bg.brand !important"
            rounded="full"
            px={8}
            py={7}
            onClick={async ()=> 
              {
                  approveWrite?.(); //call approve
              }
            }
            
            fontSize={20}
            borderRadius={"8px"}
            zIndex={11}
            className="my-auto text-white hover:text-[black]"  
          >
            Buy
          </Button>
        </Flex>
      </Flex>
      <Flex
        sx={{
          position: "relative",
          width: "100%",
        }}
      >
        <Image
          src="/images/blur-ai.png"
          width={531}
          height={637}
          alt="blur-solution"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            // left: "-100px",
            zIndex: 0,
          }}
          priority
        />
        <Flex
          sx={{
            position: "relative",
            width: "100%",
          }}
         className="border-2 border-[#555C6D] lg:ml-[50px] ml-[0px] rounded-lg relative">
        <Image
          src="/images/GP_NFT.jpg"
          width={630}
          height={560}
          
          alt="nft_description"
          style={{
            width: "100%",
            height: "100%",
          }}
          className="p-[2px] min-w-[330px] rounded-lg"
          priority
        />
        </Flex>
        <Typography onClick={() => {navigator.clipboard.writeText(""+tokenIndex);}} opacity={"80%"} textColor={"white"} type="headline3" className=" absolute top-5 right-5 cliptext">#{tokenIndex}</Typography>

        <Typography opacity={"20%"} textColor={"white"} type="headline4" className=" absolute bottom-5 right-2">Generation Prime NFT</Typography>

        <div  onClick={() => {navigator.clipboard.writeText(tNFTContractAddress);}} style={{color:"white", opacity:"50%"}}  className=" absolute bottom-0 right-2 cliptext textover">{tNFTContractAddress}</div>
      </Flex>
    </Flex>
  );
};
export default GPNFTBuy;