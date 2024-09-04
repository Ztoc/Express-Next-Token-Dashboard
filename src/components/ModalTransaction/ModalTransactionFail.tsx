import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Image,
} from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";

interface ModalTransactionFailProps {
  isOpen: boolean;
  onClose: () => void;
  errorMess: string;
  titleFail: string
}

const ModalTransactionFail: React.FC<ModalTransactionFailProps> = ({
  isOpen,
  onClose,
  errorMess,
  titleFail
}) => {
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
        <ModalBody p="0">
          <Image
            src="/images/transaction-fail.svg"
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
           { titleFail || 'Transaction failed'}
          </Typography>
          <Typography type="body1-r" textAlign={"center"} color="text.secondary">
            {errorMess}
          </Typography>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalTransactionFail;
