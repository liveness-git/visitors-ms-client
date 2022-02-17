# visitors-ms client

## 0.0.0.17-2022-02-17

- イベントの日付を表示できるよう修正。
- 登録時イベントの時刻を５分刻みで選択するよう修正。

## 0.0.0.16-2022-02-16

- 開始時刻・終了時刻のコンポーネント修正

## 0.0.0.15-2022-02-10

- iCalUId による連携に変更

## 0.0.0.14-2022-01-19

- eventId,visitorId の連携部分を追加。
- 来訪情報の更新処理追加
- 来訪情報の削除確認メッセージを追加。

## 0.0.0.13-2022-01-19

- fetchPostata：get→post へ切り替え
- loading 時のデバッグ用 setTimeout を削除。
- main 側：ダイアログからの reload 処理方法を変更。

## 0.0.0.12-2022-01-19

- front 側：ダイアログからの reload 処理方法を変更。

## 0.0.0.11-2022-01-14

## 0.0.0.10-2022-01-14

- ダイアログの state 管理。新規作成時と編集で共通化

## 0.0.0.10-2022-01-13

- イベント作成ボタンの追加

## 0.0.0.9-2022-01-07

- 一般ユーザーの初期ページ作成（途中
- サインイン・ログインの文言統一。

## 0.0.0.8-2022-01-06

- 一般ユーザーの初期ページ作成（途中

## 0.0.0.7-2021-12-31

- ms365 の認可コードによる OAuth 実装。

## 0.0.0.7-2021-12-14

- outlook アドイン利用しない方針にシフト。

## 0.0.0.6-2021-11-29

- images ディレクトリ作成。addin で使用するアイコン画像を配置。※画像自体は仮登録
- outlook/readform を編集不可のデザインに変更。
- outloo/list 縦スクロールの出現条件見直し。

## 0.0.0.5-2021-11-25

- 受付。border の CSS 描画がおかしい箇所を調整。
- ssl 設定。(.env.local で設定)
- outlook/form → outlook/inputform, outlook/readform に分割。

## 0.0.0.4-2021-11-15

- 受付。カレンダー選択による取得データ url の変更。
- 受付。チェックイン/アウト時刻の表示位置変更に伴う不具合修正

## 0.0.0.3-2021-11-12

- データ送信まわり調整。共通化。
- favicon の変更
- 受付。カード番号の入力必須 → 解除
- 受付。チェックイン/アウト時刻の表示位置変更。
- デモ環境用として pulp 実行

## 0.0.0.2-2021-11-12

- データ取得、送信まわり大幅調整。
- ディレクトリ階層の変更。
- デモ環境用として pulp 実行

## 0.0.0.1-2021-11-09

- gulp 追加。
- proxy 設置追加。