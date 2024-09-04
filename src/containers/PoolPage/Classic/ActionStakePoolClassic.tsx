import {
  Button,
  ButtonProps,
  Flex,
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
import { useWeb3React } from "@src/hooks/useWeb3React";
import { formatBigNumber, formatNumberWithNumeral } from "@src/utils/format";
import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { ButtonComponent } from "..";
import { ethers } from "ethers";
import { MAX_INT } from "@src/constants";

interface ActionStakePoolClassicProps extends ButtonProps {
  data: ICardPool;
  tokenContract: any;
  stakingContract: any;
  apr: string | number;
  priceToken: string | number;
  totalStake: string | number;
  mktContract: any;
  isMKTUSDTPool?: boolean;
}
const listOptionsAmount = [
  { value: 25, label: "25%" },
  { value: 50, label: "50%" },
  { value: 75, label: "75%" },
  { value: 100, label: "100%" },
];

const ActionStakePoolClassic: React.FC<ActionStakePoolClassicProps> = ({
  data,
  tokenContract,
  stakingContract,
  apr,
  priceToken,
  totalStake,
  mktContract,
  isMKTUSDTPool = false,
  ...rest
}) => {
  const [valueInput, setValueInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");
  const [errorTransaction, setErrTransaction] = React.useState("");
  const { symbol } = data ?? {};
  const { account } = useWeb3React();
  const pendingModal = useModal();
  const submittedModal = useModal();
  const failModal = useModal();
  const stakeModal = useModal();
  const { data: balance } = useSWR(
    ["getBalance", account, tokenContract.address],
    async () => {
      const res = await tokenContract.balanceOf(account);
      return res;
    }
  );

  const { data: tokenAllowance } = useSWR(
    ["tokenAllowance", account, tokenContract.address],
    async () => {
      const res = await tokenContract.allowance(
        account,
        stakingContract.address
      );
      return res;
    }
  );
  const [isPendingApprover, setIsPendingApprover] = useState(false);

  const isNeedApprove = useMemo(() => {
    if (!tokenAllowance) {
      return true;
    }
    const realMktAllowance = formatBigNumber(tokenAllowance);
    if (realMktAllowance < Number(valueInput)) {
      return true;
    }
    return false;
  }, [tokenAllowance, valueInput]);

  const handleApproveToken = useCallback(async () => {
    try {
      setIsLoading(true);
      const tx = await mktContract.approve(
        stakingContract.address,
        MAX_INT.toString()
      );

      const res = await tx.wait();
      if (res) {
        return setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [mktContract, stakingContract.address]);
  const [percent, setPercent] = useState<number | string>("");

  const handleChangeAmount = (e: any) => {
    setPercent(e);

    if (e === 100) {
      return setValueInput((balanceToNumber * 0.999999999).toString());
    } else {
      {
        setValueInput(Number((balanceToNumber * e) / 100).toString());
      }
    }
  };
  const balanceToNumber = formatBigNumber(balance);
  const errMess = useMemo(() => {
    if (Number(valueInput) > Number(balanceToNumber)) {
      return "Insufficient balance";
    }
  }, [balanceToNumber, valueInput]);

  const onChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setValueInput(e.target.value);
  };
  const onMax = () => {
    setValueInput((balanceToNumber * 0.999999999).toFixed(17));
  };
  const handleStake = useCallback(async () => {
    try {
      if (isNeedApprove) {
        return handleApproveToken();
      }
      if (!valueInput) {
        return;
      }
      setIsLoading(true);
      stakeModal.closeModal();
      const amount = ethers.utils.parseUnits(Number(valueInput).toFixed(16)).toString();

      let tx = null;
      if (isMKTUSDTPool) {
        await stakingContract.estimateGas.stake(amount);
        pendingModal.openModal();
        tx = await stakingContract.stake(amount, { gasLimit: 500000 });
      } else {
        await stakingContract.estimateGas.deposit(data?.pid, amount);
        pendingModal.openModal();
        tx = await stakingContract.deposit(data?.pid, amount, {
          gasLimit: 500000,
        });
      }
      setTxHash(tx.hash);
      await tx.wait();
      pendingModal.closeModal();
      submittedModal.openModal();

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      failModal.openModal();
      pendingModal.closeModal();
      setErrTransaction(error.reason);
    }
  }, [
    data?.pid,
    failModal,
    handleApproveToken,
    isMKTUSDTPool,
    isNeedApprove,
    pendingModal,
    stakeModal,
    stakingContract,
    submittedModal,
    valueInput,
  ]);

  useEffect(() => {
    setValueInput("");
  }, [stakeModal?.isOpen]);

  const handleConfirm = useCallback(() => {
    return handleStake();
  }, [handleStake]);
  const actionName = useMemo(() => {
    if (isNeedApprove) {
      return "Approve";
    }
    return "Confirm";
  }, [isNeedApprove]);

  const isValidate =
    !!errMess ||
    valueInput === "" ||
    Number(valueInput) === Number(0) ||
    isLoading;
  return (
    <>
      <ButtonComponent
        onClick={stakeModal?.openModal}
        title="Deposit"
        loadingText={"Deposit..."}
        isLoading={isLoading}
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
        titleFail={"Staked failed"}
      />
      <Modal
        autoFocus={false}
        isOpen={stakeModal?.isOpen}
        onClose={() => {
          stakeModal?.closeModal();
          setPercent("");
        }}
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
              Stake {data?.title}
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
                  {formatNumberWithNumeral(balanceToNumber)}
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
                errorBorderColor={"text.error"}
                _focus={{
                  borderColor: "bg.brand",
                  boxShadow: "none",
                }}
                onChange={onChange}
                value={valueInput}
                placeholder="0.0"
                color={"text.primary"}
                _placeholder={{
                  color: "text.muted",
                }}
                isInvalid={!!errMess}
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

            {/* <Flex mt="24px" w="100%" justifyContent={"space-between"}>
              <Typography type="body1-r" color="text.secondary">
                Total Staked
              </Typography>
              <Typography type="body1-r" color="text.primary">
                {formatNumberWithNumeral(totalStake)} {symbol}{" "}
              </Typography>
            </Flex> */}
            {/* <Flex py="8px" w="100%" justifyContent={"space-between"}>
              <Typography type="body1-r" color="text.secondary">
                APR
              </Typography>
              <Typography type="body1-r" color="text.primary">
                {formatNumberWithNumeral(apr, 2)}
              </Typography>
            </Flex> */}
            {/* <Flex w="100%" justifyContent={"space-between"} >
              <Typography type="body1-r" color="text.secondary">
                Est Annual Income
              </Typography>
              <Typography type="body1-r" color="text.primary">
                $
                {formatNumberWithNumeral(
                  Number(valueInput) *
                  (Number(apr) / 100) *
                  Number(priceToken || 1)
                )}
              </Typography>
            </Flex> */}
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
                onClick={stakeModal?.closeModal}
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
                onClick={handleConfirm}
              >
                <Typography type="button1">{actionName}</Typography>
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ActionStakePoolClassic;
