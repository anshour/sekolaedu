import { Box } from "@chakra-ui/react";

export const SidebarOverlay = ({
  isOpen,
  isDesktop,
  onClose,
}: {
  isOpen: boolean;
  isDesktop: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || isDesktop) return null;

  return (
    <Box
      position="fixed"
      bgColor="rgba(0, 0, 0, 0.6)"
      w="full"
      h="full"
      top={0}
      left={0}
      zIndex={3}
      onClick={onClose}
      data-state="open"
      _open={{
        animation: "fade-in 300ms ease-out",
      }}
    />
  );
};
