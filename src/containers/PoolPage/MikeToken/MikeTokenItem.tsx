import React from "react";
import Marquee from "react-fast-marquee";
import { Typography } from "@src/components/Typography";
import { Box, Flex, Image } from "@chakra-ui/react";

interface MikeTokenItemProps{
  direction?: any;
  colorPrimary: string;
  bgPrimary: string;
}

const MikeTokenItem: React.FC<MikeTokenItemProps> = ({direction, colorPrimary, bgPrimary}) => {
   const listPartner = [
    {
      title: "MIKETOKEN",
    },
    {
      title: "MIKETOKEN",
    },
    {
      title: "MIKETOKEN",
    },
    {
      title: "MIKETOKEN",
    },
  ];
  return (
    <Flex
      borderColor={"bg.secondary"}
      position={"relative"}
      overflow={"hidden"}
      h="40px"
      align={"center"}
      bg={bgPrimary}
    >
      <Marquee
        speed={30}
        gradient={false}
        direction={direction || "left"} 
        delay={0}
        autoFill={true}
      >
        {listPartner.map((e, idx) => {
          return (
            <Flex
              key={`item-partner-${idx}-${e.title}`}
              w="150px"
              align="center"
            >
              <Flex
                w="100%"
                mx="auto"
                alignItems={"center"}
                gap={2}
                px={2}
                justify="center"
                color={colorPrimary}
              >
                <Typography as="span" type={"body1-r"}>
                  {e?.title}
                </Typography>
              </Flex>
              <Flex bg={colorPrimary} borderRadius={"50%"} boxSize={"8px"}/>
            </Flex>
          );
        })}
      </Marquee>
    </Flex>
  );
};

export default MikeTokenItem;
