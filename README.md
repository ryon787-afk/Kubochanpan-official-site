# くぼちゃんパン公式サイト ローカル安定版

管理画面から公式サイト・商品・バナー・注文を編集できる、GitHub Pages向けの静的サイト版です。

## ファイル構成

```text
index.html              公式トップページ
order.html              注文ページ
admin.html              管理画面
css/style.css           共通デザイン
js/storage.js           localStorage保存・画像保存・通知関数
js/main.js              トップページ表示・カート追加
js/order.js             注文フォーム・注文保存
js/admin.js             管理画面の編集機能
README.md               使い方
```

## 使い方

1. フォルダ内の `index.html` を開きます。
2. 注文ページは `order.html` です。
3. 管理画面は `admin.html` です。
4. ローカル版では、保存先はブラウザの `localStorage` です。

## 管理画面のログイン方法

初期パスワード：

```text
kubochan2025
```

管理画面の「設定」から変更できます。

重要：このパスワードはローカル確認用です。本番ではSupabase Authなどの認証に変更してください。

## 商品登録方法

1. `admin.html` にログインします。
2. 左メニューの「商品管理」を開きます。
3. 商品名、価格、カテゴリー、説明、素材説明、おすすめの食べ方、表示状態を入力します。
4. 商品写真は複数アップロードできます。
5. 「商品を保存」を押します。
6. `index.html` と `order.html` に反映されます。

## 注文確認方法

1. お客様側で `order.html` から注文します。
2. 注文完了後、注文内容が `localStorage` に保存されます。
3. 管理画面の「注文管理」に表示されます。
4. 注文ステータスは以下を選択できます。

- 受付済み
- 銀行振込待ち
- 入金確認
- 発送準備
- 発送完了
- キャンセル

## 管理者メール通知について

ローカル版では実際のメール送信は行いません。

`js/storage.js` にある以下の関数に注文データを渡す構成にしています。

```js
sendOrderNotification(orderData)
```

現時点では、管理画面の通知履歴に残し、consoleには個人情報をマスクした内容だけを出します。

## 個人情報の取り扱いについて

GitHub Pagesだけでは、お客様の個人情報を安全に集めて管理者だけが見る本番通販には不十分です。

本番公開時は必ず以下の構成にしてください。

- HTTPS
- Supabase Authによる管理者ログイン
- Supabase Row Level Security（RLS）
- 注文テーブルの公開読み取り禁止
- Edge Functions経由の注文保存
- Email API経由の管理者通知
- Storageの非公開バケット、または署名付きURL

## Supabase連携時に変更する場所

`js/storage.js` の以下を差し替えます。

```js
loadData()
saveData(data)
saveImageFiles(fileList)
sendOrderNotification(orderData)
```

おすすめのSupabaseテーブル分割：

```text
site_settings
products
product_images
banners
orders
order_items
notifications
```

注文情報は個人情報を含むため、RLSで管理者以外の読み取りを禁止してください。

## 注意

まずはローカル環境で壊れにくく動くことを優先した版です。
複雑な外部ライブラリは使わず、HTML / CSS / JavaScript / localStorage のみで構成しています。
