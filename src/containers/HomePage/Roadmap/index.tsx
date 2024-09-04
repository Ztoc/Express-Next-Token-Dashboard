import { Typography } from "@src/components/Typography";
import React from "react";
import Image from "next/image";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
import dayjs from "dayjs";

const Roadmap: React.FC = () => {
  const roadmap = [
    {
      name: "q1",
      precious: "Q3, 2023",
      quarter: 3,
      year: 2023,
      endTime: "2023-09-30",
      contentOne: "Decentralized Finance (DeFi)",
      contentTwo:
        "Staking: Launch of staking platform. An MKT rewarding pool where users can stake their Mike tokens and harvest more MKT. Introduce of a unique USDT rewarding pool where users can stake their MKT and harvest USDT. Note: The reward of this pool will be provided by CoinAI Trading Protocol.",
      contentThree:
        "Farms : Launch of Mike Token's farming platform, allowing users to stake their tokens and earn rewards. Introduce of initial farming pools with attractive APYs to incentivize participation. Conduct thorough audits and security checks to ensure the safety of users' funds.",
    },
    {
      name: "q2",
      precious: "Q4, 2023",
      quarter: 4,
      year: 2023,
      endTime: "2023-12-31",
      contentOne:
        "Expanding Farming Horizons: Expanding the selection of farming pools, if necessary introducing new pairs and innovative staking options. ",
      contentTwo:
        "Engaging in strategic partnerships to bring exclusive farming opportunities to the Mike Token community.",
      contentThree:
        "NFT : Launch of the Mike Token special edition NFTs and based on the team’s decision possibly an NFT Marketplace, providing a platform for creators to mint and sell unique digital NFTs and assets.",
      contentFourth:
        " Collaboration with talented artists to curate a diverse collection of Mike - themed NFTs. Implementing a user-friendly interface for seamless buying, selling, and trading of NFTs.",
      contentFifth:
        "Artistic Expressions: Organizing NFT drops and collaborations with prominent artists, celebrities, and brands to expand the range of collectibles. ",
      contentSixth:
        "Engaging and collaborating with OpenSea for the marketplace functionality with advanced search and discovery features, enabling users to find their desired NFTs and to make seamless NFT transactions.",
      contentSeventh:
        " Introducing Passive Income elements to the Mike NFTs, offering interactive experiences and rewards tied to the Mike special NFTs.",
    },
    {
      name: "q3",
      precious: "Q1, 2024",
      quarter: 1,
      year: 2024,
      endTime: "2024-03-31",
      contentOne:
        "Advance Artificial Intelligence Powered Trade Protocols (CoinAI): Collaborating with CoinAI.app and introducing the CoinAI Pools, empowering users to earn USDT by staking USDT in a high yield pool.",
      contentTwo:
        " Collaboration with AI experts, blockchain developers and data scientists not only to develop and improve trading and arbitrage protocols but also to build captivating and informative AI visualizations for crypto industry. ",
      contentThree:
        "Providing educational resources and tutorials to help users understand the practical applications of AI in various fields of crypto technology.",
    },
    {
      name: "q4",
      precious: "Q2, 2024",
      quarter: 2,
      year: 2024,
      endTime: "2024-06-30",
      contentOne:
        "DeFi Innovations: Further expansion of the range of farming pools, incorporating new tokens and innovative staking mechanisms.",
      contentTwo:
        " Implementing cross-chain compatibility, allowing users to farm and stake their Mike Tokens on multiple blockchain networks. Introduction of AI yield optimization strategies and automated farming tools, such as bots and apps to enhance user returns.",
      contentThree:
        "Governance Platform: In our continual quest to create a more interactive and user-driven network, our next major step will be launching the Governance Platform. This will be a comprehensive, blockchain-based system that allows for transparent decision-making across our network. Stakeholders will be able to participate directly in the decision-making process, helping to shape the future of our organization. Through this platform, each voice will be heard, and every idea will be valued, fostering a true sense of collective ownership and accountability. By integrating state-of-the-art voting and discussion features, our Governance Platform will empower our community like never before to drive innovation, co-create, and directionally steer the path forward.",
    },
  ];
  const currentDate = dayjs();
  const currentQuarter = Math.floor((currentDate.month() + 3) / 3);
  const currentYear = currentDate.year();

  const firstDayOfNextQuarter = dayjs()
    .year(currentYear)
    .month(currentQuarter * 3 - 1)
    .startOf("month");

  const lastDayOfCurrentQuarter = firstDayOfNextQuarter
    .add(1, "month")
    .subtract(1, "day");
  const lastQuarter = lastDayOfCurrentQuarter.format("YYYY-MM-DD");
  return (
    <div
      id="roadmap"
      className="max-w-[1200px] w-full pt-[112px] mx-auto  max-lg:px-[16px] max-2xl:px-[24px]"
    >
      <div className="flex max-lg:flex-col justify-between mb-10">
        <div className="w-5/12 max-lg:w-full">
          <Typography
            type="body1-r"
            fontSize={"16px"}
            className="text-brand mb-2"
          >
            [ROADMAP]
          </Typography>
          <Typography
            type="headline2"
            fontWeight={700}
            className="text-primary mb-6"
          >
            Innovation Unleashed. Future Driven.
          </Typography>
          <Typography type="paragraph1" className="text-read">
            Embark on an exciting roadmap with Mike Token: Innovations and
            milestones shaping our future.
          </Typography>
        </div>
        <div className="flex w-5/12 max-lg:w-full max-lg:mt-[24px] max-lg:justify-start justify-end">
          <Image
            src={`/assets/images/ImageRoadmap.svg`}
            width="475"
            height="316"
            alt={""}
          />
        </div>
      </div>
      <Grid
        templateAreas={{
          base: `"q1 q1"
          "q2 q2"
          "q3 q3"
          "q4 q4"`,
          xl: `"q1 q2 q3 q4"`,
          lg: `"q1 q2"
          "q3 q4"`,
        }}
        gap={8}
      >
        {roadmap.map((e, index) => {
          const isActiveQuarter = e.quarter === currentQuarter ? true : false;
          const isActiveYear = e.year === currentYear ? true : false;
          const isActive =
            (currentQuarter > e.quarter && isActiveYear) || currentYear > e.year
              ? true
              : isActiveQuarter && isActiveYear
              ? true
              : false;
          return (
            <GridItem key={index} area={e.name} className="w-full min-w-[25%]">
              <Flex
                p={"1px"}
                borderRadius={"8px"}
                h={"100%"}
                // className={
                //   isActiveQuarter && isActiveYear
                //     ? "card-border-active h-full"
                //     : "card-border h-full"
                // }
                className="time-line"
              >
                <Flex
                  className={"bg-default"}
                  w="100%"
                  borderRadius={"8px"}
                  display={"block"}
                >
                  <Flex
                    display={"block"}
                    borderRadius={"8px"}
                    p={"24px 16px"}
                    // className={
                    //   isActiveQuarter && isActiveYear
                    //     ? "card-bg-active"
                    //     : "bg-default"
                    // }
                    className="bg-time-line"
                  >
                    <Typography
                      type="headline4"
                      className="mb-8"
                      color={
                        isActiveQuarter && isActiveYear ? "#1ED760" : "#C4D3D9"
                      }
                    >
                      {e.precious}
                    </Typography>
                    {/* roadmap-icon-active */}
                    <Flex alignItems={"flex-start"}>
                      <Image
                        className="mr-4"
                        src={
                          isActive
                            ? "/assets/images/icons/roadmap-icon-active.svg"
                            : "/assets/images/icons/roadmap-icon.svg"
                        }
                        width={20}
                        height={20}
                        alt=""
                      />
                      <Typography type="paragraph1" className="text-read mb-6">
                        {e.contentOne}
                      </Typography>
                    </Flex>
                    {e?.contentTwo && (
                      <Flex alignItems={"flex-start"}>
                        <Image
                          className="mr-4"
                          src={
                            isActive && lastQuarter > e.endTime
                              ? "/assets/images/icons/roadmap-icon-active.svg"
                              : "/assets/images/icons/roadmap-icon.svg"
                          }
                          width={20}
                          height={20}
                          alt=""
                        />
                        <Typography type="paragraph1" className="text-read">
                          {e.contentTwo}
                        </Typography>
                      </Flex>
                    )}
                    {e?.contentThree && (
                      <Flex alignItems={"flex-start"}>
                        <Image
                          className="mr-4"
                          src={
                            isActive && lastQuarter > e.endTime
                              ? "/assets/images/icons/roadmap-icon-active.svg"
                              : "/assets/images/icons/roadmap-icon.svg"
                          }
                          width={20}
                          height={20}
                          alt=""
                        />
                        <Typography type="paragraph1" className="text-read">
                          {e.contentThree}
                        </Typography>
                      </Flex>
                    )}
                    {e?.contentFourth && (
                      <Flex alignItems={"flex-start"}>
                        <Image
                          className="mr-4"
                          src={
                            isActive && lastQuarter > e.endTime
                              ? "/assets/images/icons/roadmap-icon-active.svg"
                              : "/assets/images/icons/roadmap-icon.svg"
                          }
                          width={20}
                          height={20}
                          alt=""
                        />
                        <Typography type="paragraph1" className="text-read">
                          {e.contentFourth}
                        </Typography>
                      </Flex>
                    )}{" "}
                    {e?.contentFifth && (
                      <Flex alignItems={"flex-start"}>
                        <Image
                          className="mr-4"
                          src={
                            isActive && lastQuarter > e.endTime
                              ? "/assets/images/icons/roadmap-icon-active.svg"
                              : "/assets/images/icons/roadmap-icon.svg"
                          }
                          width={20}
                          height={20}
                          alt=""
                        />
                        <Typography type="paragraph1" className="text-read">
                          {e.contentFifth}
                        </Typography>
                      </Flex>
                    )}{" "}
                    {e?.contentSixth && (
                      <Flex alignItems={"flex-start"}>
                        <Image
                          className="mr-4"
                          src={
                            isActive && lastQuarter > e.endTime
                              ? "/assets/images/icons/roadmap-icon-active.svg"
                              : "/assets/images/icons/roadmap-icon.svg"
                          }
                          width={20}
                          height={20}
                          alt=""
                        />
                        <Typography type="paragraph1" className="text-read">
                          {e.contentSixth}
                        </Typography>
                      </Flex>
                    )}{" "}
                    {e?.contentSeventh && (
                      <Flex alignItems={"flex-start"}>
                        <Image
                          className="mr-4"
                          src={
                            isActive && lastQuarter > e.endTime
                              ? "/assets/images/icons/roadmap-icon-active.svg"
                              : "/assets/images/icons/roadmap-icon.svg"
                          }
                          width={20}
                          height={20}
                          alt=""
                        />
                        <Typography type="paragraph1" className="text-read">
                          {e.contentSeventh}
                        </Typography>
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </GridItem>
          );
        })}
      </Grid>
    </div>
  );
};

export default Roadmap;
