import { useTranslation } from 'react-i18next';
import { Control, DeepMap, DeepPartial, FieldError, FieldValues, Path } from 'react-hook-form';

import { ControllerTextField } from '_components/ControllerTextField';

type DataInputsProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  errors: DeepMap<DeepPartial<TFieldValues>, FieldError>;
};

export function DataInputs<TFieldValues extends FieldValues>(props: DataInputsProps<TFieldValues>) {
  const { control, errors } = props;

  const { t } = useTranslation();

  return (
    <>
      <ControllerTextField name={'name' as Path<TFieldValues>} control={control} label={t('settings.header.room.name')} required errors={errors} />
      <ControllerTextField name={'email' as Path<TFieldValues>} control={control} label={t('settings.header.room.email')} required errors={errors} />
      <ControllerTextField name={'type' as Path<TFieldValues>} control={control} label={t('settings.header.room.type')} required errors={errors} />
      <ControllerTextField name={'sort' as Path<TFieldValues>} control={control} label={t('settings.header.room.sort')} required errors={errors} />
      <ControllerTextField
        name={'tea-supply' as Path<TFieldValues>}
        control={control}
        label={t('settings.header.room.tea-supply')}
        required
        errors={errors}
      />
      <ControllerTextField
        name={'members' as Path<TFieldValues>}
        control={control}
        label={t('settings.header.room.members')}
        required
        multiline
        errors={errors}
      />
      <ControllerTextField
        name={'location' as Path<TFieldValues>}
        control={control}
        label={t('settings.header.room.location')}
        required
        errors={errors}
      />
      <ControllerTextField
        name={'category' as Path<TFieldValues>}
        control={control}
        label={t('settings.header.room.category')}
        required
        errors={errors}
      />
    </>
  );
}
