// 管理画面のJavaScript

// 簡易パスワード（実際の使用時はより安全な方法を推奨）
const ADMIN_PASSWORD = 'model2025';

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    setupLoginForm();
});

// ログイン状態をチェック
function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    
    if (isLoggedIn === 'true') {
        showAdminSection();
    } else {
        showLoginSection();
    }
}

// ログインフォームの設定
function setupLoginForm() {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const password = document.getElementById('passwordInput').value;
        
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            showAdminSection();
        } else {
            document.getElementById('loginError').textContent = 'パスワードが正しくありません。';
        }
    });
}

// ログイン画面を表示
function showLoginSection() {
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('adminSection').style.display = 'none';
}

// 管理画面を表示
function showAdminSection() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminSection').style.display = 'block';
    
    setupAdminSection();
}

// 管理画面の設定
function setupAdminSection() {
    // ログアウトボタン
    document.getElementById('logoutButton').addEventListener('click', () => {
        sessionStorage.removeItem('adminLoggedIn');
        showLoginSection();
    });
    
    // タブ切り替え
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // 新規作品追加ボタン
    document.getElementById('addNewWork').addEventListener('click', () => {
        openWorkModal();
    });
    
    // モーダルを閉じる
    document.getElementById('closeModal').addEventListener('click', () => {
        closeWorkModal();
    });
    
    // 作品フォーム送信
    document.getElementById('workForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveWork();
    });
    
    // 作品削除
    document.getElementById('deleteWork').addEventListener('click', async () => {
        await deleteWork();
    });
    
    // 初期データを読み込む
    loadWorks();
    loadComments();
}

