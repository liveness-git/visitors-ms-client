import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { ControllerTextField } from '_components/ControllerTextField';

import { Room } from '_models/Room';

import { Inputs } from '../RowDataInputDialog';

export function DataInputs() {
  const {
    control,
    formState: { errors },
  } = useFormContext<Inputs<Room>>();

  const { t } = useTranslation();

  return (
    <>
      <ControllerTextField name={'name'} control={control} label={t('settings.header.room.name')} required errors={errors} />
      <ControllerTextField name={'email'} control={control} label={t('settings.header.room.email')} required errors={errors} />
      <ControllerTextField name={'type'} control={control} label={t('settings.header.room.type')} required errors={errors} />
      <ControllerTextField name={'sort'} control={control} label={t('settings.header.room.sort')} errors={errors} />
      <ControllerTextField name={'teaSupply'} control={control} label={t('settings.header.room.tea-supply')} required errors={errors} />
      <ControllerTextField name={'location'} control={control} label={t('settings.header.room.location')} required errors={errors} />
      <ControllerTextField name={'category'} control={control} label={t('settings.header.room.category')} required errors={errors} />
    </>
  );
}
