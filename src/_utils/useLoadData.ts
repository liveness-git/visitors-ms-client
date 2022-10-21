import { useCallback, useEffect, useState } from 'react';
import { get } from '_utils/Http';

/**
 * データ取得用カスタムフック
 * @param url 取得先URL
 * @param initialData データ取得前の初期表示データ
 * @returns
 */
export function useLoadData<T>(initUrl: string, initialData: T | undefined) {
  //URLの状態
  const [url, setUrl] = useState(initUrl);
  // データの状態
  const [data, setData] = useState<T | undefined>(initialData);
  // ローディングの状態
  const [isLoading, setIsLoading] = useState(false);
  // エラーの状態
  const [isError, setIsError] = useState(false);

  // データ取得
  const fetchData = useCallback(async () => {
    if (!url) return; // urlがない場合は処理しない
    setIsError(false);
    setIsLoading(true);
    try {
      const result = await get<T>(url);
      console.log(url); // TODO: debug
      // console.log(result.parsedBody); // TODO: debug
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

  return [{ data, isLoading, isError }, reload, setUrl] as const;
}
