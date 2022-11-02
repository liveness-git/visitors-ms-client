import i18next from 'i18next';
import { PatternedRecurrenceInput } from '_models/PatternedRecurrence';

export const getRecurrenceInfo = (recurrence: PatternedRecurrenceInput) => {
  console.log('recurrence', recurrence);

  // 曜日
  const daysOfWeek = recurrence.pattern.daysOfWeek?.map((week) => i18next.t(`recurrence-dialog.pattern.day-of-week.${week}`)).join(', ');
  // 日付
  const dayOfMonth = recurrence.pattern.dayOfMonth?.toString() + i18next.t(`recurrence-info.pattern.day-of-month`);
  // 週数
  const index = i18next.t(`recurrence-dialog.pattern.index.${recurrence.pattern.index}`);
  // 月
  const month = i18next.t(`recurrence-dialog.pattern.month.${recurrence.pattern.month}`);

  let patternType = '';
  let detail = '';
  switch (recurrence.pattern.type) {
    case 'daily':
      patternType = 'day';
      break;
    case 'weekly':
      patternType = 'week';
      detail = daysOfWeek!;
      break;
    case 'absoluteMonthly':
      patternType = 'month';
      detail = dayOfMonth;
      break;
    case 'relativeMonthly':
      patternType = 'month';
      detail = index + daysOfWeek!;
      break;
    case 'absoluteYearly':
      patternType = 'year';
      detail = month + dayOfMonth;
      break;
    case 'relativeYearly':
      patternType = 'year';
      detail = month + index + daysOfWeek!;
      break;
    default:
  }

  // 間隔
  const num = recurrence.pattern.interval === 1 ? '' : recurrence.pattern.interval.toString();
  const every = recurrence.pattern.interval === 1 ? 'every-' : '';
  const interval = num + i18next.t(`recurrence-info.pattern.interval.${every + patternType}`);

  const pattern = interval + ' ' + detail;
  return pattern;
};
