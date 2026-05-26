import Button from "./Button.jsx";
import Modal from "./Modal.jsx";

function ConfirmDialog({
  confirmLabel = "Delete",
  confirmVariant = "danger",
  cancelLabel = "Cancel",
  isOpen,
  onCancel,
  onConfirm,
  title = "Confirm action",
  description = "This action cannot be undone.",
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="text-sm leading-6 text-zinc-600">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
