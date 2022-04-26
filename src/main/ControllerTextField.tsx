import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { Control, Controller, DeepMap, DeepPartial, FieldError } from 'react-hook-form';

import { Inputs } from './RowDataInputDialog';

type ControllerTextFieldProps = {
  name: keyof Inputs;
  control: Control<Inputs, object>;
  label: string;
  required?: true;
  multiline?: true;
  errors: DeepMap<DeepPartial<Inputs>, FieldError>;
};

export function ControllerTextField(props: ControllerTextFieldProps) {
  const { name, control, label, required, multiline, errors } = props;

  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      rules={required ? { required: t('common.form.required') as string } : undefined}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          multiline={multiline}
          error={!!errors[name]}
          helperText={errors[name] && (errors[name] as FieldError).message}
        />
      )}
    />
  );
}
