import { Box, Button, Divider, Flex, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import Image from "next/image";
import { Typography } from "@src/components/Typography";
import Link from "next/link";
import { PriceMkt } from "../Header/PriceMkt";
import { useRouter } from "next/router";

const features = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Mission",
    path: "#mission",
  },
  {
    name: "Tokenomics",
    path: "#tokenomics",
  },
  {
    name: "Roadmap",
    path: "#roadmap",
  },
  {
    name: "Team",
    path: "#team",
  },
  {
    name: "Social",
    path: "#social",
  },
];

export const Footer = () => {
  const router = useRouter();
  const handleBuyMkt = () => {
    router.push("/swap");
  };
  return (
    <Flex
      zIndex={9}
      position={"inherit"}
      p="1em"
      w={"100%"}
      className="bg-primary"
      height="fit-content"
    >
      <Box
        sx={{
          maxW: "1200px",
          mx: "auto",
          w: "100%",
        }}
      >
        <Flex
          flexDirection={{
            xs: "column",
            lg: "row",
          }}
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            maxW: "1200px",
          }}
        >
          <Flex
            gap={"10px"}
            w={{
              lg: "50%",
            }}
          >
            <Image src="/icons/logo.svg" alt="logo" width={38} height={38} />
            <Flex alignContent={"center"}>
              <Image
                src="/icons/project_name.svg"
                alt="logo"
                width={141}
                height={28}
              />
            </Flex>
          </Flex>
          <Flex
            display={{
              xs: "flex",
              lg: "none",
            }}
            justify={"space-between"}
            w={"100%"}
            py="16px"
            alignItems={"center"}
            borderTop={"1px solid #222736"}
            borderBottom={"1px solid #222736"}
            my="12px"
          >
            <PriceMkt />
            <Button
              variant={"outline"}
              color="#1ED760"
              border={"1px solid #1ED760"}
              _hover={{}}
              _active={{}}
              onClick={handleBuyMkt}
            >
              Buy MKT
            </Button>
          </Flex>
          <Flex
            w={{
              xs: "100%",
              lg: "50%",
            }}
            justifyContent={{
              xs: "space-between",
              md: "center",
              lg: "flex-end",
            }}
            gap="1.5em"
            color="text.primary"
          >
            <Flex
              flexDirection={{
                xs: "column",
                md: "row",
              }}
              ml="16px"
              gap="1.5em"
              justifyContent={"flex-end"}
            >
              {features.slice(0, 3).map((e) => (
                <Link href={e.path} key={e.name}>
                  <Flex key={e.name}>{e.name}</Flex>
                </Link>
              ))}
            </Flex>
            <Flex
              flexDirection={{
                xs: "column",
                md: "row",
              }}
              mr="16px"
              gap="1.5em"
            >
              {features.slice(3, 6).map((e) => (
                <Link href={e.path} key={e.name}>
                  <Flex
                    justifyContent={{
                      xs: "flex-end",
                      md: "",
                    }}
                  >
                    {e.name}
                  </Flex>
                </Link>
              ))}
            </Flex>
          </Flex>
        </Flex>
        <Divider color={"#222736"} my={"1.5em"} />
        <Typography color={"text.secondary"} type="body2" textAlign={"center"}>
          Disclaimer: Mike Token project is not related to the Monsters movies.
          We simply admire the characters.
        </Typography>
        <Typography color={"text.secondary"} type="body2" textAlign={"center"}>
          Copyright © 2023 MikeToken
        </Typography>
      </Box>
    </Flex>
  );
};
