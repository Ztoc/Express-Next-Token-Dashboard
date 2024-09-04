import { Button } from "@chakra-ui/react";
import ModalConfirm from "@src/components/ModalTransaction/ConfirmModal";
import { Typography } from "@src/components/Typography";
import { useModal } from "@src/hooks/useModal";
import React, { useCallback, useState } from "react";

interface ActionHarvestProps {
  isDisabled: boolean;
  stakingContract: any;
  pid: number;
  isMKTUSDTPool?: boolean;
}

const ActionHarvest: React.FC<ActionHarvestProps> = ({
  isDisabled,
  stakingContract,
  pid,
  isMKTUSDTPool = false,
}) => {
  const [isPendingHarvest, setIsPendingHarvest] = useState(false);
  const [txHash, setTxHash] = React.useState("");
  const [errorTransaction, setErrTransaction] = React.useState("");
  const pendingModal = useModal();
  const submittedModal = useModal();
  const failModal = useModal();
  const handleHarvest = useCallback(async () => {
    try {
      setIsPendingHarvest(true);
      pendingModal.openModal();
      let tx = null;
      if (isMKTUSDTPool) {
        await stakingContract.estimateGas.harvest();
        tx = await stakingContract.harvest({ gasLimit: 500000 });
      } else {
        await stakingContract.estimateGas.deposit(0, 0);
        tx = await stakingContract.deposit(pid, 0, { gasLimit: 500000 });
      }

      setTxHash(tx.hash);
      await tx.wait();
      pendingModal.closeModal();
      submittedModal.openModal();
      setIsPendingHarvest(false);
    } catch (error: any) {
      setIsPendingHarvest(false);
      console.error("Error harvest", error);
      setErrTransaction(error.reason);
      failModal.openModal();
      pendingModal.closeModal();
    }
  }, [
    failModal,
    isMKTUSDTPool,
    pendingModal,
    pid,
    stakingContract,
    submittedModal,
  ]);

  return (
    <>
      <ModalConfirm
        isOpenModalPending={pendingModal?.isOpen}
        isOpenModalSubmitted={submittedModal?.isOpen}
        onCloseModalPending={pendingModal?.closeModal}
        onCloseModalSubmitted={submittedModal?.closeModal}
        txHash={txHash}
        errMess={errorTransaction}
        onCloseModalTransactionFail={failModal?.closeModal}
        isOpenModalTransactionFail={failModal?.isOpen}
        titleFail={"Harvest failed"}
      />
      <Button
        border="1px solid"
        borderRadius={"6px"}
        borderColor="bg.brand"
        _hover={{
          bg: "bg.brand",
          color: "bg.default",
        }}
        _active={{
          bg: "bg.brand",
          color: "text.primary",
        }}
        background={"transparent"}
        _disabled={{
          bg: "transparent",
          _hover: {
            bg: "bg.muted",
          },
          _active: {
            bg: "bg.muted",
          },
          color: "text.muted",
          borderColor: "bg.muted",
          cursor: "not-allowed",
        }}
        color={"text.brand"}
        height="48px"
        isLoading={isPendingHarvest}
        loadingText={"Harvest..."}
        onClick={handleHarvest}
        isDisabled={isDisabled || isPendingHarvest}
      >
        <Typography type="button1">Harvest</Typography>
      </Button>
    </>
  );
};

export default ActionHarvest;
