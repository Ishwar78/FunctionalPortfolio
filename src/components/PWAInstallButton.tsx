import { usePWAInstall } from "@/hooks/use-pwa-install";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const PWAInstallButton = () => {
  const { showInstallPrompt, isInstalled, canInstall, handleInstall } = usePWAInstall();
  const [isDevelopment] = useState(import.meta.env.DEV);

  const handleClick = async () => {
    if (canInstall) {
      await handleInstall();
      toast.success("App installed successfully! 🎉");
    } else if (isDevelopment) {
      // In development, trigger the install anyway
      await handleInstall();
    }
  };

  // Don't show button if already installed
  if (isInstalled) {
    return null;
  }

  // In development, always show. In production, only if can install
  const shouldShow = isDevelopment || (showInstallPrompt && canInstall);

  if (!shouldShow) {
    return null;
  }

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg flex items-center justify-center transition-colors"
      aria-label="Install app on your device"
      title="Install app on your device"
    >
      <Download size={24} />
    </motion.button>
  );
};

export default PWAInstallButton;
