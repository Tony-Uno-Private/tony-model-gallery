// 作品詳細ページのJavaScript

let currentWork = null;
let currentGenre = null;

// ジャンル名マッピング
const genreNames = {
    aircraft: '飛行機モデル',
    afv: 'AFVモデル',
    ship: '艦船モデル',
    robot: 'ロボット・SFモデル',
    other: 'その他モデル'
};

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const workId = urlParams.get('id');
    
    if (!workId) {
        window.location.href = 'index.html';
        return;
    }
    
    await loadWork(workId);
    
    // イベントリスナーを設定
    setupEventListeners(workId);
});

// 作品を読み込む
async function loadWork(workId) {
    try {
        // window.worksData から作品を検索
        const allWorks = window.worksData || [];
        currentWork = allWorks.find(work => work.id === workId);
        
        if (!currentWork) {
            throw new Error('作品が見つかりませんでした');
        }
        
        currentGenre = currentWork.genre;
        displayWork(currentWork);
    } catch (error) {
        console.error('作品の読み込みに失敗しました:', error);
        alert('作品が見つかりませんでした。');
        window.location.href = 'index.html';
    }
}

// 作品を表示
function displayWork(work) {
    document.getElementById('workTitle').textContent = work.title;
    document.getElementById('workDate').textContent = work.completed_date || '完成年月不明';
    document.getElementById('mainImage').src = work.main_image;
    document.getElementById('mainImage').alt = work.title;
    document.getElementById('workDescription').textContent = work.description;
    
    // 詳細説明文（\n\n で段落分割して <p> タグに変換、単独 \n は <br> に変換）
    if (work.detail_text) {
        const paragraphs = work.detail_text.split(/\n\n+/);
        const html = paragraphs
            .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
            .join('');
        document.getElementById('workDetailText').innerHTML = html;
    }
    
    // 追加画像
    if (work.additional_images && Array.isArray(work.additional_images) && work.additional_images.length > 0) {
        const additionalImagesHtml = work.additional_images.map(img => `
            <div class="additional-image-item">
                <img src="${img.url}" alt="${img.caption || work.title}">
                <p>${(img.caption || '').replace(/\\n/g, '<br>').replace(/\n/g, '<br>')}</p>
            </div>
        `).join('');
        
        document.getElementById('additionalImages').innerHTML = additionalImagesHtml;
    } else {
        document.getElementById('additionalImagesSection').style.display = 'none';
    }
    
    // いいね数（第1段階では表示のみ）
    document.getElementById('likeCount').textContent = work.likes || 0;
    
    // ページタイトルを更新
    document.title = `${work.title} - 余暇が出来たので模型製作を再開した件`;
    
    // 第1段階では、いいね・コメント機能を非表示
    hideLikeAndCommentSections();
}

// いいね・コメントセクションを非表示にする（第1段階用）
function hideLikeAndCommentSections() {
    const likeSection = document.querySelector('.like-section');
    const commentsSection = document.querySelector('.comments-section');
    
    if (likeSection) {
        likeSection.style.display = 'none';
    }
    
    if (commentsSection) {
        commentsSection.style.display = 'none';
    }
}

// イベントリスナーを設定
function setupEventListeners(workId) {
    // ギャラリーに戻るボタン
    const backButton = document.getElementById('backToGallery');
    if (backButton) {
        backButton.addEventListener('click', () => {
            if (currentGenre) {
                window.location.href = `gallery.html?genre=${currentGenre}`;
            } else {
                window.location.href = 'index.html';
            }
        });
    }
    
    // ページトップへ
    const scrollButton = document.getElementById('scrollToTop');
    if (scrollButton) {
        scrollButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 第1段階では、いいねボタンとコメント送信ボタンのイベントは無効化
    // （HTML側で非表示にしているため、イベントリスナーも不要）
}

// HTMLエスケープ（将来のコメント機能用に残す）
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
