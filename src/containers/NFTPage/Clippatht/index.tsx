import { Button, Flex } from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";
import Image from "next/image";
import { useRouter } from "next/router";
const Clippatht = () => {
  
  const router = useRouter();
  
  return (
    <Flex
      w="100%"
      h="10"
      background={"green"}
      mx="auto"
      justifyContent={"space-between"}
      className="clip-polygon-t"
      zIndex={2}
    >
    </Flex>
  );
};
export default Clippatht;
