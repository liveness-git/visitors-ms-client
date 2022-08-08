import { useEffect, useState } from 'react';
import { getReloadState, getReloadStateFlg, initReloadState, removeReloadStateFlg, saveReloadState } from './SessionStrage';

/**
 * カレンダー選択用カスタムフック
 */
export function useSelectedDate() {
  // カレンダー選択日の状態
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (!!getReloadStateFlg()) {
      // refreshボタンによるreload
      const value = getReloadState('selectedDate');
      setSelectedDate(new Date(Number(value)));
      removeReloadStateFlg();
    } else {
      // 初期遷移
      initReloadState();
    }
  }, []);

  useEffect(() => {
    if (!!selectedDate) saveReloadState('selectedDate', selectedDate.getTime().toString());
  }, [selectedDate]);

  return [selectedDate, setSelectedDate] as const;
}
