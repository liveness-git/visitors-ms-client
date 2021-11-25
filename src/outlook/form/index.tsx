import { useTranslation } from 'react-i18next';

import BaseTemplate from '../BaseTemplate';
import { InputForm } from './InputForm';

export function VisitorInfoForm(props: { isRead: boolean }) {
  const { t } = useTranslation();

  return (
    <BaseTemplate title={t('visitorinfoform.title')}>
      <InputForm isRead={props.isRead} />
    </BaseTemplate>
  );
}
