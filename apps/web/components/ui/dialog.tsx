"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { createContext, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type DialogType = "error" | "success" | "warn" | "info";

interface DialogOptions {
  closeText?: string;
  confirmText?: string;
  description: string;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: string;
}

interface DialogState extends DialogOptions {
  isOpen: boolean;
  type: DialogType;
}

type DialogContextType = {
  showDialog: (type: DialogType, options: DialogOptions) => void;
  closeDialog: () => void;
  state: DialogState | null;
};

const DialogContext = createContext<DialogContextType | null>(null);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<DialogState | null>(null);

  const showDialog = (type: DialogType, options: DialogOptions) => {
    setState({
      ...options,
      type,
      isOpen: true,
    });
  };

  const closeDialog = () => {
    if (state?.onClose) {
      state.onClose();
    }
    setState(null);
  };

  return (
    <DialogContext.Provider value={{ showDialog, closeDialog, state }}>
      {children}
      <DialogComponent />
    </DialogContext.Provider>
  );
};

const fallbackTitles: Record<DialogType, string> = {
  error: "Error",
  info: "Info",
  success: "Success",
  warn: "Warning",
};

// The actual dialog component using Radix UI
const DialogComponent = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error("Dialog must be used within DialogProvider");
  const { state, closeDialog } = context;

  if (!state) return null;

  const {
    type,
    title = fallbackTitles[type],
    description,
    isOpen,
    closeText = "Close",
    onConfirm,
    confirmText,
    onClose,
  } = state;

  return (
    <BaseDialog.Root onOpenChange={() => closeDialog()} open={isOpen}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="data-[closed]:fade-out-0 data-[open]:fade-in-0 fixed inset-0 z-50 bg-black/50 data-[closed]:animate-out data-[open]:animate-in" />

        <BaseDialog.Popup className="data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 data-[closed]:slide-out-to-left-1/2 data-[closed]:slide-out-to-top-[48%] data-[open]:slide-in-from-left-1/2 data-[open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-sm translate-x-[-50%] translate-y-[-50%] overflow-hidden border bg-gray-50 p-3 shadow-lg duration-200 data-[closed]:animate-out data-[open]:animate-in sm:rounded-sm">
          {title && (
            <BaseDialog.Title className="font-semibold text-gray-780 text-sm">
              {title}
            </BaseDialog.Title>
          )}

          <BaseDialog.Description className="font-medium text-gray-600 text-sm">
            {description}
          </BaseDialog.Description>

          <div className="-mx-0.5 mt-4 -mb-0.5 flex justify-between">
            <BaseDialog.Close
              className="flex-1"
              onClick={onClose}
              render={
                <Button size="xs" variant="secondary">
                  {closeText}
                </Button>
              }
            />

            {onConfirm && (
              <Button
                className="flex-1"
                onClick={() => {
                  onConfirm();
                  closeDialog();
                }}
                size="sm"
              >
                {confirmText}
              </Button>
            )}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
};

// Module-based imperative API
let dialogContext: DialogContextType | null = null;

const setDialogContext = (ctx: typeof dialogContext) => {
  dialogContext = ctx;
};

export const Dialog = {
  error: (options: DialogOptions) => {
    if (!dialogContext) {
      throw new Error("DialogProvider not found");
    }
    dialogContext.showDialog("error", options);
  },

  info: (options: DialogOptions) => {
    if (!dialogContext) {
      throw new Error("DialogProvider not found");
    }
    dialogContext.showDialog("info", options);
  },

  success: (options: DialogOptions) => {
    if (!dialogContext) {
      throw new Error("DialogProvider not found");
    }
    dialogContext.showDialog("success", options);
  },

  warn: (options: DialogOptions) => {
    if (!dialogContext) {
      throw new Error("DialogProvider not found");
    }
    dialogContext.showDialog("warn", options);
  },
};

export const useInitializeDialog = () => {
  const context = useContext(DialogContext);

  useEffect(() => {
    setDialogContext(context);
  }, [context]);
};
