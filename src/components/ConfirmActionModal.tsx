import type { Dispatch, SetStateAction } from "react";
import Modal from "./Modal";

type onConfirmType = {
  title: string;
  message: string;
  action: () => void;
};

interface ConfirmActionModalProps {
  onConfirm: null | onConfirmType;
  setOnConfirm: Dispatch<SetStateAction<null | onConfirmType>>;
}

const ConfirmActionModal = ({
  onConfirm,
  setOnConfirm,
}: ConfirmActionModalProps) => {
  return (
    <Modal
      isOpen={!!onConfirm}
      close={() => setOnConfirm(null)}
      width="w-96"
      title={onConfirm?.title}
    >
      <div className="py-2">{onConfirm?.message}</div>
      <div className="mt-2 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setOnConfirm(null)}
          className="rounded border-2 border-teal-600 px-2 py-1 text-teal-600 transition hover:brightness-110 dark:border-teal-400 dark:text-teal-400"
        >
          cancel
        </button>
        <button
          onClick={() => {
            onConfirm && onConfirm.action();
            setOnConfirm(null);
          }}
          className="flex items-center gap-2 rounded bg-teal-600 px-2 py-1 text-zinc-100 transition enabled:hover:brightness-110 disabled:opacity-50 dark:bg-teal-400 dark:text-zinc-900"
        >
          confirm
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmActionModal;
