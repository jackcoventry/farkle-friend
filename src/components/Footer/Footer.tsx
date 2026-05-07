'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import { GamePreferences } from '@/components/GamePreferences/GamePreferences';
import Modal from '@/components/Modal/Modal';

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
      <footer className="text-text mt-auto flex flex-col">
        <div className="items-between flex">
          <span className="font-sub-heading text-center">FARKLE!</span>
          <div className="gap-sm ml-auto flex items-center">
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
        <Modal.Panel size="wide">
          <Modal.Header>
            <Modal.Title className="font-heading text-center">Rules & scoring</Modal.Title>
            <Modal.CloseButton ariaLabel="Close rules and scoring" />
          </Modal.Header>
          <Modal.Content>
            <RulesInfo />
          </Modal.Content>
        </Modal.Panel>
      </Modal>
    </>
  );
}

export default Footer;
