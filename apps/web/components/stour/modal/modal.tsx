import { ComponentProps, ReactNode } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";

type ModalProps = {
  title: string;
  description: string;
  buttons?: ComponentProps<typeof Button>[];
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  showCancel?: boolean;
};

export const Modal = ({
  title,
  description,
  children,
  buttons,
  open,
  onClose,
  showCancel = true,
}: ModalProps) => (
  <Dialog {...{ open, onClose }} className="relative z-50">
    <div className="fixed inset-0 flex w-screen items-center justify-center p-4 backdrop-blur-sm">
      <Dialog.Panel className="m-4 w-full max-w-lg rounded border bg-white p-4 shadow-lg">
        <div className="mb-4">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <Dialog.Description className="text-gray-500">
            {description}
          </Dialog.Description>
        </div>

        {children}

        <div className="mt-4 flex justify-end gap-2">
          {showCancel && <Button onClick={onClose}>Cancel</Button>}
          {buttons?.map((button) => (
            <Button key={button.children?.toString()} {...button} />
          ))}
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
);
