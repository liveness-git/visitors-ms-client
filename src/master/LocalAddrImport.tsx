import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useLoadData } from '_utils/useLoadData';

import { Spinner } from '_components/Spinner';

type LocalAddrImportProps = {
  open: boolean;
};

export function LocalAddrImport(props: LocalAddrImportProps) {
  const { open } = props;

  const { t } = useTranslation();

  // インポート処理リクエスト
  const [{ data, isLoading, isError }, , setUrl] = useLoadData<string>('', undefined);

  // インポート処理実行
  useEffect(() => {
    if (open && window.confirm(t('settings.msg.local-addr-import'))) {
      setUrl('/localaddr/import');
    }
  }, [open, setUrl]);

  // インポート完了
  useEffect(() => {
    if (!!data) alert(data);
  }, [data]);

  // インポートエラー
  useEffect(() => {
    if (!!isError) alert(t('common.msg.fetch-failed'));
  }, [isError]);

  return (
    <>
      <Spinner open={isLoading} />
    </>
  );
}
