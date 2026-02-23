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
    await loadComments(workId);
    
    // イベントリスナーを設定
    setupEventListeners(workId);
});

// 作品を読み込む
async function loadWork(workId) {
    try {
        const response = await fetch(`tables/works/${workId}`);
        currentWork = await response.json();
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
    
    // 詳細説明文
    if (work.detail_text) {
        document.getElementById('workDetailText').textContent = work.detail_text;
    }
    
    // 追加画像
    if (work.additional_images && Array.isArray(work.additional_images) && work.additional_images.length > 0) {
        const additionalImagesHtml = work.additional_images.map(img => `
            <div class="additional-image-item">
                <img src="${img.url}" alt="${img.caption || work.title}">
                <p>${img.caption || ''}</p>
            </div>
        `).join('');
        
        document.getElementById('additionalImages').innerHTML = additionalImagesHtml;
    } else {
        document.getElementById('additionalImagesSection').style.display = 'none';
    }
    
    // いいね数
    document.getElementById('likeCount').textContent = work.likes || 0;
    
    // ページタイトルを更新
    document.title = `${work.title} - 余暇が出来たので模型製作を再開した件`;
}

// コメントを読み込む
async function loadComments(workId) {
    try {
        const response = await fetch('tables/comments?limit=100');
        const data = await response.json();
        
        // この作品のコメントのみフィルター（承認済みのみ）
        const comments = data.data.filter(c => c.work_id === workId && c.is_approved);
        
        // 投稿日時でソート（古い順）
        comments.sort((a, b) => a.posted_date - b.posted_date);
        
        displayComments(comments);
    } catch (error) {
        console.error('コメントの読み込みに失敗しました:', error);
    }
}

// コメントを表示
function displayComments(comments) {
    const container = document.getElementById('commentsList');
    
    if (comments.length === 0) {
        container.innerHTML = '<p class="no-works">まだコメントはありません。</p>';
        return;
    }
    
    container.innerHTML = comments.map(comment => {
        const date = new Date(comment.posted_date);
        const dateStr = date.toLocaleDateString('ja-JP');
        
        let html = `
            <div class="comment-item">
                <div class="comment-text">${escapeHtml(comment.comment_text)}</div>
        `;
        
        if (comment.reply_text) {
            html += `
                <div class="comment-reply">
                    <div class="comment-reply-label">管理人より:</div>
                    <div>${escapeHtml(comment.reply_text)}</div>
                </div>
            `;
        }
        
        html += `
                <div class="comment-date">${dateStr}</div>
            </div>
        `;
        
        return html;
    }).join('');
}

// イベントリスナーを設定
function setupEventListeners(workId) {
    // ギャラリーに戻るボタン
    document.getElementById('backToGallery').addEventListener('click', () => {
        if (currentGenre) {
            window.location.href = `gallery.html?genre=${currentGenre}`;
        } else {
            window.location.href = 'index.html';
        }
    });
    
    // いいねボタン
    document.getElementById('likeButton').addEventListener('click', async () => {
        await handleLike(workId);
    });
    
    // コメント送信
    document.getElementById('submitComment').addEventListener('click', async () => {
        await submitComment(workId);
    });
    
    // ページトップへ
    document.getElementById('scrollToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// いいね処理
async function handleLike(workId) {
    try {
        // ローカルストレージでいいね済みかチェック
        const likedWorks = JSON.parse(localStorage.getItem('likedWorks') || '[]');
        
        if (likedWorks.includes(workId)) {
            alert('すでにいいねしています！');
            return;
        }
        
        // いいね数を増やす
        const newLikes = (currentWork.likes || 0) + 1;
        
        const response = await fetch(`tables/works/${workId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                likes: newLikes
            })
        });
        
        if (response.ok) {
            currentWork.likes = newLikes;
            document.getElementById('likeCount').textContent = newLikes;
            document.getElementById('likeButton').classList.add('liked');
            
            // ローカルストレージに記録
            likedWorks.push(workId);
            localStorage.setItem('likedWorks', JSON.stringify(likedWorks));
            
            alert('いいねしました！');
        }
    } catch (error) {
        console.error('いいねに失敗しました:', error);
        alert('いいねに失敗しました。もう一度お試しください。');
    }
}

// コメント送信
async function submitComment(workId) {
    const commentText = document.getElementById('commentInput').value.trim();
    
    if (!commentText) {
        alert('コメントを入力してください。');
        return;
    }
    
    try {
        const response = await fetch('tables/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                work_id: workId,
                comment_text: commentText,
                is_approved: false, // 初期状態は未承認
                posted_date: Date.now()
            })
        });
        
        if (response.ok) {
            alert('コメントを送信しました。管理人の承認後に表示されます。');
            document.getElementById('commentInput').value = '';
        }
    } catch (error) {
        console.error('コメント送信に失敗しました:', error);
        alert('コメント送信に失敗しました。もう一度お試しください。');
    }
}

// HTMLエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// いいね済みかチェック
function checkIfLiked(workId) {
    const likedWorks = JSON.parse(localStorage.getItem('likedWorks') || '[]');
    if (likedWorks.includes(workId)) {
        document.getElementById('likeButton').classList.add('liked');
    }
}

// ページ読み込み後にいいね状態をチェック
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const workId = urlParams.get('id');
    if (workId) {
        checkIfLiked(workId);
    }
});
