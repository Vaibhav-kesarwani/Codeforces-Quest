import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { PopupBoxProps } from "../../../types/types";

const PopupBox = ({
  isOpen,
  setIsOpen,
  title,
  children,
  customClass,
  disableOutsideClick = false,
  disabledTopBar = false,
  popupHeight = "w-[100%]",
}: PopupBoxProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !disableOutsideClick &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (!disableOutsideClick) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (!disableOutsideClick) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [disableOutsideClick, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          className="px-2 no-scrollbar"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`${customClass} w-full h-full text-gray-700 dark:text-darkText-400  z-20 opacity-100 md:p-4 p-4  bg-white rounded-md shadow-sm dark:bg-darkBox-900 dark:border-darkBorder-800 mx-auto relative`}
          >
            {!disabledTopBar && (
              <div
                className={`w-full sticky h-full bg-white dark:bg-darkBox-900 z-10  dark:border-darkBorder-700 rounded-sm top-0 mb-3 flex ${title ? "justify-between" : "justify-end"
                  }`}
              >
                <h1 className="font-semibold dark:text-darkText-400 text-darkBox-800">
                  {title}
                </h1>
                <button onClick={() => setIsOpen(false)}>
                  <X size={24} />
                </button>
              </div>
            )}

            <div
              className={`${popupHeight} no-scrollbar`}
            >
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupBox;
