# 余暇が出来たので模型製作を再開した件

プラモデル・AFV・飛行機模型の製作記録サイト（新規プロジェクト）

---

## プロジェクト概要

- **プロジェクト名**: tony-models-v2
- **旧プロジェクトID**: 5065ba92-dd4f-4b28-8add-e0825d8b03f4
- **短縮URL（旧）**: https://bit.ly/tony-models
- **Google Search Console確認コード**: google37ff654542f0d005
- **Twitter/X**: @uno_qu_tony

---

## 現在の実装状況（第1段階：静的版）

### ✅ 完成済みファイル

| ファイル | 説明 |
|---------|------|
| `index.html` | トップページ（ジャンル一覧・新着作品） |
| `gallery.html` | ジャンル別ギャラリー |
| `work.html` | 作品詳細ページ |
| `css/style.css` | 全ページ共通スタイル |
| `js/works-data.js` | 全31作品データ（静的配列） |
| `js/main.js` | トップページ用JS |
| `js/gallery.js` | ギャラリーページ用JS |
| `js/work.js` | 作品詳細ページ用JS |
| `sitemap.xml` | 全37URL記載（URLプレースホルダー付き） |
| `robots.txt` | クローラー設定 |

### ⚠️ 第1段階では無効化している機能

- いいねボタン（D1連携が必要）
- コメント投稿・表示（D1連携が必要）
- 管理画面（admin.html）
- データ復元ツール（restore-works.html）

---

## URL構造

| ページ | URL |
|--------|-----|
| トップページ | `/` または `index.html` |
| 飛行機ギャラリー | `gallery.html?genre=aircraft` |
| AFVギャラリー | `gallery.html?genre=afv` |
| 艦船ギャラリー | `gallery.html?genre=ship` |
| ロボットギャラリー | `gallery.html?genre=robot` |
| その他ギャラリー | `gallery.html?genre=other` |
| 作品詳細 | `work.html?id={作品UUID}` |

---

## 作品データ構成

**合計31作品**

| ジャンル | 作品数 |
|---------|--------|
| 航空機 (aircraft) | 15 |
| AFV (afv) | 8 |
| 艦船 (ship) | 3 |
| ロボット (robot) | 3 |
| その他 (other) | 2 |

データファイル: `js/works-data.js`
- 形式: `window.worksData = [...]`
- 全作品にUUID形式のIDあり
- Imgur画像URL使用

---

## 外部依存

- **Google Fonts**: Noto Sans JP
- **Font Awesome**: 6.5.1 (cdnjs)
- **画像ホスト**: Imgur

---

## 公開後に必要な作業

以下のプレースホルダーを実際の公開URLに置換してください：

1. `sitemap.xml` 内の全 `{{NEW_PROJECT_URL}}`
2. `index.html` の `og:url`
3. `index.html` の JSON-LD `url`
4. `robots.txt` の `Sitemap:` URL
5. `https://bit.ly/tony-models` の転送先を新URLに更新

---

## 第2段階（未実装）

- `admin.html` / `js/admin.js` — 管理画面
- `restore-works.html` — D1データ一括復元ツール
- D1テーブル: `works` / `comments`
- いいね機能（PATCH `/tables/works/{id}`）
- コメント機能（POST/GET `/tables/comments`）
- Canonical URLの追加
- Faviconの追加

---

## 移行経緯

旧プロジェクト（5065ba92）でD1 API自動有効化によるエラーが発生し、静的ファイル更新不能になったため、新規プロジェクトに移行。第1段階ではD1を使用せず、全作品データをJSファイルに埋め込む形で静的サイトとして復元。
