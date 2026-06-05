# 住宅型有料老人ホーム ビルドライフ東住吉 ｜ 看護師採用LP

施設看護師（住宅型有料老人ホーム配属）採用のランディングページです。
ビルド不要のシンプルな構成で、React/Babel Standalone をブラウザ上で直接実行します。

- 施設：住宅型有料老人ホーム ビルドライフ東住吉（大阪市東住吉区／2026年7月OPEN）
- 運営：株式会社LINKLINE
- 応募：LINEから（友だち追加URLを各CTAに埋め込み）

## ファイル構成

```
.
├── index.html                # エントリ
├── app.jsx                   # 全UIコンポーネント（Babel Standaloneがブラウザ内で変換）
├── data.js                   # 全コピー・写真パス・動画ID 等
├── lp.css                    # LP本体スタイル
├── colors_and_type.css       # カラー・タイポのデザイントークン
├── images/                   # 使用する画像（ヒーロー・施設・社員・代表）
├── fonts/                    # フォント
└── 看護師求人LP-print.html   # 印刷用バリアント（自動 window.print()）
```

## ローカルで動かす

依存関係のインストールは不要です。任意の静的サーバから配信してください。

```bash
# 例) Pythonの組み込みサーバ
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/index.html` を開いてください。

スマホ表示を確認したい場合は、開発者ツールのデバイスモード（Mac: ⌘+Option+I → ⌘+Shift+M）で `375 × 812` などに切り替えてください。

## 編集ポイント

ほぼすべての文言・写真パス・動画は `data.js` 側にまとまっているので、テキストや写真の差し替えは `data.js` を編集してください。

| 編集したい内容 | 編集先 |
| --- | --- |
| 施設名・所在地・TEL・LINE URL | `data.js` の `brand` |
| ヒーローのキャッチコピー・KPI・写真 | `data.js` の `hero` |
| 悩み・社員の声・3つの理由・代表メッセージ・施設ツアー | `data.js` の各セクション |
| 給与・待遇（正看護師／准看護師の月給制・勤務時間・福利厚生） | `data.js` の `terms` |
| 採用フロー・応募CTA | `data.js` の `process` / `cta` |
| 社員ごとの動画 | `data.js` の `voices.people[i].video`（YouTube ID） |
| 代表メッセージ動画 | `data.js` の `ceo.video`（YouTube ID） |
| ロゴ表記など細かなレイアウト | `app.jsx` |
| スタイル全般 | `lp.css` |
