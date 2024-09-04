import {
  Button,
  ButtonProps,
  Checkbox,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import ModalConfirm from "@src/components/ModalTransaction/ConfirmModal";
import { Typography } from "@src/components/Typography";
import { ICardPool } from "@src/constants/pool";
import { useMKTPriceDetail } from "@src/hooks/useMktPriceDetail";
import { useModal } from "@src/hooks/useModal";
import { useWeb3React } from "@src/hooks/useWeb3React";
import { formatBigNumber, formatNumberWithNumeral } from "@src/utils/format";
import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { ButtonComponent } from ".";
import { MAX_INT } from "@src/constants";
import { ethers } from "ethers";
interface ActionStakeProps extends ButtonProps {
  data: ICardPool;
  tokenContract: any;
  stakingContract: any;
  apr: string | number;
  priceToken: string | number;
  totalStake: string | number;
  mktContract: any;
}

const ActionStake: React.FC<ActionStakeProps> = ({
  data,
  tokenContract,
  stakingContract,
  apr,
  priceToken,
  totalStake,
  mktContract,
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
  const { data: balance } = useSWR(["getBalance", account], async () => {
    const res = await tokenContract.balanceOf(account);
    return res;
  });
  const mktPriceDetail = useMKTPriceDetail(stakingContract?.address);
  const { data: mktBalance } = useSWR(["getBalance_MKT", account], async () => {
    const res = await mktContract.balanceOf(account);
    return res;
  });
  const balanceToNumber = formatBigNumber(balance);
  const mktBalanceToNumber = formatBigNumber(mktBalance);
  const errMess = useMemo(() => {
    if (Number(valueInput) > Number(balanceToNumber)) {
      return "Insufficient balance";
    }
  }, [balanceToNumber, valueInput]);

  const onChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setValueInput(e.target.value);
  };
  const onMax = () => {
    setValueInput(balanceToNumber.toString());
  };
  const handleStake = useCallback(async () => {
    try {
      if (!valueInput) {
        return;
      }
      setIsLoading(true);
      stakeModal.closeModal();
      const amount = ethers.utils.parseUnits(valueInput).toString();
      await stakingContract.estimateGas.deposit(amount);
      pendingModal.openModal();
      const tx = await stakingContract.deposit(amount, { gasLimit: 500000 });
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
      console.error("Error stake", error);
    }
  }, [
    failModal,
    pendingModal,
    stakeModal,
    stakingContract,
    submittedModal,
    valueInput,
  ]);
  useEffect(() => {
    setValueInput("");
  }, [stakeModal?.isOpen]);
  const usdtPrice = 1;
  const mktLockPerStake = useMemo(() => {
    if (!valueInput || !mktPriceDetail) {
      return 0;
    }
    const locked =
      (Number(valueInput) * mktPriceDetail.mktPercentage * usdtPrice) /
      (100 * mktPriceDetail.mktPrice);
    return locked;
  }, [mktPriceDetail, valueInput]);
  const { data: mktAllowance, error } = useSWR(
    ["mktAllowance", account],
    async () => {
      const res = await mktContract.allowance(account, stakingContract.address);
      return res;
    }
  );
  const needBuyMkt = useMemo(() => {
    if (!mktLockPerStake || !mktBalanceToNumber) {
      return false;
    }
    return mktLockPerStake > mktBalanceToNumber;
  }, [mktBalanceToNumber, mktLockPerStake]);
  const isNeedApprove = useMemo(() => {
    if (!mktAllowance) {
      return true;
    }
    const realMktAllowance = formatBigNumber(mktAllowance);
    if (realMktAllowance < mktLockPerStake) {
      return true;
    }
    return false;
  }, [mktAllowance, mktLockPerStake]);
  const [isPendingApprover, setIsPendingApprover] = useState(false);

  const handleApproveMkt = useCallback(async () => {
    try {
      setIsPendingApprover(true);
      const tx = await mktContract.approve(
        stakingContract.address,
        MAX_INT.toString()
      );

      const res = await tx.wait();
      if (res) {
        return setIsPendingApprover(false);
      }
      setIsPendingApprover(false);
    } catch (error) {
      setIsPendingApprover(false);
    }
  }, [mktContract, stakingContract.address]);

  const handleConfirm = useCallback(() => {
    if (needBuyMkt) {
      return window.open("https://pancakeswap.finance/swap");
    }
    if (isNeedApprove) {
      return handleApproveMkt();
    }
    return handleStake();
  }, [handleApproveMkt, handleStake, isNeedApprove, needBuyMkt]);
  const actionName = useMemo(() => {
    if (needBuyMkt) {
      return "Buy MKT";
    }
    if (isNeedApprove) {
      return "Approve MKT";
    }
    return "Confirm";
  }, [isNeedApprove, needBuyMkt]);
  const [acceptRule, setAcceptRule] = useState(false);
  const isValidate =
    !!errMess ||
    valueInput === "" ||
    Number(valueInput) === Number(0) ||
    isPendingApprover ||
    !acceptRule;
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
        onClose={stakeModal?.closeModal}
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
              Stake {symbol}
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
                  {formatNumberWithNumeral(balanceToNumber)}
                </Typography>
                {symbol}
              </Typography>
            </Flex>
            <Flex mb="8px" w="100%" justifyContent={"space-between"}>
              <Typography type="caption1-r" color="text.secondary">
                MKT
              </Typography>
              <Typography as="span" type="caption1-r" color="text.secondary">
                Avail:
                <Typography
                  px="4px"
                  as="span"
                  type="caption1-r"
                  color="text.primary"
                >
                  {formatNumberWithNumeral(mktBalanceToNumber)}
                </Typography>
                MKT
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

            <Flex mt="24px" w="100%" justifyContent={"space-between"}>
              <Typography type="body1-r" color="text.secondary">
                Total Staked
              </Typography>
              <Typography type="body1-r" color="text.primary">
                {formatNumberWithNumeral(totalStake)} {symbol}{" "}
              </Typography>
            </Flex>
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
            <Flex w="100%" justifyContent={"space-between"} mt="12px">
              <Typography type="body1-r" color="text.secondary">
                Est MKT Locked
              </Typography>
              <Typography type="body1-r" color="text.primary">
                {mktLockPerStake} MKT
              </Typography>
            </Flex>
            {needBuyMkt && (
              <Typography type="body1-r" color="text.error" textAlign={"end"}>
                Insufficient MKT balance
              </Typography>
            )}
            <Checkbox
              sx={{
                mt: "12px",
              }}
              colorScheme="green"
              checked={acceptRule}
              onChange={() => setAcceptRule(!acceptRule)}
            >
              <Link
                sx={{
                  color: "white",
                }}
                href="https://miketoken-io.gitbook.io/miketoken.io/terms-and-conditions/disclaimer"
                target="_blank"
              >
                I agree to your Terms and Conditions
              </Link>
            </Checkbox>
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

export default ActionStake;
