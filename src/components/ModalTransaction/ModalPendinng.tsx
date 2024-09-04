import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Image,
} from "@chakra-ui/react";
import { Typography } from "@src/components/Typography";

interface ModalPendingTransactionProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalPendingTransaction: React.FC<ModalPendingTransactionProps> = ({
  isOpen,
  onClose,
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
            src="/images/pending-transaction.svg"
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
            Processing
          </Typography>
          <Typography
            type="body1-r"
            textAlign={"center"}
            color="text.secondary"
          >
            Your transaction is being processed
          </Typography>
          <Typography
            type="body1-r"
            textAlign={"center"}
            color="text.secondary"
          >
            You will be notified of the futher updates{" "}
          </Typography>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalPendingTransaction;
