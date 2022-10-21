import { addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { getReloadStateFlg, saveReloadState } from './SessionStrage';

/**
 * カレンダー選択用カスタムフック
 */
export function useSelectedDate() {
  // カレンダー選択日の状態
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // ================================
  // ReloadStateStrageの設定
  useEffect(() => {
    if (!getReloadStateFlg()) {
      saveReloadState('selectedDate', selectedDate!.getTime().toString());
    }
  }, [selectedDate]);
  // ================================

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  const handleDatePrev = () => {
    setSelectedDate((date) => (!!date ? addDays(date!, -1) : date));
  };
  const handleDateNext = () => {
    setSelectedDate((date) => (!!date ? addDays(date!, 1) : date));
  };

  return [selectedDate, setSelectedDate, handleDateChange, handleDatePrev, handleDateNext] as const;
}
