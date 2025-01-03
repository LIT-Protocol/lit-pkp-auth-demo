import React from 'react';
import { createRoot } from 'react-dom/client';
import PKPAuthModal from './components/Modal';
import type { PKPAuthModalProps } from './components/Modal';
import { initLit } from './utils/lit';
import './styles/modal.css';

// Re-export for React usage
export { default as PKPAuthModal } from './components/Modal';
export { initLit };
export type { PKPAuthModalProps };

// Configuration interface for vanilla JS usage
interface PKPAuthModalConfig extends Omit<PKPAuthModalProps, 'isOpen' | 'onClose'> {
  container: string;
}

declare global {
  interface Window {
    LitPKPAuthModal: {
      init: (config: PKPAuthModalConfig) => void;
    };
  }
}

let modalRoot: HTMLDivElement | null = null;
let modalInstance: any = null;

function createModalContainer() {
  if (modalRoot) return modalRoot;
  modalRoot = document.createElement('div');
  modalRoot.id = 'lit-pkp-auth-modal-root';
  document.body.appendChild(modalRoot);
  return modalRoot;
}

function init(config: PKPAuthModalConfig) {
  const container = document.querySelector(config.container);
  if (!container) {
    throw new Error(`Container element "${config.container}" not found`);
  }

  const modalContainer = createModalContainer();
  const root = createRoot(modalContainer);

  const closeModal = () => {
    if (modalInstance) {
      root.unmount();
      modalInstance = null;
      if (modalRoot && modalRoot.parentNode) {
        modalRoot.parentNode.removeChild(modalRoot);
      }
      modalRoot = null;
    }
  };

  modalInstance = root.render(
    React.createElement(PKPAuthModal, {
      isOpen: true,
      onClose: closeModal,
      onSuccess: (data: any) => {
        if (config.onSuccess) {
          config.onSuccess(data);
        }
        closeModal();
      },
      redirectUri: config.redirectUri,
      network: config.network,
      debug: config.debug,
      domain: config.domain,
      stytchProjectId: config.stytchProjectId,
      onConnect: config.onConnect,
      enabledAuthMethods: config.enabledAuthMethods
    })
  );
}

// Expose global initialization function
if (typeof window !== 'undefined') {
  window.LitPKPAuthModal = {
    init,
  };
}
