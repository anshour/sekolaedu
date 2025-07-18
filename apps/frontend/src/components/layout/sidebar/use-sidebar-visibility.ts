import { useEffect } from "react";

export const useSidebarVisibility = ({
  isDesktop,
  isOpen,
  onOpen,
  onClose,
}: {
  isDesktop: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  useEffect(() => {
    // Handle sidebar visibility based on device type
    if (isDesktop !== isOpen) {
      if (isDesktop) {
        onOpen();
      } else {
        onClose();
      }
    }
  }, [isDesktop]);
};
