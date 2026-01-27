import React from 'react';

import ClayLoadingIndicator from '@clayui/loading-indicator';
import ClayModal, {useModal} from '@clayui/modal';

function LoadingModal() {
  const { observer } = useModal();

  return (
    <ClayModal observer={observer} size="lg" status="info">
      <ClayModal.Header>Loading</ClayModal.Header>
      <ClayModal.Body>
        <ClayLoadingIndicator displayType="primary" shape="squares" size="lg" />
      </ClayModal.Body>
    </ClayModal>
  );
}

  
export default LoadingModal;