import { useTranslation } from 'react-i18next';
import { Control, DeepMap, DeepPartial, FieldError, FieldValues, Path } from 'react-hook-form';

import { ControllerTextField } from '_components/ControllerTextField';
import { AddrBookAutoComplete } from '_components/AddrBookAutoComplete';
import { nameOfRole } from '_models/Role';

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
        label={t('settings.header.role.name')}
        required
        selectList={nameOfRole.map((value) => {
          return { label: t(`settings.view.role.name.${value}`), value: value };
        })}
        errors={errors}
      />
      <AddrBookAutoComplete name={'members' as Path<TFieldValues>} control={control} label={t('settings.header.role.members')} errors={errors} />
    </>
  );
}
