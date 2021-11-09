import { useTranslation } from 'react-i18next';

import BaseTemplate from '../BaseTemplate';
import { InputForm } from './InputForm';

export function VisitorInfoForm() {
  const { t } = useTranslation();

  return (
    <BaseTemplate title={t('visitorinfoform.title')}>
      <InputForm />
    </BaseTemplate>
  );
}
