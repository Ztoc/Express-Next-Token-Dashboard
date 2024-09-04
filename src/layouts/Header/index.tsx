import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerOverlay,
  Flex,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import ButtonConnectWallet from "@src/components/ButtonConnectWallet";
import { ListWallets } from "@src/configs/web3/wallets";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Features, features } from "./Features";
import UserInfo from "./UserInfo";
import Link from "next/link";
import { useRouter } from "next/router";
import { redirect } from "@src/containers/HomePage/Community";
import { Typography } from "@src/components/Typography";
import { PriceMkt } from "./PriceMkt";
export const Header = () => {
  const [currentWallet, setCurrentWallet] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const wallet = useMemo(() => {
    if (currentWallet) {
      return ListWallets.find((item) => item.connectorId === currentWallet);
    }
    return null;
  }, [currentWallet]);
  const IconWallet = wallet?.icon
    ? wallet.icon
    : (props: any) => <Flex {...props} />;

  return (
    <>
      <Flex
        sx={{
          // maxW: "1200px",
          mx: "auto",
          // borderRadius: "8px",
          // border: "1px solid #1ED760",
          // boxShadow: "0px 8px 25px 0px rgba(0, 0, 0, 0.50)",
          borderBottom: "1px solid #555C6D",
          px: "1.5em",
          py: "0.8em",
          zIndex: 10,
          position: "relative",
          background: "bg.default",
        }}
      >
        <SimpleGrid
          maxW="1200px"
          mx="auto"
          w={"100%"}
          columns={{
            xs: 2,
            xl: 3,
          }}
          alignItems={"center"}
        >
          <Flex gap={"0.5em"} align={"center"}>
            <Flex
              display={{
                xs: "flex",
                xl: "none",
              }}
              mr="10px"
            >
              <Image
                src="/icons/menu-mobile.svg"
                alt="logo"
                width={32}
                height={32}
                onClick={onOpen}
              />
            </Flex>
            <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
            <Flex
              display={{
                xs: "none",
                lg: "flex",
              }}
              alignContent={"center"}
            >
              <Image
                src="/icons/project_name.svg"
                alt="logo"
                width={141}
                height={28}
              />
            </Flex>
          </Flex>
          <Features />   
          

          <Flex justifyContent={"flex-end"}>
            <Flex
              display={{
                xs: "none",
                lg: "flex",
              }}
            >
              <PriceMkt />
            </Flex>
            <ButtonConnectWallet>
              <Flex
                className={
                  "prose cursor-pointer items-center gap-1 bg-white px-3 py-2"
                }
              >
                <IconWallet boxSize={6} />
                <UserInfo />
              </Flex>
            </ButtonConnectWallet>
          </Flex>
        </SimpleGrid>
      </Flex>
      <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="#161717" className="text-primary">
          <DrawerCloseButton />
          <DrawerHeader>
            <Flex>
              <Image
                className="mr-2"
                src="/icons/logo.svg"
                alt="logo"
                width={40}
                height={40}
              />
              <Image
                src="/icons/project_name.svg"
                alt="logo"
                width={141}
                height={28}
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody px="0">
            {features.map((e) => {
              const isActive = router?.asPath === e.path;
              return (
                <Link
                  href={e.path}
                  key={e.name}
                  onClick={onClose}
                  target={e.isExternal ? "_blank" : ""}
                >
                  <Flex
                    borderLeft={
                      router?.asPath === e.path
                        ? "2px solid #1ED760"
                        : "1px solid transparent"
                    }
                    background={
                      router?.asPath === e.path
                        ? "rgba(30, 215, 96, 0.05)"
                        : "transparent"
                    }
                    p="12px 16px"
                    _hover={{ background: "#555C6D" }}
                    w={"100%"}
                    alignItems={"center"}
                    color={router?.asPath === e.path ? "#1ED760" : "#F6F6FF"}
                  >
                    <Image
                      className="mr-4"
                      src={`/assets/images/icons/${
                        isActive ? `${e.icons}-active` : e.icons
                      }.svg`}
                      alt=""
                      width={24}
                      height={24}
                      style={{ fill: "red" }}
                    />
                    {/* {icons.home)} */}
                    <Typography type="body1" color={"text.primary"}>
                      {" "}
                      {e.name}
                    </Typography>
                  </Flex>
                </Link>
              );
            })}
            <Flex justifyContent={"center"}>
              {redirect.map((e, index) => {
                return (
                  <Flex key={index} mr="22px" mt="32px">
                    <Link href={e.link} >
                      <Image
                        src={`/assets/images/icons/${e.image}.svg`}
                        width="24"
                        height="24"
                        alt={""}
                        className="stroke-cyan-500"
                      />
                    </Link>
                  </Flex>
                );
              })}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
