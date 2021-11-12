import format from 'date-fns/format';
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from 'date-fns/locale/ja';

/**
 * DateFnsUtilsを日本語表記に対応させます。
 */
export default class JaDateFnsUtils extends DateFnsUtils {
  getCalendarHeaderText(date: Date) {
    return format(date, 'Yo MMM', { locale: jaLocale });
  }

  getDatePickerHeaderText(date: Date) {
    return format(date, 'MMMd日', { locale: jaLocale });
  }
}
