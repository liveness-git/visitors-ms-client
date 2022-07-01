import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { ControllerTextField } from '_components/ControllerTextField';
import { AddrBookAutoComplete } from '_components/AddrBookAutoComplete';
import { nameOfRole } from '_models/Role';

import { Role } from '_models/Role';

import { Inputs } from '../RowDataInputDialog';

export function DataInputs() {
  const {
    control,
    formState: { errors },
  } = useFormContext<Inputs<Role>>();

  const { t } = useTranslation();

  return (
    <>
      <ControllerTextField
        name={'name'}
        control={control}
        label={t('settings.header.role.name')}
        required
        selectList={nameOfRole.map((value) => {
          return { label: t(`settings.view.role.name.${value}`), value: value };
        })}
        errors={errors}
      />
      <AddrBookAutoComplete name={'members'} control={control} label={t('settings.header.role.members')} errors={errors} />
    </>
  );
}
