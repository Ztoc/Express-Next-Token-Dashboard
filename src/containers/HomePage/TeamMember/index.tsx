import { Typography } from "@src/components/Typography";
import React from "react";
import Image from "next/image";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { StyledSlider } from "./Box.styled";
import { LinkedinIcon } from "@src/components/Icon";
import Link from "next/link";

const TeamMember: React.FC = () => {
  const member = [
    {
      name: "q1",
      nameMenber: "Edwin",
      title: "CEO & Co-founder",
      avatar: "avt-edwin",
      linkedin: "",
      info: "Edwin, the visionary CEO of Mike Token, drives innovative solutions in DeFi, Gaming, and the Metaverse. His commitment and enthusiasm lead to unprecedented success in memecoins and blockchain.",
    },
    {
      name: "q2",
      nameMenber: "Xilantrovo",
      title: "Co-founder & Marketing Manager",
      avatar: "avt-xilantrovo",
      linkedin: "https://www.linkedin.com/in/xilantrovo/",
      info: "Xilantrovo, Co-founder and Marketing Manager of Mike Token, drives growth and success in the cryptocurrency industry through his extensive marketing experience and expertise.",
    },
    {
      name: "q3",
      nameMenber: "Walter",
      title: "Co-founder & CTO",
      avatar: "avt-walter",
      linkedin: "https://www.linkedin.com/in/walterstewart2023/",
      info: "Walter, Co-founder and CTO of Mike Token, brings vast experience in blockchain technology. His expertise drives Mike Token's position as a leading memecoin project.",
    },
    {
      name: "q4",
      nameMenber: "David",
      title: "Co-founder & Head of Community",
      avatar: "avt-david",
      linkedin: "https://www.linkedin.com/in/david-crpo-0a916427a/",
      info: "David, Co-founder and Head of Community at Mike Token, utilizes his experience to drive project success. With a user-centric approach and strategic vision, he fosters engagement and facilitates growth for the project.",
    },
  ];

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: '25px',
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: '10px'
        },
      },
    ],
  };

  return (
    <div
      id="team"
      className="max-w-[1200px] w-full pt-[112px] mx-auto  max-lg:px-[16px] max-2xl:px-[24px]"
    >
      <div className="flex max-lg:flex-col justify-between mb-10">
        <div className="w-5/12 max-lg:w-full">
          <Typography
            type="body1-r"
            fontSize={"16px"}
            className="text-brand mb-2"
          >
            [OUR TEAM]
          </Typography>
          <Typography
            type="headline2"
            fontWeight={700}
            className="text-primary mb-6"
          >
            Meet our Team
          </Typography>
          <Typography type="paragraph1" className="text-read">
            Meet the talented team driving the success of Mike Token.
          </Typography>
        </div>
        <div className="flex w-5/12 max-lg:w-full max-lg:mt-[24px] max-lg:justify-start justify-end"></div>
      </div>
      <div className="block max-md:block max-xl:hidden">
        <StyledSlider {...settings}>
          {member.map((e, index) => {
            return (
              <div key={index} className="card-member pr-8 h-[650px]">
                <Flex
                  p={"1px"}
                  borderRadius={"8px"}
                  className="bg-divider h-full"
                >
                  <Flex
                    className={index % 2 ? "bg-default" : ""}
                    w="100%"
                    borderRadius={"8px"}
                    display={"block"}
                  >
                    <Image
                      className="mx-auto"
                      src={`/assets/images/${e.avatar}.svg`}
                      width={335}
                      height={314}
                      alt=""
                    />
                    <Flex
                      w="100%"
                      bg={
                        index % 2 ? "#232325!important" : "#1ED760 !important"
                      }
                      opacity={index % 2 ? "" : "0.1!important"}
                      mt="24px"
                      height={"1px !important"}
                    />
                    <Flex p={"24px 24px"} display="block">
                      <Flex
                        align={"center"}
                        justifyContent={"space-between"}
                        w="100%"
                        marginBottom={"8px !important"}
                      >
                        <Flex>
                          <Typography type="headline4" className="text-read">
                            {e.nameMenber}
                          </Typography>
                        </Flex>
                        <Flex
                          height="33px"
                          width="33px"
                          justifyContent={"flex-end"}
                        >
                          {e.linkedin && (
                            <Link href={e.linkedin}>
                              <LinkedinIcon
                                sx={{
                                  _hover: {
                                    "& path": {
                                      stroke: "#1ED760",
                                    },
                                    stroke: "#1ED760  ",
                                  },
                                }}
                                height="33px"
                                width="33px"
                              />
                            </Link>
                          )}
                        </Flex>
                      </Flex>
                      <Flex justifyContent={"flex-start !important"}>
                        <Flex
                          bg="rgba(30, 215, 96, 0.10)"
                          className="text-brand"
                          w="fit-content !important"
                          borderRadius="4px"
                          p="8px"
                        >
                          {e.title}
                        </Flex>
                      </Flex>
                      <Flex alignItems={"flex-start"} className="pt-4">
                        <Typography type="paragraph1" className="text-read">
                          {e.info}
                        </Typography>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </div>
            );
          })}
        </StyledSlider>
      </div>
      <div className="hidden max-md:hidden max-xl:block">
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
          {member.map((e, index) => {
            return (
              <GridItem
                key={index}
                area={e.name}
                className="w-full min-w-[25%] mr-[32px]"
              >
                <Flex
                  p={"1px"}
                  borderRadius={"8px"}
                  className="bg-divider h-full"
                >
                  <Flex
                    className={index % 2 ? "bg-default" : ""}
                    w="100%"
                    borderRadius={"8px"}
                    display={"block"}
                  >
                    <Image
                      className="mx-auto"
                      src={`/assets/images/${e.avatar}.svg`}
                      width={335}
                      height={314}
                      alt=""
                    />
                    <Flex
                      w="100%"
                      className={
                        index % 2 ? "bg-divider" : "bg-brand opacity-10"
                      }
                      mt="24px"
                      height={"1px"}
                    />
                    <Flex p={"24px 24px"} display="block">
                      <Flex
                        align={"center"}
                        justifyContent={"space-between"}
                        w="100%"
                        marginBottom={"8px !important"}
                      >
                        <Typography type="headline4" className="text-read">
                          {e.nameMenber}
                        </Typography>
                        <div>
                          {e.linkedin && (
                            <Link href={e.linkedin}>
                              <LinkedinIcon height="33px" width="33px" />
                            </Link>
                          )}
                        </div>
                      </Flex>
                      <Flex
                        bg="rgba(30, 215, 96, 0.10)"
                        className="text-brand team-member mb-4"
                        w="fit-content"
                        borderRadius="4px"
                        p="8px"
                      >
                        {e.title}
                      </Flex>
                      <Flex alignItems={"flex-start"}>
                        <Typography type="paragraph1" className="text-read">
                          {e.info}
                        </Typography>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </GridItem>
            );
          })}
        </Grid>
      </div>
    </div>
  );
};

export default TeamMember;
