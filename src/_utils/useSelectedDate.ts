import { addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { getReloadStateFlg, saveReloadState } from './SessionStrage';

/**
 * カレンダー選択用カスタムフック
 */
export function useSelectedDate() {
  // カレンダー選択日の状態
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  // 矢印カウンターの状態
  const [weekly, setWeekly] = useState(false);
  const [count, setCount] = useState(0);

  // ================================
  // ReloadStateStrageの設定
  useEffect(() => {
    if (!getReloadStateFlg()) {
      saveReloadState('selectedDate', selectedDate!.getTime().toString());
    }
  }, [selectedDate]);
  // ================================

  useEffect(() => {
    if (weekly) {
      setCount(7);
    } else {
      setCount(1);
    }
  }, [weekly]);

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
  };
  const handleDatePrev = () => {
    setSelectedDate((date) => (!!date ? addDays(date!, count * -1) : date));
  };
  const handleDateNext = () => {
    setSelectedDate((date) => (!!date ? addDays(date!, count) : date));
  };

  return [selectedDate, setSelectedDate, handleDateChange, handleDatePrev, handleDateNext, setWeekly] as const;
}
