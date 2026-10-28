// Complete Internationalization (i18n) Engine for Bangla Fishing Game
// Supports full bilingual switching: বাংলা (Bengali) & English

export const I18N = {
  bn: {
    // Start Menu
    startBadge: 'নদীমাতৃক বাংলাদেশ • ঐতিহ্যবাহী মৎস্য শিকার',
    startTitle: 'মৎস্য শিকারী',
    startTitleSub: 'B A N G L A   R I V E R   A N G L E R',
    startTagline: 'ভাটিয়ালি সুর, শান্ত নদী আর রূপালি মাছের ঝাঁক',
    startDesc: 'পদ্মার উত্তাল মোহনা, বিল-হাওড়ের শান্ত জল কিংবা সুন্দরবনের গহীনে—বাঁশের ছিপ, সুতি খেপ জাল ও পলো নিয়ে গ্রাম বাংলার চিরায়ত শিকারের স্বাদ নিন।',
    startPlayBtn: '🎣 নদীতে নামেন',
    startHint: '<kbd>Space</kbd> বা <kbd>Enter</kbd> চেপে নামুন',
    rulesTitle: 'কীভাবে শিকার করবেন <span id="rulesChevron" class="rules-chevron">⌃</span>',
    rulesSub: '৩টি সনাতন শিকার পদ্ধতি',
    ruleRodTitle: 'বাঁশের ছিপ ও বড়শি',
    ruleRodDesc: 'পাওয়ার মেপে পানিতে ফেলুন। টোপে মাছ টানলে গ্রিন জোনে ব্যালান্স রেখে রিল টানুন।',
    ruleNetTitle: 'সুতি খেপ জাল',
    ruleNetDesc: 'মাছের ঝাঁকে নিশানা তাক করে জাল ছুড়ে এক নিক্ষেপেই একঝাঁক মাছ তুলে আনুন।',
    rulePolloTitle: 'বাঁশের পলো শিকার',
    rulePolloDesc: 'হাওড়ের জলে কাদা মাড়িয়ে বুদবুদের ওপর পলো চাপুন, খাঁচায় হাত দিয়ে শিকার ধরুন।',
    ruleRadioTitle: 'ভাটিয়ালি লোকগীতি বেতার',
    ruleRadioDesc: 'মন মাঝি তোর বৈঠা নে রে ও পদ্মার একতারার সুরে নদীর গভীরতায় অবগাহন করুন।',
    ruleMarketTitle: 'মাছের আড়ৎ ও কাষ্ঠ ডিঙি নৌকা',
    ruleMarketDesc: 'তাজা মাছ ঘাটের আড়তে বেচে টাকা জমান, কাঠের ডিঙি আনলক করে পদ্মায় পাড়ি জমান।',
    chipFish: '<kbd>Space</kbd> / <kbd>Click</kbd> শিকার',
    chipAim: '<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> নিশানা / হাঁটা',
    chipBorshi: '<kbd>1</kbd> ছিপ',
    chipJhal: '<kbd>2</kbd> জাল',
    chipPollo: '<kbd>3</kbd> পলো',
    chipMarket: '<kbd>M</kbd> আড়ৎ',
    chipBook: '<kbd>E</kbd> বই',
    chipGear: '<kbd>G</kbd> সরঞ্জাম',
    chipTitles: '<kbd>T</kbd> পদবি',
    chipMenu: '<kbd>P</kbd> মেনু',
    chipLang: '<kbd>L</kbd> ভাষা',
    soundLabelOn: 'সাউন্ড: চালু',
    soundLabelOff: 'সাউন্ড: বন্ধ',
    touchBtn: '📱 টাচ কন্ট্রোল',
    helpBtn: '❓ বিস্তারিত নির্দেশিকা',
    disclaimerBtn: 'ডিসক্লেইমার',
    disclaimerToast: '📜 ডিসক্লেইমার: নদীমাতৃক গ্রাম বাংলার ঐতিহ্যবাহী মাছ ধরার সংস্কৃতি ও দেশি মাছ সংরক্ষণে এক শৈল্পিক প্রয়াস।',
    langToggleLabel: 'English',
    langSwitchedToast: 'ভাষা পরিবর্তন করা হয়েছে: বাংলা 🌐',

    // In-game HUD
    hudBrandName: 'মৎস্য শিকারী',
    hudHubBtn: 'আড়ৎ ও সেবা',
    hudHubTitle: 'গ্রামের হাট ও সেবা',
    hudHubSub: '৪টি প্রধান কার্যক্রম',
    hubMarketTitle: 'মাছের আড়ৎ',
    hubMarketDesc: 'তাজা শিকার বিক্রি ও দরদাম',
    hubAlbumTitle: 'মাছ-বই',
    hubAlbumDesc: '৩০+ প্রজাতির রূপালি বিবরণ',
    hubShopTitle: 'সরঞ্জাম ও নৌকা',
    hubShopDesc: 'ছিপ, জাল ও ডিঙি আপগ্রেড',
    hubAchTitle: 'অর্জন ও পদবি',
    hubAchDesc: 'শিকারীর খেতাব ও ব্যাজ',
    hudPauseBtn: 'বিরতি',
    hudFullscreenBtn: 'পূর্ণপর্দা',
    hudFishUnit: 'টি মাছ',
    hudBaitLeft: 'টি বাকি',
    hudDolphinBuff: (mins, secs) => `🐬 শুশুকের আশীর্বাদ: ${mins}:${secs} (+৫০% বাইট)`,
    orientationHint: 'সেরা অভিজ্ঞতার জন্য ফোনটি আড়াআড়ি (Landscape) ঘুরিয়ে নিন',
    tensionLabel: 'টান (TENSION)',
    castPowerLabel: 'নিক্ষেপ শক্তি (CAST POWER)',
    fishStaminaLabel: '🐟 মাছের শক্তি (Fish Stamina)',

    // Tool dock
    toolBadge: 'হাতিয়ার',
    toolHint: 'ক্লিক করে বদলান',
    tools: {
      borshi: { name: 'বাঁশের ছিপ', hint: 'পাওয়ার দিয়ে ছিপ ফেলুন   [১]' },
      jhal: { name: 'সুতি খেপ জাল', hint: 'নিশানা করে জাল ফেলুন   [২]' },
      pollo: { name: 'বাঁশের পলো', hint: 'কাদায় হেঁটে পলো ফেলুন   [৩]' }
    },

    // Action button labels (Mobile / Desktop)
    actionLabels: {
      borshi: {
        idle: 'CAST\n(ছিপ ফেলুন)',
        charging: 'RELEASE\n(ছাড়ুন)',
        cast: 'WAITING...\n(অপেক্ষা)',
        nibble: 'HOOK!\n(টান দেন!)',
        fighting: 'REEL!\n(টানুন!)'
      },
      jhal: {
        idle: 'THROW NET\n(জাল ফেলুন)',
        aiming: 'RELEASE\n(ছুড়ুন)',
        hauling: 'HAULING\n(তুলছেন)'
      },
      pollo: {
        wading: 'SLAM POLLO\n(পলো ফেলুন)',
        trapped: 'GRAB FISH\n(হাত ঢুকান)'
      }
    },

    // Weather & Time
    weather: {
      clear: '☀️ রৌদ্রোজ্জ্বল',
      rain: '🌧️ বর্ষা বৃষ্টি',
      monsoon: '⛈️ উত্তাল ঝড়'
    },
    timeOfDay: {
      dawn: 'ভোর',
      day: 'দুপুর',
      dusk: 'গোধূলি',
      night: 'রাত'
    },

    // Ticker News
    tickerNews: [
      { tag: '🌊 পদ্মা:', text: 'মোহনায় ইলিশের রূপালি ঝাঁক দেখা গেছে!' },
      { tag: '🌧️ আবহাওয়া:', text: 'মেঘলা আকাশ ও বর্ষায় ইলিশ ও পাবদার বাইট বেশি মেলে' },
      { tag: '🧺 হাওড়-বিল:', text: 'কাদার ভেতর কই, শিং ও মাগুর মাছের বুদবুদ উঠছে—পলো নিয়ে নামুন!' },
      { tag: '🏪 মাছের আড়ৎ:', text: 'ঘাটের তাজা মাছের আড়তে বড় মাছের জন্য বেশি দাম পাওয়া যাচ্ছে' },
      { tag: '🐬 শুশুক ডলফিন:', text: 'খাঁড়িতে শুশুকের দেখা মিললে শিকারের সুযোগ বাড়ে দ্বিগুণেরও বেশি!' }
    ],

    // Modals
    modalPaused: '⏸️ স্থগিত',
    marketTitle: '🏪 মাছের আড়ৎ',
    tabMarket: '🏪 মাছের আড়ৎ',
    tabAlbum: '📖 মাছ-বই',
    tabShop: '⚙️ সরঞ্জাম দোকান',
    tabAch: '🏆 অর্জন ও খেতাব',
    marketTotalLabel: 'মোট বাজার মূল্য: ',
    marketSellAllBtn: 'সব মাছ বিক্রি করুন',
    marketEmpty: 'ঝাঁকা ফাঁকা! এখনো কোনো মাছ ধরা পড়েনি।',
    marketEmptySub: 'নদীতে নেমে ছিপ বা জাল ফেলে মাছ শিকার করুন!',
    marketSellSingle: 'বিক্রি',
    marketWeight: 'ওজন: ',
    marketCaughtAt: 'ধরা হয়েছে: ',

    albumTitle: '📖 মৎস্য এনসাইক্লোপিডিয়া',
    albumStats: (caught, total, pct) => `মোট প্রজাতি সম্পন্ন: ${caught} / ${total} (${pct}%)`,
    albumUndiscovered: 'অজানা মাছ',
    albumCaughtCount: (c) => `ধরা হয়েছে: ${c} বার`,
    albumMaxWeight: (w) => `সর্বোচ্চ ওজন: ${w} kg`,
    albumHabitat: 'আবাসস্থল: ',
    albumLockedHint: 'পানিতে ছিপ বা জাল ফেলে আবিষ্কার করুন!',

    shopTitle: '⚙️ শিকারের সরঞ্জাম ও আপগ্রেড',
    shopBaitHeader: 'মাছের পছন্দের টোপ',
    shopRodHeader: 'ছিপ ও আধুনিক রড',
    shopNetHeader: 'সুতি খেপ জাল আপগ্রেড',
    shopBoatHeader: 'কাষ্ঠ ডিঙি নৌকা ও বাহন',
    shopOwnedQty: (n) => `মজুদ আছে: ${n} টি`,
    shopPer5: '/ ৫টি',
    shopBuy5: 'কিনুন',
    shopUpgrade: 'আপগ্রেড',
    shopEquipped: 'সজ্জিত',
    shopFree: 'বিনামূল্যে',
    shopActive: 'সক্রিয়',
    shopPower: 'টান শক্তি: ',
    shopAccuracy: 'লক্ষ্য স্থিরতা: ',
    shopRadius: 'জালের ব্যাস: ',
    shopCatchRate: 'ধরা পড়ার হার: ',
    shopBuyBoat: 'ডিঙি নৌকা কিনুন',
    shopOwnedBoat: 'মালিকানা আছে',

    achTitle: '🏆 মৎস্য শিকারীর অর্জন ও খেতাব',
    achStats: (unlocked, total) => `সম্পন্ন: ${unlocked} / ${total} অর্জন আনলক`,
    achEquippedBanner: 'বর্তমান সজ্জিত খেতাব: ',
    achReward: 'পুরস্কার: +৳ ',
    achEquipBtn: 'খেতাব নিন',
    achEquippedBtn: '✓ সজ্জিত',
    achLocked: '🔒 লক করা',
    achTitleRewardLabel: 'খেতাব: ',

    trophyHeader: '🎉 মাছ ধরা পড়েছে!',
    trophyWeightLabel: 'ওজন',
    trophyValueLabel: 'বাজার মূল্য',
    trophyKeepBtn: 'ঝাঁকায় রাখুন',

    pauseTitle: '⏸️ খেলা স্থগিত',
    pauseRestHeading: 'বিশ্রাম নিচ্ছেন শিকারী!',
    pauseRestSub: 'নদীর জল শান্ত। একটু জিরিয়ে নিয়ে আবার ছিপ ফেলুন।',
    pauseStatLoc: 'বর্তমান অবস্থান',
    pauseStatTaka: 'জমানো অর্থ',
    pauseStatFish: 'ঝাঁকার মাছ',
    pauseStatTime: 'সময় ও আবহাওয়া',
    pauseGuideTitle: '⌨️ কন্ট্রোল গাইড',
    pauseResumeBtn: '▶️ খেলা চালিয়ে যান',
    pauseMainMenuBtn: '🏠 মূল মেনু',
    pauseResetBtn: '🔄 সেভ ডেটা রিসেট',
    pauseLangBtn: '🌐 ভাষা: ',

    helpTitle: '❓ খেলার নির্দেশিকা ও কন্ট্রোল',
    helpSec1Title: '⌨️ ডেক্সটপ কীবোর্ড ও মাউস কন্ট্রোল',
    helpSec2Title: '📱 মোবাইল টাচ কন্ট্রোল',
    helpSec3Title: '💡 সফল শিকারীর গোপন কৌশল',
    helpSec4Title: '👨‍💻 খেলা নির্মাতা পরিচিতি'
  },

  en: {
    // Start Menu
    startBadge: 'Riverine Bangladesh • Traditional Angling',
    startTitle: 'Bangla Fisher',
    startTitleSub: 'B A N G L A   R I V E R   A N G L E R',
    startTagline: 'Bhatiyali Melodies, Serene Waters & Silver Catches',
    startDesc: 'From the roaring waves of Padma to quiet Haor wetlands and the mystical Sundarbans mangroves—cast bamboo rods, throw traditional nets, and wade with bamboo traps.',
    startPlayBtn: '🎣 Start Fishing',
    startHint: 'Press <kbd>Space</kbd> or <kbd>Enter</kbd> to begin',
    rulesTitle: 'How to Fish <span id="rulesChevron" class="rules-chevron">⌃</span>',
    rulesSub: '3 Traditional Fishing Methods',
    ruleRodTitle: 'Bamboo Rod & Line',
    ruleRodDesc: 'Gauge your cast power into the water. When a fish bites, keep line tension inside the green sweet zone to reel in.',
    ruleNetTitle: 'Cotton Cast Net',
    ruleNetDesc: 'Aim your target circle over schooling fish shadows and fling the weighted net to harvest multiple fish in one cast.',
    rulePolloTitle: 'Handwoven Pollo Basket',
    rulePolloDesc: 'Wade into shallow Haor mud, slam the bamboo cage over bubble clusters, and reach through the top opening to grab fish.',
    ruleRadioTitle: 'Bhatiyali Folk Radio',
    ruleRadioDesc: 'Immerse yourself in authentic acoustic Bhatiyali tunes and procedural Ektara melodies as you fish.',
    ruleMarketTitle: 'Fish Market & Wooden Boat',
    ruleMarketDesc: 'Sell fresh catches at the river ghat for Taka, and unlock a wooden boat to venture into deep Padma waters.',
    chipFish: '<kbd>Space</kbd> / <kbd>Click</kbd> Action',
    chipAim: '<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Aim / Wade',
    chipBorshi: '<kbd>1</kbd> Rod',
    chipJhal: '<kbd>2</kbd> Net',
    chipPollo: '<kbd>3</kbd> Pollo',
    chipMarket: '<kbd>M</kbd> Market',
    chipBook: '<kbd>E</kbd> Book',
    chipGear: '<kbd>G</kbd> Gear',
    chipTitles: '<kbd>T</kbd> Titles',
    chipMenu: '<kbd>P</kbd> Menu',
    chipLang: '<kbd>L</kbd> Lang',
    soundLabelOn: 'Sound: On',
    soundLabelOff: 'Sound: Muted',
    touchBtn: '📱 Touch Controls',
    helpBtn: '❓ Help Guide',
    disclaimerBtn: 'Disclaimer',
    disclaimerToast: '📜 Disclaimer: A cultural celebration of traditional Bangladeshi riverine angling and native fish conservation.',
    langToggleLabel: 'বাংলা',
    langSwitchedToast: 'Language switched to: English 🌐',

    // In-game HUD
    hudBrandName: 'Bangla Fisher',
    hudHubBtn: 'Market & Hub',
    hudHubTitle: 'Village Market & Hub',
    hudHubSub: '4 Core Services',
    hubMarketTitle: 'Fish Market',
    hubMarketDesc: 'Sell fresh catches & bargain',
    hubAlbumTitle: 'Fish Encyclopedia',
    hubAlbumDesc: '30+ native species catalog',
    hubShopTitle: 'Gear & Boats',
    hubShopDesc: 'Rods, nets & boat upgrades',
    hubAchTitle: 'Achievements',
    hubAchDesc: 'Angler titles & badges',
    hudPauseBtn: 'Pause',
    hudFullscreenBtn: 'Fullscreen',
    hudFishUnit: 'Fish',
    hudBaitLeft: 'left',
    hudDolphinBuff: (mins, secs) => `🐬 Dolphin Blessing: ${mins}:${secs} (+50% Bite)`,
    orientationHint: 'For the best experience, rotate your device to Landscape',
    tensionLabel: 'LINE TENSION',
    castPowerLabel: 'CAST POWER',
    fishStaminaLabel: '🐟 Fish Stamina',

    // Tool dock
    toolBadge: 'Tool',
    toolHint: 'Click to switch',
    tools: {
      borshi: { name: 'Bamboo Rod', hint: 'Charge power to cast   [1]' },
      jhal: { name: 'Cast Net', hint: 'Aim and fling net   [2]' },
      pollo: { name: 'Pollo Basket', hint: 'Wade & slam trap   [3]' }
    },

    // Action button labels (Mobile / Desktop)
    actionLabels: {
      borshi: {
        idle: 'CAST\n(Throw Rod)',
        charging: 'RELEASE\n(Cast Line)',
        cast: 'WAITING...\n(For Bite)',
        nibble: 'HOOK!\n(Strike Now!)',
        fighting: 'REEL!\n(Reel In!)'
      },
      jhal: {
        idle: 'THROW NET\n(Cast Net)',
        aiming: 'RELEASE\n(Throw Now)',
        hauling: 'HAULING\n(Pulling Net)'
      },
      pollo: {
        wading: 'SLAM POLLO\n(Trap Mud)',
        trapped: 'GRAB FISH\n(Catch by Hand)'
      }
    },

    // Weather & Time
    weather: {
      clear: '☀️ Clear Weather',
      rain: '🌧️ Monsoon Rain',
      monsoon: '⛈️ Stormy Thunder'
    },
    timeOfDay: {
      dawn: 'Dawn',
      day: 'Day',
      dusk: 'Dusk',
      night: 'Night'
    },

    // Ticker News
    tickerNews: [
      { tag: '🌊 Padma River:', text: 'Silver schools of Royal Hilsa spotted near the estuary!' },
      { tag: '🌧️ Weather Alert:', text: 'Overcast monsoon rains dramatically boost Ilish & Pabda bite rates!' },
      { tag: '🧺 Haor & Beel:', text: 'Mud bubbles rising from Koi & Magur—grab your Pollo basket!' },
      { tag: '🏪 Fish Market:', text: 'High demand and premium Taka offered for trophy catches at the village ghat!' },
      { tag: '🐬 River Dolphin:', text: 'Spotting the Gangetic dolphin grants a 2-minute +50% speed bite blessing!' }
    ],

    // Modals
    modalPaused: '⏸️ Paused',
    marketTitle: '🏪 Village Fish Market',
    tabMarket: '🏪 Fish Market',
    tabAlbum: '📖 Fish Book',
    tabShop: '⚙️ Gear Shop',
    tabAch: '🏆 Achievements',
    marketTotalLabel: 'Total Market Value: ',
    marketSellAllBtn: 'Sell All Catches',
    marketEmpty: 'Basket is empty! No fish caught yet.',
    marketEmptySub: 'Cast your line into the river or throw a net to catch fish!',
    marketSellSingle: 'Sell',
    marketWeight: 'Weight: ',
    marketCaughtAt: 'Caught: ',

    albumTitle: '📖 Fish Encyclopedia',
    albumStats: (caught, total, pct) => `Species Discovered: ${caught} / ${total} (${pct}%)`,
    albumUndiscovered: 'Undiscovered Fish',
    albumCaughtCount: (c) => `Caught: ${c} times`,
    albumMaxWeight: (w) => `Max Weight: ${w} kg`,
    albumHabitat: 'Habitat: ',
    albumLockedHint: 'Cast your rod or net into the water to discover!',

    shopTitle: '⚙️ Fishing Gear & Boat Upgrades',
    shopBaitHeader: 'Fresh Natural Baits',
    shopRodHeader: 'Fishing Rods & Chhip Upgrades',
    shopNetHeader: 'Cast Net Upgrades',
    shopBoatHeader: 'Wooden Dinghi Boats',
    shopOwnedQty: (n) => `In Stock: ${n}`,
    shopPer5: '/ 5 pcs',
    shopBuy5: 'Buy 5',
    shopUpgrade: 'Upgrade',
    shopEquipped: 'Equipped',
    shopFree: 'Free',
    shopActive: 'Active',
    shopPower: 'Power: ',
    shopAccuracy: 'Sweet Spot: ',
    shopRadius: 'Net Radius: ',
    shopCatchRate: 'Catch Rate: ',
    shopBuyBoat: 'Buy Dinghi Boat',
    shopOwnedBoat: 'Owned & Ready',

    achTitle: '🏆 Angler Achievements & Titles',
    achStats: (unlocked, total) => `Completed: ${unlocked} / ${total} Unlocked`,
    achEquippedBanner: 'Currently Equipped Title: ',
    achReward: 'Reward: +৳ ',
    achEquipBtn: 'Equip Title',
    achEquippedBtn: '✓ Equipped',
    achLocked: '🔒 Locked',
    achTitleRewardLabel: 'Title: ',

    trophyHeader: '🎉 NEW CATCH!',
    trophyWeightLabel: 'Weight',
    trophyValueLabel: 'Market Value',
    trophyKeepBtn: 'Keep in Basket',

    pauseTitle: '⏸️ Game Paused',
    pauseRestHeading: 'Angler Taking a Rest!',
    pauseRestSub: 'The waters are peaceful. Take your time before casting again.',
    pauseStatLoc: 'Location',
    pauseStatTaka: 'Balance',
    pauseStatFish: 'In Basket',
    pauseStatTime: 'Time & Weather',
    pauseGuideTitle: '⌨️ Controls Guide',
    pauseResumeBtn: '▶️ Resume Game',
    pauseMainMenuBtn: '🏠 Start Menu',
    pauseResetBtn: '🔄 Reset All Progress',
    pauseLangBtn: '🌐 Language: ',

    helpTitle: '❓ How to Play & Controls',
    helpSec1Title: '⌨️ Desktop Keyboard & Mouse Controls',
    helpSec2Title: '📱 Touch & Mobile Controls',
    helpSec3Title: '💡 Pro Fishing Tips',
    helpSec4Title: '👨‍💻 Game Creator & Portfolio'
  }
};

export function t(key, lang = 'bn', ...args) {
  const dict = I18N[lang] || I18N.bn;
  const val = dict[key] !== undefined ? dict[key] : (I18N.bn[key] || key);
  if (typeof val === 'function') {
    return val(...args);
  }
  return val;
}

