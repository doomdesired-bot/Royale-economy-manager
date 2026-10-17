// ui.js - Handles all DOM rendering and visual updates

function getCardImage(card) {
    if (!card) return "";
    
    // Always check master cardDatabase first to bypass old cached URLs
    const dbCard = typeof cardDatabase !== 'undefined' ? cardDatabase.find(c => c.name === card.name) : null;
    if (dbCard && dbCard.iconUrl) return dbCard.iconUrl;
    if (card.iconUrl) return card.iconUrl;

    // Direct fallback using working RoyaleAPI cards-75 directory
    const slug = (card.wikiName || card.name)
        .toLowerCase()
        .replace(/\./g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    return `https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/${slug}.png`;
}

function getTowerImage(towerId) {
    if (!towerId) return "";
    const tower = typeof towerTroopDatabase !== 'undefined' ? towerTroopDatabase.find(t => t.id === towerId) : null;
    if (tower && tower.iconUrl) return tower.iconUrl;

    const slug = (tower ? tower.name : towerId)
        .toLowerCase()
        .replace(/\./g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    return `https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/${slug}.png`;
}

function handleImageError(img, name) {
    img.onerror = null;
    img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='120' viewBox='0 0 100 120'><rect width='100%' height='100%' fill='%231f293d'/><text x='50%' y='55%' font-size='32' text-anchor='middle' dominant-baseline='middle' fill='%23fbbf24'>🃏</text></svg>";
}

function getRarityClass(rarity) {
    switch(rarity) {
        case 'common': return 'border-gray-500 bg-gray-900/60';
        case 'rare': return 'border-red-500 bg-red-950/40';
        case 'epic': return 'border-purple-500 bg-purple-950/40';
        case 'legendary': return 'border-blue-500 bg-blue-950/40';
        case 'champion': return 'border-amber-500 bg-amber-950/40';
        default: return 'border-gray-700';
    }
}

function renderUI() {
    const pName = globalState.activePlayer;
    const pState = globalState.players[pName];
    const activeDeck = pState.decks[pState.activeDeckIndex];

    const tabMage = document.getElementById('tab-mage');
    if (tabMage) {
        tabMage.className = pName === "Mage master117" 
            ? "px-4 py-2 rounded-xl text-xs font-bold transition cinzel-font bg-amber-600 text-gray-950 shadow" 
            : "px-4 py-2 rounded-xl text-xs font-bold transition cinzel-font text-gray-400 hover:text-white";
    }

    const tabFaver = document.getElementById('tab-faver');
    if (tabFaver) {
        tabFaver.className = pName === "Faversaver" 
            ? "px-4 py-2 rounded-xl text-xs font-bold transition cinzel-font bg-amber-600 text-gray-950 shadow" 
            : "px-4 py-2 rounded-xl text-xs font-bold transition cinzel-font text-gray-400 hover:text-white";
    }

    for (let i = 0; i < 5; i++) {
        const btn = document.getElementById(`deck-tab-${i}`);
        if (btn) {
            btn.className = (i === pState.activeDeckIndex)
                ? "px-2.5 py-1.5 rounded-lg transition bg-amber-500 text-gray-950 font-black shadow"
                : "px-2.5 py-1.5 rounded-lg transition text-gray-400 hover:text-white";
        }
    }

    if (document.getElementById('crown-balance')) document.getElementById('crown-balance').innerText = pState.crowns;
    if (document.getElementById('active-player-title')) document.getElementById('active-player-title').innerText = `${pName} (Deck ${pState.activeDeckIndex + 1})`;
    if (document.getElementById('catalog-count')) document.getElementById('catalog-count').innerText = pState.unlockedCatalog.length;

    const highestCap = getHighestUnlockedCap();
    if (document.getElementById('highest-cap-display')) {
        document.getElementById('highest-cap-display').innerText = `${highestCap} Elixir`;
    }

    const mWins = globalState.h2h.mageWins;
    const fWins = globalState.h2h.faverWins;
    const total = mWins + fWins;

    if (document.getElementById('stat-mage-wins')) document.getElementById('stat-mage-wins').innerText = mWins;
    if (document.getElementById('stat-faver-wins')) document.getElementById('stat-faver-wins').innerText = fWins;
    if (document.getElementById('stat-total-battles')) document.getElementById('stat-total-battles').innerText = total;

    const grid = document.getElementById('deck-slots-grid');
    if (!grid) return;
    grid.innerHTML = "";

    // Tower Header
    const activeTower = towerTroopDatabase.find(t => t.id === activeDeck.activeTowerId) || towerTroopDatabase[0];
    const towerImgUrl = getTowerImage(activeTower.id);
    const towerHeaderEl = document.createElement('div');
    towerHeaderEl.className = "col-span-full bg-[#1c132e] rounded-2xl p-2.5 border-2 border-orange-500/80 flex flex-col sm:flex-row items-center justify-between gap-3 mb-1 shadow-lg";
    towerHeaderEl.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="w-10 h-12 flex items-center justify-center bg-black/40 rounded-xl border border-orange-500/30 overflow-hidden shrink-0">
                <img src="${towerImgUrl}" alt="${activeTower.name}" class="w-full h-full object-cover" onerror="handleImageError(this, '${activeTower.name}')">
            </div>
            <div>
                <div class="flex items-center gap-2">
                    <span class="cinzel-font text-[11px] font-black text-orange-300">HEADER SLOT: TOWER TROOP</span>
                    <span class="text-[9px] bg-orange-950 border border-orange-500 text-orange-300 px-2 py-0.2 rounded-full font-bold">BASE TOWER</span>
                </div>
                <h3 class="font-black text-xs text-gray-100 flex items-center gap-2">
                    ${activeTower.name}
                    <span class="text-[10px] text-orange-200/70 font-normal hidden sm:inline">• ${activeTower.desc}</span>
                </h3>
            </div>
        </div>
        <button onclick="openTowerCatalogModal()" class="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 text-gray-950 font-black px-3.5 py-1.5 rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5 shrink-0">
            <i class="fa-solid fa-chess-rook text-xs"></i> Switch / Unlock Towers
        </button>
    `;
    grid.appendChild(towerHeaderEl);

    // 8 Card Slots
    activeDeck.slots.forEach(slot => {
        const card = slot.card;
        const isHeroSlot = slot.isHeroSlot;
        const isHeroUnlocked = pState.unlockedHeroSlots.includes(slot.id);
        const currentCap = pState.slotCaps[slot.id] || 1;

        let cardHTML = !card ? `
            <div class="h-16 bg-gray-900/60 border border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 my-1">
                <i class="fa-solid fa-square-plus text-lg mb-0.5"></i>
                <span class="text-[8px] font-bold uppercase">Empty Slot</span>
            </div>` : `
            <div class="bg-gray-900/90 rounded-xl p-2 border ${getRarityClass(card.rarity)} my-1 relative overflow-hidden shadow">
                <div class="flex items-center justify-between mb-0.5">
                    <span class="text-[8px] font-black uppercase text-amber-300">${card.rarity}</span>
                    <span class="text-[9px] font-black text-pink-300 bg-pink-950/80 px-1.5 py-0.2 rounded-full border border-pink-700/50">${card.elixir} Elixir</span>
                </div>
                <div class="flex items-center gap-2.5 my-0.5">
                    <div class="w-10 h-12 flex items-center justify-center bg-black/40 rounded border border-gray-700/50 overflow-hidden shrink-0">
                        <img src="${getCardImage(card)}" alt="${card.name}" class="w-full h-full object-cover" onerror="handleImageError(this, '${card.name}')">
                    </div>
                    <div>
                        <div class="font-bold text-xs text-gray-100 leading-tight">${card.name}</div>
                        <div class="text-[8px] text-gray-400">${card.type}</div>
                    </div>
                </div>
            </div>`;

        const upgradeCost = getUpgradeCost(currentCap);
        let slotLockBannerHTML = "";
        if (isHeroSlot && !isHeroUnlocked) {
            slotLockBannerHTML = `
                <div class="flex items-center justify-between text-[8px] bg-red-950/50 text-red-300 border border-red-800/60 p-1 rounded-lg font-bold">
                    <span><i class="fa-solid fa-lock text-red-400"></i> Hero/Evo Locked</span>
                    <button onclick="unlockHeroSlot(${slot.id})" class="bg-amber-500 hover:bg-amber-400 text-gray-950 px-1.5 py-0.2 rounded font-black transition">
                        Unlock (80👑)
                    </button>
                </div>
            `;
        }

        let controlsHTML = `
            <div class="space-y-1 mt-1">
                ${slotLockBannerHTML}
                <button onclick="upgradeSlotCap(${slot.id})" class="w-full bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 py-1 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1">
                    <i class="fa-solid fa-arrow-up text-[8px]"></i> Cap +1 All Decks (${upgradeCost}👑)
                </button>
            </div>`;

        const cardEl = document.createElement('div');
        cardEl.className = "bg-[#131b2e] rounded-xl p-2.5 royal-border flex flex-col justify-between shadow-xl";
        cardEl.innerHTML = `
            <div>
                <div class="flex items-center justify-between pb-1 border-b border-gray-800">
                    <span class="cinzel-font text-[10px] font-bold text-amber-300">${slot.name}</span>
                    <span class="text-[9px] font-bold text-amber-400 bg-black/40 px-1.5 py-0.2 rounded border border-amber-500/30">Cap: ${currentCap} Elixir</span>
                </div>
                ${cardHTML}
            </div>
            ${controlsHTML}`;
        grid.appendChild(cardEl);
    });
}

function renderCatalogGrid() {
    const pState = globalState.players[globalState.activePlayer];
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;
    grid.innerHTML = "";

    pState.unlockedCatalog.forEach(card => {
        const dbCard = cardDatabase.find(c => c.name === card.name);
        const hasEvo = dbCard ? dbCard.hasEvo : card.hasEvo;
        const hasHero = dbCard ? dbCard.hasHero : card.hasHero;

        const item = document.createElement('div');
        item.className = "bg-gray-900/80 border border-gray-800 rounded-2xl p-3 flex flex-col justify-between shadow transition gap-2";
        
        const isEvo = card.isEvoUnlocked;
        const isHero = card.isHeroUnlocked;
        
        item.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-12 flex items-center justify-center bg-black/40 rounded border border-gray-700/50 overflow-hidden shrink-0">
                        <img src="${getCardImage(card)}" alt="${card.name}" class="w-full h-full object-cover" onerror="handleImageError(this, '${card.name}')">
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-amber-200">${card.name}</h4>
                        <p class="text-[10px] text-gray-400 uppercase">${card.rarity} • ${card.type}</p>
                    </div>
                </div>
                <span class="text-xs font-black text-pink-300 bg-pink-950/80 px-2 py-0.5 rounded-full border border-pink-700/50">${card.elixir} Elixir</span>
            </div>

            <div class="flex gap-1.5 text-[9px] font-bold">
                ${hasEvo ? `<span class="px-2 py-0.5 rounded-full ${isEvo ? 'bg-purple-950 text-purple-300 border border-purple-600' : 'bg-gray-800 text-gray-500'}">${isEvo ? '✨ EVO Unlocked' : 'EVO Locked'}</span>` : ''}
                ${hasHero ? `<span class="px-2 py-0.5 rounded-full ${isHero ? 'bg-amber-950 text-amber-300 border border-amber-600' : 'bg-gray-800 text-gray-500'}">${isHero ? '👑 HERO Unlocked' : 'HERO Locked'}</span>` : ''}
            </div>

            <div class="flex items-center justify-end pt-2 border-t border-gray-800">
                <button onclick="equipCardFromCatalog('${card.name}')" class="bg-amber-500 hover:bg-amber-400 text-gray-950 text-[10px] px-3 py-1.5 rounded-lg font-black transition shadow">Equip</button>
            </div>
        `;
        grid.appendChild(item);
    });
}

