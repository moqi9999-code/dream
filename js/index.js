// ============================================
// 梦境宇宙 - 主应用逻辑
// ============================================

// 应用状态
const appState = {
    currentPage: 'home',
    dreams: JSON.parse(localStorage.getItem('dreams') || '[]'),
    sharedDreams: JSON.parse(localStorage.getItem('sharedDreams') || '[]'),
    currentEmotion: null,
    clarityRating: 0,
    isRecording: false,
    filters: {
        emotion: 'all',
        dateRange: 'all'
    }
};

// 梦境解析数据库 - 基于关键词的解析库
const dreamAnalysisDB = {
    // 象征意义数据库
    symbols: {
        '飞': { meaning: '渴望自由，想要摆脱束缚', type: 'freedom', emotion: 'positive' },
        '翔': { meaning: '追求更高目标，有上升愿望', type: 'growth', emotion: 'positive' },
        '水': { meaning: '情感状态，潜意识流动', type: 'emotion', emotion: 'neutral' },
        '海': { meaning: '广阔的情感世界，未知领域', type: 'emotion', emotion: 'neutral' },
        '火': { meaning: '激情、愤怒或净化', type: 'energy', emotion: 'intense' },
        '森林': { meaning: '探索未知，寻找自我', type: 'exploration', emotion: 'mysterious' },
        '树': { meaning: '成长、生命力和根基', type: 'growth', emotion: 'positive' },
        '星': { meaning: '希望、目标和遥远理想', type: 'aspiration', emotion: 'positive' },
        '梦': { meaning: '潜意识的投射，内心愿望', type: 'subconscious', emotion: 'neutral' },
        '城': { meaning: '社会关系，生活环境', type: 'social', emotion: 'neutral' },
        '山': { meaning: '挑战、障碍或成就', type: 'challenge', emotion: 'neutral' },
        '跑': { meaning: '逃避问题或追求目标', type: 'action', emotion: 'urgent' },
        '追': { meaning: '面临压力或未解决问题', type: 'pressure', emotion: 'anxious' },
        '掉': { meaning: '失控感或安全感缺失', type: 'insecurity', emotion: 'negative' },
        '死': { meaning: '结束与新生，重大转变', type: 'transformation', emotion: 'neutral' },
        '蛇': { meaning: '潜在威胁或隐藏的智慧', type: 'warning', emotion: 'caution' },
        '猫': { meaning: '独立性，女性特质', type: 'personality', emotion: 'neutral' },
        '狗': { meaning: '忠诚，友谊，保护', type: 'relationship', emotion: 'positive' },
        '家': { meaning: '安全感，归属感', type: 'security', emotion: 'positive' },
        '门': { meaning: '机会，选择，过渡', type: 'opportunity', emotion: 'neutral' }
    },
    
    // 情绪分析关键词
    emotionKeywords: {
        happy: ['开心', '快乐', '幸福', '美好', '喜欢', '爱', '笑', '成功', '获得', '飞翔'],
        horror: ['害怕', '恐惧', '鬼', '怪物', '死亡', '血腥', '逃跑', '被困', '黑暗'],
        fantasy: ['魔法', '超能力', '飞行', '奇异', '神秘', '仙境', '不可思议'],
        chaos: ['混乱', '迷失', '找不到', '失控', '碎片', '错乱', '崩溃']
    },
    
    // 获取解析结果
    getAnalysis(text, emotion) {
        const foundSymbols = [];
        let detectedEmotion = emotion || 'fantasy';
        
        // 检测象征意义
        for (const [keyword, data] of Object.entries(this.symbols)) {
            if (text.includes(keyword)) {
                foundSymbols.push({ keyword, ...data });
            }
        }
        
        // 如果没有找到特定象征，添加默认解析
        if (foundSymbols.length === 0) {
            foundSymbols.push({
                keyword: '梦境',
                meaning: '潜意识的自我表达',
                type: 'general',
                emotion: 'neutral'
            });
        }
        
        // 生成具体解析
        return this.generateSpecificAnalysis(text, foundSymbols, detectedEmotion);
    },
    
    // 生成具体解析
    generateSpecificAnalysis(text, symbols, emotion) {
        const mainSymbol = symbols[0];
        const secondarySymbols = symbols.slice(1, 3);
        
        // 根据梦境内容长度判断清晰度
        const clarity = text.length > 100 ? 'high' : text.length > 50 ? 'medium' : 'low';
        
        // 生成象征解读
        const symbolInterpretation = symbols.map(s => 
            `梦中出现「${s.keyword}」元素，象征${s.meaning}。`
        ).join('');
        
        // 生成情绪分析
        const emotionAnalysis = this.getEmotionAnalysis(emotion, text);
        
        // 生成建议
        const suggestion = this.getSuggestion(mainSymbol, emotion);
        
        // 生成创意故事
        const story = this.generateStory(text, symbols, emotion);
        
        return {
            symbols,
            clarity,
            symbolInterpretation,
            emotionAnalysis,
            suggestion,
            story,
            timestamp: Date.now()
        };
    },
    
    // 情绪分析
    getEmotionAnalysis(emotion, text) {
        const emotionMap = {
            happy: { desc: '积极愉悦', advice: '保持这份好心情' },
            horror: { desc: '焦虑恐惧', advice: '尝试面对内心的恐惧' },
            fantasy: { desc: '好奇探索', advice: '保持对世界的好奇心' },
            chaos: { desc: '混乱迷茫', advice: '需要理清思绪，找到方向' }
        };
        
        const info = emotionMap[emotion] || emotionMap.fantasy;
        return `梦境整体呈现${info.desc}的情绪基调。${info.advice}。`;
    },
    
    // 生成建议
    getSuggestion(symbol, emotion) {
        const suggestions = {
            freedom: '你可能需要更多的自主空间',
            growth: '这是个人成长的好时机',
            emotion: '关注自己的情感需求',
            energy: '合理释放你的能量',
            exploration: '勇敢探索未知领域',
            aspiration: '坚持你的理想和目标',
            pressure: '适当减压，寻求帮助',
            insecurity: '建立内心的安全感',
            transformation: '接受生活中的变化'
        };
        
        return suggestions[symbol.type] || '记录梦境有助于了解自己';
    },
    
    // 生成创意故事
    generateStory(text, symbols, emotion) {
        const elements = symbols.map(s => s.keyword);
        const mainElement = elements[0] || '梦境';
        const setting = elements[1] || '神秘世界';
        
        return `在${setting}的深处，你发现了关于${mainElement}的秘密。这个梦境暗示着你的潜意识正在尝试告诉你一些重要的事情。当你醒来时，那种${emotions[emotion]?.name || '奇妙'}的感觉依然萦绕在心头...`;
    }
};

// 收藏的解析管理
const savedAnalysesManager = {
    getAll() {
        return JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
    },
    
    save(analysis) {
        const saved = this.getAll();
        const toSave = {
            id: Date.now().toString(),
            ...analysis,
            savedAt: new Date().toISOString()
        };
        saved.unshift(toSave);
        localStorage.setItem('savedAnalyses', JSON.stringify(saved));
        return toSave.id;
    },
    
    delete(id) {
        const saved = this.getAll().filter(a => a.id !== id);
        localStorage.setItem('savedAnalyses', JSON.stringify(saved));
    },
    
    getById(id) {
        return this.getAll().find(a => a.id === id);
    }
};

// 情绪配置
const emotions = {
    happy: { name: '愉快', color: '#ffd166', icon: 'happy' },
    horror: { name: '恐怖', color: '#6a0572', icon: 'horror' },
    fantasy: { name: '奇幻', color: '#d83f87', icon: 'fantasy' },
    chaos: { name: '混乱', color: '#f79d65', icon: 'chaos' }
};

// SVG图标
const icons = {
    star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
    mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    bold: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>`,
    italic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>`,
    underline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>`,
    list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    happy: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><path d="M8 14c1.5 2 3.5 3 6 3s4.5-1 6-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><polygon points="12,3 13,6 16,6 13.5,8 14.5,11 12,9 9.5,11 10.5,8 8,6 11,6" fill="currentColor"/></svg>`,
    horror: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 10l2 1-2 1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M16 10l-2 1 2 1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M9 16c1-1 2.5-1.5 4-1.5s3 .5 4 1.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><polygon points="12,3 13,6 16,6 13.5,8 14.5,11 12,9 9.5,11 10.5,8 8,6 11,6" fill="currentColor"/></svg>`,
    fantasy: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.34 6.34l1.41 1.41M16.24 16.24l1.41 1.41M6.34 17.66l1.41-1.41M16.24 7.76l1.41-1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><polygon points="12,2 13,5 16,5 13.5,7 14.5,10 12,8 9.5,10 10.5,7 8,5 11,5" fill="currentColor"/></svg>`,
    chaos: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 8l3 4-3 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 8v8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M17 8l-3 4 3 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><polygon points="12,2 13.5,5.5 17,5.5 14.25,7.75 15.25,11.25 12,9 8.75,11.25 9.75,7.75 7,5.5 10.5,5.5" fill="currentColor"/></svg>`,
    home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    fileText: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    moon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/></svg>`
};

// ============================================
// 页面渲染函数
// ============================================

