import { Button, Flex } from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";
import Image from "next/image";
import { useRouter } from "next/router";
const IncomeSolution = () => {
  const handleLinkLearnMore = () => {
    window.open("https://miketoken-io.gitbook.io/miketoken.io/");
  };
  const router = useRouter();
  const handleBuyMkt = () => {
    router.push("/swap");
  };
  return (
    <Flex
      w="100%"
      maxW={"1200px"}
      mx="auto"
      justifyContent={"space-between"}
      mt={["3em"]}
      p={["24px"]}
      //   flexDirection={["column", "column", "row"]}
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
      <Flex flexDirection={"column"} className="xs:mb-[28px] xl:mb-[0px]">
        <Typography
          type="headline1"
          as="span"
          lineHeight={"64px"}
          color="text.primary"
        >
          Not just a Memecoin, Mike is more...{" "}
          {/* <Typography type="headline1" as="span" color="text.success">
            CoinAI
          </Typography> */}
        </Typography>
        <Typography type="headline4" as="span" color="text.primary">
          A Meme + Superutility Project that is partnered with{" "}
          <Typography type="headline4" as="span" color="text.success">
            {" "}
            CoinAI
          </Typography>
        </Typography>
        <Typography type="body1" color="text.read" mt="8px">
          Next Gen AI-Powered protocol, utilizing an advanced insurance fund
          system to ensure a safe and steady regular passive income
        </Typography>
        <Flex
          mt={["2.5em"]}
          gap="20px"
          className="w-full md:w-3/4 xl:w-2/3"
          zIndex={10}
        >
          <Button
            sx={{
              background: "bg.brand !important",
            }}
            colorScheme="green"
            color="bg.default"
            w={"47%"}
            h={"48px"}
            onClick={handleBuyMkt}
          >
            Buy now
          </Button>
          <Button
            variant={"outline"}
            sx={{
              border: "1.5px solid #3E454B",
              bgColor: "#151616",
            }}
            color="text.primary"
            colorScheme=""
            w={"47%"}
            h={"48px"}
            onClick={handleLinkLearnMore}
          >
            Learn more
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
            top: "-200px",
            zIndex: 1,
          }}
          priority
        />
        <Image
          src="/images/income-solution.png"
          width={630}
          height={560}
          alt="income-solution-new"
          style={{
            width: "100%",
            height: "100%",
          }}
          priority
        />
      </Flex>
    </Flex>
  );
};
export default IncomeSolution;
