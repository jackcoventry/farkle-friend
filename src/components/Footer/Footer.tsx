import Modal from "@/components/Modal/Modal";
import RulesInfo from "@/components/RulesInfo/RulesInfo";
import { useState } from "react";
import Button from "@/components/Button/Button";
import "./Footer.css";
import { GamePreferences } from "../GamePreferences/GamePreferences";

function Footer() {
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  const handleShowRulesModal = () => {
    setShowRulesModal(true);
  };

  return (
    <>
      <footer className="mt-auto flex">
        <div>
          <span className="font-sub-heading text-center">FARKLE!</span>
          <span className="block">Built by Jack Coventry</span>
        </div>
        <div className="ml-auto mt-auto">
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
      </footer>
      <Modal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        ariaLabel="Game rules and scoring"
        variant="modal"
      >
        <Modal.Body>
          <div className="rules-modal | bg-white overflow-y-auto rounded-lg p-4">
            <Modal.CloseButton ariaLabel="Close rules and scoring" />
            <RulesInfo />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Footer;
