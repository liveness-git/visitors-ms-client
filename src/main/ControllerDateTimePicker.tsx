import { useTranslation } from 'react-i18next';
import { DateTimePicker } from '@material-ui/pickers';
import { Control, Controller, FieldError, FieldErrors, UseFormGetValues } from 'react-hook-form';

import { Inputs } from './RowDataInputDialog';

type ControllerDateTimePickerProps = {
  name: 'startTime' | 'endTime';
  control: Control<Inputs, object>;
  getValues: UseFormGetValues<Inputs>;
  label: string;
  handleDateTimeChange: () => void;
  errors: FieldErrors<Inputs>;
};

export function ControllerDateTimePicker(props: ControllerDateTimePickerProps) {
  const { name, control, getValues, label, handleDateTimeChange, errors } = props;

  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: t('common.form.required') as string,
        validate: () => getValues('startTime').getTime() < getValues('endTime').getTime() || (t('visitdialog.form.error.event-time') as string),
      }}
      render={({ field }) => (
        <DateTimePicker
          {...field}
          onChange={(e) => {
            field.onChange(e);
            handleDateTimeChange();
          }}
          ampm={false}
          format="yyyy/MM/dd HH:mm"
          disablePast
          minutesStep={5} //TODO: Interval config化？
          label={label}
          error={!!errors[name]}
          helperText={errors[name] && (errors[name] as FieldError).message}
          ref={null}
        />
      )}
    />
  );
}
