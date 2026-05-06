'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import { GamePreferences } from '../GamePreferences/GamePreferences';

const RulesInfo = dynamic(() => import('@/components/RulesInfo/RulesInfo'), {
  loading: () => <p className="text-text-muted">Loading rules...</p>,
});

function Footer() {
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  const handleShowRulesModal = () => {
    setShowRulesModal(true);
  };

  return (
    <>
      <footer className="mt-auto flex flex-col text-text">
        <div className="flex items-between">
          <span className="font-sub-heading text-center">FARKLE!</span>
          <div className="flex gap-3 ml-auto items-center">
            <Button
              type="button"
              onClick={handleShowRulesModal}
              icon="question-circle"
              ariaLabel="View rules and scoring"
              className="items-center"
              size="small"
            />
            <GamePreferences />
          </div>
        </div>

        <div>
          <a
            href="https://jrc.codes"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            Built by Jack Coventry
          </a>
        </div>
      </footer>
      <Modal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        ariaLabel="Game rules and scoring"
        variant="modal"
      >
        <Modal.Body className="modal-panel modal-panel--wide">
          <div className="modal-panel__header">
            <Modal.CloseButton ariaLabel="Close rules and scoring" />
          </div>
          <div className="modal-panel__content">
            <RulesInfo />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Footer;
