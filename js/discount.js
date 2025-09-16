// 折扣计算器功能 - 粉丝牌和群友优惠版本（无自定义折扣）
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const originalPriceInput = document.getElementById('originalPrice');
    const discountTypeSelect = document.getElementById('discountType');
    const fansOptions = document.getElementById('fansOptions');
    const groupOptions = document.getElementById('groupOptions');
    const fansLevelSelect = document.getElementById('fansLevel');
    const groupLevelSelect = document.getElementById('groupLevel');
    const studentVerifiedCheckbox = document.getElementById('studentVerified');
    const studentUnverifiedCheckbox = document.getElementById('studentUnverified');
    const calculateBtn = document.getElementById('calculateBtn');
    const originalPriceResult = document.getElementById('originalPriceResult');
    const discountAmount = document.getElementById('discountAmount');
    const finalPrice = document.getElementById('finalPrice');

    // 折扣类型映射
    const discountRates = {
        // 粉丝牌优惠（使用数字索引）
        'fans': {
            '1': 0.95,    // 8~12级 (95折)
            '2': 0.9,     // 13~16级 (9折)
            '3': 0.85,    // 17~19级 (85折)
            '4': 0.8,     // 20~25级 (8折)
            '5': 0.75,    // 25级以上 (75折)
            '6': 0.7      // 舰长 (7折)
        },
        // 群友优惠（使用数字索引）
        'group': {
            '1': 0.95,    // 黄金 (95折)
            '2': 0.9,     // 铂金 (9折)
            '3': 0.85,    // 钻石 (85折)
            '4': 0.8,     // 王者 (8折)
            '5': 0.5      // 紫牌 (5折)
        },
        // 特殊优惠
        'special': {
            'verified': 0.85,   // 已验证学生/教师 85折
            'unverified': 0.9   // 未验证学生/教师 9折
        }
    };

    // 折扣类型变化事件
    discountTypeSelect.addEventListener('change', function() {
        updateDiscountOptions();
    });

    // 更新折扣选项显示
    function updateDiscountOptions() {
        const discountType = discountTypeSelect.value;
        
        // 隐藏所有选项
        fansOptions.style.display = 'none';
        groupOptions.style.display = 'none';
        
        // 显示对应的选项
        if (discountType === 'fans') {
            fansOptions.style.display = 'block';
        } else if (discountType === 'group') {
            groupOptions.style.display = 'block';
        }
    }

    // 计算折扣
    calculateBtn.addEventListener('click', function() {
        calculateDiscount();
    });

    // 输入框回车键支持
    originalPriceInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateDiscount();
        }
    });

    fansLevelSelect.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateDiscount();
        }
    });

    groupLevelSelect.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateDiscount();
        }
    });

    // 折扣计算函数
    function calculateDiscount() {
        // 获取输入值
        const originalPrice = parseFloat(originalPriceInput.value);
        const discountType = discountTypeSelect.value;
        
        // 验证原价
        if (isNaN(originalPrice) || originalPrice <= 0) {
            alert('请输入有效的商品原价！');
            return;
        }

        let discountRate = 1; // 默认无折扣
        let discountDetails = [];

        // 根据优惠类型计算折扣率
        if (discountType === 'fans') {
            const fansLevel = fansLevelSelect.value;
            if (fansLevel === '0') {
                alert('请选择粉丝牌等级！');
                return;
            }
            discountRate = discountRates.fans[fansLevel];
            const levelName = getLevelName('fans', fansLevel);
            discountDetails.push(`粉丝牌优惠 (${levelName}): ${formatDiscountRate(discountRate)}`);
            
        } else if (discountType === 'group') {
            const groupLevel = groupLevelSelect.value;
            if (groupLevel === '0') {
                alert('请选择群友等级！');
                return;
            }
            discountRate = discountRates.group[groupLevel];
            const levelName = getLevelName('group', groupLevel);
            discountDetails.push(`群友优惠 (${levelName}): ${formatDiscountRate(discountRate)}`);
            
        } else {
            alert('请选择优惠类型！');
            return;
        }

        // 处理特殊优惠（学生/教师）
        let specialDiscountRate = 1;
        if (studentVerifiedCheckbox.checked) {
            specialDiscountRate *= discountRates.special.verified;
            discountDetails.push('学生/教师已验证: 85折');
        } else if (studentUnverifiedCheckbox.checked) {
            specialDiscountRate *= discountRates.special.unverified;
            discountDetails.push('学生/教师未验证: 9折');
        }

        // 计算最终折扣率（叠加优惠）
        const finalDiscountRate = discountRate * specialDiscountRate;
        
        // 计算折扣金额和最终价格
        const discountAmt = originalPrice * (1 - finalDiscountRate);
        let finalPriceValue = originalPrice - discountAmt;

        // 确保最终价格不为负数
        if (finalPriceValue < 0) {
            finalPriceValue = 0;
        }

        // 更新结果显示
        updateResults(originalPrice, discountAmt, finalPriceValue, discountDetails);
    }

    // 获取等级名称
    function getLevelName(discountType, levelValue) {
        const levelNames = {
            'fans': {
                '1': '8~12级',
                '2': '13~16级', 
                '3': '17~19级',
                '4': '20~25级',
                '5': '25级以上',
                '6': '舰长'
            },
            'group': {
                '1': '黄金',
                '2': '铂金',
                '3': '钻石', 
                '4': '王者',
                '5': '紫牌'
            }
        };
        return levelNames[discountType][levelValue] || '未知等级';
    }

    // 格式化折扣率显示
    function formatDiscountRate(rate) {
        const discountPercent = (1 - rate) * 100;
        return `${discountPercent}%折扣`;
    }

    // 更新结果显示
    function updateResults(originalPrice, discountAmt, finalPriceValue, discountDetails) {
        originalPriceResult.textContent = formatCurrency(originalPrice);
        discountAmount.textContent = formatCurrency(discountAmt);
        finalPrice.textContent = formatCurrency(finalPriceValue);

        // 显示折扣详情
        if (discountDetails.length > 0) {
            const detailsElement = document.getElementById('discountDetails') || createDiscountDetailsElement();
            detailsElement.innerHTML = `<strong>优惠详情:</strong><br>${discountDetails.join('<br>')}`;
        }

        // 添加动画效果
        animateResults();
    }

    // 创建折扣详情元素
    function createDiscountDetailsElement() {
        const detailsElement = document.createElement('div');
        detailsElement.id = 'discountDetails';
        detailsElement.className = 'result-item';
        detailsElement.style.marginTop = '1rem';
        detailsElement.style.paddingTop = '1rem';
        detailsElement.style.borderTop = '1px solid #eee';
        detailsElement.style.fontSize = '0.9rem';
        detailsElement.style.color = '#666';
        
        const resultSection = document.querySelector('.result-section');
        const totalItem = document.querySelector('.result-item.total');
        resultSection.insertBefore(detailsElement, totalItem);
        
        return detailsElement;
    }

    // 货币格式化
    function formatCurrency(amount) {
        return '¥' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    // 结果显示动画
    function animateResults() {
        const resultItems = document.querySelectorAll('.result-item span:last-child');
        
        resultItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        });
    }

    // 特殊优惠复选框互斥功能
    studentVerifiedCheckbox.addEventListener('change', function() {
        if (this.checked) {
            studentUnverifiedCheckbox.checked = false;
        }
    });

    studentUnverifiedCheckbox.addEventListener('change', function() {
        if (this.checked) {
            studentVerifiedCheckbox.checked = false;
        }
    });

    // 初始化
    updateDiscountOptions();

    // 添加示例数据快速填充功能
    const examples = document.querySelectorAll('.example');
    examples.forEach((example, index) => {
        example.addEventListener('click', function() {
            originalPriceInput.value = '100';
            
            if (index === 0) {
                // 粉丝牌优惠示例
                discountTypeSelect.value = 'fans';
                fansLevelSelect.value = '6'; // 舰长
            } else if (index === 1) {
                // 群友优惠示例
                discountTypeSelect.value = 'group';
                groupLevelSelect.value = '5'; // 紫牌
            } else if (index === 2) {
                // 特殊优惠示例
                discountTypeSelect.value = 'fans';
                fansLevelSelect.value = '1'; // 8~12级
                studentVerifiedCheckbox.checked = true;
            }
            
            updateDiscountOptions();
            calculateDiscount();
        });
    });

    console.log('折扣计算器已初始化 - 粉丝牌和群友优惠版本（无自定义折扣）');
});