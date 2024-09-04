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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ButtonComponent } from "..";
import { ethers } from "ethers";

interface ActionUnstakeClassicProps extends ButtonProps {
  data: ICardPool;
  tokenContract: any;
  stakingContract: any;
  stakedAmount: string;
  isMKTUSDTPool?: boolean;
}
const listOptionsAmount = [
  { value: 25, label: "25%" },
  { value: 50, label: "50%" },
  { value: 75, label: "75%" },
  { value: 100, label: "100%" },
];
const ActionUnstakeClassic: React.FC<ActionUnstakeClassicProps> = ({
  data,
  stakingContract,
  stakedAmount,
  isMKTUSDTPool = false,
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
    setValueInput(stakedAmount.toString());
  };
  const amount = useMemo(() => {
    try {
      if (!ethers || !valueInput) {
        return "0";
      }
      return ethers?.utils?.parseUnits(Number(valueInput).toFixed(16) ?? "1")?.toString();
    } catch (error) {}
  }, [valueInput]);
  const [percent, setPercent] = useState<number | string>("");
  const handleChangeAmount = (e: any) => {
    setPercent(e);
    if (e === 100) {
      return setValueInput(stakedAmount.toString());
    } else {
      {
        setValueInput(Number((Number(stakedAmount) * e) / 100).toString());
      }
    }
  };
  const handleUnstake = useCallback(async () => {
    try {
      if (!valueInput) {
        return;
      }
      setIsLoading(true);
      unstakeModal.closeModal();
      let tx = null;
      if (isMKTUSDTPool) {
        await stakingContract.estimateGas.unstake(amount);
        pendingModal.openModal();
        tx = await stakingContract.unstake(
          amount,

          {
            gasLimit: 500000,
          }
        );
      } else {
        await stakingContract.estimateGas.withdraw(data?.pid, amount);
        pendingModal.openModal();
        tx = await stakingContract.withdraw(
          data?.pid,
          amount,

          {
            gasLimit: 500000,
          }
        );
      }

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
  }, [
    amount,
    data?.pid,
    failModal,
    isMKTUSDTPool,
    pendingModal,
    stakingContract,
    submittedModal,
    unstakeModal,
    valueInput,
  ]);

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
        onClick={unstakeModal.openModal}
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
              UnStake {data?.title}
            </Typography>
            <Flex mb="8px" w="100%" justifyContent={"space-between"}>
              <Typography type="caption1-r" color="text.secondary">
                {data?.title}
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
                {data?.stakedSymbol}
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
            <Flex className={"my-2 justify-between gap-1 "}>
              {listOptionsAmount.map((item) => (
                <Button
                  variant={"unstyled"}
                  key={item.value}
                  onClick={() => handleChangeAmount(item.value)}
                  className={
                    "h-[32px] w-[18%] min-w-fit rounded-xl px-3 font-medium leading-4"
                  }
                  sx={{
                    h: "32px",
                    borderRadius: "10px",
                    mt: "12px",
                  }}
                  border="1px solid"
                  borderColor={
                    item.value === percent ? "text.brand" : "text.secondary"
                  }
                  color={
                    item.value === percent ? "text.brand" : "text.secondary"
                  }
                  fontSize={"sm"}
                >
                  {item.label}
                </Button>
              ))}
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

export default ActionUnstakeClassic;
