// トップページのJavaScript

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', async () => {
    await loadNewWorks();
});

// 新着作品を読み込む
async function loadNewWorks() {
    try {
        // window.worksData から取得（静的版）
        const allWorks = window.worksData || [];
        
        // 新着フラグがtrueの作品のみフィルター
        const newWorks = allWorks.filter(work => work.is_new);
        
        // sort_order でソート（昇順）
        newWorks.sort((a, b) => (a.sort_order || 9999) - (b.sort_order || 9999));
        
        // 最大6件まで表示
        const displayWorks = newWorks.slice(0, 6);
        
        displayNewWorks(displayWorks);
    } catch (error) {
        console.error('新着作品の読み込みに失敗しました:', error);
    }
}

// 新着作品を表示
function displayNewWorks(works) {
    const container = document.getElementById('newWorksList');
    
    if (works.length === 0) {
        container.innerHTML = '<p class="no-works">新着作品はまだありません。</p>';
        return;
    }
    
    container.innerHTML = works.map(work => `
        <a href="work.html?id=${work.id}" class="new-work-item">
            <img src="${work.main_image}" alt="${work.title}">
            <div class="new-work-info">
                <h3>
                    ${work.title}
                    <span class="new-badge">NEW</span>
                </h3>
                <p>${work.description}</p>
                <p class="work-date">${work.completed_date || '完成年月不明'}</p>
            </div>
        </a>
    `).join('');
}
