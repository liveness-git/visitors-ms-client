import { useTranslation } from 'react-i18next';

import BaseTemplate from '../BaseTemplate';
import { InfoList } from './InfoList';

export function VisitorInfoList() {
  const { t } = useTranslation();

  return (
    <BaseTemplate title={t('visitorinfolist.title')}>
      <InfoList />
    </BaseTemplate>
  );
}
