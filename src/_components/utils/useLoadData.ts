import { useCallback, useEffect, useState } from 'react';
import { get } from '_components/utils/Http';

export function useLoadData<T>(url: string, initialData: T | undefined) {
  // データの状態
  const [data, setData] = useState<T | undefined>(initialData);
  // データ再取得の状態
  const [refresh, setRefresh] = useState(false);
  // ローディングの状態
  const [isLoading, setIsLoading] = useState(false);
  // // エラーの状態
  // const [isError, setIsError] = useState(false);

  // データ再取得関数
  const reroad = useCallback(() => setRefresh(true), []);

  // データ取得
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const result = await get<T>(url);
    await new Promise((r) => setTimeout(r, 2000)); // TODO: debug
    console.log(url); // TODO: debug
    if (result.parsedBody) setData(result.parsedBody);
    setRefresh(false);
    setIsLoading(false);
  }, [url]);

  // データ初回表示
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // データ更新
  useEffect(() => {
    if (refresh) fetchData();
  }, [fetchData, refresh]);

  return [{ data, isLoading }, reroad] as const;
}
