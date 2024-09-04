import { useDisclosure } from "@chakra-ui/react";

export const useModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const openModal = () => {
    onOpen();
  };

  const closeModal = () => {
    onClose();
  };

  return {
    isOpen,
    openModal,
    closeModal,
  };
};
