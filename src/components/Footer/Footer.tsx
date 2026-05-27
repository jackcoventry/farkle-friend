'use client';

import { useI18n } from '@/i18n/I18nProvider';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import { GamePreferences } from '@/components/GamePreferences/GamePreferences';
import Modal from '@/components/Modal/Modal';

const RulesInfo = dynamic(() => import('@/components/RulesInfo/RulesInfo'), {
  loading: () => <RulesLoading />,
});

function RulesLoading() {
  const { t } = useI18n();
  return <p className="text-text-muted">{t('footer.loadingRules')}</p>;
}

function Footer() {
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const { t } = useI18n();

  const handleShowRulesModal = () => {
    setShowRulesModal(true);
  };

  return (
    <>
      <footer className="text-text mt-auto flex flex-col">
        <div className="items-between flex flex-col-reverse sm:flex-col">
          <div className="gap-sm ml-auto flex items-center">
            <Button
              type="button"
              onClick={handleShowRulesModal}
              icon="question-circle"
              ariaLabel={t('footer.rulesOpen')}
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
            {t('footer.builtBy')}
          </a>
        </div>
      </footer>
      <Modal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        ariaLabel={t('footer.rulesDialogTitle')}
        variant="modal"
      >
        <Modal.Panel size="wide">
          <Modal.Header>
            <Modal.Title className="font-heading text-center">{t('footer.rulesTitle')}</Modal.Title>
            <Modal.CloseButton ariaLabel={t('footer.rulesClose')} />
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
