import { Flex } from "@chakra-ui/react";
import React, { useMemo } from "react";
import Image from "next/image";
import { useMKTPrice } from "@src/hooks/useBUSDPrice";
import useSWR from "swr";
import { Typography } from "@src/components/Typography";
export const PriceMkt = () => {
  const mktPrice = useMKTPrice();
  return (
    <Flex
      alignItems={"center"}
      justify={"center"}
      gap="6px"
      mr={{
        xs: "0px",
        lg: "12px",
      }}
    >
      <Image src="/icons/single.svg" alt="logo" width={24} height={24} />
      <Typography type="body1" color={"white"}>
        ${mktPrice}
      </Typography>
    </Flex>
  );
};
