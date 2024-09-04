/* eslint-disable react/no-unescaped-entities */
import { Image, Flex, useMediaQuery } from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";
import { listTokenomics } from "@src/constants/home";
import React, { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const Tokenomics: React.FC = () => {
  const data = [
    {
      name: "liquidity",
      quantity: 35,
      color: "#1ED760",
    },
    {
      name: "staking",
      quantity: 15,
      color: "#2F45C5",
    },
    {
      name: "community",
      quantity: 25,
      color: "#7955BF",
    },
    {
      name: "rdo",
      quantity: 25,
      color: "#FED724",
    },
  ];
  const COLORS = [
    "#1ED760",
    "#2F45C5",
    "#7955BF",
    "#FED724",
    "#FE9BBC",
    " #88CDA1",
  ];

  const coreImg1024 =
    "https://statics.position.exchange/assets/frog-fellow/core_tokenomic.svg";
  const coreImg1920 =
    "https://statics.position.exchange/assets/frog-fellow/Pepe_stripe_big.svg";
  const [isLargerThan481] = useMediaQuery("(min-width: 481px)");
  const [isLargerThan769] = useMediaQuery("(min-width: 769px)");
  const [isLargerThan1025] = useMediaQuery("(min-width: 1025px)");

  const coreImg = useMemo(() => {
    return isLargerThan1025
      ? coreImg1920
      : isLargerThan481
      ? coreImg1024
      : coreImg1024;
  }, [isLargerThan481, isLargerThan1025]);
  const sizeChart = useMemo(() => {
    return isLargerThan1025
      ? 400
      : isLargerThan769
      ? 340
      : isLargerThan481
      ? 380
      : 250;
  }, [isLargerThan481, isLargerThan1025, isLargerThan769]);
  const sizeOuter = useMemo(() => {
    return isLargerThan1025
      ? 200
      : isLargerThan769
      ? 170
      : isLargerThan481
      ? 190
      : 100;
  }, [isLargerThan481, isLargerThan1025, isLargerThan769]);
  const sizeInner = useMemo(() => {
    return isLargerThan1025
      ? 150
      : isLargerThan769
      ? 120
      : isLargerThan481
      ? 140
      : 70;
  }, [isLargerThan481, isLargerThan1025, isLargerThan769]);

  return (
    <Flex
      id="tokenomics"
      w="100%"
      maxW="1200px"
      mx="auto"
      className="style-chart-tokenomics"
      px={{
        base: "16px",
        lg: "24px",
        "2xl": 0,
      }}
      mt={{
        base: "48px",
        md: "80px",
        lg: "112px",
      }}
    >
      <Flex
        py={{
          base: "24px",
          xl: "80px",
        }}
        px={{
          base: "16px",
          lg: "24px",
          xl: "60px",
          "2xl": "80px",
        }}
        border='2px solid'
        borderColor='bg.secondary'
        borderRadius={"12px"}
        background={
          "radial-gradient(213.29% 109.87% at 8.93% -0.00%, rgba(36, 100, 125, 0.50) 0%, rgba(28, 34, 37, 0.50) 34.76%, rgba(19, 19, 20, 0.50) 63.42%)"
        }
        justifyContent={"space-between"}
        direction={{
          base: "column",
          xl: "row",
        }}
        position={"relative"}
      >
        <Flex
          w="35px"
          h="35px"
          borderTop={"2px"}
          borderLeft={"2px"}
          borderStyle={"solid"}
          borderColor="bg.brand"
          position={"absolute"}
          left={"0px"}
          top={"0px"}
          borderTopLeftRadius={"12px"}
        />
        <Flex
          w="35px"
          h="35px"
          borderLeft={"2px"}
          borderBottom={"2px"}
          borderStyle={"solid"}
          borderColor="bg.brand"
          position={"absolute"}
          left={"0px"}
          bottom={"0px"}
          borderBottomLeftRadius={"12px"}
        />
        <Flex
          w="35px"
          h="35px"
          borderTop={"2px"}
          borderRight={"2px"}
          borderStyle={"solid"}
          borderColor="bg.brand"
          position={"absolute"}
          right={"0px"}
          top={"0px"}
          borderTopRightRadius={"12px"}
        />
        <Flex
          w="35px"
          h="35px"
          borderRight={"2px"}
          borderBottom={"2px"}
          borderStyle={"solid"}
          borderColor="bg.brand"
          position={"absolute"}
          right={"0px"}
          bottom={"0px"}
          borderBottomRightRadius={"12px"}
        />
        <Flex
          w={{
            base: "100%",
            xl: "50%",
          }}
          direction={"column"}
        >
          <Typography
            letterSpacing={"3.2px"}
            type="body1-r"
            fontSize={"16px"}
            color={"text.brand"}
          >
            [TOKENOMICS]
          </Typography>
          <Typography type="headline2" color={"text.primary"}>
            Fairly Distributed
          </Typography>
          <Typography type="headline2" color={"text.brand"}>
            [TOKENOMICS]
          </Typography>
          <Typography mb="36px" mt="24px" type="paragraph1" color={"text.read"}>
            Discover Mike Tokenomics: Unveiling our ecosystem's potential. From
            token allocation to liquidity strategies and rewarding
            opportunities, we revolutionize the blockchain landscape. Join us as
            we shape the future together.
          </Typography>
          {listTokenomics?.map((e, idx) => {
            return (
              <Flex
                key={`item_tokenomics_${e.title}`}
                w="100%"
                justifyContent={"space-between"}
                align="center"
                mt={idx ? "24px" : "0px"}
              >
                <Typography type="body1" color="text.primary">
                  {e?.title}
                </Typography>
                <Flex
                  px="12px"
                  background={e?.bg}
                  py="4px"
                  borderRadius={"4px"}
                >
                  <Typography
                    type="body1"
                    color={
                      idx === 1 || idx === 2 ? "text.primary" : "bg.default"
                    }
                  >
                    {e?.value}%
                  </Typography>
                </Flex>
              </Flex>
            );
          })}
          <Flex
            mt="24px"
            w="100%"
            direction={{
              base: "column",
              md: "row",
            }}
            justifyContent={"space-between"}
          >
            <Flex
              borderRadius={"4px"}
              w={{
                base: "100%",
                md: "48%",
              }}
              h="40px"
              background="rgba(30, 215, 96, 0.15)"
              align={"center"}
              justify={"center"}
            >
              <Image mr="12px" src="/check-icon.svg" alt="icon-check" />
              <Typography color="text.brand" type="body1">
                No tax
              </Typography>
            </Flex>
            <Flex
              borderRadius={"4px"}
              w={{
                base: "100%",
                md: "48%",
              }}
              mt={{
                base: "16px",
                md: "0",
              }}
              h="40px"
              background="rgba(30, 215, 96, 0.15)"
              align={"center"}
              justify={"center"}
            >
              <Image mr="12px" src="/check-icon.svg" alt="icon-check" />
              <Typography color="text.brand" type="body1">
                No team token{" "}
              </Typography>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          w={{
            base: "100%",
            xl: "48%",
          }}
        >
          <Flex
            ml="auto"
            mt={{
              base: "32px",
              xl: 0,
            }}
            mr={{
              base: "auto",
              xl: "inherit",
            }}
            position={"relative"}
          >
            <Flex
              position={"absolute"}
              top={{
                base: "33%",
                md: "34%",
                lg: "32%",
                xl: "40%",
              }}
              left={{
                base: "33%",
                md: "34%",
                lg: "32%",
                xl: "35%",
              }}
            >
              <Flex
                align={"center"}
                justify={"center"}
                boxSize={{
                  base: "90px",
                  md: "120px",
                }}
                borderRadius={"50%"}
                background={"#FFD065"}
              >
                <Image
                  boxSize={{
                    base: "50px",
                    md: "80px",
                  }}
                  src="/tokenomic.svg"
                  alt="tokenomics"
                />
              </Flex>
            </Flex>
            <Flex my="auto" ml="auto">
              <ResponsiveContainer width={sizeChart} height={sizeChart}>
                <PieChart
                  width={sizeChart}
                  height={sizeChart}
                  style={{ border: "none" }}
                >
                  <Pie
                    data={data}
                    cx={"50%"}
                    cy={"50%"}
                    outerRadius={sizeOuter}
                    dataKey="quantity"
                    innerRadius={sizeInner}
                    style={{ border: "none" }}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        style={{ border: "none" }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Tokenomics;
