import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Flex,
  Image,
} from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";
import { SubExplorerPath, useGetExplorer } from "@src/hooks/useGetExplorer";

interface ModalTransactionSubmittedProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
}

const ModalTransactionSubmitted: React.FC<ModalTransactionSubmittedProps> = ({
  isOpen,
  onClose,
  txHash,
}) => {
  const txHashLink = useGetExplorer(SubExplorerPath.TX, txHash)
  return (
    <Modal autoFocus={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        maxW="390px"
        mx="10px"
        bg="bg.secondary"
        p={{
          base: "24px",
          md: "32px",
        }}
        borderRadius={"8px"}
      >
        <ModalCloseButton
          mt="6px"
          color="text.secondary"
          _hover={{
            color: "text.primary",
          }}
        />
        <ModalBody p="0">
          <Image
            src="/images/transaction-submitted.svg"
            alt="pending transaction"
            mx="auto"
          />
          <Typography
            mb="12px"
            mt="16px"
            textAlign={"center"}
            type="headline5"
            color="text.primary"
          >
            Transaction Submitted
          </Typography>
          <Typography
            type="body1-r"
            textAlign={"center"}
            color="text.secondary"
          >
            Your transaction has been submitted{" "}
          </Typography>
          <Typography
            type="body1-r"
            textAlign={"center"}
            color="text.secondary"
          >
            You will be notified of the futher updates{" "}
          </Typography>

          <Flex
            cursor={"pointer"}
            w="fit-content"
            align="center"
            mx="auto"
            borderRadius={"6px"}
            mt="24px"
            py="12px"
            px="20px"
            border="1px solid"
            borderColor={"bg.brand"}
            as="a"
            href={txHashLink}
            target="_blank"
          >
            <Typography pr="12px" type="button1" color="text.brand">
              View transaction detail 
            </Typography>
            <Image src="/icons/chevron-right.svg" alt="chevron right" />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalTransactionSubmitted;
