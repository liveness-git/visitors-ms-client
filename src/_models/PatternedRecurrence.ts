export type PatternedRecurrence = {
  pattern: RecurrencePattern & RecurrencePatternReadOnly;
  range: RecurrenceRange & RecurrenceRangeReadOnly;
};

export type PatternedRecurrenceInput = {
  pattern: RecurrencePattern;
  range: RecurrenceRange;
};

export const nameOfRecurrencePatternType = ['daily', 'weekly', 'absoluteMonthly', 'relativeMonthly', 'absoluteYearly', 'relativeYearly'] as const;
export type RecurrencePatternType = typeof nameOfRecurrencePatternType[number];

export const nameOfDayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
export type DayOfWeek = typeof nameOfDayOfWeek[number];

export const nameOfWeekIndex = ['first', 'second', 'third', 'fourth', 'last'] as const;
export type WeekIndex = typeof nameOfWeekIndex[number];

export type RecurrencePattern = {
  type: RecurrencePatternType;
  interval: number;
  daysOfWeek?: DayOfWeek[]; // weekly, relativeMonthly, relativeYearly
  dayOfMonth?: number; // absoluteMonthly, absoluteYearly
  index?: WeekIndex; // relativeMonthly, relativeYearly
  month?: number; // absoluteYearly, relativeYearly
};
type RecurrencePatternReadOnly = {
  firstDayOfWeek?: DayOfWeek; //weekly
};

// export const nameOfRecurrenceRangeType = ['endDate', 'noEnd', 'numbered'] as const;//TODO: noEnd未対応（最大５年問題）
export const nameOfRecurrenceRangeType = ['endDate', 'numbered'] as const;
export type RecurrenceRangeType = typeof nameOfRecurrenceRangeType[number];

export type RecurrenceRange = {
  type: RecurrenceRangeType;
  endDate?: Date;
  numberOfOccurrences?: number;
};
type RecurrenceRangeReadOnly = { startDate: Date };
