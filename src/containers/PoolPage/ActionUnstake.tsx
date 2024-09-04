import {
  Button,
  ButtonProps,
  Flex,
  FlexProps,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import ModalConfirm from "@src/components/ModalTransaction/ConfirmModal";
import { Typography } from "@src/components/Typography";
import { ICardPool } from "@src/constants/pool";
import { useModal } from "@src/hooks/useModal";
import { formatNumberWithNumeral } from "@src/utils/format";
import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useMemo } from "react";
import { ButtonComponent } from ".";

interface ActionUnstakeProps extends ButtonProps {
  data: ICardPool;
  tokenContract: any;
  stakingContract: any;
  stakedAmount: string;
}

const ActionUnstake: React.FC<ActionUnstakeProps> = ({
  data,
  stakingContract,
  stakedAmount,
  ...rest
}) => {
  const [valueInput, setValueInput] = React.useState("");
  const [txHash, setTxHash] = React.useState("");
  const [errorTransaction, setErrTransaction] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const pendingModal = useModal();
  const submittedModal = useModal();
  const failModal = useModal();
  const unstakeModal = useModal();

  const { symbol } = data ?? {};

  const errMess = useMemo(() => {
    if (Number(valueInput) > Number(stakedAmount)) {
      return "Insufficient balance";
    }
  }, [stakedAmount, valueInput]);

  const isValidate =
    !!errMess || valueInput === "" || Number(valueInput) === Number(0);
  const onChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setValueInput(e.target.value);
  };
  const onMax = () => {
    setValueInput(stakedAmount);
  };

  const handleUnstake = useCallback(async () => {
    try {
      setIsLoading(true);
      // unstakeModal.closeModal();

      await stakingContract.estimateGas.withdraw();
      pendingModal.openModal();
      const tx = await stakingContract.withdraw({
        gasLimit: 500000,
      });
      setTxHash(tx.hash);
      await tx.wait();
      setIsLoading(false);
      pendingModal.closeModal();
      submittedModal.openModal();
    } catch (error: any) {
      console.error("Error unstake", error);
      failModal.openModal();
      pendingModal.closeModal();
      setErrTransaction(error.reason);
      setIsLoading(false);
    }
  }, [failModal, pendingModal, stakingContract, submittedModal]);

  useEffect(() => {
    setValueInput("");
  }, [unstakeModal?.isOpen]);

  return (
    <>
      <ButtonComponent
        borderRadius={"6px"}
        w="100%"
        isLoading={isLoading}
        loadingText="Withdraw..."
        title="Withdraw"
        onClick={handleUnstake}
        {...rest}
      />
      <ModalConfirm
        isOpenModalPending={pendingModal?.isOpen}
        isOpenModalSubmitted={submittedModal?.isOpen}
        onCloseModalPending={pendingModal?.closeModal}
        onCloseModalSubmitted={submittedModal?.closeModal}
        txHash={txHash}
        errMess={errorTransaction}
        onCloseModalTransactionFail={failModal?.closeModal}
        isOpenModalTransactionFail={failModal?.isOpen}
        titleFail={"Unstake failed"}
      />
      <Modal
        autoFocus={false}
        isOpen={unstakeModal.isOpen}
        onClose={unstakeModal.closeModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg="bg.secondary" p="16px" borderRadius={"8px"}>
          <ModalCloseButton
            mt="6px"
            color="text.secondary"
            _hover={{
              color: "text.primary",
            }}
          />
          <ModalBody p="0">
            <Typography mb="16px" type="headline6" color="text.primary">
              UnStake {symbol}
            </Typography>
            <Flex mb="8px" w="100%" justifyContent={"space-between"}>
              <Typography type="caption1-r" color="text.secondary">
                {symbol}
              </Typography>
              <Typography as="span" type="caption1-r" color="text.secondary">
                Avail:
                <Typography
                  px="4px"
                  as="span"
                  type="caption1-r"
                  color="text.primary"
                >
                  {formatNumberWithNumeral(stakedAmount)}
                </Typography>
                {symbol}
              </Typography>
            </Flex>
            <InputGroup className="style-focus">
              <Input
                border="1px solid"
                borderColor="bg.tertiary"
                _hover={{
                  borderColor: "bg.brand",
                }}
                _active={{
                  borderColor: "bg.brand",
                }}
                _focus={{
                  borderColor: "bg.brand",
                  boxShadow: "none",
                }}
                isInvalid={!!errMess}
                errorBorderColor={"text.error"}
                onChange={onChange}
                value={valueInput}
                placeholder="0.0"
                color={"text.primary"}
                _placeholder={{
                  color: "text.muted",
                }}
                paddingRight={"80px"}
                paddingLeft={"16px"}
                type="number"
              />
              <InputRightElement>
                <Typography
                  cursor={"pointer"}
                  pr="16px"
                  type="button2"
                  color={"text.brand"}
                  onClick={onMax}
                >
                  MAX
                </Typography>
              </InputRightElement>
            </InputGroup>
            <Flex mt="4px" hidden={!errMess}>
              <Image src="/icons/exclamation-circle.svg" alt="icon error" />
              <Typography pl="6px" type="caption1-r" color={"text.error"}>
                {errMess}
              </Typography>
            </Flex>

            <Flex w="100%" mt="24px" justify={"space-between"}>
              <Button
                borderRadius={"6px"}
                border="1px solid"
                bg="transparent"
                _hover={{
                  bg: "bg.muted",
                }}
                _active={{
                  bg: "bg.muted",
                }}
                color="text.muted"
                borderColor="bg.muted"
                onClick={unstakeModal.closeModal}
                w="48%"
              >
                <Typography type="button1">Cancel</Typography>
              </Button>

              <Button
                w="48%"
                background={"bg.brand !important"}
                borderRadius={"6px"}
                _hover={{
                  bg: "bg.brand-active !important",
                }}
                _active={{
                  bg: "bg.brand-active !important",
                }}
                color={"bg.default"}
                isDisabled={isValidate}
                _disabled={{
                  background: "bg.muted !important",
                  color: "text.secondary",
                  _hover: {
                    bg: "bg.muted",
                  },
                  _active: {
                    bg: "bg.muted",
                  },
                  cursor: "not-allowed",
                }}
                onClick={handleUnstake}
              >
                <Typography type="button1">Confirm</Typography>
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ActionUnstake;
