import { useTranslation } from 'react-i18next';

import BaseTemplate from '../BaseTemplate';
import { InputForm } from './InputForm';
import { ReadForm } from './ReadForm';

export function VisitorInfoForm(props: { isRead: boolean }) {
  const { t } = useTranslation();

  const form = props.isRead ? <ReadForm /> : <InputForm />;

  return <BaseTemplate title={t('visitorinfoform.title')}>{form}</BaseTemplate>;
}
