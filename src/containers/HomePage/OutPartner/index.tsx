import React from "react";
import Marquee from "react-fast-marquee";
import { Typography } from "@src/components/Typography";
import { Box, Flex, Image } from "@chakra-ui/react";
import { listPartner } from "@src/constants/home";
const OurPartner: React.FC = () => {
  return (
    <Flex
      borderTop={"2px solid"}
      borderBottom={"6px solid"}
      //   py="54px"
      borderColor={"bg.secondary"}
      position={"relative"}
      overflow={"hidden"}
      h="140px"
      align={"center"}
    >
      <Flex
        color="text.brand"
        opacity="0.05000000074505806"
        fontWeight={700}
        textAlign={"center"}
        fontSize={"100px"}
        justify={"center"}
        mx="auto"
        whiteSpace={"nowrap"}
        align={"center"}
        justifyContent={"center"}
        position={"absolute"}
        left={{
          base: 0,
          lg: "10%",
          xl: "20%",
        }}
      >
        OUR PARTNERS
      </Flex>

      <Marquee
        speed={30}
        gradient={false} // Tắt hiệu ứng gradient
        direction={"left"} // Thiết lập hướng di chuyển
        delay={0}
        autoFill={true}
      >
        {listPartner.map((e, idx) => {
          return (
            <Flex
              key={`item-partner-${idx}-${e.title}`}
              w="180px"
              align="center"
            >
              <Flex
                w="100%"
                mx="auto"
                alignItems={"center"}
                gap={2}
                px={3}
                justify="center"
              >
                <Box bg="white" borderRadius={"50%"}>
                  <Image alt={e.title} src={e?.imageUrl} boxSize="30px" borderRadius={"50%"}/>
                </Box>
                <Typography as="span" color={"text.primary"} type={"headline6"}>
                  {e?.title}
                </Typography>
              </Flex>
            </Flex>
          );
        })}
      </Marquee>
    </Flex>
  );
};

export default OurPartner;
