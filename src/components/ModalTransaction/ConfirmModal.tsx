import React from "react";
import ModalPendingTransaction from "./ModalPendinng";
import ModalTransactionSubmitted from "./ModalTransactionSubmitted";
import ModalTransactionFail from "./ModalTransactionFail";

interface ModalConfirmProps {
  isOpenModalPending: boolean;
  onCloseModalPending: () => void;
  isOpenModalSubmitted: boolean;
  onCloseModalSubmitted: () => void;
  txHash: string;
  isOpenModalTransactionFail: boolean;
  onCloseModalTransactionFail: () => void;
  errMess: string
  titleFail: string;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  isOpenModalPending,
  onCloseModalPending,
  isOpenModalSubmitted,
  onCloseModalSubmitted,
  txHash,
  isOpenModalTransactionFail,
  onCloseModalTransactionFail,
  errMess,
  titleFail
}) => {
  return (
    <>
      <ModalPendingTransaction
        isOpen={isOpenModalPending}
        onClose={onCloseModalPending}
      />
      <ModalTransactionSubmitted
        isOpen={isOpenModalSubmitted}
        onClose={onCloseModalSubmitted}
        txHash={txHash}
      />
      <ModalTransactionFail
        isOpen={isOpenModalTransactionFail}
        onClose={onCloseModalTransactionFail}
        errorMess={errMess}
        titleFail={titleFail}
      />
    </>
  );
};

export default ModalConfirm;
