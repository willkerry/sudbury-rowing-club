import { Fragment } from "react";
import safety from "../../data/safety.json";
import cn from "classnames";
import Link from "next/link";
import { Popover, Transition } from "@headlessui/react";
import SafetyPopup from "../safety";

function StatusIndicator() {
  return (
    <>
      {safety.status.display && (
        <div
          className={cn(
            "flex items-center px-1.5 py-1 rounded font-semibold text-xs",
            {
              "bg-red-100": safety.status.severity == "Red",
              "bg-yellow-100": safety.status.severity == "Amber",
              "bg-green-100": safety.status.severity == "Green",
              "bg-blue-100": safety.status.severity == "Neutral",
            }
          )}
        >
          <div
            className={cn(
              "inline-block w-3 h-3 mr-1 rounded-full animate-pulse",
              {
                "bg-red-500": safety.status.severity == "Red",
                "bg-yellow-600": safety.status.severity == "Amber",
                "bg-green-500": safety.status.severity == "Green",
                "bg-blue-500": safety.status.severity == "Neutral",
              }
            )}
          />
          <span
            className={cn("pt-px", {
              "text-red-900": safety.status.severity == "Red",
              "text-yellow-900": safety.status.severity == "Amber",
              "text-green-900": safety.status.severity == "Green",
              "text-blue-800": safety.status.severity == "Neutral",
            })}
          >
            <span className="lg:sr-only">{safety.status.severity}</span>
            <span className="hidden lg:inline">River status</span>
          </span>
        </div>
      )}
    </>
  );
}

export default function SafetyStatus() {
  return (
    <>
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button className="focus:outline-none">
              <StatusIndicator />
            </Popover.Button>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                static
                className="absolute z-20 px-2 mt-3 transform -translate-x-1/2 w-min left-1/2 sm:px-0"
              >
                <div className="overflow-hidden bg-white rounded-lg shadow-lg w-96 ring-1 ring-black ring-opacity-5">
                  <SafetyPopup />
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
}
