import { useTranslation } from 'react-i18next';
import format from 'date-fns/format';

import { PatternedRecurrenceInput } from '_models/PatternedRecurrence';

type RecurrenceInfoProps = { recurrence: PatternedRecurrenceInput; start: Date; end: Date };

export const RecurrenceInfo = (props: RecurrenceInfoProps) => {
  const { recurrence, start, end } = props;

  const { t } = useTranslation();

  // 曜日
  const daysOfWeek = recurrence.pattern.daysOfWeek?.map((week) => t(`recurrence-dialog.pattern.day-of-week.${week}`)).join(', ');
  // 日付
  const dayOfMonth = recurrence.pattern.dayOfMonth?.toString() + t(`recurrence-info.pattern.day-of-month`);
  // 週数
  const index = t(`recurrence-dialog.pattern.index.${recurrence.pattern.index}`);
  // 月
  const month = t(`recurrence-dialog.pattern.month.${recurrence.pattern.month}`);

  let patternType = '';
  let detail = '';
  switch (recurrence.pattern.type) {
    case 'daily':
      patternType = 'day';
      break;
    case 'weekly':
      patternType = 'week';
      detail = ' ' + daysOfWeek!;
      break;
    case 'absoluteMonthly':
      patternType = 'month';
      detail = ' ' + dayOfMonth;
      break;
    case 'relativeMonthly':
      patternType = 'month';
      detail = ' ' + index + daysOfWeek!;
      break;
    case 'absoluteYearly':
      patternType = 'year';
      detail = ' ' + month + dayOfMonth;
      break;
    case 'relativeYearly':
      patternType = 'year';
      detail = ' ' + month + index + daysOfWeek!;
      break;
    default:
  }

  // 間隔
  const num = recurrence.pattern.interval === 1 ? '' : recurrence.pattern.interval.toString();
  const every = recurrence.pattern.interval === 1 ? 'every-' : '';
  const interval = num + t(`recurrence-info.pattern.interval.${every + patternType}`);

  const pattern = interval + detail;
  const apptTime = format(start, 'HH:mm') + '-' + format(end, 'HH:mm');

  const range = recurrence.range.startDate + t(`recurrence-info.range.to`) + recurrence.range.endDate + t(`recurrence-info.range.valid-from`);

  return <>{pattern + ' ' + apptTime + '  ' + range}</>;
};
