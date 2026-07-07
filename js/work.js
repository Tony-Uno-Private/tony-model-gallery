// 作品詳細ページのJavaScript

let currentWork = null;
let currentGenre = null;

const SITE_NAME = '余暇が出来たので模型製作を再開した件';
const SITE_URL  = 'https://tony-models.com';

// ジャンル名マッピング
const genreNames = {
    aircraft: '飛行機モデル',
    afv: 'AFVモデル',
    ship: '艦船モデル',
    robot: 'ロボット・SFモデル',
    other: 'その他モデル'
};

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const workId = urlParams.get('id');

    if (!workId) {
        window.location.href = 'index.html';
        return;
    }

    loadWork(workId);
    setupEventListeners();
});

// 作品を読み込む
function loadWork(workId) {
    // 静的ページ（works/xxx.html）が存在する場合はリダイレクト
    // 現在のパスが既に works/ 配下でなければリダイレクト
    if (!window.location.pathname.includes('/works/')) {
        window.location.replace(`works/${workId}.html`);
        return;
    }

    const allWorks = window.worksData || [];
    currentWork = allWorks.find(work => work.id === workId);

    if (!currentWork) {
        console.error('作品が見つかりませんでした:', workId);
        window.location.href = 'index.html';
        return;
    }

    currentGenre = currentWork.genre;
    updateHead(currentWork);   // ★ head を先に更新（SEO最重要）
    displayWork(currentWork);
}

// ============================================================
// ★ head 一括更新（title / description / canonical / OGP / JSON-LD）
// ============================================================
function updateHead(work) {
    const pageUrl   = `${SITE_URL}/work.html?id=${work.id}`;
    const pageTitle = `${work.title} | ${SITE_NAME}`;

    // description: 作品説明の先頭100文字をフォールバック
    const rawDesc   = (work.description || '').replace(/\n/g, ' ').trim();
    const descShort = rawDesc.length > 100 ? rawDesc.slice(0, 100) + '…' : rawDesc;
    const pageDesc  = descShort || `${work.title}の模型製作詳細ページ`;

    const imageUrl  = work.main_image || '';
    const genreLabel = genreNames[work.genre] || work.genre;

    // --- title ---
    document.title = pageTitle;

    // --- meta description ---
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', pageDesc);

    // --- canonical ---
    // href=""の状態（初期値）ではGooglebotはcanonical指定なしと判断するため安全
    // JS実行後に正確なURLをセット
    const canonical = document.getElementById('canonicalTag');
    if (canonical) canonical.setAttribute('href', pageUrl);

    // --- OGP ---
    const ogTitle = document.getElementById('ogTitle');
    const ogDesc  = document.getElementById('ogDescription');
    const ogImg   = document.getElementById('ogImage');
    const ogUrl   = document.getElementById('ogUrl');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);
    if (ogDesc)  ogDesc.setAttribute('content', pageDesc);
    if (ogImg)   ogImg.setAttribute('content', imageUrl);
    if (ogUrl)   ogUrl.setAttribute('content', pageUrl);

    // --- Twitter Card ---
    const twTitle = document.getElementById('twitterTitle');
    const twDesc  = document.getElementById('twitterDescription');
    const twImg   = document.getElementById('twitterImage');
    if (twTitle) twTitle.setAttribute('content', pageTitle);
    if (twDesc)  twDesc.setAttribute('content', pageDesc);
    if (twImg)   twImg.setAttribute('content', imageUrl);

    // --- JSON-LD (VisualArtwork) ---
    const jsonLdEl = document.getElementById('jsonLd');
    if (jsonLdEl) {
        const completedDate = (work.completed_date || '').replace(/[^0-9\-]/g, '').slice(0, 7);
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
                'name': 'Tony',
                'url': SITE_URL
            },
            'isPartOf': {
                '@type': 'WebSite',
                'name': SITE_NAME,
                'url': SITE_URL
            }
        };
        if (completedDate) jsonLd['dateCreated'] = completedDate;
        jsonLdEl.textContent = JSON.stringify(jsonLd, null, 2);
    }
}

// ============================================================
// 作品コンテンツをDOMに描画
// ============================================================
function displayWork(work) {
    // h1・日付
    document.getElementById('workTitle').textContent = work.title;
    document.getElementById('workDate').textContent  = work.completed_date || '完成年月不明';

    // メイン画像
    const mainImg = document.getElementById('mainImage');
    mainImg.src = work.main_image;
    mainImg.alt = `${work.title} 完成写真`;

    // 作品説明（ジャンルラベル付き）
    const genreLabel = genreNames[work.genre] || work.genre;
    document.getElementById('workDescription').textContent = work.description || '';

    // 詳細説明文（\n\n で段落分割 → <p>、単独 \n → <br>）
    const detailEl = document.getElementById('workDetailText');
    if (work.detail_text) {
        const paragraphs = work.detail_text.split(/\n\n+/);
        detailEl.innerHTML = paragraphs
            .map(p => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
            .join('');
    } else {
        detailEl.innerHTML = '';
    }

    // 追加画像（alt属性を「作品名 写真N」で設定）
    const addImgSection = document.getElementById('additionalImagesSection');
    const addImgContainer = document.getElementById('additionalImages');
    if (work.additional_images && work.additional_images.length > 0) {
        addImgContainer.innerHTML = '';
        work.additional_images.forEach((img, i) => {
            const item = document.createElement('div');
            item.className = 'additional-image-item';

            const imgEl = document.createElement('img');
            imgEl.src = img.url;
            imgEl.alt = `${work.title} 写真${i + 1}`;  // ★ alt属性を具体的に設定
            imgEl.loading = 'lazy';

            const caption = document.createElement('p');
            // キャプションはテキストとして安全にセット
            caption.innerHTML = escapeHtml(img.caption || '').replace(/\n/g, '<br>');

            item.appendChild(imgEl);
            item.appendChild(caption);
            addImgContainer.appendChild(item);
        });
    } else {
        addImgSection.style.display = 'none';
    }

    // いいね数
    document.getElementById('likeCount').textContent = work.likes || 0;

    // いいね・コメント非表示（第1段階）
    hideLikeAndCommentSections();
}

// いいね・コメントセクションを非表示
function hideLikeAndCommentSections() {
    const likeSection     = document.querySelector('.like-section');
    const commentsSection = document.querySelector('.comments-section');
    if (likeSection)     likeSection.style.display     = 'none';
    if (commentsSection) commentsSection.style.display = 'none';
}

// イベントリスナー
function setupEventListeners() {
    // ギャラリーに戻るボタン
    const backButton = document.getElementById('backToGallery');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = currentGenre
                ? `gallery.html?genre=${currentGenre}`
                : 'index.html';
        });
    }

    // ページトップへ
    const scrollButton = document.getElementById('scrollToTop');
    if (scrollButton) {
        scrollButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// HTMLエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}
