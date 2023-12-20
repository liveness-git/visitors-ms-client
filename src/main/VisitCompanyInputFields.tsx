import { useTranslation } from 'react-i18next';
import { Control, Controller, FieldErrors } from 'react-hook-form';

import { Grid, IconButton, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { Inputs } from './RowDataInputDialog';

type VisitCompanyInputFieldsProps = {
  control: Control<Inputs, object>;
  index: number;
  remove: (index: number) => void;
  disabledVisitor: boolean;
  errors: FieldErrors<Inputs>;
};

export function VisitCompanyInputFields(props: VisitCompanyInputFieldsProps) {
  const { control, index, remove, disabledVisitor, errors } = props;

  const { t } = useTranslation();

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Controller
          name={`visitCompany.${index}.name`}
          control={control}
          rules={{ required: !disabledVisitor ? (t('common.form.required') as string) : false }}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('visittable.header.visit-company-name')}
              disabled={disabledVisitor}
              error={!!errors?.visitCompany?.[index]?.name}
              helperText={errors?.visitCompany?.[index]?.name && errors?.visitCompany?.[index]?.name?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={5}>
        <Controller
          name={`visitCompany.${index}.rep`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('visittable.header.visit-company-rep')}
              disabled={disabledVisitor}
              error={!!errors?.visitCompany?.[index]?.rep}
              helperText={errors?.visitCompany?.[index]?.rep && errors?.visitCompany?.[index]?.rep?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={1} style={{ margin: 'auto', marginLeft: '-7px' }}>
        <IconButton onClick={() => remove(index)} color="primary" aria-label={t('common.button.delete')} component="span" disabled={index === 0}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
