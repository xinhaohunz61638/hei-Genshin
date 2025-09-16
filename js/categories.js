// 分类页面功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const categoryItems = document.querySelectorAll('.category-item');
    const productCards = document.querySelectorAll('.product-card');
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const filterSelect = document.querySelector('.filter-select');
    const contentHeader = document.querySelector('.content-header h3');


    // 分类切换功能
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有active类
            categoryItems.forEach(cat => cat.classList.remove('active'));
            // 添加active类到当前项
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            const categoryName = this.textContent;
            
            // 更新内容标题
            contentHeader.textContent = categoryName;
            
            // 筛选商品
            filterProducts(category);
        });
    });

    // 商品筛选函数
    function filterProducts(category) {
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                // 添加淡入动画
                card.style.animation = 'fadeIn 0.6s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // 搜索功能
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // 如果搜索为空，显示所有商品
            productCards.forEach(card => {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.6s ease-out';
            });
            contentHeader.textContent = '全部商品';
            return;
        }

        let found = false;
        
        productCards.forEach(card => {
            const productName = card.querySelector('h4').textContent.toLowerCase();
            const productDesc = card.querySelector('.product-desc').textContent.toLowerCase();
            
            if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.6s ease-out';
                found = true;
            } else {
                card.style.display = 'none';
            }
        });

        contentHeader.textContent = found ? `搜索结果: "${searchTerm}"` : '未找到相关商品';
    }

    // 排序功能
    filterSelect.addEventListener('change', function() {
        const sortType = this.value;
        sortProducts(sortType);
    });

    function sortProducts(sortType) {
        const visibleProducts = Array.from(productCards).filter(card => 
            card.style.display !== 'none'
        );

        visibleProducts.sort((a, b) => {
            switch (sortType) {
                case 'price-asc':
                    return getPrice(a) - getPrice(b);
                case 'price-desc':
                    return getPrice(b) - getPrice(a);
                case 'new':
                    // 简单的新品排序（假设有new标签的优先）
                    const aIsNew = a.querySelector('.product-tag.new');
                    const bIsNew = b.querySelector('.product-tag.new');
                    return (bIsNew ? 1 : 0) - (aIsNew ? 1 : 0);
                default:
                    return 0;
            }
        });

        // 重新排列商品
        const productGrid = document.querySelector('.product-grid');
        visibleProducts.forEach(product => {
            productGrid.appendChild(product);
        });
    }

    // 辅助函数：获取商品价格
    function getPrice(card) {
        const priceText = card.querySelector('.current-price').textContent;
        return parseFloat(priceText.replace('¥', '').replace(',', ''));
    }





    // 购物车功能（简化版）
    const addCartBtns = document.querySelectorAll('.add-cart-btn');
    addCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.closest('.product-card').querySelector('h4').textContent;
            
            // 添加动画效果
            this.style.transform = 'scale(0.95)';
            this.textContent = '已添加 ✓';
            
            setTimeout(() => {
                this.style.transform = '';
                setTimeout(() => {
                    this.textContent = '加入购物车';
                }, 1000);
            }, 500);
            
            // 显示提示信息
            showToast(`已添加 ${productName} 到购物车`);
        });
    });

    // 显示提示信息函数
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    // 添加滑动动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    console.log('分类页面功能已初始化');
});