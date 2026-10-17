// actions.js - Handles state, chests, rolling, and actions

const STORAGE_KEY = "clash_royale_pvp_v11_costs_starters";

// Starter Card Definitions
const GOBLINS_CARD = { name: "Goblins", rarity: "common", elixir: 2, type: "Troop", hasEvo: false, hasHero: true, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/goblins.png" };
const BARB_BARREL_CARD = { name: "Barbarian Barrel", rarity: "epic", elixir: 2, type: "Spell", hasEvo: false, hasHero: true, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/barbarian-barrel.png" };

const createInitialDeck = (defaultSlot8Card) => ({
    slots: [
        { id: 1, name: "Slot 1", card: { name: "Zap", rarity: "common", elixir: 2, type: "Spell", hasEvo: true, hasHero: false, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/zap.png" }, evoUnlocked: false, isHeroSlot: true },
        { id: 2, name: "Slot 2", card: { name: "Heal Spirit", rarity: "rare", elixir: 1, type: "Troop", hasEvo: false, hasHero: false, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/heal-spirit.png" }, evoUnlocked: false, isHeroSlot: true },
        { id: 3, name: "Slot 3", card: { name: "Fire Spirit", rarity: "common", elixir: 1, type: "Troop", hasEvo: false, hasHero: false, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/fire-spirit.png" }, evoUnlocked: false, isHeroSlot: true },
        { id: 4, name: "Slot 4", card: { name: "Electro Spirit", rarity: "common", elixir: 1, type: "Troop", hasEvo: false, hasHero: false, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/electro-spirit.png" }, evoUnlocked: false },
        { id: 5, name: "Slot 5", card: { name: "Ice Spirit", rarity: "common", elixir: 1, type: "Troop", hasEvo: true, hasHero: false, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/ice-spirit.png" }, evoUnlocked: false },
        { id: 6, name: "Slot 6", card: { name: "Skeletons", rarity: "common", elixir: 1, type: "Troop", hasEvo: true, hasHero: false, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/skeletons.png" }, evoUnlocked: false },
        { id: 7, name: "Slot 7", card: { name: "Mirror", rarity: "epic", elixir: 1, type: "Spell", hasEvo: false, hasHero: false, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/mirror.png" }, evoUnlocked: false },
        { id: 8, name: "Slot 8", card: defaultSlot8Card, evoUnlocked: false }
    ],
    activeTowerId: "cannoneer"
});

const defaultPlayerState = (defaultSlot8Card) => ({
    crowns: 0,
    activeDeckIndex: 0,
    slotCaps: { 1: 2, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 2 },
    unlockedHeroSlots: [1],
    unlockedTowers: ["cannoneer"],
    unlockedCatalog: [
        { name: "Zap", rarity: "common", elixir: 2, type: "Spell", hasEvo: true, hasHero: false, isEvoUnlocked: false, isHeroUnlocked: false, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/zap.png" },
        { name: "Heal Spirit", rarity: "rare", elixir: 1, type: "Troop", hasEvo: false, hasHero: false, isEvoUnlocked: false, isHeroUnlocked: false, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/heal-spirit.png" },
        { name: "Fire Spirit", rarity: "common", elixir: 1, type: "Troop", hasEvo: false, hasHero: false, isEvoUnlocked: false, isHeroUnlocked: false, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/fire-spirit.png" },
        { name: "Electro Spirit", rarity: "common", elixir: 1, type: "Troop", hasEvo: false, hasHero: false, isEvoUnlocked: false, isHeroUnlocked: false, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/electro-spirit.png" },
        { name: "Ice Spirit", rarity: "common", elixir: 1, type: "Troop", hasEvo: true, hasHero: false, isEvoUnlocked: false, isHeroUnlocked: false, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/ice-spirit.png" },
        { name: "Skeletons", rarity: "common", elixir: 1, type: "Troop", hasEvo: true, hasHero: false, isEvoUnlocked: false, isHeroUnlocked: false, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/skeletons.png" },
        { name: "Mirror", rarity: "epic", elixir: 1, type: "Spell", hasEvo: false, hasHero: false, isEvoUnlocked: false, isHeroUnlocked: false, iconUrl: "https://raw.githubusercontent.com/RoyaleAPI/cr-api-assets/master/cards-75/mirror.png" },
        { ...defaultSlot8Card, isEvoUnlocked: false, isHeroUnlocked: true }
    ],
    decks: [
        createInitialDeck(defaultSlot8Card),
        createInitialDeck(defaultSlot8Card),
        createInitialDeck(defaultSlot8Card),
        createInitialDeck(defaultSlot8Card),
        createInitialDeck(defaultSlot8Card)
    ]
});

let globalState = {
    activePlayer: "Mage master117",
    players: {
        "Mage master117": defaultPlayerState(GOBLINS_CARD),
        "Faversaver": defaultPlayerState(BARB_BARREL_CARD)
    },
    h2h: { mageWins: 0, faverWins: 0 }
};

const rarityCosts = { common: 5, rare: 10, epic: 15, legendary: 30 };

function getUpgradeCost(currentCap) {
    if (currentCap === 1) return 20;
    if (currentCap === 2) return 30;
    return 40; 
}

let selectedMageScore = 0;
let selectedFaverScore = 0;

function saveLocalState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
}

function loadLocalState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            globalState = JSON.parse(saved);
            migratePlayerStates();
        } catch(e) { console.error("Error loading state", e); }
    }
}

function migratePlayerStates() {
    Object.keys(globalState.players).forEach(pKey => {
        const pState = globalState.players[pKey];
        if (pState.unlockedCatalog) {
            pState.unlockedCatalog.forEach(catCard => {
                const dbCard = cardDatabase.find(c => c.name === catCard.name);
                if (dbCard) {
                    catCard.hasEvo = dbCard.hasEvo;
                    catCard.hasHero = dbCard.hasHero;
                    catCard.iconUrl = dbCard.iconUrl;
                }
            });
        }
    });
    saveLocalState();
}

function switchPlayer(playerName) {
    globalState.activePlayer = playerName;
    saveLocalState();
    renderUI();
}

function switchDeck(index) {
    const pState = globalState.players[globalState.activePlayer];
    pState.activeDeckIndex = index;
    saveLocalState();
    renderUI();
}

function getHighestUnlockedCap() {
    const pState = globalState.players[globalState.activePlayer];
    const caps = Object.values(pState.slotCaps);
    return Math.max(...caps, 1);
}

/* --- MATCH RECORDING FUNCTIONS --- */

function openMatchModal() {
    selectedMageScore = 0;
    selectedFaverScore = 0;
    if (document.getElementById('match-mage-score-disp')) document.getElementById('match-mage-score-disp').innerText = "+0 Crowns";
    if (document.getElementById('match-faver-score-disp')) document.getElementById('match-faver-score-disp').innerText = "+0 Crowns";
    const modal = document.getElementById('match-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeMatchModal() {
    const modal = document.getElementById('match-modal');
    if (modal) modal.classList.add('hidden');
}

function setPlayerScore(player, amount) {
    if (player === "Mage master117") {
        selectedMageScore = amount;
        if (document.getElementById('match-mage-score-disp')) {
            document.getElementById('match-mage-score-disp').innerText = `+${amount} Crowns`;
        }
    } else {
        selectedFaverScore = amount;
        if (document.getElementById('match-faver-score-disp')) {
            document.getElementById('match-faver-score-disp').innerText = `+${amount} Crowns`;
        }
    }
}

function submitMatchResult() {
    globalState.players["Mage master117"].crowns += selectedMageScore;
    globalState.players["Faversaver"].crowns += selectedFaverScore;

    if (selectedMageScore > selectedFaverScore) globalState.h2h.mageWins += 1;
    else if (selectedFaverScore > selectedMageScore) globalState.h2h.faverWins += 1;

    saveLocalState();
    closeMatchModal();
    renderUI();
    showToast(`Match recorded! Mage: +${selectedMageScore}👑 | Faver: +${selectedFaverScore}👑`);
}

/* --- SLOT UPGRADES & HERO UNLOCKS --- */

function unlockHeroSlot(slotId) {
    const pState = globalState.players[globalState.activePlayer];
    if (pState.crowns < 80) {
        showToast("Requires 80 Crowns to unlock Hero/Evo slot eligibility!");
        return;
    }
    pState.crowns -= 80;
    pState.unlockedHeroSlots.push(slotId);
    saveLocalState();
    renderUI();
    showToast(`Unlocked Hero/Evo Eligibility for Slot ${slotId}!`);
}

function upgradeSlotCap(slotId) {
    const pState = globalState.players[globalState.activePlayer];
    const currentCap = pState.slotCaps[slotId] || 1;
    const cost = getUpgradeCost(currentCap);

    if (pState.crowns < cost) {
        showToast(`Insufficient Crowns! Requires ${cost} 👑`);
        return;
    }
    pState.crowns -= cost;
    pState.slotCaps[slotId] = currentCap + 1;
    saveLocalState();
    renderUI();
    showToast(`Slot ${slotId} Cap upgraded to ${currentCap + 1}!`);
}

/* --- ROLL CARD CHEST FUNCTIONS --- */

function openRollModal() {
    const highestCap = getHighestUnlockedCap();
    if (document.getElementById('modal-slot-title')) document.getElementById('modal-slot-title').innerText = `Roll Card Chest`;
    if (document.getElementById('modal-slot-subtitle')) document.getElementById('modal-slot-subtitle').innerText = `Your highest unlocked cap is ${highestCap} Elixir. Draws 1-${highestCap} Elixir cards into Catalog:`;

    const modal = document.getElementById('roll-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeRollModal() {
    const modal = document.getElementById('roll-modal');
    if (modal) modal.classList.add('hidden');
}

function confirmAndRoll(rarity) {
    const cost = rarityCosts[rarity] || 5;
    const pState = globalState.players[globalState.activePlayer];
    if (pState.crowns < cost) {
        showToast(`Not enough crowns! Need ${cost} 👑`);
        return;
    }

    const maxCap = getHighestUnlockedCap();
    const validCards = cardDatabase.filter(c => c.rarity === rarity && c.elixir <= maxCap);

    if (validCards.length === 0) {
        showToast(`No ${rarity.toUpperCase()} cards fit your highest unlocked Elixir cap (${maxCap}). Upgrade slot caps first!`);
        return;
    }

    pState.crowns -= cost;
    const drawnCard = validCards[Math.floor(Math.random() * validCards.length)];
    const isAlreadyInCatalog = pState.unlockedCatalog.some(c => c.name === drawnCard.name);

    if (!isAlreadyInCatalog) {
        pState.unlockedCatalog.push({ ...drawnCard, isEvoUnlocked: false, isHeroUnlocked: false });
        showToast(`UNLOCKED: ${drawnCard.name} (${drawnCard.elixir} Elixir) added to Catalog!`);
    } else {
        const refundAmount = Math.round(cost * 0.75);
        pState.crowns += refundAmount;
        showToast(`DUPLICATE! ${drawnCard.name} is already in Catalog. Refunded ${refundAmount} 👑 (75%)!`);
    }

    saveLocalState();
    closeRollModal();
    renderUI();
}

/* --- SPECIAL 50-CROWN CHEST FUNCTIONS --- */

function buyRandomEvoChest() {
    const pState = globalState.players[globalState.activePlayer];
    if (pState.crowns < 50) {
        showToast("Requires 50 Crowns to open an Evolution Chest!");
        return;
    }

    const availableEvos = cardDatabase.filter(c => {
        if (!c.hasEvo) return false;
        const catCard = pState.unlockedCatalog.find(cat => cat.name === c.name);
        return !catCard || !catCard.isEvoUnlocked;
    });

    if (availableEvos.length === 0) {
        showToast("You have already unlocked ALL available Card Evolutions!");
        return;
    }

    pState.crowns -= 50;
    const targetCard = availableEvos[Math.floor(Math.random() * availableEvos.length)];

    let catCard = pState.unlockedCatalog.find(c => c.name === targetCard.name);
    if (!catCard) {
        catCard = { ...targetCard, isEvoUnlocked: true, isHeroUnlocked: false };
        pState.unlockedCatalog.push(catCard);
    } else {
        catCard.isEvoUnlocked = true;
    }

    saveLocalState();
    renderUI();
    showToast(`✨ EVOLUTION UNLOCKED: ${targetCard.name}!`);
}

function buyRandomHeroChest() {
    const pState = globalState.players[globalState.activePlayer];
    if (pState.crowns < 50) {
        showToast("Requires 50 Crowns to open a Hero Chest!");
        return;
    }

    const availableHeroes = cardDatabase.filter(c => {
        if (!c.hasHero) return false;
        const catCard = pState.unlockedCatalog.find(cat => cat.name === c.name);
        return !catCard || !catCard.isHeroUnlocked;
    });

    if (availableHeroes.length === 0) {
        showToast("You have already unlocked ALL available Hero abilities!");
        return;
    }

    pState.crowns -= 50;
    const targetCard = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];

    let catCard = pState.unlockedCatalog.find(c => c.name === targetCard.name);
    if (!catCard) {
        catCard = { ...targetCard, isEvoUnlocked: false, isHeroUnlocked: true };
        pState.unlockedCatalog.push(catCard);
    } else {
        catCard.isHeroUnlocked = true;
    }

    saveLocalState();
    renderUI();
    showToast(`👑 HERO UNLOCKED: ${targetCard.name}!`);
}

function buyRandomChampionChest() {
    const pState = globalState.players[globalState.activePlayer];
    if (pState.crowns < 50) {
        showToast("Requires 50 Crowns to open a Champion Chest!");
        return;
    }

    const availableChampions = cardDatabase.filter(c => {
        if (c.rarity !== "champion") return false;
        return !pState.unlockedCatalog.some(cat => cat.name === c.name);
    });

    if (availableChampions.length === 0) {
        showToast("You have already unlocked ALL Champion cards!");
        return;
    }

    pState.crowns -= 50;
    const drawnChamp = availableChampions[Math.floor(Math.random() * availableChampions.length)];

    pState.unlockedCatalog.push({ ...drawnChamp, isEvoUnlocked: false, isHeroUnlocked: false });

    saveLocalState();
    renderUI();
    showToast(`🏆 CHAMPION UNLOCKED: ${drawnChamp.name}!`);
}

/* --- CATALOG & TOWER EQUIP FUNCTIONS --- */

function openCatalogModal() {
    const pState = globalState.players[globalState.activePlayer];
    const activeDeck = pState.decks[pState.activeDeckIndex];
    
    if (document.getElementById('modal-catalog-count')) {
        document.getElementById('modal-catalog-count').innerText = pState.unlockedCatalog.length;
    }
    
    const slotSelect = document.getElementById('catalog-target-slot');
    if (slotSelect) {
        slotSelect.innerHTML = "";
        activeDeck.slots.forEach(slot => {
            const opt = document.createElement('option');
            opt.value = slot.id;
            const slotCap = pState.slotCaps[slot.id] || 1;
            opt.innerText = `${slot.name} (Cap: ${slotCap} Elixir)`;
            slotSelect.appendChild(opt);
        });
    }

    renderCatalogGrid();
    const modal = document.getElementById('catalog-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeCatalogModal() {
    const modal = document.getElementById('catalog-modal');
    if (modal) modal.classList.add('hidden');
}

function equipCardFromCatalog(cardName) {
    const pState = globalState.players[globalState.activePlayer];
    const activeDeck = pState.decks[pState.activeDeckIndex];
    const targetSlotElem = document.getElementById('catalog-target-slot');
    if (!targetSlotElem) return;
    
    const targetSlotId = parseInt(targetSlotElem.value);
    const slot = activeDeck.slots.find(s => s.id === targetSlotId);
    const slotCap = pState.slotCaps[slot.id] || 1;
    const card = pState.unlockedCatalog.find(c => c.name === cardName);

    if (card.elixir > slotCap) {
        showToast(`Cannot equip ${card.name} (${card.elixir} Elixir)! ${slot.name} cap is ${slotCap}.`);
        return;
    }

    slot.card = { ...card };
    slot.evoUnlocked = card.isEvoUnlocked;
    saveLocalState();
    renderUI();
    closeCatalogModal();
    showToast(`Equipped ${card.name} into ${slot.name}!`);
}

function openTowerCatalogModal() {
    renderTowerCatalogGrid();
    const modal = document.getElementById('tower-catalog-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeTowerCatalogModal() {
    const modal = document.getElementById('tower-catalog-modal');
    if (modal) modal.classList.add('hidden');
}

function unlockTower(towerId) {
    const pState = globalState.players[globalState.activePlayer];
    if (pState.crowns < 100) {
        showToast("Requires 100 Crowns to unlock this Tower Troop!");
        return;
    }
    pState.crowns -= 100;
    pState.unlockedTowers.push(towerId);
    saveLocalState();
    renderTowerCatalogGrid();
    renderUI();
    const tower = towerTroopDatabase.find(t => t.id === towerId);
    showToast(`Unlocked ${tower.name} for 100 Crowns!`);
}

function equipTower(towerId) {
    const pState = globalState.players[globalState.activePlayer];
    const activeDeck = pState.decks[pState.activeDeckIndex];
    activeDeck.activeTowerId = towerId;
    saveLocalState();
    renderTowerCatalogGrid();
    renderUI();
    closeTowerCatalogModal();
    const tower = towerTroopDatabase.find(t => t.id === towerId);
    showToast(`Equipped ${tower.name} as Deck ${pState.activeDeckIndex + 1} Tower!`);
}

/* --- TOAST NOTIFICATIONS --- */

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}