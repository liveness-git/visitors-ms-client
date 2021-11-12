import { useCallback, useEffect, useState } from 'react';
import { get } from '_utils/Http';

/**
 * データ取得用カスタムフック
 * @param url 取得先URL
 * @param initialData データ取得前の初期表示データ
 * @returns
 */
export function useLoadData<T>(url: string, initialData: T | undefined) {
  // データの状態
  const [data, setData] = useState<T | undefined>(initialData);
  // ローディングの状態
  const [isLoading, setIsLoading] = useState(false);
  // エラーの状態
  const [isError, setIsError] = useState(false);

  // データ取得
  const fetchData = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const result = await get<T>(url);
      await new Promise((r) => setTimeout(r, 1500)); // TODO: debug
      console.log(url); // TODO: debug
      if (result.parsedBody) setData(result.parsedBody);
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
    setIsLoading(false);
  }, [url]);

  // データ再取得
  const reload = useCallback(async () => fetchData(), [fetchData]);

  // データ初回表示
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [{ data, isLoading, isError }, reload] as const;
}
