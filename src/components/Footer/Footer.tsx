import Modal from "@/components/Modal/Modal";
import RulesInfo from "@/components/RulesInfo/RulesInfo";
import { useState } from "react";
import "./Footer.css";

function Footer() {
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  const handleShowRulesModal = () => {
    setShowRulesModal(true);
  };

  return (
    <>
      <footer className="mt-auto">
        <span className="font-sub-heading text-center">FARKLE!</span>
        <span className="block">Built by Jack Coventry</span>
        <div>
          <button type="button" onClick={handleShowRulesModal}>
            Game Rules
          </button>
        </div>
      </footer>
      <Modal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        ariaLabel="Game finished"
        variant="modal"
      >
        <Modal.Body>
          <div className="rules-modal | bg-white overflow-y-auto rounded-lg">
            <RulesInfo />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Footer;
