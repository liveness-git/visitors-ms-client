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

  return [selectedDate, setSelectedDate] as const;
}
