/**
 * 疑似SSG：works-data.js から 31個の静的HTMLファイルを生成するスクリプト
 *
 * 使い方:
 *   1. このファイルをリポジトリのルートに置く
 *   2. コマンドプロンプトでリポジトリのルートに移動
 *   3. node generate.js を実行
 *   4. works/ フォルダに31個のHTMLが生成される
 *   5. GitHub Desktopで一括コミット＆プッシュ
 */

const fs   = require('fs');
const path = require('path');

// ===== 設定 =====
const SITE_NAME = '余暇が出来たので模型製作を再開した件';
const SITE_URL  = 'https://tony-models.com';
const OUTPUT_DIR = path.join(__dirname, 'works');

// ===== works-data.js を読み込む =====
// Node.js環境ではwindowオブジェクトがないので定義してから読み込む
global.window = {};
const dataPath = path.join(__dirname, 'js', 'works-data.js');
const dataCode = fs.readFileSync(dataPath, 'utf8');
// window.worksData = [...] を実行
eval(dataCode.replace('window.worksData', 'global.worksData'));
const worksData = global.worksData;

if (!worksData || worksData.length === 0) {
    console.error('❌ works-data.js の読み込みに失敗しました');
    process.exit(1);
}

// ===== 出力フォルダを作成 =====
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('📁 works/ フォルダを作成しました');
}

// ===== ジャンル名マッピング =====
const genreNames = {
    aircraft: '飛行機モデル',
    afv:      'AFVモデル',
    ship:     '艦船モデル',
    robot:    'ロボット・SFモデル',
    other:    'その他モデル'
};

// ===== HTMLエスケープ =====
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ===== テキストを段落HTMLに変換 =====
function textToHtml(text) {
    if (!text) return '';
    return text.split(/\n\n+/)
        .map(p => `<p>${escHtml(p).replace(/\n/g, '<br>')}</p>`)
        .join('\n');
}

// ===== description用テキスト生成（先頭120文字） =====
function makeDesc(work) {
    const raw = (work.description || '').replace(/\n/g, ' ').trim();
    if (raw.length > 120) return raw.slice(0, 120) + '…';
    return raw || `${work.title}の模型製作詳細ページ`;
}

// ===== 完成日から dateCreated を抽出（YYYY-MM形式） =====
function makeDate(completedDate) {
    if (!completedDate) return '';
    const m = completedDate.match(/(\d{4})年(\d{1,2})月/);
    if (m) return `${m[1]}-${String(m[2]).padStart(2, '0')}`;
    const y = completedDate.match(/(\d{4})/);
    if (y) return y[1];
    return '';
}

// ===== 追加画像HTMLを生成 =====
function makeAdditionalImagesHtml(work) {
    if (!work.additional_images || work.additional_images.length === 0) return '';
    const items = work.additional_images.map((img, i) => `
        <div class="additional-image-item">
            <img src="${escHtml(img.url)}"
                 alt="${escHtml(work.title)} 写真${i + 1}"
                 loading="lazy">
            <p>${escHtml(img.caption || '').replace(/\n/g, '<br>')}</p>
        </div>`).join('\n');
    return `
        <section id="additionalImagesSection" class="additional-images-section">
            <h2>詳細写真</h2>
            <div id="additionalImages" class="additional-images">
                ${items}
            </div>
        </section>`;
}

// ===== 1作品分のHTMLを生成 =====
function generateHtml(work) {
    const pageUrl    = `${SITE_URL}/works/${work.id}.html`;
    const oldUrl     = `${SITE_URL}/work.html?id=${work.id}`;
    const pageTitle  = `${work.title} | ${SITE_NAME}`;
    const pageDesc   = makeDesc(work);
    const imageUrl   = work.main_image || '';
    const genreLabel = genreNames[work.genre] || work.genre;
    const dateStr    = makeDate(work.completed_date);

    // JSON-LD
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'VisualArtwork',
        'name': work.title,
        'description': pageDesc,
        'url': pageUrl,
        'image': imageUrl,
        'artMedium': 'プラスチックモデル',
        'genre': genreLabel,
        'author': {
            '@type': 'Person',
            'name': '徒仁伊',
            'url': SITE_URL
        },
        'isPartOf': {
            '@type': 'WebSite',
            'name': SITE_NAME,
            'url': SITE_URL
        }
    };
    if (dateStr) jsonLd['dateCreated'] = dateStr;

    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>${escHtml(pageTitle)}</title>
    <meta name="description" content="${escHtml(pageDesc)}">

    <!-- canonical：この静的ページ自身のURL -->
    <link rel="canonical" href="${escHtml(pageUrl)}">

    <!-- 旧URL（work.html?id=xxx）からのcanonical統合 -->
    <!-- 旧URLへのアクセスはwork.jsがこのページにリダイレクト -->

    <!-- OGP -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="${escHtml(SITE_NAME)}">
    <meta property="og:title" content="${escHtml(pageTitle)}">
    <meta property="og:description" content="${escHtml(pageDesc)}">
    <meta property="og:image" content="${escHtml(imageUrl)}">
    <meta property="og:url" content="${escHtml(pageUrl)}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escHtml(pageTitle)}">
    <meta name="twitter:description" content="${escHtml(pageDesc)}">
    <meta name="twitter:image" content="${escHtml(imageUrl)}">

    <!-- JSON-LD -->
    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
    </script>

    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <div class="container detail-header">
            <a href="../index.html" class="home-icon" title="ホームに戻る">
                <i class="fas fa-home"></i>
            </a>
            <a href="../gallery.html?genre=${escHtml(work.genre)}" class="back-button">
                <i class="fas fa-arrow-left"></i>
                ギャラリーに戻る
            </a>
        </div>
    </header>

    <main>
        <article class="work-detail">
            <div class="container">

                <div class="work-header">
                    <h1 class="work-title">${escHtml(work.title)}</h1>
                    <p class="work-date">${escHtml(work.completed_date || '')}</p>
                </div>

                <div class="work-main-image">
                    <img src="${escHtml(imageUrl)}"
                         alt="${escHtml(work.title)} 完成写真"
                         loading="eager">
                </div>

                <div class="work-description">
                    <h2>作品説明</h2>
                    <p>${escHtml(work.description || '')}</p>
                    <div class="work-detail-text">
                        ${textToHtml(work.detail_text)}
                    </div>
                </div>

                ${makeAdditionalImagesHtml(work)}

            </div>
        </article>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2026 ${escHtml(SITE_NAME)}. All rights reserved.</p>
        </div>
    </footer>

</body>
</html>`;
}

// ===== 全作品を処理 =====
let successCount = 0;
let errorCount   = 0;

console.log(`\n🚀 ${worksData.length}作品の静的HTMLを生成します...\n`);

worksData.forEach(work => {
    try {
        const html     = generateHtml(work);
        const filePath = path.join(OUTPUT_DIR, `${work.id}.html`);
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`✅ ${work.id}.html  ${work.title}`);
        successCount++;
    } catch (err) {
        console.error(`❌ ${work.id}  ${work.title}  エラー: ${err.message}`);
        errorCount++;
    }
});

console.log(`\n============================`);
console.log(`✅ 成功: ${successCount}件`);
if (errorCount > 0) console.log(`❌ 失敗: ${errorCount}件`);
console.log(`📂 出力先: ${OUTPUT_DIR}`);
console.log(`============================\n`);
console.log('次の手順:');
console.log('  GitHub Desktop を開いて変更を確認');
console.log('  → コミット＆プッシュ');
console.log('');
