# 余暇が出来たので模型製作を再開した件

プラモデル・AFV・飛行機模型などの製作記録サイト。
公開URL: https://tony-models.com/

- **Twitter/X**: @uno_qu_tony
- **Google Search Console 確認ファイル**: `google37ff654542f0d005.html`（削除しないこと）
- **最終更新**: 2026-11-02

---

## 構成の概要

HTML + CSS + JavaScript のみの静的サイト。サーバー側のコードやデータベースは使っていない。

作品詳細ページは「疑似SSG」方式。`js/works-data.js` のデータから、ローカルPCで `node generate.js` を実行して `works/` に静的HTMLを生成し、GitHub Desktop でコミット＆プッシュして公開する。

### 重要：エディタ環境とローカルリポジトリは別物

- このエディタ（Genspark）にあるのは、ソースの一部だけ。**`works/` フォルダ（31ファイル）はこのエディタ上に存在しない。**
- `works/` はローカルPC（`Documents\GitHub\tony-model-gallery`）で生成され、GitHub に置かれている。
- エディタで `js/works-data.js` などを編集した後は、**ローカルのファイルにも同じ変更が入っているか確認してから** `node generate.js` を実行すること。

---

## ファイル一覧

| ファイル | 説明 |
|---------|------|
| `index.html` | トップページ（ジャンル一覧・新着作品） |
| `works.html` | 全作品一覧（31作品。カードは `works/UUID.html` に直接リンク） |
| `gallery.html` | ジャンル別ギャラリー（`?genre=` で切替。中身はJSで生成） |
| `work.html` | 旧・作品詳細ページ。`noindex` 済み。アクセスすると `works/UUID.html` へ転送される |
| `works/UUID.html` | 作品詳細の静的ページ（31ファイル。`generate.js` が生成。**エディタ上には無い**） |
| `generate.js` | 静的ページ生成スクリプト（ローカルで `node generate.js` を実行） |
| `js/works-data.js` | 全31作品のデータ（`window.worksData = [...]`） |
| `js/main.js` | トップページ用JS（新着作品カードは `works/UUID.html` にリンク） |
| `js/gallery.js` | ギャラリー用JS（作品カードは `works/UUID.html` にリンク） |
| `js/work.js` | 旧 `work.html` 用JS（`works/UUID.html` への転送処理を含む） |
| `css/style.css` | 全ページ共通スタイル |
| `admin.html` | 管理画面。`noindex` 済み。動作の詳細（認証・保存方法）は未確認 |
| `admin_old.html` | 旧管理画面。`noindex` 済み。使っていなければ削除候補 |
| `sitemap.xml` | 33URL（トップ・works.html・作品31件） |
| `robots.txt` | `/admin.html` のクロール拒否、sitemapの場所を指定 |

---

## 作品を追加・修正したときの手順

1. 作品データを `js/works-data.js` に追加・修正する（管理画面経由かどうかは運用による）
2. ローカルの `js/works-data.js` に同じ変更が入っているか確認する
3. コマンドプロンプトで次を実行する
   ```
   cd Documents\GitHub\tony-model-gallery
   node generate.js
   ```
4. 画面に「成功: 31件」（作品数）と出ることを確認する
5. GitHub Desktop で変更ファイルを確認し、コミット＆プッシュする
6. 本番で `works/UUID.html` が表示されることを確認する
7. Search Console の「URL検査」で、新しい作品のURLをインデックス登録リクエストする

`generate.js` が行うこと:
- `works/UUID.html` を全作品ぶん（再）生成する
- `works.html` の `work.html?id=UUID` リンクを `works/UUID.html` に変換する
- `js/work.js` に転送処理がなければ追加する
- `sitemap.xml` に**未掲載のURLだけ**追記する

`generate.js` が**行わないこと**:
- `sitemap.xml` の既存項目の更新（`lastmod` と `image:title` は古いまま。Bf109G-6 の2件は旧タイトル表記が残っている）
- `works.html` のカードの文言更新（手で直す）
- `works.html` の作品カードの新規追加（新作品は手で追加する必要がある。未確認のため要確認）

---

## URL構造

| ページ | URL |
|--------|-----|
| トップページ | `/`（`index.html` は `/` の代替として扱われる） |
| 全作品一覧 | `works.html` |
| 作品詳細（正規） | `works/{作品UUID}.html` |
| 作品詳細（旧・転送） | `work.html?id={作品UUID}` → `works/{作品UUID}.html` |
| ジャンル別ギャラリー | `gallery.html?genre=aircraft` / `afv` / `ship` / `robot` / `other` |

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

- データファイル: `js/works-data.js`
- 全作品にUUID形式のIDがある
- 画像は Imgur URL を使用

---

## SEO対応の経緯

### 実施済み

