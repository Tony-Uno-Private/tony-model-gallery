# 余暇が出来たので模型製作を再開した件

プラモデル・AFV・飛行機模型の製作記録を紹介するWebサイトです。

## プロジェクト概要

### 🎯 目的
趣味で製作した模型作品（プラモデル、AFV、飛行機、艦船、ロボット等）を紹介し、他のモデラーとの交流を促進するためのWebサイトです。

### ✨ 主な機能

#### 公開ページ
1. **トップページ** (`index.html`)
   - サイトタイトル: 「余暇が出来たので模型製作を再開した件」
   - サブタイトル: 「プラモデル・AFV・飛行機模型の製作記録」
   - メインビジュアル（リビングの棚の写真）
   - 6つのジャンルカテゴリー（飛行機、AFV、艦船、ロボット・SF、その他、+将来追加枠）
   - 新着作品表示（NEW表示付き）
   - X (Twitter)へのリンク
   - 相互リンク希望メッセージ

2. **ジャンル別ギャラリーページ** (`gallery.html`)
   - 作品を横3列のタイル表示
   - 各作品のタイトルと画像
   - クリックで作品詳細ページへ遷移

3. **作品詳細ページ** (`work.html`)
   - 作品タイトル、完成年月、メイン画像
   - 作品説明と詳細説明文
   - 追加写真とキャプション
   - いいねボタン
   - コメント機能（承認制）
   - ページトップへ戻るボタン

#### 管理画面
4. **管理画面** (`admin.html`)
   - **パスワード保護**: `model2025`
   - **作品管理**: 追加・編集・削除
   - **コメント管理**: 承認・返信・削除
   - iPad/PCブラウザ上でノーコード編集可能

### 📱 レスポンシブデザイン
- **iPad対応**: iPad Air (第5世代) Safari最適化
- **PC対応**: Windows 11、Chrome対応
- **スマートフォン対応**: モバイルブラウザ対応

## 技術仕様

### 使用技術
- **HTML5**: セマンティックなマークアップ
- **CSS3**: カスタムプロパティ、Flexbox、Grid、レスポンシブデザイン
- **JavaScript (ES6+)**: 非同期処理、Fetch API、DOM操作
- **Font Awesome**: アイコンライブラリ
- **Google Fonts**: Noto Sans JP

### データ管理
- **RESTful Table API**: データの永続化
- **LocalStorage**: いいね機能の状態管理
- **SessionStorage**: 管理画面のログイン状態管理

### データベーススキーマ

#### worksテーブル（作品情報）
- `id`: 作品ID (text)
- `title`: 作品タイトル (text)
- `genre`: ジャンル (text) - aircraft, afv, ship, robot, other
- `completed_date`: 完成年月 (text)
- `main_image`: メイン画像URL (text)
- `description`: 作品説明 (text)
- `detail_text`: 詳細説明文 (rich_text)
- `additional_images`: 追加画像配列 (array)
- `likes`: いいね数 (number)
- `is_new`: 新着フラグ (bool)
- `sort_order`: 表示順序 (number)

#### commentsテーブル（コメント情報）
- `id`: コメントID (text)
- `work_id`: 作品ID (text)
- `comment_text`: コメント本文 (rich_text)
- `reply_text`: 管理人の返信 (rich_text)
- `is_approved`: 承認済みフラグ (bool)
- `posted_date`: 投稿日時 (datetime)

## ファイル構成

```
├── index.html              # トップページ
├── gallery.html            # ジャンル別ギャラリーページ
├── work.html               # 作品詳細ページ
├── admin.html              # 管理画面
├── css/
│   └── style.css          # スタイルシート
├── js/
│   ├── main.js            # トップページ用JavaScript
│   ├── gallery.js         # ギャラリーページ用JavaScript
│   ├── work.js            # 作品詳細ページ用JavaScript
│   └── admin.js           # 管理画面用JavaScript
└── README.md              # このファイル
```

## 初期データ

### 登録済み作品（10件）

#### 飛行機モデル（4件）
1. 1/48 メッサーシュミットBf109G-6（ハルトマン少尉機）
2. 1/48 メッサーシュミットBf109G-6（バルクホルン大尉機）
3. 1/48 雷電21型 ⭐NEW
4. 1/48 零戦52型丙 ⭐NEW

#### AFVモデル（3件）
1. 1/35 タイガーI 後期型 ⭐NEW
2. 1/35 KV-1 1941年型
3. 1/35 KV-1 1942年型

#### 艦船モデル（1件）
1. ノンスケール(1/510) 原子力巡洋艦 ロングビーチ ⭐NEW

#### ロボット・SFモデル（1件）
1. 1/144 ナイト・オブ・ゴールド ラキシス ⭐NEW

#### その他モデル（1件）
1. 1/460 会津 鶴ヶ城

## 使用方法

### 訪問者向け

1. **トップページから作品を閲覧**
   - ジャンルボタンをクリックしてギャラリーへ
   - 新着作品から直接詳細ページへ

2. **作品詳細ページで作品を楽しむ**
   - 詳細写真と説明を閲覧
   - いいねボタンで応援
   - コメントを投稿（管理人承認後に公開）

### 管理人向け

1. **管理画面にログイン**
   - URL: `admin.html`
   - パスワード: `model2025`