function renderTowerCatalogGrid() {
    const pState = globalState.players[globalState.activePlayer];
    const activeDeck = pState.decks[pState.activeDeckIndex];
    const grid = document.getElementById('tower-catalog-grid');
    if (!grid) return;
    grid.innerHTML = "";

    towerTroopDatabase.forEach(tower => {
        const isUnlocked = tower.defaultUnlocked || pState.unlockedTowers.includes(tower.id);
        const isEquipped = activeDeck.activeTowerId === tower.id;
        const towerImgUrl = getTowerImage(tower.id);

        const item = document.createElement('div');
        item.className = "bg-gray-900/80 border border-orange-500/30 rounded-2xl p-4 flex items-center justify-between shadow";
        item.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 flex items-center justify-center bg-black/40 rounded-xl border border-orange-500/30 overflow-hidden shrink-0">
                    <img src="${towerImgUrl}" alt="${tower.name}" class="w-full h-full object-cover" onerror="handleImageError(this, '${tower.name}')">
                </div>
                <div>
                    <h4 class="text-sm font-bold text-amber-200 flex items-center gap-2">
                        ${tower.name}
                        ${isEquipped ? '<span class="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-500 px-2 py-0.5 rounded-full">EQUIPPED</span>' : ''}
                    </h4>
                    <p class="text-xs text-gray-400">${tower.desc}</p>
                </div>
            </div>
            <div>
                ${isUnlocked 
                    ? `<button onclick="equipTower('${tower.id}')" ${isEquipped ? 'disabled' : ''} class="${isEquipped ? 'bg-gray-800 text-gray-500 border border-gray-700' : 'bg-amber-500 hover:bg-amber-400 text-gray-950 font-black shadow'} text-xs px-3 py-1.5 rounded-xl transition">
                        ${isEquipped ? 'Active' : 'Equip'}
                      </button>`
                    : `<button onclick="unlockTower('${tower.id}')" class="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 text-gray-950 text-xs px-3.5 py-1.5 rounded-xl font-black shadow transition">
                        Unlock (100 👑)
                      </button>`
                }
            </div>
        `;
        grid.appendChild(item);
    });
}