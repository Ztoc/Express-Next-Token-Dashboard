import { Button, Flex } from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";
import Image from "next/image";
import { useRouter } from "next/router";

const Description = () => {
  
  const router = useRouter();
  
  return (
    <Flex
      w="100%"
      maxW={"1200px"}
      mx="auto"
      justifyContent={"space-between"}
      mt={["3em"]}
      p={["24px"]}
      className="xs:flex-col sm:flex-col lg:flex-row relative z-1"
    >
      <Image
        src="/icons/bigger-star.svg"
        width={40}
        height={40}
        alt="left"
        style={{
          left: "-100px",
          position: "absolute",
        }}
        className="hidden xl:block"
        priority
      />
      <Image
        src="/images/line-star.svg"
        width={772}
        height={123}
        alt="line"
        style={{
          position: "absolute",
          bottom: "9%",
          left: "10%",
        }}
        className="hidden xl:block"
        priority
      />
      <Image
        src="/icons/smaller-star.svg"
        width={32}
        height={32}
        alt="left"
        style={{
          top: "150px",
          left: "-50px",
          position: "absolute",
        }}
        priority
      />
      <Image
        src="/icons/bigger-star.svg"
        width={40}
        height={40}
        alt="left"
        style={{
          right: "0",
          position: "absolute",
          top: "30%",
        }}
        className="hidden xl:block"
        priority
      />
      {/* <Image src=""/> */}
      <Flex maxW={600} flexDirection={"column"} className="xs:mb-[28px] xl:mb-[0px]">
        <Typography
          type="headline1"
          as="span"
          lineHeight={"64px"}
          color="text.primary"
        >
          Welcome to the captivating world of Mike Token NFTs{" "}
          {/* <Typography type="headline1" as="span" color="text.success">
            CoinAI
          </Typography> */}
        </Typography>
        <Typography type="headline4" as="span" color="text.success">
        Generation Prime  {" "}
          <Typography type="headline4" as="span" color="text.success">
            {" "}
            &
            
          </Typography>
          <Typography type="headline4" as="span" color="text.success">
            {" "}
            Monsters Syndicate
          </Typography>
        </Typography>
        <Typography type="body1" color="text.read" mt="8px">
        These unique digital assets open the doors to our exclusive USDT Yield pools while providing exceptional opportunities for passive income. As a proud holder of these NFTs, you gain access to lucrative APRs, unlocking the potential for substantial returns on your investments. Immerse yourself in the power of blockchain technology and join us on this extraordinary journey towards a more prosperous financial future.
        </Typography>
        
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
            top: "-200px",
            zIndex: 1,
          }}
          priority
        />
        <Image
          src="/images/nft_description.png"
          width={630}
          height={560}
          
          alt="nft_description"
          style={{
            width: "100%",
            height: "100%",
          }}
          className=" lg:pl-[100px] pl-[0px] min-w-[330px]"
          priority
        />
      </Flex>
      
    </Flex>
  );
};
export default Description;