2. **作品を追加・編集**
   - 「新規作品追加」ボタンをクリック
   - 必要事項を入力（タイトル、ジャンル、画像URL等）
   - 「保存」ボタンで登録

3. **作品の編集・削除**
   - 作品リストから作品をクリック
   - 情報を編集して「保存」
   - または「削除」ボタンで削除

4. **コメント管理**
   - 「コメント管理」タブに切り替え
   - 「承認」ボタンでコメントを公開
   - 返信欄に入力して「返信」ボタン
   - 不適切なコメントは「削除」

### 追加画像の登録方法

作品編集フォームの「追加画像」欄に、以下のJSON形式で入力：

```json
[
  {
    "url": "https://example.com/image1.jpg",
    "caption": "ディテールアップした部分の写真"
  },
  {
    "url": "https://example.com/image2.jpg",
    "caption": "塗装の説明"
  }
]
```

## 機能URI一覧

### 公開ページ
- `/` または `/index.html` - トップページ
- `/gallery.html?genre=aircraft` - 飛行機モデルギャラリー
- `/gallery.html?genre=afv` - AFVモデルギャラリー
- `/gallery.html?genre=ship` - 艦船モデルギャラリー
- `/gallery.html?genre=robot` - ロボット・SFモデルギャラリー
- `/gallery.html?genre=other` - その他モデルギャラリー
- `/work.html?id={作品ID}` - 作品詳細ページ

### 管理ページ
- `/admin.html` - 管理画面ログイン・メイン

### API エンドポイント
- `GET /tables/works` - 作品一覧取得
- `GET /tables/works/{id}` - 作品詳細取得
- `POST /tables/works` - 作品新規作成
- `PUT /tables/works/{id}` - 作品更新
- `PATCH /tables/works/{id}` - 作品部分更新
- `DELETE /tables/works/{id}` - 作品削除
- `GET /tables/comments` - コメント一覧取得
- `POST /tables/comments` - コメント投稿
- `PATCH /tables/comments/{id}` - コメント承認・返信
- `DELETE /tables/comments/{id}` - コメント削除

## 完成済み機能

✅ 3階層構造のWebサイト（トップ→ギャラリー→詳細）  
✅ ブラウザ上での管理画面（パスワード保護付き）  
✅ 作品の追加・編集・削除機能  
✅ 画像URLによる画像管理  
✅ いいね機能  
✅ コメント機能（承認制、管理人返信可能）  
✅ レスポンシブデザイン（iPad/PC/スマホ対応）  
✅ 新着作品表示  
✅ ジャンル別ギャラリー  
✅ SNSリンク（X/Twitter）  
✅ 初期データ登録（10作品）  

## 未実装機能

⚠️ **閲覧カウンター**: 静的サイトの制約により非実装
- **代替案**: Google Analyticsの埋め込みを推奨
  - 無料で詳細なアクセス解析が可能
  - ページビュー、訪問者数、流入元などを確認可能
  - 設定方法: GoogleアナリティクスでトラッキングIDを取得し、各HTMLファイルの`<head>`内に以下を追加
  ```html
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
  ```

## 推奨される次のステップ

### 1. Google Analytics設定
アクセス解析を実装して訪問者数を追跡

### 2. コンテンツ追加
- 既存作品の追加写真とキャプションを追加
- 製作過程の写真を追加
- 詳細な製作記録を記入

### 3. SEO最適化
- 各ページのメタタグ最適化
- OGP（Open Graph Protocol）タグ追加
- sitemap.xml作成

### 4. 画像最適化
- 画像を適切なサイズにリサイズ
- WebP形式への変換で読み込み速度向上

### 5. 追加カテゴリー
- 料理カテゴリーの追加準備（将来計画）

### 6. 相互リンク
- 他の模型モデラーとの相互リンク設定

## GitHub Pages公開手順

1. GitHubリポジトリを作成
2. プロジェクトファイルをリポジトリにプッシュ
3. Settings → Pages → Source で `main` ブランチを選択
4. 公開URLが発行される: `https://{username}.github.io/{repository-name}/`

## パスワード変更方法

管理画面のパスワードを変更する場合：
1. `js/admin.js`を開く
2. 2行目の`ADMIN_PASSWORD`の値を変更
   ```javascript
   const ADMIN_PASSWORD = '新しいパスワード';
   ```
3. ファイルを保存

## SNSリンク

- **X (Twitter)**: [@uno_qu_tony](https://x.com/uno_qu_tony) - 徒仁伊

## ハッシュタグ

#プラモデル #スケールモデル #AFV #飛行機模型 #艦船模型 #ミリタリーモデル #模型製作 #ガンプラ #鶴ヶ城

## ブラウザ対応

- **Safari**: iPad Air (第5世代) iPadOS 18.3
- **Chrome**: Windows 11、iPad
- **その他モダンブラウザ**: Edge、Firefox等

## ライセンス

© 2025 余暇が出来たので模型製作を再開した件. All rights reserved.

---

## サポート・質問

作品の製作記録や模型に関するご質問は、Xアカウント（[@uno_qu_tony](https://x.com/uno_qu_tony)）までお気軽にどうぞ！

**模型モデラーの方、相互リンクを希望しています！**
