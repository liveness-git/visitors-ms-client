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
      <ControllerTextField
        name={'name' as Path<TFieldValues>}
        control={control}
        label={t('settings.header.location.name')}
        required
        errors={errors}
      />
      <ControllerTextField
        name={'url' as Path<TFieldValues>}
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
      <ControllerTextField name={'sort' as Path<TFieldValues>} control={control} label={t('settings.header.location.sort')} errors={errors} />
    </>
  );
}
