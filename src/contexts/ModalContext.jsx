import React, { createContext, useContext, useState, useCallback } from "react";
import Modal from "../components/Modal";

const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    content: null,
    confirmText: "Confirm",
    cancelText: "Cancel",
    confirmVariant: "danger",
    onConfirm: null,
  });

  const openModal = useCallback((config) => {
    setModalConfig({
      isOpen: true,
      title: config.title || "Confirm Action",
      content: config.content || config.message || null,
      confirmText: config.confirmText || "Confirm",
      cancelText: config.cancelText || "Cancel",
      confirmVariant: config.confirmVariant || "danger",
      onConfirm: config.onConfirm || null,
    });
    setIsLoading(false);
  }, []);

  const closeModal = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
    setIsLoading(false);
  }, []);

  const handleConfirm = async () => {
    if (modalConfig.onConfirm) {
      setIsLoading(true); // Turns on the spinner right before the API call runs
      try {
        const shouldClose = await modalConfig.onConfirm(); // Awaits your delete handler
        if (shouldClose !== false) {
          closeModal();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // Turns off the spinner when the API call finishes
      }
    } else {
      closeModal();
    }
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={modalConfig.title}
        content={modalConfig.content}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        confirmVariant={modalConfig.confirmVariant}
        // 🌟 THE MISSING LINKS:
        isLoading={isLoading}
        hasActions={!!modalConfig.onConfirm}
      />
    </ModalContext.Provider>
  );
};
