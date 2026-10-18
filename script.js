// 遊戲初始變數
let stats = { money: 100, approval: 100, env: 100 };
let currentYear = 1;
let currentEvent = null;
const maxYears = 10;

// 事件資料庫
const events = [
    {
        title: "🔥 極端熱浪來襲",
        desc: "連日高溫導致全國用電量暴增，電網面臨崩潰邊緣。",
        options: [
            { text: "重啟老舊燃煤電廠以穩定供電 (資金-10, 生態-20, 民心+10)", effect: { money: -10, approval: 10, env: -20 } },
            { text: "實施嚴格的分區限電措施 (資金-20, 生態+5, 民心-25)", effect: { money: -20, approval: -25, env: 5 } }
        ]
    },
    {
        title: "🌧️ 特大暴雨與洪災",
        desc: "暴雨襲擊主要工業區，淹水災情頻傳。",
        options: [
            { text: "動用緊急預備金全面修繕排水系統 (資金-30, 生態0, 民心+15)", effect: { money: -30, approval: 15, env: 0 } },
            { text: "僅提供災民微薄補貼，消極應對 (資金-5, 生態-15, 民心-30)", effect: { money: -5, approval: -30, env: -15 } }
        ]
    },
    {
        title: "📜 國際碳稅協定",
        desc: "聯合國要求簽署嚴格的減碳協定，違者將面臨貿易制裁。",
        options: [
            { text: "乖乖簽署並強迫企業轉型 (資金-25, 生態+25, 民心-10)", effect: { money: -25, approval: -10, env: 25 } },
            { text: "拒絕簽署以保護本土企業利潤 (資金+20, 生態-25, 民心+10)", effect: { money: 20, approval: 10, env: -25 } }
        ]
    },
    {
        title: "🌲 森林大火失控",
        desc: "受長期乾旱影響，保護區發生嚴重森林大火。",
        options: [
            { text: "投入大量資金與人力進行撲滅 (資金-25, 生態+10, 民心+15)", effect: { money: -25, approval: 15, env: 10 } },
            { text: "任其自然燃燒，節省開支 (資金0, 生態-35, 民心-20)", effect: { money: 0, approval: -20, env: -35 } }
        ]
    },
    {
        title: "💡 新能源科技突破",
        desc: "國內科學家研發出高效能太陽能板，但需要大量投資才能量產。",
        options: [
            { text: "全力投資並補貼綠能產業 (資金-35, 生態+30, 民心+10)", effect: { money: -35, approval: 10, env: 30 } },
            { text: "維持現狀，不干預市場 (資金+10, 生態-10, 民心-5)", effect: { money: 10, approval: -5, env: -10 } }
        ]
    },
    {
        title: "🏭 企業大罷工",
        desc: "環保法規過於嚴格，導致多家大廠揚言罷工並裁員。",
        options: [
            { text: "妥協並放寬環保法規 (資金+25, 生態-20, 民心-10)", effect: { money: 25, approval: -10, env: -20 } },
            { text: "堅持法規，並補貼失業勞工 (資金-25, 生態+15, 民心+15)", effect: { money: -25, approval: 15, env: 15 } }
        ]
    },
    {
        title: "🥤 減塑法案爭議",
        desc: "環保團體要求全面禁止一次性塑膠，但餐飲業強烈反彈。",
        options: [
            { text: "強制推行全面禁塑令 (資金-10, 生態+25, 民心-20)", effect: { money: -10, approval: -20, env: 25 } },
            { text: "改為柔性勸導，不強制開罰 (資金0, 生態+5, 民心+10)", effect: { money: 0, approval: 10, env: 5 } }
        ]
    }
];

let availableEvents = [];

// 初始化遊戲
function initGame() {
    stats = { money: 80, approval: 80, env: 80 }; // 開局給 80 增加一點難度
    currentYear = 1;
    availableEvents = [...events]; // 複製題庫
    document.getElementById('end-screen').style.display = 'none';
    updateUI();
    nextTurn();
}

// 更新介面數值與進度條
function updateUI() {
    document.getElementById('year-display').innerText = `第 ${currentYear} 年 / 目標 ${maxYears} 年`;
    
    for (let key in stats) {
        // 限制數值在 0~100
        stats[key] = Math.max(0, Math.min(100, stats[key]));
        
        // 更新文字
        document.getElementById(`val-${key}`).innerText = stats[key];
        
        // 更新進度條寬度與顏色警告
        const bar = document.getElementById(`bar-${key}`);
        bar.style.width = stats[key] + '%';
        
        if (stats[key] <= 20) {
            bar.style.backgroundColor = '#ff4757'; // 危險紅色
        } else {
            if(key === 'money') bar.style.backgroundColor = 'var(--money-color)';
            if(key === 'approval') bar.style.backgroundColor = 'var(--approval-color)';
            if(key === 'env') bar.style.backgroundColor = 'var(--env-color)';
        }
    }
}

// 進入下一回合
function nextTurn() {
    if (checkGameOver()) return;

    if (currentYear > maxYears) {
        showEndScreen("🎉 恭喜通關！", "你成功帶領國家度過了十年的氣候危機，達成了經濟與環境的平衡！");
        return;
    }

    // 隨機抽取事件
    if (availableEvents.length === 0) availableEvents = [...events]; // 題目用完重新洗牌
    const randomIndex = Math.floor(Math.random() * availableEvents.length);
    currentEvent = availableEvents.splice(randomIndex, 1)[0];

    // 顯示事件
    document.getElementById('event-title').innerText = currentEvent.title;
    document.getElementById('event-desc').innerText = currentEvent.desc;
    document.getElementById('btn-a').innerText = "A: " + currentEvent.options[0].text;
    document.getElementById('btn-b').innerText = "B: " + currentEvent.options[1].text;
}

// 玩家做出選擇
function makeChoice(optionIndex) {
    const effect = currentEvent.options[optionIndex].effect;
    stats.money += effect.money;
    stats.approval += effect.approval;
    stats.env += effect.env;
    
    currentYear++;
    updateUI();
    
    // 加上一點小延遲讓玩家看到數值變化
    setTimeout(() => {
        nextTurn();
    }, 500);
}

// 檢查是否死亡
function checkGameOver() {
    if (stats.money <= 0) {
        showEndScreen("💀 國家破產", "資金歸零。國家無力負擔任何建設，社會陷入混亂，你的政權被推翻了。");
        return true;
    }
    if (stats.approval <= 0) {
        showEndScreen("💀 失去民心", "民怨沸騰。憤怒的民眾包圍了政府機關，你被迫引咎辭職。");
        return true;
    }
    if (stats.env <= 0) {
        showEndScreen("💀 生態崩潰", "環境徹底毀滅。極端氣候讓這片土地變得不適合人類居住，一切都太遲了。");
        return true;
    }
    return false;
}

// 顯示結算畫面
function showEndScreen(title, msg) {
    document.getElementById('end-title').innerText = title;
    if(title.includes("通關")) {
        document.getElementById('end-title').style.color = "var(--env-color)";
    } else {
        document.getElementById('end-title').style.color = "var(--approval-color)";
    }
    document.getElementById('end-msg').innerText = msg;
    document.getElementById('end-screen').style.display = 'flex';
}

// 啟動遊戲
initGame();
