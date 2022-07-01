import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { ControllerTextField } from '_components/ControllerTextField';

import { Location } from '_models/Location';

import { Inputs } from '../RowDataInputDialog';

export function DataInputs() {
  const {
    control,
    formState: { errors },
  } = useFormContext<Inputs<Location>>();

  const { t } = useTranslation();

  return (
    <>
      <ControllerTextField name={'name'} control={control} label={t('settings.header.location.name')} required errors={errors} />
      <ControllerTextField
        name={'url'}
        control={control}
        label={t('settings.header.location.url')}
        required
        validation={{
          pattern: {
            value: /^[a-z0-9]+$/,
            message: t('settings.form.location.error.url.pattern'),
          },
        }}
        errors={errors}
      />
      <ControllerTextField name={'sort'} control={control} label={t('settings.header.location.sort')} errors={errors} />
    </>
  );
}