| 日付 | 内容 |
|------|------|
| 2026-07 | 疑似SSGへ移行。`works/UUID.html` を31件生成し、`works.html`・`sitemap.xml`・`work.js` を対応させた |
| 2026-10-21 | `work.html` に `<meta name="robots" content="noindex,follow">` を追加（旧URLと静的ページの重複対策） |
| 2026-11-02 | Bf109G-6 の2作品のタイトルを機体別に変更（「バルクホルン大尉機」「ハルトマン少尉機」） |
| 2026-11-02 | `js/gallery.js` の作品カードのリンクを `works/UUID.html` に直接向けた |
| 2026-11-02 | `admin.html`・`admin_old.html` に `noindex,nofollow` を追加 |
| 2026-11-21 | `js/main.js` のトップページ「新着作品」カードのリンクを `works/UUID.html` に直接向けた（旧URLへの内部リンクの見落としを修正。新着はハルトマン機を含む5件） |

※ 2026-11-02 の変更はプッシュ済み。2026-11-21 の `main.js` 変更は、ローカルでのコミット＆プッシュが必要。

### Search Console の状況（2026-11-02 時点・画面からの目視集計）

- 登録済み: 39件
  - トップ `/`: 1件
  - `works/` の作品ページ: 28件（目標31件）
  - `gallery.html?genre=…`: 5件
  - 旧URL `work.html?id=…`: 5件（クロール日は7〜8月。再クロールで消える見込み）
- `works/` で未登録の作品（3件）:
  - Bf109G-6 ハルトマン少尉機 `00f07b3b-6175-4922-bce7-02a11658aab5`（リクエスト済み）
  - T-34-76 1943年式 `ab0472ff-6ad8-40d4-b86b-11a9169c0d56`
  - MIG-21 MF `e447e794-4b60-4311-bfbe-478657e5fdc2`
- 「重複しています」の該当: `works/00f07b3b…`（ハルトマン機）と旧URL 2件
- 「ページにリダイレクトがあります」: 旧URL 16件（`work.html` の転送によるもの）
- 「代替ページ（適切な canonical タグあり）」: `index.html`（正常）

### 原因についての注意

- ハルトマン機が「重複」と判定された原因は、**推定であり、確認できていない**。タイトルが同一だったことや、旧URLの評価が残っていたことが候補。
- 確認方法: Search Console の URL検査で「Google が選択した正規 URL」を見る。
- 2026-11-21 の URL検査結果: ユーザー指定の正規URLは `works/00f07b3b…`（正しい）。「Google が選択した正規 URL」は「該当なし」で、原因は特定できなかった。最終クロールは 11/02。
- 仮説（未確認）: トップページの新着カードが旧URLへ強くリンクしていたため、Google が旧URLを重視した可能性。`main.js` 修正後、再クロールで変化を見る。
- 予備案: 改善しない場合、ハルトマン機の `detail_text` をバルクホルン機と差別化する（両者は共通文が多い）。

---

## 今後の確認事項

- [ ] 2026-11-21 の変更（`js/main.js`、`README.md`）をコミット＆プッシュ
- [ ] プッシュ後、トップページの新着カードのリンク先が `works/UUID.html` になっているか確認し、ハルトマン機 `works/00f07b3b…` を再度インデックス登録リクエスト
- [ ] 本番で `gallery.html?genre=ship` を開き、カードをタップして `works/UUID.html` に直接移動することを確認
- [ ] 未登録の3作品を Search Console でインデックス登録リクエスト
- [ ] 1〜2週間後に、登録済みの内訳（`works/` が31件に近づくか、旧URLが減るか）を確認
- [ ] ハルトマン機の「重複」の表示が消えるか確認
- [ ] `admin_old.html` を使っていなければ削除を検討
- [ ] `sitemap.xml` の `lastmod` と Bf109G-6 の `image:title` の更新を検討

---

## 補足

- `robots.txt` で `/admin.html` のクロールを拒否しているため、`admin.html` 内の `noindex` は Google に読まれない。現状 `admin.html` は登録されていない。
- `gallery.html` は `sitemap.xml` に載っていないが、`gallery.html?genre=…` の5件が登録済み。害はないため現状維持。
- 作品31件のうち、`works.html` のカード件数・`sitemap.xml` の作品URL・`works-data.js` の件数は、すべて31で一致している（2026-11-02 に確認）。

---

## 外部依存

- **Google Fonts**: Noto Sans JP
- **Font Awesome**: 6.5.1 (cdnjs)
- **画像ホスト**: Imgur

---

## 無効化している機能（未実装）

- いいねボタン
- コメント投稿・表示
- Favicon の追加

---

## 移行経緯

旧プロジェクト（5065ba92-dd4f-4b28-8add-e0825d8b03f4）でD1 API自動有効化によるエラーが発生し、静的ファイル更新不能になったため、新規プロジェクト（tony-models-v2）に移行。データベースは使わず、全作品データをJSファイルに埋め込む静的サイトとして復元した。短縮URL（旧）: https://bit.ly/tony-models