// タブ切り替え
function switchTab(tabName) {
    // すべてのタブボタンとコンテンツから activeクラスを削除
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // 選択されたタブをアクティブに
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

// 作品を読み込む
async function loadWorks() {
    try {
        const response = await fetch('tables/works?limit=100');
        const data = await response.json();
        
        // 作成日時でソート（新しい順）
        const works = data.data.sort((a, b) => b.created_at - a.created_at);
        
        displayWorksAdmin(works);
    } catch (error) {
        console.error('作品の読み込みに失敗しました:', error);
    }
}

// 作品を表示（管理画面）
function displayWorksAdmin(works) {
    const container = document.getElementById('worksList');
    
    if (works.length === 0) {
        container.innerHTML = '<p class="no-works">作品がありません。</p>';
        return;
    }
    
    const genreNames = {
        aircraft: '飛行機モデル',
        afv: 'AFVモデル',
        ship: '艦船モデル',
        robot: 'ロボット・SFモデル',
        other: 'その他モデル'
    };
    
    container.innerHTML = works.map(work => `
        <div class="work-item" onclick="editWork('${work.id}')">
            <img src="${work.main_image}" alt="${work.title}">
            <div class="work-item-info">
                <h3>
                    ${work.title}
                    ${work.is_new ? '<span class="work-item-badge">NEW</span>' : ''}
                </h3>
                <p>${genreNames[work.genre] || work.genre} | ${work.completed_date || '完成年月不明'}</p>
                <p>${work.description}</p>
                <p style="color: var(--gray); font-size: 0.85rem;">いいね: ${work.likes || 0}</p>
            </div>
        </div>
    `).join('');
}

// 作品編集モーダルを開く
function openWorkModal(workId = null) {
    const modal = document.getElementById('workModal');
    const form = document.getElementById('workForm');
    
    if (workId) {
        // 編集モード
        document.getElementById('modalTitle').textContent = '作品編集';
        document.getElementById('deleteWork').style.display = 'block';
        loadWorkForEdit(workId);
    } else {
        // 新規作成モード
        document.getElementById('modalTitle').textContent = '新規作品追加';
        document.getElementById('deleteWork').style.display = 'none';
        form.reset();
        document.getElementById('workId').value = '';
    }
    
    modal.classList.add('active');
}

// 作品編集モーダルを閉じる
function closeWorkModal() {
    document.getElementById('workModal').classList.remove('active');
}

// 編集用に作品を読み込む
async function loadWorkForEdit(workId) {
    try {
        const response = await fetch(`tables/works/${workId}`);
        const work = await response.json();
        
        document.getElementById('workId').value = work.id;
        document.getElementById('workTitleInput').value = work.title;
        document.getElementById('workGenre').value = work.genre;
        document.getElementById('workCompletedDate').value = work.completed_date || '';
        document.getElementById('workMainImage').value = work.main_image;
        document.getElementById('workDescription').value = work.description;
        document.getElementById('workDetailText').value = work.detail_text || '';
        document.getElementById('workIsNew').checked = work.is_new || false;
        document.getElementById('workSortOrder').value = work.sort_order || 0;
        
        if (work.additional_images && Array.isArray(work.additional_images)) {
            document.getElementById('workAdditionalImages').value = JSON.stringify(work.additional_images, null, 2);
        } else {
            document.getElementById('workAdditionalImages').value = '';
        }
    } catch (error) {
        console.error('作品の読み込みに失敗しました:', error);
        alert('作品の読み込みに失敗しました。');
    }
}

// 作品を保存
async function saveWork() {
    const workId = document.getElementById('workId').value;
    const isNew = !workId;
    
    // 追加画像のJSON検証
    let additionalImages = [];
    const additionalImagesText = document.getElementById('workAdditionalImages').value.trim();
    
    if (additionalImagesText) {
        try {
            additionalImages = JSON.parse(additionalImagesText);
            if (!Array.isArray(additionalImages)) {
                alert('追加画像はJSON配列形式で入力してください。');
                return;
            }
        } catch (e) {
            alert('追加画像のJSON形式が正しくありません。');
            return;
        }
    }
    
    const workData = {
        title: document.getElementById('workTitleInput').value,
        genre: document.getElementById('workGenre').value,
        completed_date: document.getElementById('workCompletedDate').value,
        main_image: document.getElementById('workMainImage').value,
        description: document.getElementById('workDescription').value,
        detail_text: document.getElementById('workDetailText').value,
        additional_images: additionalImages,
        is_new: document.getElementById('workIsNew').checked,
        sort_order: parseInt(document.getElementById('workSortOrder').value) || 0,
        likes: 0 // 新規作成時のみ
    };
    
    try {
        let response;
        
        if (isNew) {
            // 新規作成
            response = await fetch('tables/works', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workData)
            });
        } else {
            // 更新（いいね数は保持）
            delete workData.likes;
            response = await fetch(`tables/works/${workId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workData)
            });
        }
        
        if (response.ok) {
            alert('作品を保存しました。');
            closeWorkModal();
            loadWorks();
        } else {
            alert('保存に失敗しました。');
        }
    } catch (error) {
        console.error('保存に失敗しました:', error);
        alert('保存に失敗しました。');
    }
}

// 作品を削除
async function deleteWork() {
    const workId = document.getElementById('workId').value;
    
    if (!workId) {
        return;
    }
    
    if (!confirm('本当にこの作品を削除しますか？')) {
        return;
    }
    
    try {
        const response = await fetch(`tables/works/${workId}`, {
            method: 'DELETE'
        });
        
        if (response.ok || response.status === 204) {
            alert('作品を削除しました。');
            closeWorkModal();
            loadWorks();
        } else {
            alert('削除に失敗しました。');
        }
    } catch (error) {
        console.error('削除に失敗しました:', error);
        alert('削除に失敗しました。');
    }
}

// グローバル関数として定義（HTMLから呼び出せるように）
window.editWork = function(workId) {
    openWorkModal(workId);
};

// コメントを読み込む
async function loadComments() {
    try {
        const response = await fetch('tables/comments?limit=100');
        const data = await response.json();
        
        // 投稿日時でソート（新しい順）
        const comments = data.data.sort((a, b) => b.posted_date - a.posted_date);
        
        displayCommentsAdmin(comments);
    } catch (error) {
        console.error('コメントの読み込みに失敗しました:', error);
    }
}

// コメントを表示（管理画面）
async function displayCommentsAdmin(comments) {
    const container = document.getElementById('adminCommentsList');
    
    if (comments.length === 0) {
        container.innerHTML = '<p class="no-works">コメントはありません。</p>';
        return;
    }
    
    // 作品情報を取得
    const worksResponse = await fetch('tables/works?limit=100');
    const worksData = await worksResponse.json();
    const worksMap = {};
    worksData.data.forEach(work => {
        worksMap[work.id] = work.title;
    });
    
    container.innerHTML = comments.map(comment => {
        const date = new Date(comment.posted_date);
        const dateStr = date.toLocaleDateString('ja-JP');
        const workTitle = worksMap[comment.work_id] || '不明な作品';
        
        return `
            <div class="admin-comment-item">
                <div class="admin-comment-header">
                    <span class="admin-comment-work">${workTitle}</span>
                    <span class="comment-date">${dateStr}</span>
                </div>
                <div class="admin-comment-text">${escapeHtml(comment.comment_text)}</div>
                ${comment.reply_text ? `
                    <div class="admin-comment-reply-form">
                        <strong>返信:</strong>
                        <div style="padding: 10px; background: var(--bg-color); border-radius: 5px; margin-top: 5px;">
                            ${escapeHtml(comment.reply_text)}
                        </div>
                    </div>
                ` : `
                    <div class="admin-comment-reply-form">
                        <textarea id="reply-${comment.id}" placeholder="返信を入力..."></textarea>
                    </div>
                `}
                <div class="admin-comment-actions">
                    ${!comment.is_approved ? `
                        <button class="button button-primary" onclick="approveComment('${comment.id}')">承認</button>
                    ` : `
                        <span style="color: var(--secondary-color);">✓ 承認済み</span>
                    `}
                    ${!comment.reply_text ? `
                        <button class="button button-secondary" onclick="replyComment('${comment.id}')">返信</button>
                    ` : ''}
                    <button class="button button-danger" onclick="deleteComment('${comment.id}')">削除</button>
                </div>
            </div>
        `;
    }).join('');
}

// コメントを承認
window.approveComment = async function(commentId) {
    try {
        const response = await fetch(`tables/comments/${commentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                is_approved: true
            })
        });
        
        if (response.ok) {
            alert('コメントを承認しました。');
            loadComments();
        }
    } catch (error) {
        console.error('承認に失敗しました:', error);
        alert('承認に失敗しました。');
    }
};

// コメントに返信
window.replyComment = async function(commentId) {
    const replyText = document.getElementById(`reply-${commentId}`).value.trim();
    
    if (!replyText) {
        alert('返信を入力してください。');
        return;
    }
    
    try {
        const response = await fetch(`tables/comments/${commentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reply_text: replyText,
                is_approved: true
            })
        });
        
        if (response.ok) {
            alert('返信を送信しました。');
            loadComments();
        }
    } catch (error) {
        console.error('返信に失敗しました:', error);
        alert('返信に失敗しました。');
    }
};

// コメントを削除
window.deleteComment = async function(commentId) {
    if (!confirm('本当にこのコメントを削除しますか？')) {
        return;
    }
    
    try {
        const response = await fetch(`tables/comments/${commentId}`, {
            method: 'DELETE'
        });
        
        if (response.ok || response.status === 204) {
            alert('コメントを削除しました。');
            loadComments();
        }
    } catch (error) {
        console.error('削除に失敗しました:', error);
        alert('削除に失敗しました。');
    }
};

// HTMLエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