// 渲染首页
function renderHome() {
    const lastDream = appState.dreams[appState.dreams.length - 1];
    const emotionStats = calculateEmotionStats();
    
    return `
        <div class="page home-page">
            <header class="home-header">
                <p class="greeting">${getGreeting()}</p>
                <h1 class="home-title">梦境宇宙</h1>
            </header>
            
            <section class="stats-grid">
                <div class="stat-card">
                    <div class="star-icon">${icons.star}</div>
                    <p class="stat-label">上次记录梦境</p>
                    <p class="stat-value">${lastDream ? formatDate(lastDream.date) : '暂无记录'}</p>
                </div>
                <div class="stat-card">
                    <div class="star-icon">${icons.star}</div>
                    <p class="stat-label">梦境时长</p>
                    <p class="stat-value">${lastDream ? formatDuration(lastDream.duration) : '0小时'}</p>
                </div>
            </section>
            
            <section class="feature-grid-new">
                <div class="feature-btn" onclick="navigateTo('record')">
                    <div class="feature-icon">
                        <svg viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="22" fill="rgba(26,54,93,0.6)" stroke="#ffd166" stroke-width="2"/>
                            <rect x="16" y="18" width="16" height="12" rx="2" stroke="#ffd166" stroke-width="2"/>
                            <line x1="19" y1="22" x2="29" y2="22" stroke="#ffd166" stroke-width="1.5"/>
                            <line x1="19" y1="26" x2="27" y2="26" stroke="#ffd166" stroke-width="1.5"/>
                            <polygon points="24,8 25.5,12 30,12 26.5,15 28,19 24,17 20,19 21.5,15 18,12 22.5,12" fill="#ffd166"/>
                        </svg>
                    </div>
                    <p class="feature-title">记录梦境</p>
                    <p class="feature-desc">捕捉每一个梦境</p>
                </div>
                <div class="feature-btn" onclick="navigateTo('analyze')">
                    <div class="feature-icon">
                        <svg viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="22" fill="rgba(200,162,200,0.4)" stroke="#C8A2C8" stroke-width="2"/>
                            <circle cx="22" cy="22" r="6" stroke="#C8A2C8" stroke-width="2"/>
                            <line x1="27" y1="27" x2="34" y2="34" stroke="#C8A2C8" stroke-width="2"/>
                            <polygon points="24,6 25.5,10 30,10 26.5,13 28,17 24,15 20,17 21.5,13 18,10 22.5,10" fill="#C8A2C8"/>
                        </svg>
                    </div>
                    <p class="feature-title">AI解析</p>
                    <p class="feature-desc">深度解读梦境</p>
                </div>
                <div class="feature-btn" onclick="navigateTo('diary')">
                    <div class="feature-icon">
                        <svg viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="22" fill="rgba(200,162,200,0.4)" stroke="#C8A2C8" stroke-width="2"/>
                            <rect x="16" y="14" width="16" height="20" rx="2" stroke="#C8A2C8" stroke-width="2"/>
                            <line x1="20" y1="14" x2="20" y2="34" stroke="#C8A2C8" stroke-width="1.5"/>
                            <line x1="24" y1="20" x2="32" y2="20" stroke="#C8A2C8" stroke-width="1.5"/>
                            <line x1="24" y1="26" x2="32" y2="26" stroke="#C8A2C8" stroke-width="1.5"/>
                            <polygon points="24,6 25.5,10 30,10 26.5,13 28,17 24,15 20,17 21.5,13 18,10 22.5,10" fill="#C8A2C8"/>
                        </svg>
                    </div>
                    <p class="feature-title">梦境日记</p>
                    <p class="feature-desc">回顾梦境历程</p>
                </div>
                <div class="feature-btn" onclick="navigateTo('share')">
                    <div class="feature-icon">
                        <svg viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="22" fill="rgba(26,54,93,0.6)" stroke="#ffd166" stroke-width="2"/>
                            <circle cx="34" cy="14" r="4" stroke="#ffd166" stroke-width="2"/>
                            <circle cx="14" cy="24" r="4" stroke="#ffd166" stroke-width="2"/>
                            <circle cx="34" cy="34" r="4" stroke="#ffd166" stroke-width="2"/>
                            <line x1="18" y1="22" x2="30" y2="16" stroke="#ffd166" stroke-width="1.5"/>
                            <line x1="18" y1="26" x2="30" y2="32" stroke="#ffd166" stroke-width="1.5"/>
                            <polygon points="24,6 25.5,10 30,10 26.5,13 28,17 24,15 20,17 21.5,13 18,10 22.5,10" fill="#ffd166"/>
                        </svg>
                    </div>
                    <p class="feature-title">共享宇宙</p>
                    <p class="feature-desc">连接集体潜意识</p>
                </div>
            </section>
            
            <section class="emotion-section">
                <h2 class="section-title"><span class="star">★</span> 梦境情绪占比</h2>
                <div class="emotion-bars">
                    ${Object.entries(emotionStats).map(([key, value]) => `
                        <div class="emotion-item">
                            <div class="emotion-icon ${key}">${icons[key]}</div>
                            <div class="emotion-bar-wrapper">
                                <div class="emotion-bar ${key}" style="width: ${value}%"></div>
                            </div>
                            <span class="emotion-percent">${value}%</span>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <section class="dream-list">
                <h2 class="section-title"><span class="star">★</span> 最近梦境</h2>
                ${appState.dreams.slice(-3).reverse().map(dream => `
                    <div class="dream-item" onclick="showDreamDetail('${dream.id}')">
                        <div class="dream-icon" style="background: ${emotions[dream.emotion]?.color || '#ffd166'}20">
                            ${icons[dream.emotion] || icons.moon}
                        </div>
                        <div class="dream-info">
                            <p class="dream-title">${dream.title || '无标题梦境'}</p>
                            <div class="dream-meta">
                                <span>${formatDate(dream.date)}</span>
                                <span class="dream-tag ${dream.emotion}">${emotions[dream.emotion]?.name || '未知'}</span>
                            </div>
                        </div>
                    </div>
                `).join('') || '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">暂无梦境记录</p>'}
            </section>
        </div>
    `;
}

// 渲染记录梦境页
function renderRecord() {
    return `
        <div class="page record-page">
            <header class="page-header">
                <button class="back-btn" onclick="navigateTo('home')">${icons.back}</button>
                <h1 class="page-title">记录梦境</h1>
            </header>
            
            <form id="dream-form" onsubmit="saveDream(event)">
                <div class="form-group">
                    <label class="form-label">梦境标题</label>
                    <input type="text" class="input" id="dream-title" placeholder="给你的梦境起个名字..." required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">梦境日期</label>
                    <input type="date" class="input" id="dream-date" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">梦境时长（小时）</label>
                    <input type="number" class="input" id="dream-duration" min="0" max="24" step="0.5" value="0" placeholder="请输入梦境时长（0-24小时）">
                </div>
                
                <div class="form-group" style="position: relative; min-height: 40vh;">
                    <label class="form-label">梦境内容 <span style="font-size: 11px; color: var(--text-secondary); font-weight: normal;">(支持语音输入，推荐 Chrome/Safari)</span></label>
                    <div class="editor-toolbar">
                        <button type="button" class="toolbar-btn" onclick="formatText('bold')" title="粗体">${icons.bold}</button>
                        <button type="button" class="toolbar-btn" onclick="formatText('italic')" title="斜体">${icons.italic}</button>
                        <button type="button" class="toolbar-btn" onclick="formatText('underline')" title="下划线">${icons.underline}</button>
                        <button type="button" class="toolbar-btn" onclick="formatText('insertUnorderedList')" title="列表">${icons.list}</button>
                    </div>
                    <div class="textarea textarea-with-toolbar" id="dream-content" contenteditable="true" placeholder="详细描述你的梦境..." style="min-height: 200px;"></div>
                    <button type="button" class="voice-btn" id="voice-btn" onclick="toggleVoiceInput()" title="点击开始语音输入">
                        <span class="mic-icon">${icons.mic}</span>
                        <span class="stop-icon" style="display: none;">⏹</span>
                    </button>
                </div>
                
                <div class="form-group">
                    <label class="form-label">梦境情绪</label>
                    <div class="emotion-selector">
                        ${Object.entries(emotions).map(([key, emotion]) => `
                            <div class="emotion-option ${key}" onclick="selectEmotion('${key}')" data-emotion="${key}">
                                <div class="icon-wrapper">${icons[key]}</div>
                                <span class="label">${emotion.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">清晰度评分</label>
                    <div class="clarity-rating" id="clarity-rating">
                        ${[1,2,3,4,5].map(i => `
                            <div class="star-rating" onclick="setClarity(${i})" data-rating="${i}">
                                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-wrapper" onclick="toggleCheckbox(this)">
                        <div class="checkbox" id="recurring-check">
                            ${icons.check}
                        </div>
                        <span class="checkbox-label">这是重复出现的梦境</span>
                    </label>
                </div>
                
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 24px; padding: 10px 20px; font-size: 14px;">
                    <span style="display:inline-block;width:16px;height:16px;vertical-align:middle;margin-right:6px;">${icons.star}</span>保存梦境
                </button>
            </form>
        </div>
    `;
}

// 渲染AI解析页
function renderAnalyze() {
    return `
        <div class="page analyze-page">
            <header class="page-header">
                <button class="back-btn" onclick="navigateTo('home')">${icons.back}</button>
                <h1 class="page-title">AI梦境解析</h1>
            </header>
            
            <div class="analyze-container" style="min-height: 70vh; display: flex; flex-direction: column;">
                <div class="analyze-input-area" style="flex: 1; display: flex; flex-direction: column;">
                    <label class="form-label">输入你的梦境</label>
                    <textarea class="textarea" id="analyze-input" style="flex: 1; min-height: 300px;" placeholder="描述你的梦境，AI将为你深度解析..."></textarea>
                </div>
                <button class="btn btn-primary analyze-btn" onclick="analyzeDream()" style="margin-top: 20px;">
                    <span style="display:inline-block;width:20px;height:20px;vertical-align:middle;margin-right:8px;">${icons.brain}</span>开始解析
                </button>
            </div>
            
            <div id="analysis-result"></div>
        </div>
    `;
}

// 渲染梦境日记页
function renderDiary() {
    const filteredDreams = filterDreams();
    const patternAnalysis = analyzeDreamPatterns();
    const savedAnalyses = savedAnalysesManager.getAll();
    const savedStories = JSON.parse(localStorage.getItem('savedUniverseStories') || '[]');
    
    return `
        <div class="page diary-page">
            <header class="page-header">
                <button class="back-btn" onclick="navigateTo('home')">${icons.back}</button>
                <h1 class="page-title">梦境日记</h1>
            </header>
            
            <!-- 收藏的梦境宇宙故事区域 -->
            ${savedStories.length > 0 ? `
                <div class="card saved-stories-card" style="margin-bottom: 20px; border: 1px solid rgba(139, 92, 246, 0.4); background: linear-gradient(145deg, rgba(26,26,62,0.95) 0%, rgba(139,92,246,0.1) 100%);">
                    <h3 class="section-title" style="margin-bottom: 16px; font-size: 16px; display: flex; justify-content: space-between; align-items: center;">
                        <span>
                            <span style="display:inline-block;width:18px;height:18px;vertical-align:middle;margin-right:6px;">🌌</span>收藏的梦境宇宙
                        </span>
                        <span style="font-size: 12px; color: var(--text-secondary);">${savedStories.length} 个故事</span>
                    </h3>
                    <div class="saved-stories-list" style="max-height: 300px; overflow-y: auto;">
                        ${savedStories.slice().reverse().slice(0, 3).map((story, idx) => `
                            <div class="saved-story-item" style="margin-bottom: 12px; padding: 14px; background: rgba(139,92,246,0.1); border-radius: 12px; cursor: pointer; border: 1px solid rgba(139,92,246,0.2);" onclick="showSavedStoryDetail('${story.id}')">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                    <span style="font-weight: 600; font-size: 14px; color: #a78bfa;">${story.title || '梦境宇宙故事'}</span>
                                    <button onclick="event.stopPropagation(); deleteSavedStory('${story.id}')" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 4px; font-size: 14px;">✕</button>
                                </div>
                                <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 10px;">
                                    ${story.content?.substring(0, 80) || '暂无内容'}...
                                </p>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                                        ${story.parts?.slice(0, 2).map(part => `
                                            <span style="padding: 3px 8px; background: ${part.emotionColor}30; color: ${part.emotionColor}; border-radius: 10px; font-size: 10px;">${part.emotionName}</span>
                                        `).join('') || ''}
                                    </div>
                                    <span style="font-size: 10px; color: var(--light-purple);">${formatDate(story.savedAt?.split('T')[0])}</span>
                                </div>
                            </div>
                        `).join('')}
                        ${savedStories.length > 3 ? `
                            <button class="btn btn-secondary" onclick="showAllSavedStories()" style="width: 100%; padding: 10px; font-size: 13px;">
                                查看全部 ${savedStories.length} 个宇宙故事
                            </button>
                        ` : ''}
                    </div>
                </div>
            ` : ''}
            
            <!-- 收藏的梦境解析区域 -->
            ${savedAnalyses.length > 0 ? `
                <div class="card saved-analyses-card" style="margin-bottom: 20px; border: 1px solid rgba(255,209,102,0.3);">
                    <h3 class="section-title" style="margin-bottom: 16px; font-size: 16px; display: flex; justify-content: space-between; align-items: center;">
                        <span>
                            <span style="display:inline-block;width:18px;height:18px;vertical-align:middle;margin-right:6px;">${icons.star}</span>收藏的解析
                        </span>
                        <span style="font-size: 12px; color: var(--text-secondary);">${savedAnalyses.length} 个</span>
                    </h3>
                    <div class="saved-analyses-list" style="max-height: 300px; overflow-y: auto;">
                        ${savedAnalyses.slice(0, 3).map(analysis => `
                            <div class="saved-analysis-item" style="margin-bottom: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 10px; cursor: pointer;" onclick="showSavedAnalysisDetail('${analysis.id}')">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                    <span style="font-weight: 600; font-size: 14px; color: var(--yellow);">${analysis.title || '梦境解析'}</span>
                                    <button onclick="event.stopPropagation(); deleteSavedAnalysis('${analysis.id}')" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 4px;">✕</button>
                                </div>
                                <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                    ${analysis.symbolInterpretation?.substring(0, 60) || '暂无解析内容'}...
                                </p>
                                <div style="margin-top: 8px; display: flex; gap: 6px;">
                                    <span style="font-size: 10px; color: var(--light-purple);">${formatDate(analysis.savedAt?.split('T')[0])}</span>
                                    ${analysis.clarity ? `<span style="font-size: 10px; color: var(--yellow);">清晰度: ${analysis.clarity}</span>` : ''}
                                </div>
                            </div>
                        `).join('')}
                        ${savedAnalyses.length > 3 ? `
                            <button class="btn btn-secondary" onclick="showAllSavedAnalyses()" style="width: 100%; padding: 10px; font-size: 13px;">
                                查看全部 ${savedAnalyses.length} 个收藏
                            </button>
                        ` : ''}
                    </div>
                </div>
            ` : ''}
            
            <!-- 梦境模式识别卡片 -->
            <div class="card pattern-card" style="margin-bottom: 20px;">
                <h3 class="section-title" style="margin-bottom: 16px; font-size: 16px;">
                    <span style="display:inline-block;width:18px;height:18px;vertical-align:middle;margin-right:6px;">${icons.brain}</span>梦境模式识别
                </h3>
                ${patternAnalysis.hasData ? `
                    <div class="pattern-list">
                        ${patternAnalysis.patterns.map(pattern => `
                            <div class="pattern-item" style="margin-bottom: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                    <span style="font-size: 18px;">${pattern.icon}</span>
                                    <span style="font-weight: 600; font-size: 14px;">${pattern.title}</span>
                                </div>
                                <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.6;">${pattern.description}</p>
                                <div style="margin-top: 8px; display: flex; gap: 6px; flex-wrap: wrap;">
                                    ${pattern.tags.map(tag => `
                                        <span style="padding: 3px 10px; background: ${tag.color}30; color: ${tag.color}; border-radius: 10px; font-size: 11px;">${tag.text}</span>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <p style="text-align: center; color: var(--text-secondary); font-size: 13px; padding: 20px;">
                        记录更多梦境后，AI将为您分析梦境模式
                    </p>
                `}
            </div>
            
            <div class="filter-bar">
                <button class="filter-btn ${appState.filters.emotion === 'all' ? 'active' : ''}" onclick="setFilter('emotion', 'all')">全部</button>
                ${Object.entries(emotions).map(([key, emotion]) => `
                    <button class="filter-btn ${appState.filters.emotion === key ? 'active' : ''}" onclick="setFilter('emotion', '${key}')">${emotion.name}</button>
                `).join('')}
            </div>
            
            <div class="timeline">
                ${filteredDreams.map((dream, index) => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                                <p class="timeline-date">${formatDate(dream.date)} <span style="display:inline-block;width:14px;height:14px;vertical-align:middle;margin-left:4px;">${icons.calendar}</span></p>
                                <button class="dream-delete-btn" data-dream-id="${dream.id}" style="background: rgba(255,68,68,0.2); border: none; color: #ff6666; cursor: pointer; padding: 4px 8px; border-radius: 6px; font-size: 11px; z-index: 10;">删除</button>
                            </div>
                            <div onclick="showDreamDetail('${dream.id}')" style="cursor: pointer;">
                                <p class="timeline-title">${dream.title || '无标题梦境'}</p>
                                <p class="timeline-preview">${stripHtml(dream.content).substring(0, 100)}...</p>
                                <div style="margin-top: 8px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                    <span class="dream-tag ${dream.emotion}">${emotions[dream.emotion]?.name || '未知'}</span>
                                    ${dream.clarity ? `<span style="font-size: 11px; color: var(--yellow);">${'★'.repeat(dream.clarity)}</span>` : ''}
                                    ${dream.realityCheck?.cameTrue === true ? `
                                        <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 12px; font-size: 11px; background: linear-gradient(135deg, #ffd166 0%, #ff9f43 100%); color: #1a1a3e; font-weight: 600;">
                                            <span>⭐</span> 已成真
                                        </span>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('') || '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">暂无符合条件的梦境</p>'}
            </div>
            
            <div class="export-actions">
                <button class="btn btn-secondary" onclick="exportDreams('pdf')">
                    <span style="display:inline-block;width:16px;height:16px;vertical-align:middle;margin-right:6px;">${icons.download}</span>导出PDF
                </button>
                <button class="btn btn-secondary" onclick="exportDreams('markdown')">
                    <span style="display:inline-block;width:16px;height:16px;vertical-align:middle;margin-right:6px;">${icons.fileText}</span>导出Markdown
                </button>
            </div>
        </div>
    `;
}

// 伪随机数生成器（支持种子）
function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// 打乱数组（使用种子）
function shuffleArray(array, seed) {
    const arr = [...array];
    let currentIndex = arr.length;
    let randomIndex;
    let s = seed || Date.now();
    
    while (currentIndex > 0) {
        randomIndex = Math.floor(seededRandom(s) * currentIndex);
        s++;
        currentIndex--;
        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
    return arr;
}

// 生成梦境宇宙故事
function generateDreamUniverseStory() {
    const allDreams = [...appState.sharedDreams];
    if (allDreams.length < 3) {
        return null;
    }
    
    // 使用种子来生成不同的故事
    const seed = appState.universeStorySeed || Date.now();
    const rng = () => seededRandom(seed + Math.floor(Math.random() * 1000));
    
    // 按情绪分组
    const emotionGroups = {};
    allDreams.forEach(dream => {
        const emotion = dream.emotion || 'fantasy';
        if (!emotionGroups[emotion]) {
            emotionGroups[emotion] = [];
        }
        emotionGroups[emotion].push(dream);
    });
    
    // 选择主要情绪（数量最多的），如果有多个相同数量的随机选择
    const sortedEmotions = Object.entries(emotionGroups)
        .sort((a, b) => b[1].length - a[1].length);
    const topEmotions = sortedEmotions.filter(e => e[1].length === sortedEmotions[0][1].length);
    const mainEmotion = topEmotions.length > 1 
        ? topEmotions[Math.floor(rng() * topEmotions.length)] 
        : sortedEmotions[0];
    
    if (!mainEmotion || mainEmotion[1].length < 2) {
        return null;
    }
    
    // 随机打乱并选择梦境
    const shuffledDreams = shuffleArray(mainEmotion[1], seed);
    const selectedDreams = shuffledDreams.slice(0, Math.min(5, shuffledDreams.length));
    
    const emotionName = emotions[mainEmotion[0]]?.name || '奇幻';
    const emotionColor = emotions[mainEmotion[0]]?.color || '#d83f87';
    const emotionIcon = emotions[mainEmotion[0]]?.icon || '✨';
    
    // 关键词库 - 根据不同的情绪类型选择不同的关键词
    const keywordSets = {
        fantasy: ['星空', '魔法', '奇境', '幻影', '梦境', '水晶', '彩虹', '翅膀'],
        anxiety: ['迷雾', '迷宫', '深渊', '迷雾', '风暴', '暗影', '迷雾', '迷雾'],
        joy: ['阳光', '花园', '乐园', '星光', '花海', '云端', '彩虹', '糖果'],
        fear: ['黑暗', '迷宫', '深渊', '荒原', '废墟', '暗影', '深渊', '迷雾'],
        calm: ['湖泊', '月光', '森林', '微风', '竹林', '溪流', '晨雾', '星空'],
        adventure: ['山脉', '海洋', '宝藏', '探险', '峡谷', '荒原', '遗迹', '航船'],
        mystery: ['古堡', '秘境', '时光', '迷雾', '回廊', '镜中', '虚空', '深渊'],
        sadness: ['雨夜', '落叶', '潮汐', '暮色', '孤城', '彼岸', '晚风', '残月']
    };
    
    const keywords = keywordSets[mainEmotion[0]] || keywordSets.fantasy;
    const selectedKeywords = shuffleArray(keywords, seed + 1).slice(0, 3);
    
    // 故事开头模板
    const storyIntros = [
        `在${selectedKeywords[0]}与${selectedKeywords[1]}交织的维度，`,
        `当${selectedKeywords[0]}的光芒穿透${selectedKeywords[1]}的迷雾，`,
        `穿越${selectedKeywords[0]}的边界，抵达${selectedKeywords[1]}的核心，`,
        `在${selectedKeywords[0]}的深处，${selectedKeywords[1]}悄然绽放，` ,
        `${selectedKeywords[0]}与${selectedKeywords[1]}共鸣，开启了一段` ,
        `从${selectedKeywords[0]}出发，穿越${selectedKeywords[1]}的旅程，` 
    ];
    const storyIntro = storyIntros[Math.floor(rng() * storyIntros.length)];
    
    // 故事结尾模板
    const storyOutros = [
        `最终，一切归于${selectedKeywords[2]}的宁静。`,
        `而在${selectedKeywords[2]}的尽头，新的故事正在孕育。`,
        `这就是${selectedKeywords[2]}的启示。`,
        `留下的，只有${selectedKeywords[2]}的回响。`,
        `${selectedKeywords[2]}见证了一切。`,
        `当${selectedKeywords[2]}再次升起，轮回继续。`
    ];
    const storyOutro = storyOutros[Math.floor(rng() * storyOutros.length)];
    
    // 生成故事段落
    const transitions = [
        `在${selectedKeywords[0]}的深处，`,
        `穿过${selectedKeywords[1]}的迷雾，`,
        `当${selectedKeywords[0]}的光芒洒落，`,
        `随着${selectedKeywords[1]}的律动，`,
        `在${selectedKeywords[2]}的尽头，`
    ];
    
    const storyParts = selectedDreams.map((dream, index) => {
        const shuffledTransitions = shuffleArray(transitions, seed + index);
        const emotionData = emotions[dream.emotion] || emotions.fantasy;
        return {
            transition: shuffledTransitions[0],
            content: dream.content.substring(0, 100) + (dream.content.length > 100 ? '...' : ''),
            emotion: dream.emotion,
            emotionName: emotionData.name,
            emotionColor: emotionData.color,
            emotionIcon: emotionData.icon
        };
    });
    
    // 生成完整的故事内容
    const fullStory = `${storyIntro}\n\n` + 
        storyParts.map((part, idx) => 
            `${idx + 1}. ${part.transition}${part.content}`
        ).join('\n\n') + 
        `\n\n${storyOutro}`;
    
    return {
        title: `${emotionName}梦境宇宙：${selectedKeywords.join('·')}`,
        emotion: mainEmotion[0],
        emotionName,
        emotionColor,
        emotionIcon,
        parts: storyParts,
        dreamCount: selectedDreams.length,
        keywords: selectedKeywords,
        content: fullStory,
        intro: storyIntro,
        outro: storyOutro,
        seed: seed
    };
}

// 渲染共享梦境页
function renderShare() {
    const universeStory = generateDreamUniverseStory();
    
    return `
        <div class="page share-page">
            <header class="share-header">
                <h1 class="share-title">共享梦境宇宙</h1>
                <p class="share-subtitle">连接集体潜意识，探索共同的梦境</p>
            </header>
            
            <!-- AI梦境宇宙故事 -->
            ${universeStory ? `
                <div class="universe-story-card" style="background: linear-gradient(145deg, rgba(26,26,62,0.95) 0%, ${universeStory.emotionColor}20 100%); border: 2px solid ${universeStory.emotionColor}50; border-radius: 24px; padding: 24px; margin-bottom: 24px; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -50%; right: -30%; width: 300px; height: 300px; background: radial-gradient(circle, ${universeStory.emotionColor}30 0%, transparent 70%); pointer-events: none;"></div>
                    
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 48px; height: 48px; border-radius: 50%; background: ${universeStory.emotionColor}30; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                            🌌
                        </div>
                        <div>
                            <h3 style="font-size: 18px; font-weight: 700; margin: 0; color: ${universeStory.emotionColor};">${universeStory.title}</h3>
                            <p style="font-size: 12px; color: var(--text-secondary); margin: 4px 0 0 0;">由 ${universeStory.dreamCount} 个${universeStory.emotionName}梦境编织而成</p>
                        </div>
                    </div>
                    
                    <div class="story-content" style="background: rgba(0,0,0,0.3); border-radius: 16px; padding: 20px; margin-bottom: 16px;">
                        ${universeStory.parts.map((part, index) => `
                            <div class="story-part" style="margin-bottom: ${index < universeStory.parts.length - 1 ? '16px' : '0'}; padding-bottom: ${index < universeStory.parts.length - 1 ? '16px' : '0'}; border-bottom: ${index < universeStory.parts.length - 1 ? '1px dashed rgba(255,255,255,0.1)' : 'none'};">
                                <p style="font-size: 13px; color: ${universeStory.emotionColor}; margin-bottom: 6px; font-style: italic;">${part.transition}</p>
                                <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.7; margin: 0;">${part.content}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
                        ${universeStory.keywords.map(keyword => `
                            <span style="padding: 6px 14px; background: ${universeStory.emotionColor}20; color: ${universeStory.emotionColor}; border-radius: 20px; font-size: 12px; border: 1px solid ${universeStory.emotionColor}40;">✨ ${keyword}</span>
                        `).join('')}
                    </div>
                    
                    <div style="display: flex; gap: 12px;">
                        <button class="btn btn-primary" onclick="regenerateUniverseStory()" style="flex: 1; padding: 12px; font-size: 13px;">
                            <span style="display:inline-block;width:16px;height:16px;vertical-align:middle;margin-right:6px;">🔄</span>重新编织
                        </button>
                        <button class="btn btn-secondary" onclick="saveUniverseStory()" style="flex: 1; padding: 12px; font-size: 13px;">
                            <span style="display:inline-block;width:16px;height:16px;vertical-align:middle;margin-right:6px;">${icons.book}</span>收藏故事
                        </button>
                    </div>
                </div>
            ` : `
                <div class="universe-story-card" style="background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: 24px; padding: 32px; margin-bottom: 24px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🌌</div>
                    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">梦境宇宙正在形成中</h3>
                    <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">当共享梦境达到3个以上时，AI将为您编织连贯的梦境宇宙故事</p>
                    <p style="font-size: 12px; color: var(--text-secondary);">当前已有 ${appState.sharedDreams.length} 个共享梦境</p>
                </div>
            `}
            
            <div class="share-input-area">
                <textarea class="share-textarea" id="share-content" placeholder="分享你的梦境到宇宙..."></textarea>
                <div class="share-actions">
                    <label class="anonymous-toggle">
                        <input type="checkbox" id="anonymous-check" checked style="accent-color: var(--yellow);">
                        <span>匿名分享</span>
                    </label>
                    <button class="btn btn-primary" onclick="shareDream()">
                        <span style="display:inline-block;width:18px;height:18px;vertical-align:middle;margin-right:6px;">${icons.share}</span>发布
                    </button>
                </div>
            </div>
            
            <div class="sensitive-warning">
                <span style="display:inline-block;width:20px;height:20px;vertical-align:middle;margin-right:8px;">${icons.warning}</span>
                <p>请注意：分享内容将由社区共同维护，请勿分享涉及个人隐私或敏感信息的内容。</p>
            </div>
            
            <div class="dream-pool">
                <div class="pool-header">
                    <h3 class="pool-title">集体梦境池</h3>
                    <span class="pool-count">${appState.sharedDreams.length} 个梦境</span>
                </div>
                <div class="pool-grid">
                    ${appState.sharedDreams.slice().reverse().map(dream => `
                        <div class="pool-item">
                            <p class="pool-content">${dream.content}</p>
                            <div class="pool-meta">
                                <div class="pool-tags">
                                    <span class="pool-tag" style="background: ${emotions[dream.emotion]?.color || '#ffd166'}30; color: ${emotions[dream.emotion]?.color || '#ffd166'}">
                                        ${emotions[dream.emotion]?.name || '未知'}
                                    </span>
                                </div>
                                <span>${formatTimeAgo(dream.timestamp)}</span>
                            </div>
                        </div>
                    `).join('') || '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">暂无共享梦境</p>'}
                </div>
            </div>
        </div>
    `;
}

// ============================================
// 工具函数
// ============================================

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了，愿你好梦';
    if (hour < 12) return '早安，记得记录昨晚的梦境';
    if (hour < 18) return '下午好，今天有午睡做梦吗';
    return '晚上好，准备记录今晚的梦境';
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const diff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return '今天';
    if (diff === 1) return '昨天';
    if (diff < 7) return `${diff}天前`;
    
    return `${date.getMonth() + 1}月${date.getDate()}日`;
}

// 格式化时长显示
function formatDuration(duration) {
    // 处理旧数据（字符串格式如 "2小时"）
    if (typeof duration === 'string') {
        // 如果已经包含"小时"，直接返回
        if (duration.includes('小时')) {
            return duration;
        }
        // 否则尝试解析数字
        const num = parseFloat(duration);
        if (!isNaN(num)) {
            return num + '小时';
        }
        return '0小时';
    }
    // 处理新数据（数字格式）
    if (typeof duration === 'number') {
        return duration + '小时';
    }
    // 默认返回0小时
    return '0小时';
}

function formatTimeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return new Date(timestamp).toLocaleDateString();
}

function calculateEmotionStats() {
    const stats = { happy: 0, horror: 0, fantasy: 0, chaos: 0 };
    const total = appState.dreams.length;
    
    if (total === 0) return { happy: 25, horror: 25, fantasy: 25, chaos: 25 };
    
    appState.dreams.forEach(dream => {
        if (stats[dream.emotion] !== undefined) {
            stats[dream.emotion]++;
        }
    });
    
    return {
        happy: Math.round((stats.happy / total) * 100) || 0,
        horror: Math.round((stats.horror / total) * 100) || 0,
        fantasy: Math.round((stats.fantasy / total) * 100) || 0,
        chaos: Math.round((stats.chaos / total) * 100) || 0
    };
}

function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function filterDreams() {
    let dreams = [...appState.dreams];
    
    if (appState.filters.emotion !== 'all') {
        dreams = dreams.filter(d => d.emotion === appState.filters.emotion);
    }
    
    return dreams.reverse();
}

// ============================================
// 交互功能
// ============================================

function navigateTo(page) {
    appState.currentPage = page;
    
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    
    // 渲染页面
    const mainContent = document.getElementById('main-content');
    switch(page) {
        case 'home':
            mainContent.innerHTML = renderHome();
            break;
        case 'record':
            mainContent.innerHTML = renderRecord();
            break;
        case 'analyze':
            mainContent.innerHTML = renderAnalyze();
            break;
        case 'diary':
            mainContent.innerHTML = renderDiary();
            // 绑定删除按钮事件
            setTimeout(() => {
                bindDiaryEvents();
            }, 0);
            break;
        case 'share':
            mainContent.innerHTML = renderShare();
            break;
    }
    
    // 滚动到顶部
    window.scrollTo(0, 0);
}

function selectEmotion(emotion) {
    appState.currentEmotion = emotion;
    document.querySelectorAll('.emotion-option').forEach(el => {
        el.classList.toggle('selected', el.dataset.emotion === emotion);
    });
}

function setClarity(rating) {
    appState.clarityRating = rating;
    document.querySelectorAll('.star-rating').forEach((el, index) => {
        el.classList.toggle('active', index < rating);
    });
}

function toggleCheckbox(wrapper) {
    const checkbox = wrapper.querySelector('.checkbox');
    checkbox.classList.toggle('checked');
}

function formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById('dream-content').focus();
}

// 语音识别相关变量
let recognition = null;
let isRecognitionSupported = false;
let isMobile = false;

// 检测是否为移动设备
function checkIsMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 检测浏览器类型
function checkBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    return {
        isQQ: /qq/i.test(ua) && /browser/i.test(ua),
        isBaidu: /baidu/i.test(ua) || /bdbrowser/i.test(ua),
        isWechat: /micromessenger/i.test(ua),
        isUC: /ucbrowser/i.test(ua),
        isChrome: /chrome/i.test(ua) && !/edge|qq|baidu|ucbrowser/i.test(ua),
        isSafari: /safari/i.test(ua) && !/chrome/i.test(ua),
        isEdge: /edg/i.test(ua)
    };
}

// 初始化语音识别
function initSpeechRecognition() {
    // 检查浏览器支持
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        isRecognitionSupported = false;
        console.log('当前浏览器不支持语音识别功能');
        return false;
    }
    
    isRecognitionSupported = true;
    isMobile = checkIsMobile();
    
    // 如果已存在，先停止
    if (recognition) {
        try {
            recognition.stop();
        } catch (e) {}
    }
    
    recognition = new SpeechRecognition();
    
    // 配置语音识别 - 移动端优化
    recognition.continuous = false;  // 移动端不支持 continuous，每次识别一句话
    recognition.interimResults = true;  // 返回临时结果
    recognition.lang = 'zh-CN';  // 设置语言为中文
    recognition.maxAlternatives = 1;
    
    // 识别结果处理
    recognition.onresult = (event) => {
        const contentDiv = document.getElementById('dream-content');
        if (!contentDiv) return;
        
        let finalTranscript = '';
        let interimTranscript = '';
        
        // 遍历所有结果
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        
        console.log('识别中... 最终:', finalTranscript, '临时:', interimTranscript);
        
        // 获取当前纯文本内容
        let currentText = contentDiv.innerText || contentDiv.textContent || '';
        // 移除之前的临时结果标记（匹配"识别中"或"正在识别"）
        currentText = currentText.replace(/\[(正在)?识别中\.\.\.[^\]]*\]/g, '').trim();
        
        // 添加最终识别结果
        if (finalTranscript) {
            const separator = currentText ? ' ' : '';
            const newText = currentText + separator + finalTranscript;
            contentDiv.innerText = newText;
            console.log('✅ 语音识别结果:', finalTranscript);
            showToast('✅ 识别成功');
        }
        
        // 显示临时结果（正在识别的内容）- 使用简洁格式
        if (interimTranscript && !finalTranscript) {
            const displayText = currentText + (currentText ? ' ' : '') + interimTranscript;
            if (!contentDiv.dataset.realContent) {
                contentDiv.dataset.realContent = currentText;
            }
            contentDiv.innerText = displayText;
        }
    };
    
    // 识别开始
    recognition.onstart = () => {
        appState.isRecording = true;
        updateVoiceButtonState(true);
        showToast('🎤 正在聆听，请说话...');
        console.log('✅ 语音识别已开始 - 请说话');
    };
    
    // 识别结束
    recognition.onend = () => {
        console.log('语音识别结束');
        
        // 清除临时结果标记
        const contentDiv = document.getElementById('dream-content');
        if (contentDiv) {
            // 恢复真实内容（移除临时识别标记）- 匹配"识别中"或"正在识别"
            let text = contentDiv.innerText || contentDiv.textContent || '';
            text = text.replace(/\[(正在)?识别中\.\.\.[^\]]*\]/g, '').trim();
            if (contentDiv.dataset.realContent) {
                contentDiv.innerText = contentDiv.dataset.realContent;
                delete contentDiv.dataset.realContent;
            } else {
                contentDiv.innerText = text;
            }
        }
        
        // 移动端：自动重启以持续监听
        if (isMobile && appState.isRecording) {
            setTimeout(() => {
                if (appState.isRecording) {
                    try {
                        recognition.start();
                        console.log('移动端语音识别自动重启');
                    } catch (e) {
                        console.error('重启失败:', e);
                        appState.isRecording = false;
                        updateVoiceButtonState(false);
                        showToast('🛑 录音已停止');
                    }
                }
            }, 200);
        } else if (!appState.isRecording) {
            updateVoiceButtonState(false);
            showToast('🛑 录音已停止');
        }
    };
    
    // 识别错误
    recognition.onerror = (event) => {
        console.error('❌ 语音识别错误:', event.error, event.message || '');
        
        if (event.error === 'not-allowed') {
            showToast('❌ 请允许使用麦克风权限');
            stopVoiceInput();
        } else if (event.error === 'no-speech') {
            showToast('⚠️ 未检测到语音，请大声说话');
            // 没有检测到语音，在移动端自动重启
            if (isMobile && appState.isRecording) {
                setTimeout(() => {
                    try {
                        recognition.start();
                    } catch (e) {}
                }, 200);
            }
            return;
        } else if (event.error === 'network') {
            showToast('❌ 网络错误，请检查网络连接');
            stopVoiceInput();
        } else if (event.error === 'aborted') {
            // 用户中止，不显示错误
            return;
        } else if (event.error === 'service-not-allowed') {
            showToast('❌ 语音识别服务不可用');
            stopVoiceInput();
        } else {
            showToast('❌ 识别出错: ' + event.error);
            stopVoiceInput();
        }
    };
    
    return true;
}

// 更新录音按钮状态
function updateVoiceButtonState(isRecording) {
    const btn = document.getElementById('voice-btn');
    if (!btn) return;
    
    const micIcon = btn.querySelector('.mic-icon');
    const stopIcon = btn.querySelector('.stop-icon');
    
    if (isRecording) {
        btn.classList.add('recording');
        if (micIcon) micIcon.style.display = 'none';
        if (stopIcon) stopIcon.style.display = 'block';
    } else {
        btn.classList.remove('recording');
        if (micIcon) micIcon.style.display = 'block';
        if (stopIcon) stopIcon.style.display = 'none';
    }
}

// 停止语音输入
function stopVoiceInput() {
    appState.isRecording = false;
    
    if (recognition) {
        try {
            recognition.stop();
        } catch (e) {
            // 忽略停止错误
        }
    }
    
    updateVoiceButtonState(false);
    
    // 清除临时结果标记并恢复真实内容
    const contentDiv = document.getElementById('dream-content');
    if (contentDiv) {
        // 移除临时识别标记 - 匹配"识别中"或"正在识别"
        let text = contentDiv.innerText || contentDiv.textContent || '';
        text = text.replace(/\[(正在)?识别中\.\.\.[^\]]*\]/g, '').trim();
        if (contentDiv.dataset.realContent) {
            contentDiv.innerText = contentDiv.dataset.realContent;
            delete contentDiv.dataset.realContent;
        } else {
            contentDiv.innerText = text;
        }
    }
    
    // 移动端：完全重新创建 recognition 对象
    if (isMobile) {
        recognition = null;
    }
}

// 切换语音输入
function toggleVoiceInput() {
    const browser = checkBrowser();
    
    // 检测国产浏览器，给出提示
    if (browser.isQQ || browser.isBaidu || browser.isUC) {
        const browserName = browser.isQQ ? 'QQ浏览器' : browser.isBaidu ? '百度浏览器' : 'UC浏览器';
        
        // 尝试初始化
        if (!recognition || isMobile) {
            if (!initSpeechRecognition()) {
                showToast(`❌ ${browserName}不支持语音功能\n请使用系统浏览器 Chrome/Safari`);
                return;
            }
        }
        
        // 国产浏览器尝试启动，但可能会失败
        try {
            recognition.start();
            console.log('语音识别启动成功');
        } catch (e) {
            console.error('启动失败:', e);
            // 国产浏览器可能不支持，提示用户切换
            showToast(`⚠️ ${browserName}可能不支持语音输入\n建议使用 Chrome/Safari 浏览器`);
            return;
        }
        
        showToast(`🎤 正在尝试语音识别...\n如果不工作，请换用 Chrome/Safari`);
        return;
    }
    
    // 微信内置浏览器也不支持
    if (browser.isWechat) {
        showToast('❌ 微信内置浏览器不支持语音功能\n请点击右上角 "在浏览器打开"');
        return;
    }
    
    // 每次点击都重新初始化（移动端需要）
    if (!recognition || isMobile) {
        if (!initSpeechRecognition()) {
            showToast('❌ 您的浏览器不支持语音识别\n请使用 Chrome/Safari/Edge');
            return;
        }
    }
    
    if (appState.isRecording) {
        // 停止录音
        stopVoiceInput();
    } else {
        // 先尝试直接启动（移动端有时不需要显式权限请求）
        try {
            recognition.start();
            console.log('语音识别启动成功');
        } catch (e) {
            console.error('直接启动失败，尝试请求权限:', e);
            // 请求麦克风权限并启动
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(() => {
                        // 权限获取成功，重新初始化并启动
                        initSpeechRecognition();
                        setTimeout(() => {
                            try {
                                recognition.start();
                            } catch (err) {
                                console.error('启动失败:', err);
                                showToast('❌ 启动失败，请重试');
                            }
                        }, 100);
                    })
                    .catch((err) => {
                        console.error('麦克风权限错误:', err);
                        showToast('❌ 请允许麦克风权限');
                    });
            } else {
                showToast('❌ 无法访问麦克风');
            }
        }
    }
}

function saveDream(event) {
    event.preventDefault();
    
    const title = document.getElementById('dream-title').value;
    const date = document.getElementById('dream-date').value;
    const content = document.getElementById('dream-content').innerHTML;
    const isRecurring = document.getElementById('recurring-check').classList.contains('checked');
    const durationInput = document.getElementById('dream-duration').value;
    
    // 处理时长：限制0-24，默认为0
    let duration = parseFloat(durationInput) || 0;
    if (duration < 0) duration = 0;
    if (duration > 24) duration = 24;
    
    if (!appState.currentEmotion) {
        showToast('请选择梦境情绪');
        return;
    }
    
    const dream = {
        id: Date.now().toString(),
        title,
        date,
        content,
        emotion: appState.currentEmotion,
        clarity: appState.clarityRating,
        isRecurring,
        duration: duration,
        createdAt: Date.now()
    };
    
    appState.dreams.push(dream);
    localStorage.setItem('dreams', JSON.stringify(appState.dreams));
    
    showToast('✨ 梦境已保存！');
    
    // 重置表单
    appState.currentEmotion = null;
    appState.clarityRating = 0;
    
    setTimeout(() => navigateTo('home'), 1000);
}

// 梦境主题关键词映射
const dreamThemes = {
    '飞': { theme: 'flying', color: '#87CEEB', elements: ['clouds', 'sky', 'wings', 'birds'] },
    '翔': { theme: 'flying', color: '#87CEEB', elements: ['clouds', 'sky', 'wings', 'birds'] },
    '水': { theme: 'water', color: '#4682B4', elements: ['ocean', 'waves', 'fish', 'mermaid'] },
    '海': { theme: 'water', color: '#4682B4', elements: ['ocean', 'waves', 'fish', 'mermaid'] },
    '火': { theme: 'fire', color: '#FF6347', elements: ['flames', 'phoenix', 'volcano', 'sun'] },
    '森林': { theme: 'forest', color: '#228B22', elements: ['trees', 'animals', 'fairy', 'mushrooms'] },
    '树': { theme: 'forest', color: '#228B22', elements: ['trees', 'animals', 'fairy', 'mushrooms'] },
    '星': { theme: 'cosmic', color: '#4B0082', elements: ['stars', 'galaxy', 'planets', 'astronaut'] },
    '梦': { theme: 'dreamy', color: '#DDA0DD', elements: ['clouds', 'moon', 'butterflies', 'unicorn'] },
    '城': { theme: 'urban', color: '#708090', elements: ['buildings', 'streets', 'lights', 'cars'] },
    '山': { theme: 'mountain', color: '#8B7355', elements: ['peaks', 'snow', 'eagle', 'temple'] }
};

// 生成梦境艺术图片（使用Canvas绘制抽象艺术）
function generateDreamArt(text, theme) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // 获取主题颜色
    const themeData = Object.values(dreamThemes).find(t => t.theme === theme) || dreamThemes['梦'];
    const baseColor = themeData.color;
    
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    gradient.addColorStop(0, baseColor + '20');
    gradient.addColorStop(0.5, baseColor + '40');
    gradient.addColorStop(1, baseColor + '20');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);
    
    // 绘制抽象形状
    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        const x = Math.random() * 400;
        const y = Math.random() * 300;
        const radius = Math.random() * 50 + 10;
        
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = baseColor + Math.floor(Math.random() * 60 + 20).toString(16).padStart(2, '0');
        ctx.fill();
    }
    
    // 绘制线条
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 400, Math.random() * 300);
        ctx.lineTo(Math.random() * 400, Math.random() * 300);
        ctx.strokeStyle = baseColor + '60';
        ctx.lineWidth = Math.random() * 3;
        ctx.stroke();
    }
    
    // 绘制星星/装饰
    for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        const x = Math.random() * 400;
        const y = Math.random() * 300;
        ctx.arc(x, y, Math.random() * 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
    }
    
    return canvas.toDataURL('image/png');
}

// 分析梦境主题
function analyzeDreamTheme(text) {
    for (const [keyword, data] of Object.entries(dreamThemes)) {
        if (text.includes(keyword)) {
            return data;
        }
    }
    return dreamThemes['梦']; // 默认梦幻主题
}

// 当前解析结果缓存
let currentAnalysisResult = null;

function analyzeDream() {
    const input = document.getElementById('analyze-input').value;
    if (!input.trim()) {
        showToast('请先输入梦境内容');
        return;
    }
    
    showToast('🔮 AI正在解析中...');
    
    // 分析梦境主题
    const theme = analyzeDreamTheme(input);
    
    // 使用梦境解析数据库生成具体解析
    const analysis = dreamAnalysisDB.getAnalysis(input, theme.emotion || 'fantasy');
    
    // 缓存解析结果
    currentAnalysisResult = {
        title: '梦境解析 - ' + new Date().toLocaleDateString(),
        content: input,
        ...analysis,
        theme: theme
    };
    
    // 模拟AI解析
    setTimeout(() => {
        const resultDiv = document.getElementById('analysis-result');
        
        // 生成梦境艺术图片
        const artImage = generateDreamArt(input, theme.theme);
        
        resultDiv.innerHTML = `
            <div class="analysis-result" style="animation: slideUp 0.5s ease-out;">
                <!-- 梦境可视化卡片 -->
                <div class="result-card" style="background: linear-gradient(145deg, rgba(26,26,62,0.9) 0%, rgba(26,54,93,0.6) 100%); border: 1px solid rgba(255,209,102,0.3); border-radius: 20px; padding: 20px; margin-bottom: 20px; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle, ${theme.color}20 0%, transparent 70%); pointer-events: none;"></div>
                    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        <span style="display:inline-block;width:20px;height:20px;vertical-align:middle;">🎨</span>梦境可视化
                    </h3>
                    <div style="width: 100%; height: 200px; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, ${theme.color}30 0%, ${theme.color}10 100%); display: flex; align-items: center; justify-content: center; position: relative;">
                        <img src="${artImage}" alt="梦境艺术图" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9;">
                        <div style="position: absolute; bottom: 12px; left: 12px; right: 12px; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); padding: 10px 16px; border-radius: 12px;">
                            <p style="font-size: 13px; color: var(--yellow); margin: 0;">✨ ${theme.elements.join(' · ')}</p>
                        </div>
                    </div>
                    <p style="font-size: 12px; color: var(--text-secondary); margin-top: 12px; text-align: center;">基于您的梦境内容生成的抽象艺术可视化</p>
                </div>

                <!-- 象征解读卡片 -->
                <div class="result-card" style="background: var(--bg-card); backdrop-filter: blur(10px); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px; margin-bottom: 16px; position: relative;">
                    <div style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; background: rgba(255,209,102,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="display:inline-block;width:18px;height:18px;">${icons.star}</span>
                    </div>
                    <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; color: var(--yellow);">象征解读</h3>
                    <div style="font-size: 14px; line-height: 1.8; color: var(--text-secondary);">
                        ${analysis.symbolInterpretation}
                    </div>
                </div>
                
                <!-- 情绪分析卡片 -->
                <div class="result-card" style="background: var(--bg-card); backdrop-filter: blur(10px); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px; margin-bottom: 16px; position: relative;">
                    <div style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; background: rgba(200,162,200,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="display:inline-block;width:18px;height:18px;">${icons.brain}</span>
                    </div>
                    <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; color: var(--light-purple);">情绪分析</h3>
                    <div style="font-size: 14px; line-height: 1.8; color: var(--text-secondary);">
                        ${analysis.emotionAnalysis}
                    </div>
                    <div style="margin-top: 16px; display: flex; gap: 8px;">
                        ${analysis.symbols.slice(0, 3).map(s => `
                            <span style="padding: 6px 14px; background: ${s.emotion === 'positive' ? 'rgba(255,209,102,0.15)' : s.emotion === 'negative' ? 'rgba(255,68,68,0.15)' : 'rgba(200,162,200,0.15)'}; color: ${s.emotion === 'positive' ? 'var(--yellow)' : s.emotion === 'negative' ? '#ff6666' : 'var(--light-purple)'}; border-radius: 20px; font-size: 12px;">${s.keyword}</span>
                        `).join('')}
                    </div>
                </div>
                
                <!-- 建议卡片 -->
                <div class="result-card" style="background: var(--bg-card); backdrop-filter: blur(10px); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px; margin-bottom: 16px; position: relative;">
                    <div style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; background: rgba(70,130,180,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="display:inline-block;width:18px;height:18px;">💡</span>
                    </div>
                    <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; color: #87CEEB;">建议</h3>
                    <div style="font-size: 14px; line-height: 1.8; color: var(--text-secondary);">
                        ${analysis.suggestion}
                    </div>
                </div>
                
                <!-- 创意故事卡片 -->
                <div class="result-card" style="background: var(--bg-card); backdrop-filter: blur(10px); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px; margin-bottom: 16px; position: relative;">
                    <div style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; background: rgba(216,63,135,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="display:inline-block;width:18px;height:18px;">${icons.book}</span>
                    </div>
                    <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; color: var(--pink-purple);">创意故事</h3>
                    <div style="font-size: 14px; line-height: 1.8; color: var(--text-secondary); font-style: italic; border-left: 3px solid ${theme.color}; padding-left: 16px;">
                        ${analysis.story}
                    </div>
                </div>
                
                <!-- 梦境元素图谱卡片 -->
                <div class="result-card" style="background: var(--bg-card); backdrop-filter: blur(10px); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px; margin-bottom: 16px;">
                    <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        <span style="display:inline-block;width:18px;height:18px;">${icons.eye}</span>梦境元素图谱
                    </h3>
                    <div id="dream-map" class="dream-map" style="width: 100%; height: 280px; background: rgba(0,0,0,0.2); border-radius: 12px; overflow: hidden;"></div>
                </div>

                <!-- 保存按钮 -->
                <button class="btn btn-primary" onclick="saveCurrentAnalysis()" style="width: 100%; padding: 14px; font-size: 15px; margin-top: 8px;">
                    <span style="display:inline-block;width:18px;height:18px;vertical-align:middle;margin-right:8px;">${icons.star}</span>收藏此解析
                </button>
            </div>
        `;
        
        // 绘制D3图谱
        drawDreamMap(theme);
    }, 1500);
}

// 保存当前解析
function saveCurrentAnalysis() {
    if (!currentAnalysisResult) {
        showToast('❌ 没有可保存的解析');
        return;
    }
    
    savedAnalysesManager.save(currentAnalysisResult);
    showToast('✨ 解析已收藏！');
}

// 保存解析结果到梦境
function saveAnalysisToDream() {
    showToast('✨ 解析结果已保存到梦境日记！');
    setTimeout(() => navigateTo('diary'), 1000);
}

function drawDreamMap(theme) {
    const width = document.getElementById('dream-map').clientWidth;
    const height = 280;
    
    // 根据主题生成相关节点
    const themeElements = theme ? theme.elements : ['飞翔', '星空', '自由', '探索', '梦想', '无限'];
    const nodes = themeElements.map((el, i) => ({
        id: el,
        group: i % 3 + 1,
        size: 25 + Math.random() * 15
    }));
    
    // 生成连接关系
    const links = [];
    for (let i = 0; i < nodes.length - 1; i++) {
        links.push({ source: nodes[i].id, target: nodes[i + 1].id });
        if (i < nodes.length - 2) {
            links.push({ source: nodes[i].id, target: nodes[i + 2].id });
        }
    }
    
    const svg = d3.select('#dream-map')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(70))
        .force('charge', d3.forceManyBody().strength(-250))
        .force('center', d3.forceCenter(width / 2, height / 2));
    
    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('stroke', theme ? theme.color : '#C8A2C8')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.5);
    
    const node = svg.append('g')
        .selectAll('g')
        .data(nodes)
        .enter().append('g')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
    
    // 使用主题颜色
    const baseColor = theme ? theme.color : '#C8A2C8';
    const colors = [baseColor, '#ffd166', '#d83f87', '#6a0572', '#f79d65', '#1a365d'];
    
    node.append('circle')
        .attr('r', d => d.size)
        .attr('fill', (d, i) => colors[i % colors.length])
        .attr('fill-opacity', 0.7)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5);
    
    node.append('text')
        .text(d => d.id)
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('fill', '#fff')
        .attr('font-size', '12px');
    
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
    
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

function setFilter(type, value) {
    appState.filters[type] = value;
    navigateTo('diary');
}

function shareDream() {
    const content = document.getElementById('share-content').value;
    const isAnonymous = document.getElementById('anonymous-check').checked;
    
    if (!content.trim()) {
        showToast('请输入要分享的梦境');
        return;
    }
    
    const dream = {
        id: Date.now().toString(),
        content,
        isAnonymous,
        emotion: appState.currentEmotion || 'fantasy',
        timestamp: Date.now()
    };
    
    appState.sharedDreams.push(dream);
    localStorage.setItem('sharedDreams', JSON.stringify(appState.sharedDreams));
    
    document.getElementById('share-content').value = '';
    showToast('✨ 梦境已分享到宇宙！');
    
    setTimeout(() => navigateTo('share'), 500);
}

// 重新生成梦境宇宙故事 - 真正实现重新编织
function regenerateUniverseStory() {
    if (appState.sharedDreams.length < 3) {
        showToast('需要至少3个共享梦境才能编织宇宙故事');
        return;
    }
    
    showToast('🌌 AI正在重新编织梦境宇宙...');
    
    // 使用随机种子生成不同的故事
    appState.universeStorySeed = Date.now();
    
    // 强制重新渲染分享页面
    setTimeout(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = renderShare();
        }
        showToast('✨ 梦境宇宙故事已重新编织！');
    }, 800);
}

// 查看收藏的梦境宇宙故事详情
function showSavedStoryDetail(storyId) {
    const savedStories = JSON.parse(localStorage.getItem('savedUniverseStories') || '[]');
    const story = savedStories.find(s => s.id === storyId);
    if (!story) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 90%; max-height: 80vh; overflow-y: auto; background: linear-gradient(145deg, rgba(26,26,62,0.98) 0%, rgba(139,92,246,0.1) 100%); border: 1px solid rgba(139,92,246,0.3);">
            <div class="modal-header" style="border-bottom: 1px solid rgba(139,92,246,0.2);">
                <h2 class="modal-title">${story.title}</h2>
                <button class="close-btn" onclick="closeModal()">${icons.close}</button>
            </div>
            <div style="padding: 20px;">
                <div style="margin-bottom: 20px; padding: 16px; background: rgba(139,92,246,0.1); border-radius: 12px; border-left: 3px solid #8b5cf6;">
                    <p style="font-size: 13px; line-height: 1.8; color: #e0e0ff;">${story.content || '暂无内容'}</p>
                </div>
                
                ${story.parts && story.parts.length > 0 ? `
                    <h4 style="font-size: 14px; color: #a78bfa; margin-bottom: 12px;">故事片段 (${story.parts.length}段)</h4>
                    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                        ${story.parts.map((part, idx) => `
                            <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                    <span style="font-size: 16px;">${part.emotionIcon}</span>
                                    <span style="font-size: 12px; color: ${part.emotionColor}; font-weight: 500;">${part.emotionName}</span>
                                </div>
                                <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.6;">${part.content}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <span style="font-size: 11px; color: var(--text-secondary);">
                        收藏于 ${formatDate(story.savedAt?.split('T')[0])} ${story.savedAt?.split('T')[1]?.substring(0, 5) || ''}
                    </span>
                    <span style="font-size: 11px; color: #8b5cf6;">源自 ${story.dreamCount || 0} 个梦境</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

// 删除收藏的梦境宇宙故事
function deleteSavedStory(storyId) {
    if (!confirm('确定要删除这个收藏的梦境宇宙故事吗？')) return;
    
    let savedStories = JSON.parse(localStorage.getItem('savedUniverseStories') || '[]');
    savedStories = savedStories.filter(s => s.id !== storyId);
    localStorage.setItem('savedUniverseStories', JSON.stringify(savedStories));
    
    showToast('梦境宇宙故事已删除');
    
    // 刷新日记页面
    const mainContent = document.getElementById('main-content');
    if (appState.currentPage === 'diary' && mainContent) {
        mainContent.innerHTML = renderDiary();
        bindDiaryEvents();
    }
}

// 查看全部收藏的梦境宇宙故事
function showAllSavedStories() {
    const savedStories = JSON.parse(localStorage.getItem('savedUniverseStories') || '[]');
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 90%; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header">
                <h2 class="modal-title">收藏的梦境宇宙 (${savedStories.length})</h2>
                <button class="close-btn" onclick="closeModal()">${icons.close}</button>
            </div>
            <div style="padding: 20px;">
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${savedStories.slice().reverse().map(story => `
                        <div style="padding: 16px; background: rgba(139,92,246,0.1); border-radius: 12px; border: 1px solid rgba(139,92,246,0.2); cursor: pointer;" onclick="closeModal(); showSavedStoryDetail('${story.id}')">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                <span style="font-weight: 600; font-size: 14px; color: #a78bfa;">${story.title}</span>
                                <button onclick="event.stopPropagation(); closeModal(); deleteSavedStory('${story.id}')" style="background: none; border: none; color: #ff6b6b; cursor: pointer; padding: 4px;">删除</button>
                            </div>
                            <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                ${story.content?.substring(0, 100)}...
                            </p>
                            <div style="margin-top: 8px; display: flex; gap: 6px;">
                                <span style="font-size: 10px; color: var(--light-purple);">${formatDate(story.savedAt?.split('T')[0])}</span>
                                <span style="font-size: 10px; color: #8b5cf6;">${story.dreamCount}个梦境</span>
                            </div>
                        </div>
                    `).join('') || '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">暂无收藏的梦境宇宙故事</p>'}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

// 绑定日记页面事件
function bindDiaryEvents() {
    document.querySelectorAll('.dream-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dreamId = btn.getAttribute('data-dream-id');
            deleteDreamFromList(dreamId);
        });
    });
}

// 收藏梦境宇宙故事
function saveUniverseStory() {
    const universeStory = generateDreamUniverseStory();
    if (!universeStory) {
        showToast('暂无可收藏的故事');
        return;
    }
    
    const savedStories = JSON.parse(localStorage.getItem('savedUniverseStories') || '[]');
    
    // 检查是否已收藏相同的故事（基于seed）
    const isDuplicate = savedStories.some(s => s.seed === universeStory.seed);
    if (isDuplicate) {
        showToast('⚠️ 这个故事版本已经收藏过了，试试重新编织一个新的！');
        return;
    }
    
    const storyToSave = {
        id: Date.now().toString(),
        title: universeStory.title,
        emotion: universeStory.emotion,
        emotionName: universeStory.emotionName,
        emotionColor: universeStory.emotionColor,
        emotionIcon: universeStory.emotionIcon,
        content: universeStory.content,
        intro: universeStory.intro,
        outro: universeStory.outro,
        parts: universeStory.parts,
        keywords: universeStory.keywords,
        dreamCount: universeStory.dreamCount,
        seed: universeStory.seed,
        savedAt: new Date().toISOString()
    };
    
    savedStories.push(storyToSave);
    localStorage.setItem('savedUniverseStories', JSON.stringify(savedStories));
    
    showToast('✨ 梦境宇宙故事已收藏！可在日记页面查看');
}

function showDreamDetail(dreamId) {
    const dream = appState.dreams.find(d => d.id === dreamId);
    if (!dream) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show';
    modal.innerHTML = `
        <div class="modal" style="max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3 class="modal-title">${dream.title || '无标题梦境'}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">${icons.close}</button>
            </div>
            <div class="modal-content">
                <p style="margin-bottom: 12px; color: var(--text-secondary);">
                    <span style="display:inline-block;width:14px;height:14px;vertical-align:middle;margin-right:4px;">${icons.calendar}</span>${dream.date} &nbsp; <span style="color: var(--yellow);">${dream.clarity ? '★'.repeat(dream.clarity) : '未评分'}</span>
                </p>
                <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; margin-bottom: 16px; max-height: 200px; overflow-y: auto;">
                    ${dream.content}
                </div>
                <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                    <span class="dream-tag ${dream.emotion}">${emotions[dream.emotion]?.name || '未知'}</span>
                    ${dream.isRecurring ? '<span class="dream-tag" style="background: rgba(255,209,102,0.2);">重复梦境</span>' : ''}
                </div>
                
                <!-- 现实关联部分 -->
                <div style="border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: 16px;">
                    <p style="font-weight: 600; margin-bottom: 12px; font-size: 14px;">
                        <span style="display:inline-block;width:16px;height:16px;vertical-align:middle;margin-right:6px;">🔮</span>这个梦境后来成真了吗？
                    </p>
                    <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                        <button class="btn ${dream.realityCheck?.cameTrue === true ? 'btn-primary' : 'btn-secondary'}" 
                            onclick="updateRealityCheck('${dream.id}', true)" 
                            style="flex: 1; padding: 10px; font-size: 13px;">
                            ✨ 是的，成真了
                        </button>
                        <button class="btn ${dream.realityCheck?.cameTrue === false ? 'btn-primary' : 'btn-secondary'}" 
                            onclick="updateRealityCheck('${dream.id}', false)" 
                            style="flex: 1; padding: 10px; font-size: 13px;">
                            ❌ 没有成真
                        </button>
                    </div>
                    <textarea class="input" id="reality-note-${dream.id}" placeholder="添加现实关联备注（可选）..." 
                        style="font-size: 13px; min-height: 60px; margin-bottom: 8px;">${dream.realityCheck?.note || ''}</textarea>
                    <button class="btn btn-secondary" onclick="saveRealityNote('${dream.id}')" style="width: 100%; padding: 8px; font-size: 12px;">
                        保存备注
                    </button>
                    ${dream.realityCheck?.updatedAt ? `
                        <p style="font-size: 11px; color: var(--text-secondary); margin-top: 8px; text-align: right;">
                            更新于: ${formatDate(dream.realityCheck.updatedAt)}
                        </p>
                    ` : ''}
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="deleteDream('${dream.id}')" style="padding: 10px 16px; font-size: 13px;">删除</button>
                <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()" style="padding: 10px 16px; font-size: 13px;">关闭</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// 更新现实关联状态
function updateRealityCheck(dreamId, cameTrue) {
    const dream = appState.dreams.find(d => d.id === dreamId);
    if (!dream) return;
    
    if (!dream.realityCheck) {
        dream.realityCheck = {};
    }
    
    dream.realityCheck.cameTrue = cameTrue;
    dream.realityCheck.updatedAt = new Date().toISOString().split('T')[0];
    
    localStorage.setItem('dreams', JSON.stringify(appState.dreams));
    showToast(cameTrue ? '✨ 标记为已成真！' : '已记录为未成真');
    
    // 刷新弹窗
    document.querySelector('.modal-overlay').remove();
    setTimeout(() => showDreamDetail(dreamId), 100);
}

// 保存现实关联备注
function saveRealityNote(dreamId) {
    const dream = appState.dreams.find(d => d.id === dreamId);
    if (!dream) return;
    
    const note = document.getElementById(`reality-note-${dreamId}`).value;
    
    if (!dream.realityCheck) {
        dream.realityCheck = {};
    }
    
    dream.realityCheck.note = note;
    dream.realityCheck.updatedAt = new Date().toISOString().split('T')[0];
    
    localStorage.setItem('dreams', JSON.stringify(appState.dreams));
    showToast('✅ 备注已保存');
}

// 梦境模式识别分析
function analyzeDreamPatterns() {
    const dreams = appState.dreams;
    
    if (dreams.length < 3) {
        return { hasData: false, patterns: [] };
    }
    
    const patterns = [];
    
    // 1. 情绪模式分析
    const emotionCounts = {};
    dreams.forEach(d => {
        emotionCounts[d.emotion] = (emotionCounts[d.emotion] || 0) + 1;
    });
    
    const dominantEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
    if (dominantEmotion && dominantEmotion[1] >= 3) {
        const emotionName = emotions[dominantEmotion[0]]?.name || dominantEmotion[0];
        const emotionColor = emotions[dominantEmotion[0]]?.color || '#ffd166';
        patterns.push({
            icon: '🎭',
            title: '主导情绪模式',
            description: `您的梦境中频繁出现「${emotionName}」情绪（${dominantEmotion[1]}次），这可能反映了您潜意识中持续的心理状态或关注点。`,
            tags: [
                { text: emotionName, color: emotionColor },
                { text: `占比 ${Math.round((dominantEmotion[1] / dreams.length) * 100)}%`, color: '#C8A2C8' }
            ]
        });
    }
    
    // 2. 重复梦境分析
    const recurringDreams = dreams.filter(d => d.isRecurring);
    if (recurringDreams.length >= 2) {
        patterns.push({
            icon: '🔄',
            title: '重复梦境模式',
            description: `您有 ${recurringDreams.length} 个标记为重复出现的梦境。重复梦境通常暗示着潜意识中未解决的重要议题或深层焦虑。`,
            tags: [
                { text: `${recurringDreams.length} 个重复`, color: '#ffd166' },
                { text: '需关注', color: '#f79d65' }
            ]
        });
    }
    
    // 3. 预言梦境分析
    const propheticDreams = dreams.filter(d => d.realityCheck?.cameTrue === true);
    if (propheticDreams.length >= 1) {
        patterns.push({
            icon: '🔮',
            title: '预言性梦境',
            description: `您有 ${propheticDreams.length} 个梦境后来在现实中得到了印证。这表明您可能具有较强的直觉或对未来事件的敏感感知能力。`,
            tags: [
                { text: `${propheticDreams.length} 个成真`, color: '#ffd166' },
                { text: '直觉敏锐', color: '#d83f87' }
            ]
        });
    }
    
    // 4. 清晰度模式分析
    const highClarityDreams = dreams.filter(d => d.clarity >= 4);
    if (highClarityDreams.length >= 3) {
        patterns.push({
            icon: '✨',
            title: '高清晰度梦境',
            description: `您有 ${highClarityDreams.length} 个高清晰度梦境（4-5星）。清晰的梦境通常更容易被解析，也更容易形成记忆和产生启示。`,
            tags: [
                { text: `${highClarityDreams.length} 个清晰梦`, color: '#ffd166' },
                { text: '易解析', color: '#C8A2C8' }
            ]
        });
    }
    
    // 5. 时间模式分析（如果数据足够）
    if (dreams.length >= 5) {
        const recentDreams = dreams.slice(-5);
        const recentEmotions = recentDreams.map(d => d.emotion);
        const uniqueEmotions = [...new Set(recentEmotions)];
        
        if (uniqueEmotions.length === 1) {
            const emotionName = emotions[uniqueEmotions[0]]?.name || uniqueEmotions[0];
            patterns.push({
                icon: '📊',
                title: '近期情绪聚焦',
                description: `最近5个梦境都呈现「${emotionName}」情绪，这可能暗示您近期正经历特定的心理阶段或生活状态。`,
                tags: [
                    { text: '近期趋势', color: '#6a0572' },
                    { text: emotionName, color: emotions[uniqueEmotions[0]]?.color || '#ffd166' }
                ]
            });
        }
    }
    
    return {
        hasData: patterns.length > 0,
        patterns: patterns
    };
}

function deleteDream(dreamId) {
    if (!confirm('确定要删除这个梦境吗？')) return;
    
    appState.dreams = appState.dreams.filter(d => d.id !== dreamId);
    localStorage.setItem('dreams', JSON.stringify(appState.dreams));
    
    document.querySelector('.modal-overlay').remove();
    showToast('梦境已删除');
    navigateTo('diary');
}

// 从列表直接删除梦境
function deleteDreamFromList(dreamId) {
    if (!confirm('确定要删除这个梦境吗？')) return;
    
    // 转换ID为字符串进行比较
    const dreamIdStr = String(dreamId);
    appState.dreams = appState.dreams.filter(d => String(d.id) !== dreamIdStr);
    localStorage.setItem('dreams', JSON.stringify(appState.dreams));
    
    showToast('✅ 梦境已删除');
    
    // 直接重新渲染日记页面
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = renderDiary();
    
    // 重新绑定删除按钮事件
    setTimeout(() => {
        document.querySelectorAll('.dream-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-dream-id');
                if (id) {
                    deleteDreamFromList(id);
                }
            });
        });
    }, 0);
}

// 删除收藏的解析
function deleteSavedAnalysis(analysisId) {
    if (!confirm('确定要删除这个收藏的解析吗？')) return;
    
    savedAnalysesManager.delete(analysisId);
    showToast('收藏的解析已删除');
    navigateTo('diary');
}

// 显示收藏的解析详情
function showSavedAnalysisDetail(analysisId) {
    const analysis = savedAnalysesManager.getById(analysisId);
    if (!analysis) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show';
    modal.innerHTML = `
        <div class="modal" style="max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3 class="modal-title">${analysis.title || '梦境解析'}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">${icons.close}</button>
            </div>
            <div class="modal-content">
                <div style="margin-bottom: 16px;">
                    <span style="font-size: 12px; color: var(--text-secondary);">收藏于: ${formatDate(analysis.savedAt?.split('T')[0])}</span>
                </div>
                
                <div style="background: rgba(255,209,102,0.1); border-radius: 12px; padding: 16px; margin-bottom: 16px; border-left: 3px solid var(--yellow);">
                    <h4 style="font-size: 14px; color: var(--yellow); margin-bottom: 8px;">象征解读</h4>
                    <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.7;">${analysis.symbolInterpretation || '暂无解读'}</p>
                </div>
                
                <div style="background: rgba(200,162,200,0.1); border-radius: 12px; padding: 16px; margin-bottom: 16px; border-left: 3px solid var(--light-purple);">
                    <h4 style="font-size: 14px; color: var(--light-purple); margin-bottom: 8px;">情绪分析</h4>
                    <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.7;">${analysis.emotionAnalysis || '暂无分析'}</p>
                </div>
                
                <div style="background: rgba(70,130,180,0.1); border-radius: 12px; padding: 16px; margin-bottom: 16px; border-left: 3px solid #4682B4;">
                    <h4 style="font-size: 14px; color: #87CEEB; margin-bottom: 8px;">建议</h4>
                    <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.7;">${analysis.suggestion || '暂无建议'}</p>
                </div>
                
                <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 16px; font-style: italic;">
                    <h4 style="font-size: 14px; color: var(--pink-purple); margin-bottom: 8px;">创意故事</h4>
                    <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.7;">${analysis.story || '暂无故事'}</p>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="deleteSavedAnalysis('${analysisId}'); this.closest('.modal-overlay').remove();" style="padding: 10px 16px; font-size: 13px;">删除</button>
                <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()" style="padding: 10px 16px; font-size: 13px;">关闭</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// 显示所有收藏的解析
function showAllSavedAnalyses() {
    const savedAnalyses = savedAnalysesManager.getAll();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show';
    modal.innerHTML = `
        <div class="modal" style="max-height: 90vh; overflow-y: auto; width: 90%; max-width: 500px;">
            <div class="modal-header">
                <h3 class="modal-title">所有收藏的解析 (${savedAnalyses.length})</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">${icons.close}</button>
            </div>
            <div class="modal-content">
                <div class="saved-analyses-list">
                    ${savedAnalyses.map(analysis => `
                        <div class="saved-analysis-item" style="margin-bottom: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 10px; cursor: pointer;" onclick="this.closest('.modal-overlay').remove(); showSavedAnalysisDetail('${analysis.id}')">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                <span style="font-weight: 600; font-size: 14px; color: var(--yellow);">${analysis.title || '梦境解析'}</span>
                                <button onclick="event.stopPropagation(); deleteSavedAnalysis('${analysis.id}'); this.closest('.modal-overlay').remove();" style="background: none; border: none; color: #ff6666; cursor: pointer; padding: 4px; font-size: 12px;">删除</button>
                            </div>
                            <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                ${analysis.symbolInterpretation?.substring(0, 80) || '暂无解析内容'}...
                            </p>
                            <div style="margin-top: 8px; display: flex; gap: 6px;">
                                <span style="font-size: 10px; color: var(--light-purple);">${formatDate(analysis.savedAt?.split('T')[0])}</span>
                                ${analysis.clarity ? `<span style="font-size: 10px; color: var(--yellow);">清晰度: ${analysis.clarity}</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()" style="width: 100%; padding: 12px; font-size: 14px;">关闭</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function exportDreams(format) {
    if (appState.dreams.length === 0) {
        showToast('暂无梦境可导出');
        return;
    }
    
    let content = '';
    
    if (format === 'markdown') {
        content = '# 我的梦境日记\n\n';
        
        // 添加梦境模式分析摘要
        const patternAnalysis = analyzeDreamPatterns();
        if (patternAnalysis.hasData) {
            content += '## 📊 梦境模式分析\n\n';
            patternAnalysis.patterns.forEach(pattern => {
                content += `### ${pattern.icon} ${pattern.title}\n\n`;
                content += `${pattern.description}\n\n`;
                content += `**标签**: ${pattern.tags.map(t => t.text).join(', ')}\n\n`;
            });
            content += '---\n\n';
        }
        
        // 添加梦境记录
        content += '## 📝 梦境记录\n\n';
        appState.dreams.forEach(dream => {
            content += `### ${dream.title || '无标题梦境'} - ${dream.date}\n\n`;
            content += `- **情绪**: ${emotions[dream.emotion]?.name || '未知'}\n`;
            content += `- **清晰度**: ${'★'.repeat(dream.clarity || 0)}\n`;
            content += `- **重复梦境**: ${dream.isRecurring ? '是' : '否'}\n`;
            if (dream.realityCheck) {
                content += `- **现实关联**: ${dream.realityCheck.cameTrue === true ? '✨ 已成真' : dream.realityCheck.cameTrue === false ? '❌ 未成真' : '未记录'}\n`;
                if (dream.realityCheck.note) {
                    content += `- **现实备注**: ${dream.realityCheck.note}\n`;
                }
            }
            content += `\n${stripHtml(dream.content)}\n\n---\n\n`;
        });
        
        downloadFile(content, '我的梦境日记.md', 'text/markdown');
    } else {
        // PDF导出提示
        showToast('PDF导出功能需要额外库支持，请使用Markdown格式');
    }
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('✨ 导出成功！');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ============================================
// 初始化
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // 绑定导航事件
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            navigateTo(item.dataset.page);
        });
    });
    
    // 初始化示例数据
    if (appState.dreams.length === 0) {
        appState.dreams = [
            {
                id: '1',
                title: '星空下的飞翔',
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                content: '我在一片璀璨的星空下飞翔，周围有无数闪烁的星星。每颗星星都像是一个故事，我伸手触碰，感受到温暖的能量流淌...',
                emotion: 'fantasy',
                clarity: 5,
                isRecurring: false,
                duration: 3,
                createdAt: Date.now() - 86400000
            },
            {
                id: '2',
                title: '神秘森林探险',
                date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
                content: '走进一片神秘的森林，树木高耸入云，阳光透过树叶洒下斑驳的光影。我听到了奇妙的声音，仿佛森林在与我对话...',
                emotion: 'happy',
                clarity: 4,
                isRecurring: true,
                duration: 2,
                createdAt: Date.now() - 172800000
            }
        ];
        localStorage.setItem('dreams', JSON.stringify(appState.dreams));
    }
    
    // 初始化示例共享梦境数据
    if (appState.sharedDreams.length === 0) {
        appState.sharedDreams = [
            {
                id: 's1',
                content: '我在一片无尽的星海中漂浮，周围是闪烁的星云和流动的银河。突然，一颗流星划过，带我进入了一个神秘的世界...',
                isAnonymous: true,
                emotion: 'fantasy',
                timestamp: Date.now() - 3600000
            },
            {
                id: 's2',
                content: '梦见自己长出了翅膀，在云层之间自由穿梭。下方是一片梦幻的城市，灯火辉煌，宛如仙境...',
                isAnonymous: true,
                emotion: 'fantasy',
                timestamp: Date.now() - 7200000
            },
            {
                id: 's3',
                content: '在一个水晶宫殿里，我遇到了一个发光的生物。它带我穿越了时空隧道，看到了过去和未来的景象...',
                isAnonymous: true,
                emotion: 'fantasy',
                timestamp: Date.now() - 10800000
            },
            {
                id: 's4',
                content: '站在一座悬浮的岛屿上，四周是无尽的虚空。岛上有奇异的植物，散发着柔和的光芒，空气中弥漫着魔法的气息...',
                isAnonymous: true,
                emotion: 'fantasy',
                timestamp: Date.now() - 14400000
            }
        ];
        localStorage.setItem('sharedDreams', JSON.stringify(appState.sharedDreams));
    }
    
    // 渲染首页
    navigateTo('home');
});
