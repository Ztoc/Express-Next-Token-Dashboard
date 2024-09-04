import { Box, Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router.js";
import PropTypes from "prop-types";
import type { FC, ReactNode } from "react";
import { Footer } from "./Footer.tsx";
import { Header } from "./Header";
// const TopNav = dynamic(() => import("./top-nav"));

interface LayoutProps {
  children?: ReactNode;
}

export const Layout: FC<LayoutProps> = (props) => {
  const { children } = props;
  const router = useRouter();

  return (
    <Flex justifyContent={"space-between"} flexDirection={"column"} className="bg-default h-full relative z-9 min-h-[100vh]">
      <Flex direction="column" hidden={router?.asPath !== "/"}>
        <Image
          src="/images/left.png"
          width={535}
          height={535}
          alt="left"
          style={{
            position: "absolute",
          }}
        />
        <Image
          src="/images/left.png"
          width={535}
          height={535}
          alt="left"
          style={{
            right: "10%",
            top: "200px",
            position: "absolute",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "35vh",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
          }}
        >
          <Image
            src="/images/coin-ai.png"
            width={1836}
            height={375}
            alt="coin-ai"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      </Flex>
      <Box zIndex={10}>
        <Header />
      </Box>{" "}
      {children}
      <Footer />
    </Flex>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};
