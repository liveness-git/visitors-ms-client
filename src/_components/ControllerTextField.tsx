import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { Control, Controller, DeepMap, DeepPartial, FieldError, FieldValues, Path } from 'react-hook-form';

type ControllerTextFieldProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
  name: TName;
  control: Control<TFieldValues>;
  label: string;
  required?: true;
  multiline?: true;
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
  const { name, control, label, required, selectList, multiline, errors } = props;

  const { t } = useTranslation();

  return (
    <Controller<TFieldValues, TName>
      name={name}
      control={control}
      rules={required ? { required: t('common.form.required') as string } : undefined}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
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
