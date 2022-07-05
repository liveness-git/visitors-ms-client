import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { Control, Controller, DeepMap, DeepPartial, FieldError, FieldValues, Path, RegisterOptions } from 'react-hook-form';

type ControllerTextFieldProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
  name: TName;
  control: Control<TFieldValues>;
  label: string;
  required?: true | boolean;
  validation?: RegisterOptions;
  multiline?: true | boolean;
  disabled?: true | boolean;
  selectList?: SelectOption[];
  errors: DeepMap<DeepPartial<TFieldValues>, FieldError>;
};
export type SelectOption = {
  label: string;
  value: string;
};

export function ControllerTextField<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>(
  props: ControllerTextFieldProps<TFieldValues, TName>
) {
  const { name, control, label, required, selectList, multiline, disabled, validation, errors } = props;

  const { t } = useTranslation();

  const rules: RegisterOptions = { required: required ? (t('common.form.required') as string) : false, ...validation };

  return (
    <Controller<TFieldValues, TName>
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          disabled={disabled}
          multiline={multiline}
          select={!!selectList}
          error={!!errors[name]}
          helperText={errors[name] && (errors[name] as FieldError).message}
        >
          {!!selectList &&
            selectList.map((option, index) => (
              <option key={`${name}-${index}`} value={option.value}>
                {option.label}
              </option>
            ))}
        </TextField>
      )}
    />
  );
}
