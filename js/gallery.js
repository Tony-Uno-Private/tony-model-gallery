// ギャラリーページのJavaScript

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
    const genre = urlParams.get('genre');
    
    if (!genre) {
        window.location.href = 'index.html';
        return;
    }
    
    // ジャンル名を表示
    const genreName = genreNames[genre] || '作品ギャラリー';
    document.getElementById('genreTitle').textContent = genreName;
    
    // ページタイトルをジャンル名に動的変更（SEO対応）
    document.title = `${genreName} - 余暇が出来たので模型製作を再開した件`;
    
    // 作品を読み込む
    await loadWorks(genre);
});

// 作品を読み込む
async function loadWorks(genre) {
    try {
        // window.worksData から取得（静的版）
        const allWorks = window.worksData || [];
        
        // 指定されたジャンルの作品のみフィルター
        const works = allWorks.filter(work => work.genre === genre);
        
        // 表示順序でソート
        works.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        
        displayWorks(works);
    } catch (error) {
        console.error('作品の読み込みに失敗しました:', error);
        document.getElementById('noWorks').style.display = 'block';
    }
}

// 作品を表示
function displayWorks(works) {
    const container = document.getElementById('galleryGrid');
    const noWorks = document.getElementById('noWorks');
    
    if (works.length === 0) {
        container.style.display = 'none';
        noWorks.style.display = 'block';
        return;
    }
    
    container.innerHTML = works.map(work => `
        <a href="work.html?id=${work.id}" class="gallery-item">
            <img src="${work.main_image}" alt="${work.title}">
            <div class="gallery-item-info">
                <h3>${work.title}</h3>
                <p>${work.description}</p>
                <p>${work.completed_date || '完成年月不明'}</p>
            </div>
        </a>
    `).join('');
}
