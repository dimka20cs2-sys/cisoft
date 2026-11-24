// Переводы программ (English): id → поля, по образцу items.js.
// short, description[], features[[название, текст]], notes[], changes[[…] по записям changelog], shots[] (подписи скриншотов),
// req[], tags[], pro[]. null — общая строка из js/i18n-dict.js; чего нет — показывается по-русски.
window.ITEMS_I18N = window.ITEMS_I18N || {};
window.ITEMS_I18N.en = {
"haven-frontier": {
  short: "An isometric city builder with survival and economy: from three huts to a metropolis through fires, floods and harsh winters.",
  description: [
    "Haven Frontier is a cozy but demanding city strategy. You start with a town hall and three huts on a procedural map with hills, rivers, forests and cliffs, and lead your city through four eras — from Village to a shining Metropolis. Every building needs space, a road and upkeep, while residents need food, water, jobs, leisure and services.",
    "The economy is fair: storage limits, a daily water and power balance, taxes that hurt happiness, and buildings that shut down when the treasury is empty. Fires, epidemics, floods, strikes, crop failures and blizzards force choices — quarantine, calling the fire brigade or cutting taxes all have a price. English, Russian and Ukrainian, gamepad support."
  ],
  features: [
    ["22 buildings and 16 technologies", "Upgrades up to level 3, a tech tree from fire codes to the subway."],
    ["Living economy", "Resources with storage, water and power balance, 0–30% taxes, building upkeep."],
    ["Crises with choices", "Fires, epidemics, floods, strikes, crop failures and blizzards — you decide how to respond."],
    ["Four modes", "A 5-scenario campaign, free play, Survival with harsh winters, and a sandbox."],
    ["A living city", "Residents and cars in the streets, day and night, four seasons and weather."],
    ["Comfort", "11 overlays, a minimap, an advisor, charts, 30 achievements, 6 save slots."]
  ],
  notes: [null, null],
  changes: [[null]],
  shots: [null, "A summer city from a bird's-eye view", "Market, factories and the building panel", "Survival: a winter night", "A fire at dusk — choose your response", "Tech tree", "A school and education coverage"],
  req: [null, null, null],
  tags: ["game", "city builder", "strategy", "economy", "survival"]
},
"frostmarch": {
  short: "HD survival in a frozen wasteland: 3D in first and third person, 4K textures, your own character, blizzards and northern lights, 80 recipes and a path to the lighthouse.",
  description: [
    "You wake up in the middle of a frozen wasteland, and the blizzard grows stronger every day. Watch your warmth, hunger, thirst and stamina, melt snow, cook, sew clothes and build a warm base — walls, shelters, a stove, a bed, a workbench and traps.",
    "A huge procedural world: snowy forests, frozen lakes with ice fishing, caves with ore, ruins, an observatory and a mine. Wolf packs, a bear, cave crawlers and ice wraiths at night. Find a lens, a gear and oil, light the lighthouse in the north and survive until the ship arrives — or play an endless winter. English, Russian and Ukrainian, gamepad support."
  ],
  features: [
    ["Warmth comes first", "Campfires, closed rooms, shelters and clothing decide whether you make it through the night."],
    ["80 recipes, 104 items", "Tools, weapons, clothing, food and buildings — from a stick to a smelter and a tannery."],
    ["A huge procedural world", "320×320 tiles: forests, lakes, caves, ruins, an observatory, a mine and a lighthouse."],
    ["Dangerous nights", "Wolf packs, a bear, cave crawlers and ice wraiths; blizzards grow stronger every day."],
    ["Story and endless winter", "Light the lighthouse and wait for the ship (2–4 hours) — or survive forever."],
    ["30 achievements, gamepad, 3 languages", "3 difficulty levels, notes, autosave, key remapping."]
  ],
  notes: [null, null],
  changes: [
    ["HD world: 4K textures, detailed trees, rocks and animals, a real sky with clouds, stars and the Milky Way", "New lighting with sky reflections, soft shadows and a cold cinematic look; smooth snowy mountains", "Your survivor: a full 3D character, third-person view (V) and an appearance editor", "New first-person hands: sleeves, gloves and fingers with lively animations", "Modern HUD: stat rings, a “feels like” thermometer, a compass with markers, 3D item icons, notifications", "Roofs over your rooms and windows that glow at night", "10 music tracks, wind and blizzards, footsteps on snow, ice and wood, breath in the frost"],
    ["Frostmarch 2.0: full first-person 3D", "HD graphics: procedural textures with normal maps, sun and campfire shadows, bloom, ambient occlusion and light shafts", "Day-night cycle with stars and northern lights, blizzards, breath vapor and footprints in the snow", "Hands and tools in view; a crosshair that highlights targets — chop, mine, open and build", "Graphics settings: quality presets with GPU auto-detection, render scale, shadows, FOV, mouse sensitivity", "5 new achievements (35 in total)", "Version 1.0 saves keep working"],
    [null]
  ],
  shots: [null, "A survivor by the campfire", "Night, a torch and wolves", "A house under the northern lights", "Mountains and ore", "Inventory and character", "The lighthouse"],
  req: [null, "8 GB RAM, a WebGL2-capable GPU (GTX 1050 / RX 560 or better for High)", "1 GB of free space", null],
  tags: ["game", "survival", "pixel art", "crafting", "open world"]
},
"ultra": {
  short: "Pro in every AkeeTech app plus professional features: automation, audits and reports, monitoring with history, Telegram notifications, a command line.",
  description: [
    "AkeeTech Ultra is the top tier. One key unlocks Pro in every AkeeTech app, and in 35 Windows apps it adds professional features on par with paid tools: snapshots and comparisons over time, rules and automation, security audits, monitoring with charts and history, HTML/CSV/JSON reports, Telegram and webhook notifications, a command line for scripts and much more.",
    "Examples: ARP spoofing detection in NetRadar, broadcast-standard audio mastering in RecCast and FrameCut, crash and mod compatibility analysis in ModNest, deduplicated world versions in CraftVault, a firewall between members in SquadLAN, rule-based traffic splitting in TunnelBox. The golden “★ Ultra” button in every app shows its Ultra features; without a key they're visible but open the purchase window.",
    "Also included: exclusive themes, accent colors, hotkeys, a quick launcher and a settings backup for all apps."
  ],
  features: [
    ["Pro in every app", "More than 70 Windows apps and 12 Android apps — every Pro feature with one key."],
    ["Professional features", "35 apps got 3–4 Ultra features each: audits, automation, reports, monitoring, CLI."],
    ["Notifications and integrations", "Telegram bot, webhook, HTML/CSV/JSON reports — for scheduled jobs and scripts."],
    ["Studio audio and video", "Loudness normalization, noise reduction, chapters, batch export in RecCast, FrameCut, Melodia, VoiceNote."],
    ["For admins", "Network and PC snapshots, comparisons, audits of services, accounts, drivers and tasks, a PC fleet over WMI."],
    ["Ultra panel", "Themes, scaling, hotkeys, a quick launcher for all apps and a settings backup."]
  ],
  notes: ["PC games (VoidSwarm, Pixel Bastion, Deep Drill) are not included — they're sold separately."],
  changes: [
    ["Professional Ultra features in 35 apps", "Telegram and webhook notifications, reports, command line"],
    ["Ultra panel in every Windows app", "7 exclusive themes, accent colors, interface scaling", "Always on top, transparency, hotkeys", "Quick launcher and settings backup"],
    ["AkeeTech Ultra launch"]
  ],
  shots: ["Ultra panel: themes, window, hotkeys, quick launcher", "The Neon theme in ModNest", "The Sakura theme in Lumo", "The Gold theme in TunnelBox"],
  req: ["Any AkeeTech app for Windows or Android"],
  tags: ["ultra", "all apps", "pro", "key", "bundle", "discount"],
  pro: [
    "Pro in ALL AkeeTech apps for Windows and Android — with one key",
    "Professional Ultra features in 35 apps: audits, automation, monitoring, reports",
    "Telegram and webhook notifications, a command line for scripts",
    "Audio mastering, chapters, batch export and smart cutting in the media apps",
    "Mod analysis, crash diagnostics and world versions in the Minecraft apps",
    "Themes, hotkeys, a quick launcher, a settings backup",
    "The golden ULTRA badge and all future AkeeTech apps"
  ]
},
"pc-monitor": {
  short: "Full PC analytics, RAM cleanup and Windows optimization in one window.",
  description: [
    "Pulse shows what's happening with your computer right now: CPU load per core, memory, GPU, disks and network — with live charts.",
    "One button frees up RAM, cleans temporary files and the Recycle Bin, and manages startup apps and power plans. It runs in the tray and can clean memory on its own when it runs low."
  ],
  features: [
    ["Live analytics", "CPU, every core, RAM, GPU, disks and network — charts for the last minute."],
    ["RAM cleanup", "Quick and deep memory cleanup, automatic cleanup at a set load."],
    ["Processes", "Sorting, search, ending tasks, memory trimming and priority changes."],
    ["Hardware", "CPU, motherboard, memory sticks, GPUs, SSD/HDD, battery wear — with a report to a file."],
    ["Optimization", "Temporary files, Recycle Bin, DNS cache, power plans, Windows tools."],
    ["Startup", "Enable and disable apps at Windows startup — just like in Task Manager."]
  ],
  notes: ["Windows may show “Windows protected your PC” — the app isn't signed with a paid certificate. Click “More info” → “Run anyway”.", "Uninstalls like any other app: Settings → Apps → Pulse."],
  changes: [[null]],
  shots: ["System overview", "Optimization", "Disks"],
  req: [null, "No admin rights needed (recommended for deep RAM cleanup)"],
  tags: ["Windows", "optimization", "RAM"]
},
"mc-backup": {
  short: "Minecraft world backups in one click — and automatically while you play.",
  description: [
    "CraftVault finds all your worlds by itself: in the regular .minecraft folder (official launcher, TLauncher) and in every Prism Launcher, PolyMC and MultiMC instance. You can also add your own saves folder.",
    "Backups are saved as zip archives in “Documents\\MC Backups”. If a world breaks, your house burns down or items go missing, pick a copy and click “Restore”. The current state of the world is saved first, so nothing is lost."
  ],
  features: [
    ["All launchers", "Official, TLauncher, Prism, PolyMC, MultiMC — worlds are found automatically."],
    ["One-click backup", "The selected world or all of them, with progress and archive size."],
    ["Auto-backup", "Hourly (every 10–30 minutes in Pro), copies only changed worlds and runs from the tray."],
    ["Safe restore", "Before restoring, the current world is saved as a separate copy."],
    ["Tidy backups", "Keeps the last N backups of each world and deletes older ones itself."],
    ["See what isn't saved", "Worlds without a fresh backup are highlighted in yellow."],
    ["★ Ultra: Deduplicated world versions", "Incremental backups: each world file (region, player, level.dat) is stored once with compression — hundreds of versions take the space of a few zips."],
    ["★ Ultra: Region-level version comparison", "What changed between versions or against the current world: regions with X/Z coordinates per dimension (Overworld, Nether, End), players, world settings."],
    ["★ Ultra: Selective rollback", "Restore only chosen regions or players (e.g. after griefing) or the whole world — the current state is saved as a version first."],
    ["★ Ultra: Event-based auto-versions", "A new version is saved 2 minutes after the world changes and right after Minecraft closes — only changed files."]
  ],
  notes: ["Close Minecraft before restoring a world — the app will remind you.", null],
  changes: [
    ["AkeeTech Ultra professional features: deduplicated world versions, region-level version comparison, selective rollback, event-based auto-versions", "Ultra: the “★ World versions” window — incremental deduplicated storage", "Ultra: region-level version comparison with coordinates", "Ultra: selective rollback of regions and players", "Ultra: auto-version on world changes and after the game closes"],
    [null, null],
    [null]
  ],
  shots: ["Worlds, backups and auto-backup settings"],
  req: [null, "Minecraft Java Edition (any launcher)"],
  tags: ["Minecraft", "backup", "TLauncher", "Prism"],
  pro: ["Auto-backup every 10, 15 or 30 minutes (hourly in the free version)", "Keep up to 100 copies of each world (up to 5 for free)", "Mirror backups to a second folder: USB drive, OneDrive, Google Drive", "Backup right after the game closes", null]
},
"mod-manager": {
  short: "Minecraft mods, resource packs, shaders, datapacks and whole modpacks from Modrinth in one click: search for your game version, install into the right folder, dependencies and updates.",
  description: [
    "ModNest finds your Minecraft installs by itself: .minecraft from the official launcher and TLauncher, and Prism Launcher, PolyMC, MultiMC and CurseForge instances. Based on the game version and loader (Fabric, Forge, NeoForge, Quilt), the Modrinth catalog shows only what will work. Mods are installed with their required dependencies, resource packs go to resourcepacks, shaders to shaderpacks, and datapacks to the chosen world's folder.",
    "The “Installed” tab shows everything in an instance: mods, resource packs, shaders and world datapacks. ModNest recognizes files by SHA-1 on Modrinth, shows names, icons and available updates, and only deletes to the Recycle Bin. If a shader needs Iris or OptiFine and neither is installed, the app warns you and installs Iris together with Sodium."
  ],
  features: [
    ["Modrinth catalog by type", "A “Mods / Resource packs / Shaders / Datapacks / Modpacks” switcher and categories: 16x, 32x, 64x+, realistic, PvP, fonts, sounds, shadows, low-end PCs and more."],
    ["For your game version", "Search and version picking respect the instance's Minecraft version and loader, and Iris or OptiFine for shaders. One-click picks: Faithful 32x, Fresh Animations, Complementary, BSL, Sildur's Vibrant."],
    ["The right folders", "Resource packs go to resourcepacks, shaders to shaderpacks, datapacks to saves\\<world>\\datapacks with a world picker. Every file's checksum is verified."],
    ["Resource packs and shaders", "See which resource packs are enabled in options.txt and which shader is active in Iris or OptiFine. SHA-1 detection, icons, updates, deletion to the Recycle Bin."],
    ["Modpacks (.mrpack)", "A Modrinth modpack becomes a new Prism Launcher instance: game version and loader from modrinth.index.json, mods downloaded with SHA-1/SHA-512 checks and only from trusted addresses."],
    ["Mods and updates", "Required dependencies are installed automatically, mods toggle on and off in one click, and updates are checked for the instance's game version and loader."],
    ["★ Ultra: Mod compatibility analysis", "Reads fabric.mod.json, quilt.mod.json and mods.toml inside jars: duplicates, mods for another loader or Minecraft version, missing and mismatched dependencies, known conflicts — with tips and an HTML report."],
    ["★ Ultra: Game crash diagnostics", "Parses crash-reports, latest.log and hs_err_pid: out of memory, Java version, dependencies, mixins, drivers, broken configs — and finds the likely culprit from the stack and the classes in jars."],
    ["★ Ultra: Sync modpacks with friends", "A compact modpack code for a friend and a comparison with theirs: what's missing, where versions differ, one-click install of missing mods from Modrinth."]
  ],
  notes: ["It's best to close Minecraft before installing mods — the app warns you if the game is running.", null],
  changes: [
    ["AkeeTech Ultra professional features: mod compatibility analysis, game crash diagnostics, modpack sync with friends", "Ultra: mod conflict and compatibility analysis", "Ultra: automatic crash diagnostics from crash logs", "Ultra: share a modpack by code and compare with a friend", "“★ Ultra” button on the mods panel"],
    ["Resource packs, shaders, datapacks and modpacks (.mrpack) from Modrinth", "One-click picks: Faithful, Complementary, BSL, Terralith…", "Enable resource packs and choose the active shader (Pro)", "Install a modpack as a Prism instance (Pro)"],
    [null]
  ],
  shots: ["The Modrinth catalog on the Resource packs tab: packs for Minecraft 1.21.1, one-click picks and categories"],
  req: [null, "Minecraft Java Edition (official launcher, TLauncher, Prism, CurseForge)"],
  tags: ["Minecraft", "mods", "resource packs", "shaders", "datapacks", "Modrinth", "modpacks"],
  pro: ["Update all mods and packs with one button", "Export and import modpacks (.mrpack)", "Mod profiles: switch sets quickly", "Back up the mods folder before changes", "Modpacks: install .mrpack as a new Prism profile in one click", "Resource packs and shaders: enable and switch the active one right from the app", null]
},
"lagzero": {
  short: "Lower ping and less lag: diagnostics to game servers, the fastest DNS and network tuning with rollback.",
  description: [
    "LagZero shows ping, jitter and packet loss to Minecraft, Steam and Riot servers, finds exactly where latency grows — on your Wi-Fi, at your ISP or further out — and suggests what to fix.",
    "The fastest DNS and Windows network tweaks for gaming in one click — and everything can be reverted."
  ],
  features: [
    ["Diagnostics to game servers", "Ping, jitter and loss to Hypixel, Steam, Riot and your own server in half a minute."],
    ["Traceroute with conclusions", "Shows the hop where ping grows: your Wi-Fi, your ISP or the backbone."],
    ["Best DNS", "Benchmarks six DNS servers and sets the fastest in one click."],
    ["Gaming optimization", "Nagle, network throttling and adapter power saving — with a “Revert all” button."],
    ["Who's eating bandwidth", "Apps with network connections and safely closing the extras before you play."],
    ["Ping monitor", "A 5-minute chart and a notification as soon as lag starts."]
  ],
  notes: ["Changing network settings needs admin rights — the app will offer to restart.", null],
  changes: [[null]],
  shots: ["Connection diagnostics and ping to servers"],
  req: [null],
  tags: ["ping", "lag", "DNS", "network", "games"],
  pro: ["One-click network optimization for gaming (Nagle, throttling, adapter)", "Automatically pick and set the fastest DNS", "Ping monitor with lag notifications", "Profiles for different games", null]
},
"aimdot": {
  short: "Your own crosshair over any game: cross, dot, circle — 12 presets, an editor and hotkeys.",
  description: [
    "AimDot draws a crosshair over the game in a transparent window: clicks pass through and the game keeps focus. The app doesn't read anything from the game or modify it.",
    "An editor with a live preview over Minecraft and CS backgrounds, 12 ready-made presets, crosshair codes for friends and importing settings from CS2."
  ],
  features: [
    ["Crosshair over the game", "A transparent window, clicks pass through, the game doesn't lose focus."],
    ["Live preview", "See how the crosshair looks in Minecraft, CS, in the dark and in light, plus a ×4 magnifier."],
    ["12 presets", "From “CS Classic” to “Sniper” and “Minecraft Plus” — in one click."],
    ["Crosshair code", "An “AIMDOT-…” string that's easy to share with friends."],
    ["Import from CS2", "Paste cl_crosshair… commands — AimDot converts them to pixels."],
    ["Hotkeys", "Ctrl+Shift+X — show/hide, Ctrl+Shift+C — next crosshair."]
  ],
  notes: ["Works in windowed and borderless game modes; in exclusive fullscreen the crosshair isn't visible.", "In competitive games with anti-cheat, use at your own risk.", null],
  changes: [[null]],
  shots: ["Crosshair editor with live preview"],
  req: [null],
  tags: ["crosshair", "crosshair", "overlay", "CS2", "Minecraft"],
  pro: ["Unlimited custom crosshairs (3 for free)", "Import crosshairs from CS2 (cl_crosshair…)", "Show the crosshair only when a chosen game is running", "Anchor to the game window's center and multi-monitor support", null]
},
"playhub": {
  short: "All your games in one place — Steam, Epic, Riot, Minecraft, Roblox — plus playtime tracking.",
  description: [
    "PlayHub finds games from Steam, Epic, Riot, Battle.net, EA, Ubisoft, Minecraft (including Prism instances), Roblox and Xbox by itself and gathers them into one library with covers.",
    "The app honestly counts how much you play — per game, per day, week and month — and reminds you to take a break."
  ],
  features: [
    ["All launchers in one window", "Games are found automatically, nothing to configure."],
    ["Steam-style covers", "Large cards, and a nice placeholder for other games."],
    ["Every Minecraft instance separately", "TLauncher and Prism instances are listed separately and launch in one click."],
    ["Honest time tracking", "By the game process, not the launcher; PC sleep and crashes don't spoil the stats."],
    ["Breaks and limits", "Gentle reminders to rest, without closing the game."],
    ["Statistics", "Charts, records, top games and CSV export."]
  ],
  notes: ["To always track time, enable autostart — the app will run quietly in the tray.", null],
  changes: [[null]],
  shots: ["Playtime statistics"],
  req: [null],
  tags: ["library", "launcher", "Steam", "playtime"],
  pro: ["Detailed stats: charts by day, week and month", "A daily playtime limit with reminders", "Custom covers and game collections", "Export game history to CSV", null]
},
"gametune": {
  short: "Tune Windows for gaming: Game Mode, GPU scheduling, no mouse acceleration, 144 Hz — safely and with rollback.",
  description: [
    "GameTune checks how ready Windows is for gaming and explains every item in plain words: what it does and whether there's any risk.",
    "Only safe, documented settings. Every change is remembered — you can revert everything with one button, even after a crash."
  ],
  features: [
    ["Readiness score", "A percentage and a clear explanation for each item."],
    ["Revert everything", "Previous values are saved before changes — “Restore everything” in one click."],
    ["Games on the GPU", "“High performance GPU” for detected games — important for laptops."],
    ["Max refresh rate", "Shows the current and maximum refresh rate and sets the maximum."],
    ["No Shift pop-ups", "Turns off only the Sticky Keys hotkey."],
    ["Auto-check", "Lets you know if a Windows update reset your settings."]
  ],
  notes: ["Some items (GPU scheduling) need admin rights and a reboot — the app will tell you.", null],
  changes: [[null]],
  shots: ["Checking Windows' gaming readiness"],
  req: [null],
  tags: ["Windows tuning", "FPS", "tweaks", "Game Mode"],
  pro: ["Apply all recommendations with one button", "Per-game settings: GPU and fullscreen mode", "Max refresh rate in one click", "Auto-check after Windows updates", null]
},
"senskit": {
  short: "Everything about your gaming mouse: polling rate, real DPI, sensitivity conversion between games and a mini aim trainer.",
  description: [
    "SensKit checks your mouse's polling rate and real DPI, turns off Windows acceleration and converts sensitivity between games via cm/360.",
    "Plus a mini aim trainer, a CPS test and a button chatter detector — to spot a worn-out mouse."
  ],
  features: [
    ["Honest polling rate", "Raw Input events, current and average rate in Hz."],
    ["Converter for 17 games", "CS2, Valorant, Minecraft, Fortnite, Apex, Overwatch and more — with cm/360 and eDPI."],
    ["Real DPI", "Move the mouse along a ruler — SensKit calculates the sensor's true DPI."],
    ["Acceleration in one click", "Turns off “Enhance pointer precision” and can restore it."],
    ["Mini aim trainer", "Flicks, Tracking and Precision with reaction time and records."],
    ["Chatter detector", "Finds buttons that double-click on their own."]
  ],
  notes: ["Multipliers for some games (Fortnite, R6, Roblox) are approximate — they're marked in the app.", null],
  changes: [[null]],
  shots: ["Sensitivity converter between games"],
  req: [null],
  tags: ["mouse", "sensitivity", "DPI", "aim trainer", "polling rate"],
  pro: ["Aim trainer: all modes and progress history", "Converter for 15+ games (free: Minecraft, CS2, Valorant)", "Mouse and game profiles with saved settings", "Detailed polling rate chart", null]
},
"wakeup": {
  short: "Turn on computers over the network in one click: Wake-on-LAN, finding PCs on the network and checking that they woke up.",
  description: [
    "WakeUp turns on computers, NAS boxes and media centers over the network with Wake-on-LAN: it sends a “magic packet” over UDP to the subnet broadcast address, then pings to confirm the computer really woke up and shows how many seconds it took.",
    "No need to type computers in by hand: WakeUp scans the local network, reads the Windows ARP table and DNS names — the PC you need is added in one click. The “WoL setup” page shows whether wake-up is allowed on this computer (powercfg) and tells you what to enable in the BIOS and the network card driver."
  ],
  features: [
    ["Computer list", "Name, MAC address, IP or network name, a custom broadcast address and port 9 or 7. MAC addresses are accepted in any form: with colons, dashes, dots or no separators."],
    ["Wake and verify", "The magic packet goes to the subnet broadcast and 255.255.255.255, then WakeUp pings the PC and shows “Waking… 14 s” → “Online in 38 s”."],
    ["Find PCs on the network", "A subnet scan, the Windows ARP table and DNS names. Double-click a found computer to add it — with MAC and IP."],
    ["Wake-on-LAN setup", "Which network cards in this PC can wake the computer, the powercfg /devicequery wake_armed list and step-by-step hints for the BIOS, driver and Windows."],
    ["Allow wake-up", "A button lets the network card wake the PC (powercfg, as administrator). “Restore” undoes only what WakeUp enabled."],
    ["Groups, schedule, shortcuts (Pro)", "“Wake all” and PC groups, scheduled wake-up via Windows Task Scheduler and a desktop shortcut that turns on a PC without opening the app."],
    ["★ Ultra: Wake-up in waves", "Wakes a group N PCs at a time with a pause (to avoid overloading the network and power), waits for a ping or TCP port response and reports who woke up."],
    ["★ Ultra: Fleet monitoring and uptime", "Periodic ping of all PCs with history, “on” percentage over 24 h and 7 days, the time of the last state change and an HTML/CSV report."],
    ["★ Ultra: Telegram and webhook alerts", "Reports when a PC turns on or off, and the outcome of a wake-up scenario."],
    ["★ Ultra: Command line for scripts", "WakeUp.exe --wake group --wave --delay --port --notify and --status with reports and exit codes for Task Scheduler."]
  ],
  notes: ["Free version: up to 5 computers, wake-up and “online” check.", "Waking over the internet requires a UDP port forward on your router or a VPN into your home network.", "Admin rights are needed only for the “Allow the network card to wake the PC” button.", null],
  changes: [
    ["AkeeTech Ultra professional features: wake-up in waves, fleet monitoring and uptime, Telegram and webhook alerts, command line for scripts", "Ultra: wave wake-up scenario with waiting and a report", "Ultra: fleet monitoring, history and uptime", "Ultra: Telegram/webhook alerts", "Ultra: CLI mode --wake/--status", "“★ Ultra” button on the computers page"],
    [null]
  ],
  shots: ["Computer list: wake over the network and “online” check"],
  req: [null, null, "PC to wake: a network card with Wake-on-LAN, wired connection"],
  tags: ["Wake-on-LAN", "network", "remote power-on", "magic packet", "administration"],
  pro: ["Unlimited PCs and groups (“wake all”)", "Wake-up schedule", "Desktop shortcut for one-click wake-up", null]
},
"remotedesk": {
  short: "All your remote desktops in one list: connect to RDP with a double-click, availability checks and .rdp import.",
  description: [
    "RemoteDesk stores your RDP connections — name, address, port, user, folder and note — and opens them via the standard mstsc with a double-click. For each connection RemoteDesk creates an .rdp file in a temp folder with the right resolution, monitors, sound, clipboard and drives.",
    "The app checks whether the RDP port is open on each computer and shows the response time. Existing .rdp files are imported in a couple of clicks, and search finds the right server by name, address or note. RemoteDesk doesn't store passwords: in Pro they're saved in Windows Credential Manager."
  ],
  features: [
    ["Connection list", "Name, address, port, user and note for each computer. Double-click or press Enter — and mstsc is already connecting."],
    ["Session settings", "Full screen or a 1280–2560 px window, all monitors, sound here/there/off, shared clipboard, local drives and printers."],
    ["Availability check", "RemoteDesk tries the RDP TCP port (3389 or yours) and shows “open · 41 ms” or “unreachable”."],
    ["Search and .rdp import", "Instant search by name, address, user and note (Ctrl+F). Import ready .rdp files with address, port and user."],
    ["No passwords in files", "Passwords never end up in settings or .rdp files. In Pro they're saved in Windows Credential Manager (TERMSRV/address), and mstsc fills them in itself."],
    ["Folders and templates (Pro)", "Group connections into folders — “Office”, “Clients” — and set parameter templates: “Laptop 1366”, “Server without sound”."],
    ["★ Ultra: Availability monitoring", "Background DNS, ping and RDP port checks of all connections with history, 24 h and 7-day uptime, Telegram/webhook “down/up” alerts and an HTML/CSV report."],
    ["★ Ultra: Session log", "Records every connection: start, end, duration — and builds a per-server summary with a report."],
    ["★ Ultra: RDCMan/mRemoteNG/CSV import and export", "Moves all connections at once with groups, ports and users from RDCMan (.rdg), mRemoteNG (confCons.xml) and CSV; exports to .rdg and CSV."],
    ["★ Ultra: Command line for scripts", "RemoteDesk.exe --check/--connect/--list/--import/--export with exit codes for Task Scheduler and PowerShell."]
  ],
  notes: ["Free version: up to 10 connections, connecting and availability checks.", "A password saved in Windows lets anyone signed in to your Windows account connect — RemoteDesk warns you about this.", null],
  changes: [
    ["AkeeTech Ultra professional features: availability monitoring, session log, RDCMan/mRemoteNG/CSV import and export, command line for scripts", "Ultra: availability monitoring with history, uptime and alerts", "Ultra: session log with a report", "Ultra: batch import/export of RDCMan, mRemoteNG, CSV", "Ultra: CLI mode for scripts", "“★ Ultra” button on the connections page"],
    [null]
  ],
  shots: ["Connections in folders: RDP port check and saved passwords"],
  req: [null, null, "Remote PC: Windows Pro/Enterprise/Server with Remote Desktop enabled"],
  tags: ["RDP", "remote desktop", "mstsc", "administration", "network"],
  pro: ["Unlimited connections and folders/groups", "Passwords via Windows Credential Manager", ".rdp settings templates", null]
},
"boottime": {
  short: "Shows how many seconds Windows takes to boot and shut down, and what exactly slows startup.",
  description: [
    "BootTime reads Windows logs and shows the last boot and shutdown times, a chart of recent startups and what the boot consists of: the time until the desktop appears and the post-sign-in phase.",
    "With admin rights the app takes precise data from the Windows Diagnostics log and shows which apps, drivers and services delayed startup — with clear explanations and tips. Without admin rights BootTime still works and gives an estimate from the System log."
  ],
  features: [
    ["Last boot", "The last Windows startup time in seconds, the boot type (full or Fast Startup) and current uptime."],
    ["Shutdown time", "How many seconds Windows took to shut down last time and on average."],
    ["Boot chart", "Bars for recent boots with an average line: you instantly see which boot was slow."],
    ["What startup consists of", "Time to desktop, post-sign-in loading, BIOS/UEFI and the number of startup apps."],
    ["What slows it down", "Apps, drivers and services that made Windows boot longer than usual, with an explanation and a tip."],
    ["Works without admin", "Without admin rights it estimates from the System log; a “Restart as administrator” button gives precise data."],
    ["★ Ultra: Speed-up plan", "A per-phase boot breakdown and a prioritized action list with estimated savings in seconds."],
    ["★ Ultra: Period comparison and regressions", "Median and 90th percentile of two periods, automatic detection of when things got worse and the new culprits around it."],
    ["★ Ultra: Boot watchdog", "A notification and a log entry if a boot exceeds a threshold or is noticeably slower than normal."],
    ["★ Ultra: Command line", "BootTime.exe /plan, /compare, /check with an HTML, JSON or CSV report and an exit code for scripts."]
  ],
  notes: ["The app only reads Windows logs and doesn't change anything in the system.", "The Windows Diagnostics log keeps boot data for a limited time — BootTime builds its own history.", "You can disable unnecessary apps in Windows Startup apps or in one click with AkeeTech's Sweep.", null],
  changes: [
    ["AkeeTech Ultra professional features: speed-up plan, period comparison and regressions, boot watchdog, command line", "Ultra: boot speed-up plan with estimated savings", "Ultra: period comparison and automatic regression detection", "Ultra: slow-boot watchdog with notifications", "Ultra: CLI /plan /compare /check and HTML/JSON/CSV reports"],
    [null]
  ],
  shots: ["BootTime: last boot, shutdown and a chart of the last 30 boots with a trend"],
  req: [null, null, "Admin rights — only for precise data and the list of culprits"],
  tags: ["boot", "startup", "speed-up", "diagnostics", "Windows"],
  pro: ["History of all boots and the trend", "Slow-boot culprits (apps, drivers, services)", "Export a report to HTML", null]
},
"batterycare": {
  short: "Shows your laptop battery's wear and real capacity, and reminds you to unplug at 80%.",
  description: [
    "BatteryCare shows how much capacity your battery has already lost: it compares the design capacity with the current full charge capacity, and shows the current charge, charge or discharge power in mW and an estimated runtime.",
    "The app lives in the tray and tells you when the charge reaches 80% and you can unplug, and when it drops below 20%. Data comes from Windows (WMI and the powercfg report) — read-only, no drivers and no changes to power settings."
  ],
  features: [
    ["Battery wear", "Health and wear in percent: design capacity versus current full charge capacity."],
    ["Current state", "Charge level, charge or discharge power in mW, voltage and stored energy in Wh."],
    ["Time estimate", "How long until empty or fully charged at the current load."],
    ["Capacity over time", "A chart of full charge capacity by day from the Windows report and the app's own log."],
    ["80/20 notifications", "“Charged to 80% — you can unplug” and “Battery below 20%” right from the tray."],
    ["Tray app", "A battery-level icon, minimize to tray and optional start with Windows."],
    ["★ Ultra: Wear forecast", "A regression of battery health from capacity history: wear per month, dates for reaching 80% and 60%, a cycle-based estimate and capacity jumps."],
    ["★ Ultra: Charging habits", "A charge log and analysis: time at 100% on AC, deep discharges, discharge power, real runtime and a gentleness score."],
    ["★ Ultra: Power rules", "Your own commands on battery events: charge below or above a threshold, charger plugged in or unplugged, with a trigger log."],
    ["★ Ultra: Command line", "BatteryCare.exe /status, /forecast, /habits with an HTML, JSON or CSV report."]
  ],
  notes: ["The app only reads battery data and doesn't change any power settings.", "Not every laptop reports the cycle count — in that case BatteryCare shows “not reported”.", "No admin rights needed.", null],
  changes: [
    ["AkeeTech Ultra professional features: wear forecast, charging habits, power rules, command line", "Ultra: battery wear forecast by regression", "Ultra: charging habit analysis with a gentleness score", "Ultra: power rules — commands on battery events", "Ultra: CLI /status /forecast /habits and HTML/JSON/CSV reports"],
    [null]
  ],
  shots: ["BatteryCare: battery health, current discharge in mW and full charge capacity by date"],
  req: [null, null, "A laptop or tablet with a battery"],
  tags: ["battery", "laptop", "wear", "charging", "health"],
  pro: ["Capacity history and usage charts", "Custom thresholds and reminders", "Report export", null]
},
"securedns": {
  short: "Encrypted DNS (DNS-over-HTTPS) in one click using Windows 11's built-in tools — your ISP and public Wi-Fi can no longer see which sites you open.",
  description: [
    "Regular DNS queries travel in plain text: your ISP, the café Wi-Fi owner and anyone in between can see them. Windows 11 can encrypt DNS over HTTPS, but the setting is buried in adapter properties and netsh commands. SecureDNS does it with one button: pick a provider — Cloudflare, Google, Quad9 or AdGuard — and the app assigns the DNS addresses and DoH template to the active adapter.",
    "No drivers, services or proxies — only built-in Windows tools. Previous settings are saved before any change, and the “Restore” button brings back the router's DNS (DHCP) or your previous addresses. The “Check” page honestly shows what works: the DoH template, the server's HTTPS response and the Windows DNS service connection on port 443."
  ],
  features: [
    ["DoH in one click", "DNS addresses and the DNS-over-HTTPS template are assigned to the active adapter (Wi-Fi or Ethernet), including IPv6."],
    ["Trusted providers", "Cloudflare, Cloudflare Security (blocks malicious sites), Google Public DNS and Quad9 — free."],
    ["No fallback to plain DNS", "Encryption is enabled with autoupgrade=yes and udpfallback=no: if something fails, queries won't go out in plain text."],
    ["Honest check", "Templates from netsh, a direct query to the DoH server and a search for the Windows DNS service's HTTPS connection to the server."],
    ["Restore", "Previous DNS (DHCP or custom), encryption templates and the global DoH mode are saved and restored with one button."],
    ["Windows tools only", "Works via netsh — no drivers, services, VPNs or third-party proxies."],
    ["★ Ultra: DoH benchmark with a recommendation", "8 queries to each DNS-over-HTTPS server from your network: median, p95, jitter, loss, an overall score and advice on which to switch to."],
    ["★ Ultra: Scheduled DNS monitor", "Background measurements of all providers every 5–60 minutes, a 30-day log, a 24-hour latency chart and a tray alert if the current DNS fails."],
    ["★ Ultra: DNS rules for Wi-Fi networks", "An action per network: a family filter at home, Cloudflare at the café, network DNS (DHCP) at the office; applied automatically on connect."],
    ["★ Ultra: HTML / CSV / JSON report export", "A report with a chart, benchmark, availability and rules — for your boss, Excel or monitoring scripts."]
  ],
  notes: ["Browsers (Chrome, Edge, Firefox) may use their own “secure DNS” — SecureDNS encrypts queries from all other apps at the Windows level.", "VPN clients usually assign their own DNS — while a VPN is on, its settings apply.", "From inside Windows you can't prove every query went out encrypted; the check shows the key signs — the DoH template and the DNS service's HTTPS connection to the server.", null],
  changes: [
    ["AkeeTech Ultra professional features: DoH benchmark with a recommendation, scheduled DNS monitor, DNS rules for Wi-Fi networks, HTML / CSV / JSON report export", "New “★ Analytics” page: a 24-hour DoH latency chart", "DoH provider benchmark with a recommendation and one-click selection", "Scheduled availability monitor with a log and failure alerts", "DNS rules for Wi-Fi networks (provider or network DNS)", "Report export to HTML, CSV and JSON", null],
    [null]
  ],
  shots: ["SecureDNS: Cloudflare DNS over HTTPS enabled on the Wi-Fi adapter, provider choice and restore"],
  req: ["Windows 11 64-bit (DoH is built into Windows 11; DNS encryption isn't available in Windows 10)", ".NET Framework 4.8 (included in Windows 11)", "Admin rights to enable and roll back"],
  tags: ["DNS", "DoH", "privacy", "security", "network"],
  pro: ["Family filter and ad blocking in one click", "Custom DoH server", "Auto-restore settings after a network change", null]
},
"wallguard": {
  short: "A simple firewall: block any app's internet access with one switch — a built-in Windows Firewall rule.",
  description: [
    "A game downloads updates mid-match, an app sends telemetry, a torrent clogs your connection — the built-in Windows firewall can stop all of this, but its settings are confusing. WallGuard shows which apps are using the network right now and creates a Windows Firewall rule for the selected exe with one “Internet: allowed / blocked” switch.",
    "No drivers or third-party filters: WallGuard creates regular firewall rules with a clear name like “WallGuard: app.exe” and deletes only its own rules — system rules and yours are left alone. There's intentionally no “block everything new” mode: it easily breaks Windows updates and drivers."
  ],
  features: [
    ["Who goes online", "A list of apps with network activity: TCP/UDP connections per process, clear names and paths."],
    ["One switch", "“Internet: allowed / blocked” — a Windows Firewall rule for the selected app's outbound connections."],
    ["Any exe", "Add an app manually even if it isn't running right now — e.g. a game's background downloader."],
    ["Only its own rules", "Rules prefixed with “WallGuard: ”, and only those get deleted. System components (svchost etc.) can't be blocked."],
    ["Activity log", "What was blocked or allowed and when, plus a hint on enabling the Windows block log (audit, event 5157)."],
    ["Built-in firewall", "Works via netsh advfirewall — no drivers, services or third-party traffic filters."],
    ["★ Ultra: Auto-profiles by schedule and Wi-Fi", "“Days and time / Wi-Fi network → profile” rules: “Night” at night, a strict profile at the café; switches automatically without overriding manual choices."],
    ["★ Ultra: Network activity analytics", "7-day connection history for all apps: hourly load with a chart, an app ranking and alerts about apps going online for the first time."],
    ["★ Ultra: Firewall rule audit", "Checks ALL Windows Firewall rules: dangerous allowances, conflicts, duplicates and junk, with a 0–100 score."],
    ["★ Ultra: Rule snapshots and reports", "Rule snapshots showing added, removed and changed rules, and report export to HTML, CSV and JSON."]
  ],
  notes: ["The free version can block internet access for up to 5 apps; the list and viewing are unlimited.", "A temporary block is lifted by a Windows Task Scheduler task (after an hour or at PC startup), and by WallGuard itself on launch.", "If a third-party firewall (e.g. from an antivirus) is on, Windows Firewall rules may not take effect.", null],
  changes: [
    ["AkeeTech Ultra professional features: auto-profiles by schedule and Wi-Fi, network activity analytics, firewall rule audit, rule snapshots and reports", "New “★ Ultra” section in the menu", "Profiles switch on automatically by schedule and Wi-Fi network", "Network activity history and chart per app, “first time online”", "Audit and snapshot comparison of Windows Firewall rules (read-only)", "Report export to HTML, CSV and JSON", null],
    [null]
  ],
  shots: ["WallGuard: apps with network activity, Discord blocked from the internet until 15:30"],
  req: [null, null, "Windows Firewall enabled", "Admin rights to create and delete rules"],
  tags: ["firewall", "firewall", "internet", "privacy", "network"],
  pro: ["Unlimited rules and inbound blocking", "Temporary blocking (for 1 hour / until restart)", "Profiles (Gaming/Study)", null]
},
"tempguard": {
  short: "Watches CPU, GPU and disk temperatures and warns about overheating before things slow down.",
  description: [
    "TempGuard shows the temperature of every available sensor in your laptop or PC: CPU thermal zones from Windows, an NVIDIA GPU (with load and power) and NVMe/SSD drives. Each card is colored by level — normal, warm or hot — and a 10-minute chart plus session maximums instantly show how the system heats up in a game.",
    "The app runs in the tray and quietly watches temperatures: if the CPU or GPU stays above a threshold for a while, you get a notification with advice. Everything essential works without admin rights; they're only needed for disk temperatures."
  ],
  features: [
    ["Sensor cards", "CPU (ACPI thermal zones), NVIDIA GPU via nvidia-smi and drives — a large temperature in the level's color and a mini chart."],
    ["10-minute chart", "All sensors on one chart; the selected one is filled, with “warm” and “hot” threshold lines."],
    ["Session maximums", "The highest and lowest temperature of each sensor since launch and the number of warnings."],
    ["Overheating notifications", "Fire only if the temperature stays above the threshold for 5 seconds, and at most once every 10 minutes — no spam."],
    ["GPU details", "GPU load, power draw and fan speed next to the temperature."],
    ["Tray app", "Closing the window minimizes to the tray; can start with Windows. Changes nothing in the system."],
    ["★ Ultra: Thermal analysis", "7-day history: percentiles, overheating minutes and episodes, temperature growth by day, the hottest hour and recommendations per sensor."],
    ["★ Ultra: Period comparison", "The last 24 hours versus the previous 6 days: averages, 95th percentile and overheating minutes per sensor."],
    ["★ Ultra: Actions on overheating", "Your own command and a webhook or Telegram bot on an overheating alert, with a trigger log."],
    ["★ Ultra: Command line", "TempGuard.exe /now, /analyze, /compare with an HTML, JSON or CSV report and an exit code on overheating."]
  ],
  notes: ["CPU temperature comes from Windows ACPI thermal zones: on many laptops this is the CPU package sensor, not individual cores.", "AMD and Intel GPUs aren't supported yet — only NVIDIA is shown.", "The overlay is visible in windowed and borderless windowed game modes; in exclusive fullscreen Windows doesn't show it.", "While the window is hidden, the GPU is polled less often so it can sleep and save battery.", null],
  changes: [
    ["AkeeTech Ultra professional features: thermal analysis, period comparison, actions on overheating, command line", "Ultra: thermal history analysis with overheating episodes and recommendations", "Ultra: comparing the last day with typical days", "Ultra: actions on overheating — command, webhook, Telegram", "Ultra: CLI /now /analyze /compare and HTML/JSON/CSV reports"],
    [null]
  ],
  shots: ["TempGuard: CPU, GPU and SSD cards, a 10-minute temperature chart and session maximums"],
  req: [null, null, "For the GPU — an NVIDIA driver (nvidia-smi comes with it)", "Admin rights — only for disk temperatures"],
  tags: ["temperature", "overheating", "GPU", "laptop", "monitoring"],
  pro: ["Custom thresholds and a sound alert", "7-day history", "Temperature in the tray icon and an overlay over games", null]
},
"driverview": {
  short: "Shows all your PC's drivers with versions and dates, finds problem devices and backs up drivers before reinstalling Windows.",
  description: [
    "DriverView gathers every device and its driver into one table: manufacturer, version, date, signature and INF file. Filters instantly show third-party drivers, drivers older than 3 years and unsigned ones, and search finds the device you need by name, version or manufacturer.",
    "A separate page shows devices with errors (the yellow icon in Device Manager) and explains in plain words what the error code means and what to do. For NVIDIA GPUs the app shows the familiar driver version number (e.g. 566.07) and opens NVIDIA's website to check for updates."
  ],
  features: [
    ["All drivers in one table", "Device, class, provider, version, date, age and digital signature; sort by any column."],
    ["Filters and search", "Third-party, older than 3 years, unsigned, GPUs; search by name, manufacturer, version, INF and device ID."],
    ["Problem devices", "Devices with a Device Manager error code — with a clear explanation (codes 10, 28, 43 and more) and advice."],
    ["GPU", "The NVIDIA driver version in its familiar form, date and age, an “Open NVIDIA website” button. The app never goes online by itself."],
    ["Driver packages", "Third-party packages from the Windows driver store (pnputil /enum-drivers): INF, original file, provider, version and date."],
    ["Breaks nothing", "The app only reads driver information; the essentials work without admin rights."],
    ["★ Ultra: Driver security audit", "Finds kernel drivers from vulnerable-driver lists (BYOVD), unsigned and very old drivers, checks the Microsoft blocklist and HVCI and calculates the risk."],
    ["★ Ultra: Driver store analysis", "Shows old package versions in DriverStore, how much space they take, and ready pnputil commands for manual cleanup — without deleting anything."],
    ["★ Ultra: Driver change log", "An automatic snapshot on every launch and a single change feed: which drivers were added, removed or updated, and when."],
    ["★ Ultra: Command line", "DriverView.exe /audit, /store, /timeline, /snapshot with an HTML, JSON or CSV report."]
  ],
  notes: ["Microsoft drivers that update along with Windows aren't listed as “older than 3 years”, even if their date is old.", "The backup saves only third-party drivers (oem*.inf) — built-in Windows drivers are restored automatically when the system is installed.", "To restore drivers from a backup: pnputil /add-driver \"folder\\*.inf\" /subdirs /install in an administrator command prompt.", "The app doesn't download or search for new driver versions online — it only shows the current ones.", null],
  changes: [
    ["AkeeTech Ultra professional features: driver security audit, driver store analysis, driver change log, command line", "Ultra: driver security audit with a risk score", "Ultra: DriverStore analysis with old package versions", "Ultra: automatic snapshots and a driver change log", "Ultra: CLI /audit /store /timeline /snapshot", "Fixed: the driver package list was empty on Russian Windows (pnputil encoding)"],
    [null]
  ],
  shots: ["DriverView: an NVIDIA GPU with version 566.07, filters and a table of all drivers with dates and age"],
  req: [null, null, "Admin rights — only for backing up drivers"],
  tags: ["drivers", "devices", "backup", "diagnostics", "Windows"],
  pro: ["Back up all drivers to a folder (pnputil /export-driver *)", "HTML/CSV report", "Compare with a previous snapshot", null]
},
"taskpilot": {
  short: "Windows Task Scheduler made human: a clear schedule, decoded result codes and a new-task wizard without extra settings.",
  description: [
    "TaskPilot shows all Windows Task Scheduler tasks in one tidy list: what runs, when it last ran, how it finished and when it runs next. Instead of “0x80070002” and “PT30M” you see “Program file not found” and “every 30 minutes”. Microsoft's system tasks are hidden with one switch, so you immediately see what third-party apps have added.",
    "Any task can be run now, enabled or disabled, or have its program opened in Explorer. All changes are remembered — the “Restore” button rolls them back. In Pro: a “New task” wizard in plain language (at sign-in, every day at …, every N minutes), run history from the Windows log and task export/import to XML."
  ],
  features: [
    ["Schedule in words", "“Every day at 08:00”, “At Windows sign-in, then every 10 minutes”, “Weekly: on weekdays” — instead of technical triggers."],
    ["Clear result codes", "0x0 — success, 0x1 — the program returned an error, 0x80070002 — file not found, 0x41303 — hasn't run yet: dozens of decoded codes."],
    ["Third-party tasks only", "A “not Microsoft” filter, folder selection and search by name, program and author. See which tasks are disabled and which fail."],
    ["Run and toggle", "Run a task now, enable or disable it, open the action's file in Explorer — in one click."],
    ["Restore", "TaskPilot remembers the original state of every changed task and puts everything back with one button."],
    ["New task wizard", "Pick a program or script (.exe, .bat, .ps1, .vbs) and when to run it — TaskPilot sets up the trigger, folder and power options."],
    ["★ Ultra: Task security audit", "Rates the risk of each task: running from temp folders, hidden PowerShell and LOLBin commands, missing files, disguising as Microsoft."],
    ["★ Ultra: Task snapshots and comparison", "An automatic scheduler snapshot on launch and a change feed: which tasks appeared, disappeared or changed their command, schedule or account."],
    ["★ Ultra: 24-hour agenda", "All task runs for the next 24 hours, hourly load and simultaneous starts that slow down your PC."],
    ["★ Ultra: Command line", "TaskPilot.exe /audit, /diff, /agenda, /snapshot with an HTML, JSON or CSV report and an exit code for monitoring."]
  ],
  notes: ["The essentials work without admin rights; for SYSTEM tasks and enabling the history log there's a “Restart as administrator” button.", "Windows' task run history log is off by default — TaskPilot offers to turn it on and can turn it back off.", "The app sends nothing to the internet.", null],
  changes: [
    ["AkeeTech Ultra professional features: task security audit, task snapshots and comparison, 24-hour agenda, command line", "Ultra: task security audit with a risk score", "Ultra: scheduler snapshots and a change feed", "Ultra: a 24-hour run agenda with “traffic jam” detection", "Ultra: CLI /audit /diff /agenda /snapshot and HTML/JSON/CSV reports"],
    [null]
  ],
  shots: ["Scheduler task list: schedule in words, a clear last-run result and the selected task's card"],
  req: [null, null, "Admin rights — only for system tasks and enabling the history log"],
  tags: ["scheduler", "autorun", "tasks", "schedule", "Windows"],
  pro: ["Create tasks with a wizard", "Run history (TaskScheduler/Operational log)", "Task export/import (XML)", null]
},
"netspeed": {
  short: "An internet speed test via Cloudflare: ping, jitter, download and upload on a nice speedometer, with a clear verdict for gaming, streaming and 4K.",
  description: [
    "In 25 seconds NetSpeed measures your internet speed via the nearest Cloudflare server: 20 ping and jitter samples, download over 4–6 parallel streams (like browser tests) and upload. The speedometer needle shows the speed smoothly in real time, and the result is translated into plain language: is your connection good enough for online games, streaming and 4K video.",
    "Every result is saved to a history with a chart — you can see whether your ISP delivers the promised speed. In Pro: full history with daily averages, a scheduled auto-test with a Windows notification if the speed drops, and history export to CSV for Excel."
  ],
  features: [
    ["Live speedometer", "Custom-drawn with smooth animation and a non-linear 0–1000 Mbps scale — handy for both 10 and 500 Mbps."],
    ["Ping and jitter", "20 latency samples to a Cloudflare server minus the server processing time; jitter shows connection stability."],
    ["Honest download and upload", "Parallel streams (4, or 6 on fast connections); connection ramp-up isn't counted in the result."],
    ["For gaming, streaming and 4K", "An “excellent / good / okay / poor” rating with an explanation: shooters, 1080p 60 fps streaming, several 4K streams."],
    ["History with a chart", "Recent measurements with a download and upload chart; in Pro — the full history and daily averages."],
    ["Auto-test and notifications", "Scheduled checks (from hourly to daily) and a notification if the speed drops 30–70% below usual."]
  ],
  notes: ["A full test uses about 100–600 MB of traffic depending on speed (limited to 10 seconds of download and 8 of upload); the auto-test is lighter — up to 190 MB.", "Measurements go through Cloudflare servers (speed.cloudflare.com); the app needs no admin rights and changes nothing in the system.", "The auto-test runs while NetSpeed is open or minimized to the tray.", null],
  changes: [[null]],
  shots: ["Test result: speedometer, ping, download and upload, a rating for gaming, streaming and 4K"],
  req: [null, null, "An internet connection"],
  tags: ["internet speed", "speedtest", "ping", "Cloudflare", "ISP"],
  pro: ["Full history and a daily chart", "Scheduled auto-test and speed drop notifications", "CSV export", null]
},
"shotsnap": {
  short: "Hotkey screenshots with a handy editor: arrows, text, blurring personal data and one-click copying.",
  description: [
    "ShotSnap lives in the tray and takes a screenshot in a second: Ctrl+Shift+S — select an area with the mouse (the screen dims, with a magnifier showing coordinates and size next to the cursor), Ctrl+Shift+A — the full screen, Ctrl+Shift+W — the active window. Optionally it can take over the PrtScr key.",
    "The screenshot opens straight in the editor: arrows, boxes, captions, a highlighter, numbered markers and cropping. Passwords, card numbers and chats are easy to hide with blur or pixelation. The finished screenshot is copied to the clipboard or saved as PNG/JPG to “Pictures\\ShotSnap”."
  ],
  features: [
    ["Area, screen or window", "Three hotkeys, a dimmed screen, a magnifier with exact coordinates and the selection size right by the cursor."],
    ["Annotation editor", "Arrows, rectangles, outlined text, 8 colors and 4 widths, cropping, undo and redo (Ctrl+Z / Ctrl+Y)."],
    ["Hide personal data", "Blur and pixelation cover passwords, card numbers and names — the pixels are replaced and can't be recovered."],
    ["Markers 1, 2, 3", "Numbered markers and a highlighter for instructions: click through the steps and the numbers are placed automatically."],
    ["Clipboard and files", "Copy to the clipboard with one press, save lossless PNG or compact JPG, with clear date-and-time names."],
    ["Delay and scrolling", "A 3–10 second timer so you can open a menu, and stitching a long page from several scrolled frames."]
  ],
  notes: ["Hotkeys work while ShotSnap is open or minimized to the tray; if a combination is taken by another app, ShotSnap shows it in the menu.", "To stop PrtScr from opening the Windows Snipping Tool, turn off “Use the Print screen key to open screen capture” in Settings → Accessibility → Keyboard.", "Scrolling capture is simplified: you scroll the window yourself and click “Add frame”, and ShotSnap finds the overlap and stitches the frames.", "Start with Windows is toggled in the settings (its own entry in the user's startup).", null],
  changes: [[null]],
  shots: ["ShotSnap's main window: capture modes and recent screenshots"],
  req: [null, null, null],
  tags: ["screenshot", "screen capture", "editor", "annotations", "tray"],
  pro: ["Blur and pixelation to hide data", "Numbered markers and a highlighter", "Delayed and scrolling screenshots (in parts)", null]
},
"batchname": {
  short: "Batch-rename files by rules with a live “before → after” preview, conflict protection and undo.",
  description: [
    "BatchName renames hundreds of files at once: drag in files or a folder, build a chain of rules — text replacement, prefix and suffix, numbering, case, removing characters, file date or EXIF shooting date, Cyrillic transliteration — and see the new names instantly.",
    "Conflicts (duplicate names, names already taken, forbidden characters) are highlighted before renaming. Renaming goes through temporary names, so swapping a ↔ b works, nothing gets overwritten, and if something fails everything is put back. Every operation is logged — “Undo last” restores the previous names."
  ],
  features: [
    ["Rule chain", "Text replacement (case-sensitive or not), prefix/suffix, numbering with a start and step, case, removing characters and ranges."],
    ["Live preview", "The “before → after” table updates with every rule change — you see the result before pressing the button."],
    ["Conflict highlighting", "Duplicates, names already in use, forbidden characters and reserved Windows names are marked red and skipped."],
    ["Safe and reversible", "Renaming via temporary names without overwriting, rollback on failure and “Undo last” from the operation log."],
    ["Dates and EXIF", "Modified, created or photo-taken date in any format — e.g. 2024-07-12_18-30-05.jpg."],
    ["Transliteration and templates", "Cyrillic → Latin using the Ukrainian scheme, {n:000}, {name}, {parent}, {date} tokens, ready-made rule sets."]
  ],
  notes: ["The free version renames up to 100 files at a time; the preview shows any number.", "Undo restores names only if the files haven't been renamed or moved since — otherwise nothing changes.", "The log keeps the last 30 operations in %APPDATA%\\CISOFT\\batchname\\journal.", null],
  changes: [[null]],
  shots: ["BatchName: rules on the left, a “before → after” preview with a highlighted conflict on the right"],
  req: [null, null, null],
  tags: ["renaming", "files", "photos", "EXIF", "transliteration"],
  pro: ["Unlimited files and regular expressions", "Dates from EXIF and file properties", "Saving rule sets", null]
},
"vaultix": {
  short: "A password manager that keeps everything only on your computer — in an AES-256 encrypted vault behind one master password.",
  description: [
    "Vaultix stores logins, passwords, website addresses and notes in a single file on your PC. The file is encrypted with AES-256, the key is derived from the master password via PBKDF2-SHA256 (310,000 iterations), and integrity is checked with HMAC-SHA256: data can't be swapped or “tweaked” unnoticed. The master password is never stored anywhere, and there's no cloud or account.",
    "A password is copied with one click, and the clipboard clears itself after 20 seconds. The built-in generator creates strong or easy-to-pronounce passwords, and the check shows weak and reused ones. The vault locks itself after a few minutes of inactivity, when the window is minimized and when Windows is locked."
  ],
  features: [
    ["AES-256 encryption", "PBKDF2-SHA256 with 310,000 iterations and a random salt, AES-256-CBC + HMAC-SHA256. A wrong password or a damaged file is detected immediately."],
    ["Copy with auto-clear", "Login and password are copied in one click and the clipboard clears after 20 seconds. The password is flagged so Windows clipboard history doesn't keep it."],
    ["Password generator", "Length from 6 to 64, letters, digits, symbols, no look-alike characters, or a “pronounceable” password that's easy to remember. A strength meter in bits."],
    ["Quick search", "Search by title, login, site and notes as you type. Hotkeys: Ctrl+F, Ctrl+N, Ctrl+C — password, Ctrl+B — login."],
    ["Auto-lock", "Locks after 1–30 minutes of inactivity, on minimize and when Windows is locked. Keys in memory are wiped."],
    ["Password check", "A vault assessment: how many passwords are weak, reused, empty or unchanged for over a year."]
  ],
  notes: ["Free version: up to 50 entries, generator, search, copy with auto-clear, auto-lock and the password check summary.", "Vault: %APPDATA%\\CISOFT\\vaultix\\vault.dat. Make a backup in Settings — it stays encrypted.", "If you forget the master password, the entries can't be recovered — that's how the protection works.", null],
  changes: [[null]],
  shots: ["Vaultix: the entry list with search, strength ratings and the selected password's card"],
  req: [null, null, null],
  tags: ["passwords", "security", "encryption", "password generator", "password manager"],
  pro: ["Unlimited entries and folders", "Import from browser CSV (Chrome/Edge/Firefox) and export", "Weak and reused password report", null]
},
"clipstack": {
  short: "Clipboard history: everything you've copied, at hand with Ctrl+Shift+V in any app.",
  description: [
    "ClipStack quietly runs in the tray and remembers what you copy. Press Ctrl+Shift+V and a list of recent snippets opens next to the cursor: find the one you need with search, press Enter, and it's pasted into the window you were working in. Important items can be pinned so new entries don't push them out.",
    "Passwords don't get into the history: ClipStack skips anything copied from password managers (Vaultix, KeePass, Bitwarden, 1Password and others), respects the “don't save” flag and can optionally filter out text that looks like a password. The saved history is encrypted with your Windows account key."
  ],
  features: [
    ["History window on Ctrl+Shift+V", "Opens next to the cursor in any app: search as you type, Enter to paste, Ctrl+1…9 for quick paste."],
    ["Paste into the previous window", "The chosen snippet goes to the clipboard and is pasted right where you were typing — like a normal Ctrl+V."],
    ["Pinning and search", "Pinned entries always stay on top and aren't removed by the limit. Copying something again doesn't duplicate it — it moves to the top."],
    ["Password protection", "Exclusions for password managers and your own apps, a “looks like a password” filter, and respect for flags apps use to ask not to save content."],
    ["Tray app", "Starts with Windows without admin rights, pause recording in one click, exit from the icon menu."],
    ["Handy preview", "Icons by content (link, email, code, number), the source and copy time, the full text of the selected entry."]
  ],
  notes: ["Free version: the last 30 text entries in memory (until the app exits), search, pinning, paste with Ctrl+Shift+V.", "If Ctrl+Shift+V is already taken by another app, the history window opens by clicking the tray icon.", "Windows doesn't allow a regular app to paste into some windows running as administrator — use Ctrl+V there after choosing.", null],
  changes: [[null]],
  shots: ["ClipStack: clipboard history with search, pinned entries and a preview of the selected snippet"],
  req: [null, null, null],
  tags: ["clipboard", "history", "productivity", "hotkeys", "snippets"],
  pro: ["History of up to 1,000 entries kept between restarts", "Images and files in the history", "Snippets — your own text templates", null]
},
"beamdrop": {
  short: "Send files and folders between computers on the same network — no internet, USB sticks or clouds, with encryption and SHA-256 verification.",
  description: [
    "BeamDrop finds other computers running BeamDrop on your network by itself — home Wi-Fi, cable, Radmin VPN or SquadLAN. Drag files onto the device's card and the recipient gets an “Accept files?” window. Once accepted, files fly directly over the local network at full speed, with progress, speed and time remaining.",
    "Every transfer is encrypted with a one-time key (ECDH P-256 + AES-256 and HMAC-SHA256), and every file is checked with SHA-256 after receiving: a broken or incomplete file won't stay in the folder. Received files are saved to “Downloads\\BeamDrop”, and the app waits quietly in the tray."
  ],
  features: [
    ["Finds devices itself", "Broadcast announcements over all of the PC's networks at once: LAN, Wi-Fi, Radmin VPN, SquadLAN. If the network blocks broadcasts — “Add by IP”."],
    ["Drag and send", "Drop files onto a device card, or click it and choose files. Progress shows right on the card."],
    ["“Accept files from X?”", "The recipient sees who's sending what, the size and a verification code, and decides. No answer means an automatic decline after 2 minutes."],
    ["Channel encryption", "One-time ECDH P-256 keys per transfer, AES-256-CBC + HMAC-SHA256, protection against tampering and replay."],
    ["SHA-256 check", "The file is written to a temporary .bdpart and appears only after the hash matches. A dropped connection leaves no junk."],
    ["Speed and history", "Speed, time remaining, one-click cancel, a list of all transfers and an “Open folder” button."]
  ],
  notes: ["Free version: up to 2 GB per send and one recipient at a time.", "Ports: UDP 47100 (discovery) and TCP 47101 (transfer) — the firewall will ask for permission on first launch.", "No internet is needed or used: files go directly between computers.", null],
  changes: [[null]],
  shots: ["BeamDrop: devices on the network, drag-and-drop and transfers with SHA-256 verification"],
  req: [null, null, "BeamDrop on both computers on the same network", null],
  tags: ["local network", "file transfer", "Radmin", "encryption", "LocalSend"],
  pro: ["No size limits and whole folders", "Send to several devices at once", "Auto-accept from trusted devices", null]
},
"lanchat": {
  short: "A chat for computers on the same network — at home, at the office, at a LAN party or over Radmin VPN, with no internet, servers or sign-up.",
  description: [
    "LanChat finds everyone running it on the same network by itself: Wi-Fi, cable, Radmin VPN or SquadLAN. There's a shared “Everyone” channel for the whole group and private messages to anyone on the list — with a nickname, color and an “online” or “away” status.",
    "Messages go directly between computers; no servers needed. History is stored on your disk, new messages arrive as tray notifications, and a private message to someone who's offline is delivered as soon as they show up."
  ],
  features: [
    ["No internet or servers", "Computers find each other by broadcast on the local network and talk directly over TCP. Works over Radmin VPN and SquadLAN."],
    ["Shared channel and private chats", "“Everyone” — for the whole network at once, private messages — for one person. Unread counters for every conversation."],
    ["Nickname, color and status", "Your own nickname and avatar color. “Online” / “away” status — manually or automatically after 10 minutes of inactivity."],
    ["Tray notifications", "You can close the window — LanChat stays in the tray and notifies you of new messages."],
    ["History and delivery", "All conversations are saved to disk. “Delivered” marks, resending and duplicate protection."],
    ["Emoji", "A one-click Unicode emoji panel and any emoji right in the text."]
  ],
  notes: ["Messages in “Everyone” reach those online at the time of sending; private ones wait for the recipient for up to a day.", "Ports: UDP 47200 (discovery) and TCP 47201 (messages).", "History: %APPDATA%\\CISOFT\\lanchat. Room messages are encrypted with the room password (AES-256).", null],
  changes: [[null]],
  shots: ["LanChat: shared channel, rooms and private messages on the local network"],
  req: [null, null, "LanChat on the other people's computers on the same network", null],
  tags: ["chat", "local network", "Radmin", "no internet", "LAN"],
  pro: ["Your own channels (rooms) with a password", "Send images to the chat", "History search and export", null]
},
"saveguard": {
  short: "Finds your game saves by itself and makes dated zip copies, so a crash, a Windows reinstall or a bad mod won't cost you your progress.",
  description: [
    "SaveGuard knows where more than 50 popular games keep their saves: Minecraft (and Prism/MultiMC/TLauncher instances), Terraria, R.E.P.O., Stardew Valley, Hollow Knight, Elden Ring, GTA V, Skyrim, Cyberpunk 2077, Baldur's Gate 3 and more. It also finds Steam Cloud saves and folders in My Games, Saved Games and LocalLow. If a game isn't on the list, add its folder manually.",
    "Each copy is a regular zip archive with the date in its name that you can open in Explorer. Old copies are deleted automatically. Before restoring, SaveGuard saves the current state, so a restore can be undone. While you're choosing a copy, the app doesn't touch the game folder."
  ],
  features: [
    ["Auto-detects 50+ games", "A built-in path database: Documents\\My Games, AppData, LocalLow\\Studio\\Game, Saved Games, Steam libraries and Steam Cloud (userdata\\…\\remote)."],
    ["Dated zip copies", "One click — an archive like 2026-10-15_18-30-00.zip. Works even while the game is running: files are read with shared access."],
    ["Safe restore", "First a copy of the current saves, then extraction to a temp folder and a full swap. If something goes wrong, the previous files are put back."],
    ["Copy rotation", "A set number of recent copies is kept for each game and the oldest are deleted automatically. 3 for free, up to 50 in Pro."],
    ["Your own folder", "Any save folder (a server world, an emulator, an indie game) can be added to the list. Unneeded games are easy to hide."],
    ["Runs from the tray", "In Pro, SaveGuard runs in the tray and copies saves after the game closes or on a schedule, only if they changed."],
    ["★ Ultra: Deduplicated versions", "Incremental storage: each unique save file is stored once (SHA-256 + compression), so hundreds of versions take the space of a few copies."],
    ["★ Ultra: Version comparison", "What changed between two versions or against the current saves: added, modified and deleted files with sizes."],
    ["★ Ultra: Auto-version on change", "SaveGuard watches the save folder and, after a minute of quiet following a game write, saves a new version itself — only changed files."],
    ["★ Ultra: Integrity check and restore", "SHA-256 check of every file in every version; restore any version in place (keeping the current state) or to a separate folder."]
  ],
  notes: ["Free version: detected games, manual backup and restore, 3 copies per game.", "Copies are stored in “Documents\\SaveGuard Backups” by default; the folder can be changed.", "The cloud copy is simply copying to a OneDrive or Google Drive folder. Your cloud client uploads it — SaveGuard sends nothing to the internet.", "Auto-backup works while the app is open or minimized to the tray. You can enable start with Windows.", null],
  changes: [
    ["AkeeTech Ultra professional features: deduplicated versions, version comparison, auto-version on change, integrity check and restore", "Ultra: deduplicated version storage", "Ultra: comparing versions with each other and with current saves", "Ultra: auto-version on file changes", "Ultra: integrity check and restore of any version"],
    [null]
  ],
  shots: ["Detected games, save size, recent copies and one-click restore"],
  req: [null, null, null],
  tags: ["saves", "backup", "games", "Minecraft", "Steam"],
  pro: ["Auto-backup when the game closes and on a schedule", "Keep up to 50 copies", "Copy to a cloud folder (OneDrive/Google Drive)", null]
},
"crafthost": {
  short: "A handy panel for your own Minecraft server: start and stop, a colored console, online players, TPS, settings, plugins and world backups in one window.",
  description: [
    "CraftHost manages a Paper, Spigot or Vanilla server from the chosen folder, without the black start.bat window. The server starts with the right Java (CraftHost finds Java 21 for Minecraft 1.21 itself), the allocated memory and optimal flags. Stopping is graceful, with the stop command, so the world is saved.",
    "The console colors player joins and leaves, chat, warnings and errors, and you can type commands right in the window. On the right you see online players and ready-made addresses for friends: localhost, SquadLAN (10.77.*), Radmin VPN (26.*) and the local network. Every server.properties parameter has a name and a tooltip."
  ],
  features: [
    ["Start, stop, restart", "Runs java without a window, UTF-8 output, graceful stop with world saving. Pre-start checks: server core, Java version, EULA."],
    ["Colored console", "Errors, warnings, chat, player joins and leaves are color-coded. Command input with history (↑/↓ arrows)."],
    ["Players, TPS and memory", "A list of online players, TPS for Paper/Spigot (updated every 30 seconds) and the java process memory."],
    ["server.properties made clear", "More than 60 parameters with clear names and tooltips, buttons for options, value validation. The file is backed up before the first change, and “Restore” brings back the original."],
    ["Plugins", "A list of plugins with versions from plugin.yml. Enable and disable in one click (renaming to .jar.disabled)."],
    ["World backup and addresses for friends", "A zip of all world dimensions, on a running server via save-off and save-all flush. SquadLAN, Radmin VPN and LAN addresses copy with a double-click."],
    ["★ Ultra: Task scheduler", "Restarts, stop, start, backups, commands and scripts by weekday and time — with chat warnings to players 15/5/1 min ahead and a backup before a restart."],
    ["★ Ultra: Scripts and RCON", "Saved command scenarios with wait pauses and substitutions, run on your own server or a remote one via RCON (VPS, hosting)."],
    ["★ Ultra: Console with history", "Command history is kept between launches: search, repeat with a double-click, move into a script; “rcon …” and “run script” in the console."],
    ["★ Ultra: Monitoring with charts", "TPS, players and memory every 30 s with 90 days of history: hour/day/week charts, a lag and peak summary, CSV export and an HTML report."]
  ],
  notes: ["Free version: start and stop, console, players, TPS, the server.properties editor, plugins, manual world backup.", "Only you can accept the Minecraft EULA: CraftHost shows a link to the agreement and writes eula=true only when you click “I accept the EULA”.", "The plugin catalog is Modrinth (modrinth.com). The version for your Minecraft and Paper/Spigot is downloaded and its checksum verified.", "A firewall rule for the server port is added with a button (admin rights required) and removed with “Restore”.", null],
  changes: [
    ["AkeeTech Ultra professional features: task scheduler, scripts and RCON, console with history, monitoring with charts", "Ultra: weekday task scheduler with player warnings", "Ultra: command scripts and an RCON client for remote servers", "Ultra: persistent command history with search", "Ultra: TPS/player/memory monitoring with charts and reports"],
    [null]
  ],
  shots: ["A running Paper 1.21.4 server: console, online players, TPS, memory and addresses for friends"],
  req: [null, null, "Java 21 for Minecraft 1.20.5 and newer (Java 17 for 1.18–1.20.4)", "A ready server in a folder (paper.jar or server.jar)"],
  tags: ["Minecraft", "server", "Paper", "plugins", "backup"],
  pro: ["Auto-restart on crash and on a schedule", "Scheduled world backups", "One-click plugin installation from Modrinth", null]
},
"gifforge": {
  short: "GIFs from videos and images in a minute: choose a segment, size and quality — and get a light GIF for Telegram and Discord.",
  description: [
    "Drag a video into the GifForge window and a strip of frames appears. Mark the start and end with two sliders, choose the width, frame rate and quality, and the app instantly shows how big the GIF will be. The color palette is tuned to each clip (palettegen/paletteuse), so the GIF comes out clean, without muddiness or banding.",
    "Turn on the “Telegram / Discord — up to 8 MB” target and GifForge will shrink the size itself if the file doesn't fit. You can build an animation from a set of images — frame order and display time are adjustable. The finished GIF plays frame by frame right in the window, and you can copy it and paste it into a chat."
  ],
  features: [
    ["Segment on the frame strip", "Preview frames across the whole clip, two start and end sliders, a large frame at the slider position. Duration and frame count are visible right away."],
    ["Size, frame rate, quality", "Width from 120 px, 5–30 frames per second, a 256/128/64-color palette and four dithering types (Bayer, Floyd–Steinberg, Sierra)."],
    ["Size estimate in advance", "A sample chunk is encoded with your settings — you see the approximate file size before the GIF is created."],
    ["Up to 8 MB for messengers", "If the GIF doesn't fit the Telegram and Discord limit, the app reduces the width or frame rate itself and tries again."],
    ["Images → GIF", "PNG, JPG, BMP, TIFF of different sizes: frame order, display time, black or white borders — everything fits into one frame."],
    ["Result preview", "A built-in frame-by-frame GIF player with pause, file details, “Copy” for pasting into a chat and a list of recent files."]
  ],
  notes: ["Free version: GIFs up to 10 seconds and 480 px wide, all quality settings, the “up to 8 MB” target, images → GIF.", "The finished file is saved next to the source video (or to Pictures if that location isn't writable); existing files are never overwritten.", "The caption (Pro) is drawn in Arial Bold with an outline, at the top or bottom of the frame; any characters and multiple lines are supported.", null],
  changes: [[null]],
  shots: ["GifForge: choosing a segment on the frame strip, GIF settings and a size estimate for the Telegram/Discord limit"],
  req: [null, null, "FFmpeg — downloaded by the app on first launch (~100 MB, shared by AkeeTech apps)", null],
  tags: ["GIF", "video", "animation", "memes", "Telegram"],
  pro: ["Any length and resolution", "Text over the GIF", "GIF to WebP/MP4 for messengers", null]
},
"voicenote": {
  short: "A simple voice recorder for Windows: record from the mic to MP3 or M4A with one button or a hotkey, a list of recordings with waveforms and playback.",
  description: [
    "Press the big red button or Ctrl+Alt+R from any app and VoiceNote starts recording from the chosen microphone. While you talk you see a timer, a live waveform and the volume level, and pausing doesn't create extra pieces: recording continues into the same file.",
    "All recordings are kept in one folder and shown as a list with duration and date. Select a recording to see its waveform, click the waveform to seek, and listen right in the app. Recordings can be renamed, deleted to the Recycle Bin or opened in Explorer."
  ],
  features: [
    ["One-button recording", "A big start/stop button, pause and resume, a timer and a live waveform while recording."],
    ["Mic selection and level", "Any Windows microphone (USB, headset, built-in) and a real-time volume meter — you instantly see that sound is coming in."],
    ["MP3 or M4A", "Save to MP3 or M4A (AAC) with quality from 64 kbps for speech to 192 kbps for music."],
    ["Hotkey", "Start/stop from any app, even with the window minimized: Ctrl+Alt+R, Ctrl+Shift+R, Ctrl+Alt+Space or F9."],
    ["List with waveforms", "Duration, date, format and size of each recording; a waveform with click-to-seek and playback right in the window."],
    ["Reliable", "Sound is written to disk while recording; if the computer shuts down, the recording is recovered on the next launch."],
    ["★ Ultra: Voice mastering for platforms", "Noise reduction, de-esser, compressor and precise two-pass EBU R128 normalization for podcasts (−16), broadcast (−23), ACX audiobooks or social media, with LUFS and True Peak measured before and after."],
    ["★ Ultra: Pauses: split and remove", "Finds pauses and splits the recording into separate fragments or shortens pauses, keeping bookmarks in place."],
    ["★ Ultra: Chapters from bookmarks", "Timestamps for YouTube/podcasts to the clipboard, a CUE file and chapters embedded right into MP3 (ID3 CHAP) or M4A."],
    ["★ Ultra: Batch export with presets", "All recordings at once to podcast MP3 at −16 LUFS, Opus for messengers, ACX audiobook or a WAV archive."]
  ],
  notes: ["Free version: mic recording, pause, MP3/M4A, a recording list with waveforms, playback, renaming, deleting, a hotkey.", "Recordings are saved to “Documents\\VoiceNote” by default; the folder can be changed in settings. Deleted recordings go to the Recycle Bin.", "Audio cleanup (Pro) creates a copy “… (clean audio)”, and trimming — “… (fragment)”: the original recording stays unchanged.", "Windows may ask you to allow microphone access: “Settings → Privacy → Microphone → Let desktop apps access your microphone”.", null],
  changes: [
    ["AkeeTech Ultra professional features: voice mastering for platforms, pauses: split and remove, chapters from bookmarks, batch export with presets", "New “★ Studio” page", "Two-pass EBU R128 voice mastering with a LUFS/True Peak report", "Splitting recordings at pauses and removing pauses while moving bookmarks", "Chapter export: YouTube timestamps, CUE, chapters inside MP3/M4A", "Batch export with presets"],
    [null]
  ],
  shots: ["VoiceNote: the recording list, a waveform with bookmarks and a trim selection, playback in the window"],
  req: [null, null, "A microphone (not needed for recording system sound)", "FFmpeg — downloaded by the app on first launch (~100 MB, shared by AkeeTech apps)", null],
  tags: ["voice recorder", "audio recording", "microphone", "MP3", "notes"],
  pro: ["Noise reduction and loudness leveling", "Bookmarks and trimming", "Recording system sound (whatever is playing on the PC)", null]
},
"powermode": {
  short: "Laptop power plans in one click: switch from the tray, clear settings and automatic switching between AC and battery.",
  description: [
    "PowerMode shows all Windows power plans — standard and from the manufacturer (e.g. ASUS Silent) — as cards: click one and the plan is active. The tray icon changes color with the current mode, and you can switch right from its menu.",
    "The key settings of the active plan are gathered on one page in plain language: what to do when the lid closes, when to turn off the screen and go to sleep, turbo boost and minimum/maximum processor state — separately for AC and battery. Before the first change the previous value is remembered, and the “Restore” button brings everything back."
  ],
  features: [
    ["One-click switching", "All power plans as cards, the active one highlighted. Manufacturer plans are never modified or deleted."],
    ["Mode in the tray", "A colored speedometer icon shows the current plan; switch from the tray menu without opening the window."],
    ["High and Ultimate", "Creates “High performance” and “Ultimate performance” as copies of the standard plans, even if Windows has hidden them."],
    ["Clear options", "Lid, screen off, sleep — separately for AC and battery, adjusted with ◀ ▶ arrows."],
    ["CPU turbo boost", "Turbo boost mode (PERFBOOSTMODE), minimum and maximum processor state — quieter and cooler on battery."],
    ["Auto-switching", "A performance plan on AC, balanced on battery, maximum in games. Runs in the tray."],
    ["★ Ultra: Plan comparison and audit", "All power plans side by side by key AC and battery settings, with differences and setting recommendations."],
    ["★ Ultra: Mode log", "How long each plan ran on AC and battery, switches by day and energy-saving tips."],
    ["★ Ultra: Plan schedule", "Rules by time of day and weekday: power saving at night, balanced during working hours; games take priority over the schedule."],
    ["★ Ultra: Command line", "PowerMode.exe /compare, /log, /rule with an HTML, JSON or CSV report."]
  ],
  notes: ["All changes are made with the standard powercfg tool and can be undone with the “Restore” button.", "Only plans created in PowerMode can be deleted; Windows and laptop manufacturer plans can't.", "For auto-switching, turn on “Start with Windows” — the app will run in the tray.", null],
  changes: [
    ["AkeeTech Ultra professional features: plan comparison and audit, mode log, plan schedule, command line", "Ultra: power plan comparison and audit", "Ultra: a mode log with time spent in each plan", "Ultra: a plan schedule by time and weekday", "Ultra: CLI /compare /log /rule and HTML/JSON/CSV reports"],
    [null]
  ],
  shots: ["PowerMode: power plans as cards — “High performance” is active"],
  req: [null, null, "No admin rights needed to switch plans"],
  tags: ["power", "laptop", "performance", "battery", "tray"],
  pro: ["Auto-switching on AC/battery and when games launch", "Fine CPU settings (turbo, min/max)", "Custom plans", null]
},
"updatecheck": {
  short: "Shows which apps on your computer are outdated and updates them via winget — one at a time or all at once.",
  description: [
    "UpdateCheck asks winget — the package manager built into Windows — which installed apps can be updated, and shows a clear list: name, installed and new version, source.",
    "Updates start with one button or a double-click: the installer runs silently in the background, and the table shows the download progress. You can close the window — UpdateCheck finishes in the tray and reports the result."
  ],
  features: [
    ["Update list", "Every app with a newer version: installed → available, source winget or Microsoft Store."],
    ["Background updates", "Silent installation with download progress right in the table; tasks run one after another."],
    ["Update all", "One button queues all available updates except excluded ones."],
    ["Exclusions", "Mark apps you don't want updated — they're hidden from the list and skipped by “Update all”."],
    ["History", "What was updated, when, from which version to which, and how it went."],
    ["Scheduled checks", "Every 6 hours, daily or weekly — a tray notification when updates appear."]
  ],
  notes: ["If winget isn't installed, the app tells you where to get “App Installer” in the Microsoft Store.", "Some installers ask for admin rights during an update — that's a Windows prompt, not UpdateCheck.", "The app never updates anything without your command: on a schedule it only checks and notifies.", null],
  changes: [[null]],
  shots: ["UpdateCheck: available app updates on this PC, one downloading in the background"],
  req: [null, "winget (App Installer from the Microsoft Store — already in Windows 11)", null],
  tags: ["updates", "winget", "apps", "security", "tray"],
  pro: ["Update all with one button", "Scheduled checks with notifications", "Exclusions and update history", null]
},
"snapback": {
  short: "Windows restore points in one window: view them, create one with a clear description and roll back if something breaks.",
  description: [
    "SnapBack shows all Windows restore points with their date, description and type, the protection status of drive C: and how much space the points take. A new point is created in one click with your description — e.g. “Before installing the NVIDIA driver”. The “System Restore” button opens the standard Windows rollback wizard.",
    "Windows silently refuses to create a second point within 24 hours. SnapBack notices this, explains it and offers to lift the limit — the previous registry value is saved, and everything comes back with the “Restore” button. In Pro: automatic points on a schedule and before installing apps, a space limit for points and deleting old points."
  ],
  features: [
    ["Point list", "Date, description, type (app install, driver, manual, system) and age of each point. Data comes from Windows (Get-ComputerRestorePoint)."],
    ["A point in one click", "Type a description, press Enter — and the point is created. If drive protection is off, SnapBack offers to turn it on."],
    ["Bypass the 24-hour limit", "If Windows didn't create a point because of the “once a day” limit, SnapBack tells you and, with your consent, lifts it (SystemRestorePointCreationFrequency = 0) with the option to roll back."],
    ["Protection and space", "Whether system protection is on for C:, how much space points take and the configured maximum (vssadmin)."],
    ["System Restore", "The Windows rollback wizard (rstrui) opens with a button — choose a point and bring the system back to a working state."],
    ["Restore settings", "Every change to Windows settings is logged with its previous value and undone with one button."]
  ],
  notes: ["Free version: the point list, creating a point with a description, bypassing the 24-hour limit, enabling drive protection and opening System Restore.", "Scheduled automatic points run via Windows Task Scheduler (the AkeeTech\\SnapBack - автоточка task) — even when the app is closed.", "Deleted points can't be recovered — SnapBack always asks for confirmation and never deletes the newest point.", null],
  changes: [[null]],
  shots: ["SnapBack: drive protection, space for points, creating a new point and the list of restore points"],
  req: [null, null, "Admin rights for listing and creating points (the app has a restart button)"],
  tags: ["system restore", "restore points", "backup", "Windows", "rollback"],
  pro: ["Automatic point before app installs and on a schedule", "Managing space for points", "Deleting old points", null]
},
"shelltune": {
  short: "Clean up everything apps have added to your right-click menu — reversibly and with a rollback log.",
  description: [
    "ShellTune gathers every Explorer context menu item — for files, folders, folder background and drives — and shows them with clear names and the app that added them. An unwanted item is disabled with one button without deleting registry keys: ShellTune only marks the item as hidden and remembers its original state.",
    "Everything you change is recorded in the “Rollback log” — the “Restore all” button returns the menu to its original look. Explorer restarts with a button so changes apply instantly. In Pro: items for all users and handler extensions, the classic Windows 10 menu in Windows 11 and your own “Open in app…” items."
  ],
  features: [
    ["Every menu item", "Commands (shell) and extensions (shellex) for files, folders, folder background and drives — from the current user's and all users' keys."],
    ["Clear names", "Names from MUIVerb and Windows resources, extension names by CLSID and the source app name from file details."],
    ["Reversible disabling", "Commands are hidden with the LegacyDisable value, extensions via the official Shell Extensions\\Blocked list. Apps' keys are never deleted."],
    ["Rollback log", "The original state of every change is saved. Click “Restore all” and the menu is back as it was."],
    ["Filters", "Files, folders, folder background, drives and “Hide Windows items” — to quickly find what third-party apps added."],
    ["Restart Explorer", "One button: menu changes apply immediately, without signing out of Windows."]
  ],
  notes: ["Free version: view all items, enable/disable commands added for your account (HKCU), rollback log.", "A disabled extension is blocked by CLSID for your account — it's hidden everywhere it appears in the menu.", "Items in the new Windows 11 menu from Microsoft Store apps (packaged extensions) aren't described in the registry and aren't listed; they don't appear in the classic menu.", null],
  changes: [[null]],
  shots: ["ShellTune: context menu items with the source app, filters and enable/disable"],
  req: [null, null, "Admin rights — only for all-users items (HKLM)"],
  tags: ["context menu", "Explorer", "Windows 11", "tweaks", "registry"],
  pro: ["All-users items (HKLM) and handler extensions", "Classic Windows 10 menu in Windows 11", "Your own menu items (open in app…)", null]
},
"userguard": {
  short: "Who's on your computer: local users and groups, administrators, recent sign-ins, failed attempts and an account security check.",
  description: [
    "UserGuard shows all local Windows accounts in one table: whether an account is enabled, whether it has admin rights, when it was last used to sign in, when the password was set and when it expires. A separate page shows groups and their members, including Microsoft accounts.",
    "The sign-in log reads Windows events 4624 and 4625 and keeps only human sign-ins: at the computer, unlock, Remote Desktop, failed attempts with a reason (wrong password, no such user). Night-time, remote and failed sign-ins are highlighted — you instantly see if someone is guessing a password."
  ],
  features: [
    ["All users", "Status, admin or not, last sign-in, password date and expiry, groups — for every local account."],
    ["Groups and members", "All local Windows groups and who's in them; “Administrators” first. Works on Russian, Ukrainian and English Windows."],
    ["Sign-in log", "Sign-ins and failed attempts for a day, week or month: who, when, how (local, unlock, RDP) and from where."],
    ["Suspicious activity", "Failed attempts with a reason, night-time and Remote Desktop sign-ins — as a separate filter."],
    ["Safe management", "Enable or disable a user, grant or revoke admin rights — with confirmation. You can't remove the last administrator or yourself."],
    ["Check and report", "An account security score: enabled guest, extra administrators, unused accounts, old passwords. An HTML report for review."],
    ["★ Ultra: Account snapshots and comparison", "Saves account snapshots and shows what changed: who was created or deleted, enabled/disabled, added to administrators, changed their password; HTML/CSV report."],
    ["★ Ultra: Security event alerts", "Watches the Security log: account creation and deletion, group additions, lockouts, log clearing and password guessing (a 4625 spike) — to a log and Telegram/webhook."],
    ["★ Ultra: Network PC account audit", "Checks users and administrators on several PCs via netapi32 (read-only) and gives a summary with a security score for each PC."],
    ["★ Ultra: Command line for scripts", "UserGuard.exe --audit/--snapshot/--events [--computer PC] with HTML/CSV reports, alerts and exit codes."]
  ],
  notes: ["Viewing users and groups works without admin rights; the Windows Security log can only be read with them — the app has a “Restart as administrator” button.", "Every change is recorded, and the “Restore” button undoes the last one. User files are never deleted.", "For Microsoft accounts Windows often doesn't store the sign-in time — in that case the last profile load time is shown.", null],
  changes: [
    ["AkeeTech Ultra professional features: account snapshots and comparison, security event alerts, network PC account audit, command line for scripts", "Ultra: account snapshots and comparison over time", "Ultra: Security log monitoring with Telegram/webhook alerts", "Ultra: account audit of remote PCs", "Ultra: CLI mode for scripts", "“★ Ultra” button on the users page"],
    [null]
  ],
  shots: ["UserGuard: local users, administrators and recent sign-ins"],
  req: [null, null, "Admin rights — only for the sign-in log and changes"],
  tags: ["users", "administrator", "security", "sign-in log", "Windows"],
  pro: ["Sign-in and failed attempt log", "User and group management", "Security review report", null]
},
"freeloot": {
  short: "All free game giveaways in one window: Steam, Epic Games, GOG, itch.io and more — with images, deadlines, value and notifications about new ones.",
  description: [
    "FreeLoot collects giveaways from the open GamerPower catalog and the Epic Games Store's free games of the week into neat cards: an image, platforms, the usual price and the date until which you can claim it. One game from two sources — one card.",
    "The “Claim” button opens the giveaway page in your browser, while “✓ Claimed” and “Hide” remove the card from the list. FreeLoot can live in the tray, check for giveaways every 3 hours and tell you about new ones — especially games from your wishlist."
  ],
  features: [
    ["Giveaway cards", "An image, platforms, the usual price and “free”, days left — giveaways ending soon are highlighted."],
    ["Two sources", "The GamerPower catalog and Epic Games Store free games, including next week's “coming soon”. Duplicates are merged."],
    ["Platform filters", "Steam, Epic, GOG, itch.io, Ubisoft, EA, Xbox, PlayStation, Switch, Android, iOS, DRM-Free — in one click."],
    ["Claimed and hidden", "Marked giveaways stay out of the way; you can bring them back on a separate page."],
    ["Tray notifications", "Checks every 3 hours and reports giveaways that are new since the last check; can start with Windows."],
    ["Wishlist", "Add game titles — matches float to the top, get a ♥ mark and a separate notification."],
    ["★ Ultra: Notification rules", "Your own conditions — stores, type, minimum value, keywords and exclusions — decide which giveaways to report and where."],
    ["★ Ultra: Webhook and Telegram", "New giveaways arrive automatically in Discord, Slack, any webhook (JSON) or Telegram via your bot, with a test button."],
    ["★ Ultra: Giveaway history", "A log of every giveaway seen, with search, “how much you saved” stats and export to CSV and an HTML report with a monthly chart."]
  ],
  notes: ["Giveaway data comes from the open GamerPower and Epic Games Store APIs; FreeLoot never signs in to your accounts — it only opens the giveaway page in your browser.", "Images are cached in %LOCALAPPDATA%\\CISOFT\\freeloot\\img; the cache can be cleared in settings.", "Autostart adds one entry to HKCU\\…\\Run; turning the switch off removes it.", null],
  changes: [
    ["AkeeTech Ultra professional features: notification rules, webhook and Telegram, giveaway history", "Ultra: notification rules with conditions and actions", "Ultra: Discord/Slack/webhook integrations and a Telegram bot", "Ultra: giveaway history, savings stats, CSV/HTML export", "FreeLoot stays in the tray if Ultra rules are enabled"],
    [null]
  ],
  shots: ["FreeLoot: current giveaways with platform filters, a wishlist and deadlines"],
  req: [null, null, "An internet connection", null],
  tags: ["free games", "giveaways", "Steam", "Epic Games", "GOG"],
  pro: ["Notifications about new giveaways", "Only my platforms and a title wishlist", "DLC and in-game item giveaways", null]
},
"cryptbox": {
  short: "Encrypt files and folders with a password: drag them in and get a protected .cbox that can't be opened without the password.",
  description: [
    "CryptBox turns any file into an encrypted .cbox. The key is derived from the password via PBKDF2-SHA256 (310,000 iterations, random salt), data is encrypted with AES-256, and the whole file is signed with HMAC-SHA256 — if even one byte changes, CryptBox notices and won't decrypt anything.",
    "It's simple to use: drag files into the window, enter the password twice — done. .cbox files are decrypted the same way. Large files are processed as a stream without loading them into memory, and the original file name is stored inside the ciphertext and can be hidden entirely if you like."
  ],
  features: [
    ["Drag to encrypt", "Drag files and folders into the window. Regular files get encrypted, .cbox files get decrypted, all in one queue with progress."],
    ["Strong encryption", "AES-256-CBC, a key from the password via PBKDF2-SHA256 with 310,000 iterations and a random salt, HMAC-SHA256 integrity check before decryption."],
    ["Password strength meter", "The password is rated as you type: length, alphabet, repeats, “qwerty” sequences and common passwords are all considered. A weak password gets a warning."],
    ["Delete the original", "Optionally, the original file is sent to the Recycle Bin after encryption — an honest regular deletion, with no promises of “wiping”."],
    ["Explorer menu (Pro)", "“Encrypt with CryptBox” on right-click for files and folders, and double-click a .cbox to decrypt. HKCU only, with a “Restore” button."],
    ["Vault folder (Pro)", "Everything that lands in the chosen folder is encrypted automatically while CryptBox is running (in the tray). Locked and temporary files wait their turn."]
  ],
  notes: ["Free version: encrypting one file at a time up to 100 MB; decryption is unlimited.", "The password is never stored anywhere. If you forget it, the file can't be recovered.", "Deleting the original is a regular deletion to the Recycle Bin; data may persist on SSDs and in shadow copies.", null],
  changes: [[null]],
  shots: ["The encryption queue: a password with a strength meter and progress"],
  req: [null, null, null],
  tags: ["encryption", "AES-256", "password", "security", "files"],
  pro: ["No size limits and whole folders", "“Encrypt” item in the Explorer menu", "Encrypted vault folder: everything you put in it is encrypted automatically", null]
},
"qrbridge": {
  short: "Create and read QR codes offline: links, Wi-Fi, contacts, emails and map locations — to PNG in a couple of seconds.",
  description: [
    "QRBridge makes a QR code from any text, link, Wi-Fi network details, business card, email or coordinates. The code updates as you type, and you can save it as a PNG of the size you need or copy it as an image into a chat or document. The generator is written from scratch to the ISO/IEC 18004 standard and works fully offline — your passwords and contacts aren't sent anywhere.",
    "Pro adds custom colors and a logo in the center of the code, vector SVG for printing, batch creation of hundreds of codes from a list, and reading QR codes: take a screenshot, open an image or paste it from the clipboard — QRBridge finds the code and shows what's in it."
  ],
  features: [
    ["Six code types", "Text, link, Wi-Fi (WPA/WEP/open, hidden network), vCard contact, email with subject and body, geolocation."],
    ["Wi-Fi for guests", "Point a phone camera at it and the phone offers to join the network without typing the password. Handy to print and hang by the router."],
    ["Four error correction levels", "L, M, Q and H: from the most compact code to one that reads even with a third of its modules damaged."],
    ["Best mask automatically", "Of eight masks, the one giving the most readable pattern is chosen — using the QR standard's penalty rules."],
    ["PNG and clipboard", "512, 1024 or 2048 pixels with crisp module edges. Copy as an image — straight into a messenger or Word."],
    ["No internet or libraries", "Encoding, Reed–Solomon and recognition all run on your computer. Nothing is uploaded."]
  ],
  notes: ["QR versions 1–20 are supported: up to ~850 Latin or ~420 Cyrillic characters in one code.", "Reading (beta) is designed for sharp codes: screenshots, images, PDFs on screen. Photos at a steep angle may not be recognized.", "The center logo is available only with error correction level H — that keeps the code readable.", null],
  changes: [[null]],
  shots: ["QRBridge: a guest Wi-Fi code with a preview and error correction level choice"],
  req: [null, null],
  tags: ["QR code", "Wi-Fi", "business card", "scanner", "generator"],
  pro: ["Custom colors and a center logo", "Read QR codes from the screen and images", "SVG and batch creation from a list", null]
},
"emojipad": {
  short: "Emoji and special characters at hand: press Ctrl+Shift+E in any app, find an emoji by keyword and insert it with one click.",
  description: [
    "EmojiPad lives in the tray and opens a compact window next to the cursor on Ctrl+Shift+E. It has all 1,870 Unicode 15 emoji in color, sorted into categories, plus special characters that aren't on the keyboard: arrows, ©, ™, «guillemets», the em dash, currencies like ₴ and €, math, box drawing and Greek letters. You can search with words — “heart”, “fire”, “ok”, “hryvnia”, “arrow” — in Russian, Ukrainian or by a code like :fire:.",
    "Clicking a character inserts it where you were typing: Telegram, Discord, a browser, Word. EmojiPad types the character directly without touching the clipboard, and for apps that can't handle that there's a clipboard paste mode. Recent characters are always on top."
  ],
  features: [
    ["Window on Ctrl+Shift+E", "Opens at the cursor in any app. Start typing a query right away, pick with the arrows and insert with Enter. The shortcut can be changed."],
    ["Search by keywords", "Unicode CLDR keywords in Russian and Ukrainian plus colloquial words. Codes like :heart: or :+1: work too."],
    ["Color emoji", "Emoji are drawn in color via DirectWrite, like in Windows 11 itself, not as gray outlines."],
    ["Special characters", "More than 250 characters in 9 groups: quotes and dashes, signs, arrows, math, sub/superscripts and fractions, currencies, box drawing, shapes, Greek letters."],
    ["Insert into the previous window", "The character is typed in the window you were working in via Windows Unicode input. For games and picky apps there's clipboard paste."],
    ["Recents and catalog", "The last 36 characters always come first. The main window has a full catalog with a large preview, the name and code of the selected character."]
  ],
  notes: ["Free version: all emoji and special character categories, search, recents, insert and copy.", "Auto-replacement of :codes: works only in the draft inside EmojiPad: the app doesn't intercept the keyboard in other apps.", "Windows shows country flags as letters (UA, PL), but real flags are inserted, and Telegram, Discord and browsers show them as images.", "Windows doesn't let a regular app paste into windows running as administrator. There EmojiPad puts the character on the clipboard so you can paste it with Ctrl+V.", null],
  changes: [[null]],
  shots: ["EmojiPad: a catalog of color emoji with search, recent characters and details of the selected one"],
  req: [null, null, null],
  tags: ["emoji", "smileys", "special characters", "kaomoji", "hotkeys"],
  pro: ["Favorites and custom sets", "Kaomoji and text templates", "Skin tone and :code: auto-replacement while typing", null]
},
"statuscraft": {
  short: "Your own Discord profile status: “Playing Minecraft on server…”, “Studying”, “Watching a stream” — with an image, a timer and link buttons.",
  description: [
    "StatusCraft shows any status you like in your Discord profile: two lines of text, an image from a link, an “elapsed” timer or a countdown and up to two link buttons — for example “Join the server” or “Watch the stream”. The status title is the name of your app in the Discord Developer Portal — the app walks you through creating one in a minute.",
    "The app connects directly to the Discord client running on your computer, without signing in and without tokens: it doesn't need your password or account data. You can keep several ready-made statuses, switch them on a timer or let StatusCraft set “Playing …” itself when you launch a game."
  ],
  features: [
    ["A status in a minute", "Two lines, the activity type (playing, watching, listening, competing) and a live preview of the card as your friends will see it."],
    ["Image and timer", "An image from an https link or an Art Assets key, an “elapsed” timer or a countdown for a focus session."],
    ["Link buttons", "Up to two buttons in the status: a Minecraft server, your stream, a website or a Discord server — with label and URL validation."],
    ["Templates", "Ready-made statuses: Minecraft on a server, studying, a movie, a stream, music, AFK, a focus session — apply in one click."],
    ["Auto-status by game", "Launch Minecraft, CS2, Dota 2, Valorant or another game from the list — the status changes itself and reverts after you quit."],
    ["Runs from the tray", "Starts with Windows without admin rights, reconnects after Discord restarts, clear error messages."]
  ],
  notes: ["Free version: one status with text, an image and a timer, manual on and off.", "Discord shows the status while StatusCraft is running; when you close the window, the app stays in the tray.", "Other users see the link buttons — Discord doesn't always show them on your own card, and that's normal.", null],
  changes: [[null]],
  shots: ["StatusCraft: the status editor with a Discord card preview, a timer and link buttons"],
  req: [null, null, "The Discord desktop app (the browser version doesn't show statuses)", "Your own app in the Discord Developer Portal (free, instructions in the app)"],
  tags: ["discord", "rich presence", "status", "games", "for streamers"],
  pro: ["Templates and auto-status for the running game", "Link buttons in the status", "Switching statuses on a timer", null]
},
"proxyjump": {
  short: "Quickly switch the Windows system proxy: HTTP, SOCKS5 and PAC profiles, switching from the tray, IP check through the proxy and “Restore”.",
  description: [
    "ProxyJump stores your proxies as profiles — an office HTTP proxy, a local SOCKS5 from Tor or Shadowsocks, a corporate PAC script — and turns on the one you need with one click in the window or from the tray menu. The app changes the same settings as “Settings → Network → Proxy” and immediately notifies browsers and apps.",
    "Before the first change ProxyJump remembers your previous proxy settings, and the “Restore” button brings them back exactly. A built-in check shows whether the proxy responds, which external IP websites see through it and whether it matches your real one."
  ],
  features: [
    ["Proxy profiles", "HTTP and SOCKS5 (address:port), exclusions like “<local>;192.168.*;*.corp.local” and PAC scripts from a URL or a file."],
    ["Switch from the tray", "Right-click the icon for the profile list, “Turn off proxy” and “Restore”; the icon turns green when a proxy is on."],
    ["Proxy check", "TCP reachability and the external IP through the proxy (api.ipify.org) — you instantly see whether the proxy works and whether it's transparent."],
    ["Restore", "The original ProxyEnable, ProxyServer, ProxyOverride and AutoConfigURL are saved and restored exactly, including values that didn't exist."],
    ["Auto-switch by Wi-Fi", "List networks in a profile — the office proxy turns on on the office Wi-Fi, and the proxy can be turned off automatically on unknown networks."],
    ["Speed and ping", "Time to connect to the proxy, response latency through it and the download speed of 4 MB — to pick the fastest."],
    ["★ Ultra: Per-domain PAC rules", "Which sites go through which proxy, which go direct and which get blocked: masks, domains and subnets, an address tester and PAC file export."],
    ["★ Ultra: Failover chain with monitoring", "Background proxy latency checks, automatic switching to a backup on failure and switching back to the primary."],
    ["★ Ultra: Latency chart and reports", "Proxy latency and availability history for an hour/day/week with a chart and export to HTML, CSV and JSON."],
    ["★ Ultra: Profile schedule", "Weekdays and hours → a profile, PAC rules or proxy off; intervals across midnight."]
  ],
  notes: ["The free version has 2 HTTP/SOCKS5 profiles, turning the proxy on and off, and reachability and IP checks.", "Only the current user's proxy settings are changed (as in Windows Settings); apps with their own proxy settings, like Firefox with a manual proxy, don't use them.", "The SOCKS5 check works with proxies without a password; for proxies with a login the app shows that authentication is required.", "Settings and saved previous values are stored in %APPDATA%\\CISOFT\\proxyjump\\settings.ini.", null],
  changes: [
    ["AkeeTech Ultra professional features: per-domain PAC rules, failover chain with monitoring, latency chart and reports, profile schedule", "New menu sections: ★ PAC rules, ★ Failover, ★ Schedule", "A local PAC server at 127.0.0.1 generating the script from rules", "Latency monitoring, failover and failback along a profile chain", "30 days of measurement history, a chart and HTML/CSV/JSON reports", "A schedule for enabling profiles"],
    [null]
  ],
  shots: ["ProxyJump: proxy profiles, the office proxy enabled and the profile editor"],
  req: [null, null, null],
  tags: ["proxy", "SOCKS5", "PAC", "network", "tray"],
  pro: ["Unlimited profiles and PAC", "Auto-switching by network (Wi-Fi SSID)", "Speed and ping check through the proxy", null]
},
"wifivault": {
  short: "All Wi-Fi networks saved on this computer, with passwords and a QR code to connect a phone in a second.",
  description: [
    "Forgot your home Wi-Fi password and a guest wants to connect? WiFiVault shows every network the computer has ever connected to and the password for any of them — with a “Show” button, no command line. A QR code appears right next to it: the phone points its camera and connects without typing the password.",
    "The app works through the built-in Windows netsh and understands its output in Russian, Ukrainian and English. It also shows the current connection with signal strength, channel and speed, and deletes old networks (with an encrypted copy and a “Restore” button); in Pro — moving all networks to another PC, airwaves analysis with a free-channel suggestion and network connection order."
  ],
  features: [
    ["Saved network passwords", "A list of all Wi-Fi profiles with the security type and connection mode; the password is shown only on a button press and copied to the clipboard."],
    ["QR code for the phone", "A standard WIFI: code — the Android and iPhone camera offers to connect without typing the password. Can be saved as PNG and printed."],
    ["Current connection", "Signal in percent and bars, channel, band, Wi-Fi 4/5/6/7 standard, receive and transmit rates, a 3-minute signal chart."],
    ["Lossless deletion", "Before deletion the profile is saved to an encrypted copy (DPAPI) — “Restore deleted” brings the network back with its password."],
    ["Airwaves analysis", "Neighboring networks on a 2.4 and 5 GHz channel chart, the load on each channel and advice on which channel to pick in your router settings."],
    ["Migration and priority", "Export all networks to XML and import them on another PC with undo; the order in which Windows picks networks, with a “Restore” button."],
    ["★ Ultra: Wi-Fi security audit", "A 0–100 score and an A–F grade for every saved network: outdated security, weak and reused passwords, auto-connecting to open networks, default router names."],
    ["★ Ultra: Profile snapshots and comparison", "Snapshots of all networks over time compared with the current ones: what was added, removed, changed and what weakened security (passwords are stored only as fingerprints)."],
    ["★ Ultra: Encrypted .wvault archive", "All networks with passwords in one password-protected file (AES, PBKDF2) for moving to another PC, and import from it."],
    ["★ Ultra: HTML / CSV / JSON reports", "An audit report and a list of changes for archiving or an administrator — without the passwords themselves."]
  ],
  notes: ["Passwords are read with the built-in Windows netsh command — no admin rights needed for your own networks; Group Policy networks and other accounts' networks may require admin rights.", "In Windows 11 the list of neighboring networks for airwaves analysis is available only when location access for desktop apps is enabled — the app shows where to turn it on.", "Exported XML files contain passwords in plain text — keep them safe and delete them after moving.", null],
  changes: [
    ["AkeeTech Ultra professional features: Wi-Fi security audit, profile snapshots and comparison, encrypted .wvault archive, HTML / CSV / JSON reports", "New menu sections: ★ Profile snapshots and ★ Security audit", "Password strength rating: entropy, a common-password dictionary, match with the network name", "Snapshot comparison flagging dangerous changes", "★ To .wvault archive / ★ From .wvault buttons on the Migration page", "Report export to HTML, CSV and JSON", null],
    [null]
  ],
  shots: ["WiFiVault: the list of saved networks, the selected network's password and a QR code to connect a phone"],
  req: [null, null, "A Wi-Fi adapter and the WLAN service running"],
  tags: ["Wi-Fi", "passwords", "QR code", "network", "router"],
  pro: ["Profile export and import (move to another PC)", "Airwaves analysis: neighboring network channels and the best channel advice", "Network priority", null]
},
"subtitler": {
  short: "A subtitle editor: frame- and audio-accurate syncing, reading speed checks, SRT/VTT/ASS and burning subtitles into video.",
  description: [
    "SubTitler helps you quickly create or fix subtitles for a video. Open a clip and an SRT file — the table shows every line with its start, end, duration and reading speed. Click a line and the frame at that moment appears on the right with the text overlaid; the “Listen” button plays that fragment's audio, and F2 and F3 mark a line's start and end right while you listen.",
    "When subtitles drift, you can shift them by the right number of milliseconds or stretch them between two points (e.g. for a different frame rate). The check finds overlaps, lines too fast to read, and displays that are too short or too long. In Pro: VTT and ASS formats with styles, and burning subtitles into the video itself with a choice of font, size and outline."
  ],
  features: [
    ["Line table", "Start, end, duration and characters per second for every line; fast and overlapping lines are highlighted."],
    ["Frame and audio without a player", "A frame preview at any moment and listening to a fragment — precise syncing without a heavy built-in video player."],
    ["Hotkeys", "F2 — start, F3 — end (and jump to the next line), F4 — new line, F5 — listen, Alt+arrows — 0.1 s steps."],
    ["Shift and stretch", "Shift all or some lines by ±N ms, stretch between two points and convert 25 ↔ 23.976 fps."],
    ["Error check", "Overlaps, reading speed above the norm, displays too short or too long, long lines — with a jump to the line."],
    ["Burn into video", "Subtitles become part of the picture: font, size, color, outline, an accurate frame preview, encoding with NVIDIA NVENC."],
    ["★ Ultra: Speech-based auto-timing", "Finds speech in the audio track (FFmpeg silencedetect) and creates draft lines or snaps the boundaries of existing lines to the start and end of phrases."],
    ["★ Ultra: Snap to shot changes", "Finds shot changes in the video and snaps line starts to the cut and ends 2 frames before it, as streaming service standards require."],
    ["★ Ultra: Netflix standard", "A check against the Netflix Timed Text Style Guide (duration, 42 characters, 2 lines, reading speed, 2-frame gaps) with auto-fixing, splitting of long lines and HTML/CSV reports."],
    ["★ Ultra: Batch folder conversion", "Converts all SRT/VTT/ASS files in a folder (with subfolders) to the format you need, with shifting, FPS conversion and Netflix fixes in one pass."]
  ],
  notes: ["Free version: opening and saving SRT, editing, frame and audio preview, time shifting, error checking.", "Subtitle files in Windows-1251 encoding open automatically; saving is in UTF-8.", "Burning re-encodes the video: on a laptop with an NVIDIA GPU it's noticeably faster; without one, the CPU is used.", null],
  changes: [
    ["AkeeTech Ultra professional features: speech-based auto-timing, snap to shot changes, Netflix standard, batch folder conversion", "New “★ Ultra” page in the menu", "Auto-timing by speech segments and snapping lines to speech", "Shot change detection and snapping line boundaries to cuts", "Checking and auto-fixing to the Netflix standard (adult and children's), HTML and CSV reports", "Batch conversion of a subtitle folder: format, shift, FPS, Netflix fixes"],
    [null]
  ],
  shots: ["SubTitler: the line table, a frame with a subtitle and the timeline with line markers"],
  req: [null, null, "FFmpeg for working with video — downloaded automatically (~100 MB, shared by AkeeTech apps)", null],
  tags: ["subtitles", "SRT", "video", "sync", "ASS"],
  pro: ["VTT and ASS with styles", "Burn subtitles into video", "Two-point stretching and batch editing", null]
},
"syncbox": {
  short: "Folder sync and backup: to a USB stick, another drive, a network folder or OneDrive — manually, when a USB stick is plugged in or on a schedule.",
  description: [
    "SyncBox keeps copies of important folders up to date. Create a “from → to” job, choose a mode — mirror, new files only or a versioned backup — and run it with one button. Before running you can see exactly what will be copied, updated and deleted.",
    "Files are compared by size and modification time (with tolerance for FAT/exFAT USB sticks) and optionally by SHA-256 hash. Locked files are skipped and logged, copying goes through a temporary file, and deleting extra files in Mirror mode happens only after confirmation and to the Recycle Bin."
  ],
  features: [
    ["Three modes", "“Mirror” — an exact copy of the source, “New only” — no deletions, “Versioned backup” — a dated zip archive on every run, keeping the last N versions."],
    ["Preview", "A “what will happen” list before running: new, updated and deleted files, the copy size, warnings about unavailable folders."],
    ["Safe deletion", "Extra mirror files are deleted only after confirmation and to the Recycle Bin. You can also sync and leave the extras in place."],
    ["Mask exclusions", "*.tmp; ~$*; Thumbs.db; node_modules\\; Cache\\*.bak — by file name, folder or relative path."],
    ["USB stick by volume label (Pro)", "Plug in a USB stick and the job runs by itself, even if Windows gave it a different drive letter. Works while SyncBox is in the tray."],
    ["Schedule and log", "Run every hour, every 6 hours or daily (Pro). The log keeps what was copied, deleted and which files were locked."]
  ],
  notes: ["Free version: 2 jobs, manual runs, Mirror and New only modes.", "USB and scheduled runs work while SyncBox is running (in the tray); you can enable start with Windows.", "Network folders and some USB sticks have no Recycle Bin — deletion in Mirror mode is permanent there, and SyncBox warns you about it.", null],
  changes: [[null]],
  shots: ["Sync jobs: a mirror to a USB stick, photos to a NAS, project versions"],
  req: [null, null, null],
  tags: ["backup", "sync", "USB stick", "backup copy", "OneDrive"],
  pro: ["Unlimited jobs and running when a USB stick is plugged in", "Schedule (while SyncBox is in the tray)", "Versioned backup (zip by date)", null]
},
"talklan": {
  short: "Voice chat for your crew: friends on the same network, Radmin VPN or SquadLAN hear each other without servers, sign-up or internet.",
  description: [
    "TalkLAN finds everyone running it on the same network by itself and puts them in a shared voice room. You can talk like a walkie-talkie — holding a key (works over a game too) — or with voice activation at a threshold you set right on the microphone meter.",
    "Voice goes directly between computers over UDP with a 60–100 ms jitter buffer: no servers, no cloud and no extra delay. Each participant has their own volume and a mute button, and the speaker is shown by a highlighted avatar."
  ],
  features: [
    ["No servers or sign-up", "Participants find each other by broadcast on the local network. Works at home, over Wi-Fi, in Radmin VPN and SquadLAN; you can also add a friend by IP."],
    ["Push-to-talk", "Hold V, Caps Lock, Alt or a side mouse button — the key works even when the game window is active."],
    ["Voice activation", "Transmission turns on by itself when you speak. The threshold is a white mark on the microphone meter that you can drag."],
    ["Per-person volume", "A 0–200% slider and mute for every participant. Settings are remembered for each friend."],
    ["Who's talking", "The speaker's avatar is highlighted, a muted-mic icon shows for those who muted, and your own mic level."],
    ["Light and fast", "G.711 μ-law 16 kHz codec, 20 ms frames, about 100 ms latency. Barely loads the CPU while gaming."]
  ],
  notes: ["Ports: UDP 47300 (discovery) and UDP 47301 (voice).", "The voice stream is about 128 kbps per person: designed for a local network and LAN VPNs, not mobile internet.", "Password-protected rooms encrypt voice with AES-256 with authentication (HMAC-SHA256); recordings are saved as WAV to “Documents\\TalkLAN”.", null],
  changes: [[null]],
  shots: ["TalkLAN: a shared voice room — who's talking, per-person volume and push-to-talk"],
  req: [null, null, "A microphone or headset", "TalkLAN on the other people's computers on the same network", null],
  tags: ["voice chat", "local network", "Radmin", "push-to-talk", "LAN"],
  pro: ["Password-protected rooms (AES encryption)", "Noise suppression (a simple noise gate + filter)", "Conversation recording", null]
},
"textstyler": {
  short: "Fancy text for nicknames and messages: bold, script, gothic, bubbles, strikethrough and 30-plus more Unicode styles — in one click.",
  description: [
    "Type your text and TextStyler instantly shows it in 41 styles: 𝐁𝐨𝐥𝐝, 𝘐𝘵𝘢𝘭𝘪𝘤, 𝓢𝓬𝓻𝓲𝓹𝓽, 𝔉𝔯𝔞𝔨𝔱𝔲𝔯, Ⓒⓘⓡⓒⓛⓔ, ᴄᴀᴘꜱ, upside down, strikethrough, underlined, fullwidth and more. It's not a font but Unicode characters, so the style survives copying into Telegram, Discord, Instagram or Steam.",
    "TextStyler is honest about the limits. Every style has icons for where it displays and a mark for whether it works with Cyrillic: Unicode has no “bold” Russian letters, but strikethrough, underline, frames and letter spacing work. Next to it you see the length in characters and in UTF-16 units, which nickname limits are counted in."
  ],
  features: [
    ["41 text styles", "Fonts (bold, italic, script, gothic, double-struck, monospace), outlines, lines, sub/superscripts, upside-down text, spacing and decorations."],
    ["One-click copy", "Clicking a style copies the finished text. Paste it straight into a chat, bio or nickname."],
    ["Where it works", "Telegram, Discord, Instagram, Steam and Minecraft icons on each style show where it's visible. Cyrillic support is marked separately."],
    ["Nickname length", "Length is shown in visible characters and in UTF-16. A bold letter takes two units, and the app warns you if a nickname won't fit Discord's 32-character limit."],
    ["Nickname generator", "A word turns into 24 variants with fonts and decorations like ꧁꧂, 『』, ★彡, ⚡. The “More” button gives a new set."],
    ["Markup preview", "Format a message with **bold**, ||spoiler||, `code`, > quote buttons and instantly see how Discord or Telegram will show it."]
  ],
  notes: ["Free version: 10 styles (bold, italic, bold italic, script, gothic, double-struck, bubbles, small caps, strikethrough, upside down), copying, markup buttons.", "Font styles exist only for Latin letters and digits. Russian letters stay plain, while lines, frames and decorations work with any text.", "Minecraft only accepts Latin letters, digits and _ (3–16 characters) in nicknames, so a styled nickname isn't possible there. Minecraft chat shows only simple characters.", "Some circled letters (🅰) are shown as emoji on phones.", null],
  changes: [[null]],
  shots: ["TextStyler: text in different Unicode styles with icons showing where each works, and nickname length"],
  req: [null, null, null],
  tags: ["text", "nicknames", "unicode", "discord", "telegram"],
  pro: ["All 40+ styles and decorations", "Nickname generator", "Discord/Telegram markup preview", null]
},
"streamchat": {
  short: "Twitch chat right over your game: a click-through transparent overlay and a chroma-key window for OBS.",
  description: [
    "StreamChat shows your Twitch channel's chat over the game — no need to alt-tab or keep a second monitor. The overlay is transparent and passes clicks to the game; you can drag it to any corner, resize it, choose the font size, background and how long messages stay before fading out.",
    "The connection is anonymous and read-only: no sign-in or tokens needed. Nicknames appear in Twitch colors with broadcaster, moderator, VIP and subscriber badges, emotes as labeled chips, and subs, gifts, raids and bits are highlighted separately. For streaming there's an “OBS window” with a solid background for the Chroma Key filter."
  ],
  features: [
    ["Overlay over the game", "A transparent click-through window: the mouse goes to the game. Setup mode lets you drag and resize; a double-click locks it."],
    ["Just like Twitch", "Nickname colors, broadcaster, moderator, VIP and subscriber badges, emotes as chips, /me actions."],
    ["Stream events", "Subs, resubs, gift subs, raids and bits are color-highlighted so you don't miss them in the heat of the game."],
    ["OBS window", "A regular window with a green, magenta or blue background: window capture + the Chroma Key filter — and the chat is on stream."],
    ["Appearance", "Font size, background opacity or shadow, message lifetime, timestamps and badges — with a preview over a “game”."],
    ["No clutter", "Hide bots (Nightbot, StreamElements…) and “!” commands, highlight messages with your nickname, reconnect after drops."]
  ],
  notes: ["Free version: one Twitch channel, an overlay over the game, the OBS window, hiding bots and commands, mention highlighting.", "Windows doesn't show windows over games in exclusive fullscreen — choose “Borderless windowed” in the game.", "Emotes are shown as text on a colored chip (no images); YouTube chat isn't supported yet.", null],
  changes: [[null]],
  shots: ["StreamChat: a Twitch chat feed with badges, emotes, a sub and a raid, plus overlay and OBS window buttons"],
  req: [null, null, "Internet; no Twitch account needed"],
  tags: ["twitch", "chat", "for streamers", "overlay", "obs"],
  pro: ["Several channels at once", "Word filters and highlighting", "Sounds for messages and events (sub, raid, bits)", null]
},
"leaktest": {
  short: "A connection privacy check: whether websites see your real IP, your ISP's DNS and IPv6 while a VPN is on.",
  description: [
    "In a few seconds LeakTest shows what the internet sees about you: your external IPv4 and IPv6, country and ISP, the DNS resolver your queries actually go through, which VPN adapters are connected and which adapter carries your internet traffic.",
    "The verdict fits in one line: “No leaks”, “Your ISP's DNS is visible with the VPN on”, “IPv6 leak bypassing the VPN” or “VPN connected, but traffic bypasses it” — with specific tips on what to enable in the VPN client or Windows."
  ],
  features: [
    ["External IP and country", "IPv4 and IPv6 via api.ipify.org; country, city, ISP and address type (home or VPN server) via ip-api.com."],
    ["DNS leak", "A unique edns.ip-api.com subdomain shows which DNS resolver the world sees and whether it passes your real subnet to websites."],
    ["VPN adapters", "Recognizes WireGuard, OpenVPN TAP, Wintun, SSTP/L2TP, AnyConnect, and marks Radmin VPN, Hamachi and ZeroTier as local networks."],
    ["Default route", "Determines which adapter really carries IPv4 and IPv6 internet traffic — split tunneling and VPN bypass become visible."],
    ["Clear verdict and tips", "A color-coded verdict, a list of findings and tips: DNS leak protection, encrypted DNS, disabling IPv6, WebRTC."],
    ["Monitoring and history", "A tray notification if the VPN drops or the IP changes, scheduled checks and a log of all checks."],
    ["★ Ultra: Stability analytics", "A 0–100 protection index over 7/30 days, a daily check chart, per-Wi-Fi-network stats and comparison with the previous period."],
    ["★ Ultra: Telegram and webhook alerts", "A message to your bot or Discord/Slack on a leak, VPN drop, IP change or leak fix — with anti-spam; tokens are encrypted with DPAPI."],
    ["★ Ultra: HTML / CSV / JSON reports", "A report with a chart, networks, recommendations and the check log — for archiving, Excel or a SIEM."],
    ["★ Ultra: Command line", "LeakTest.exe /check /out report.json /alert and /export — for Task Scheduler and scripts, with an exit code based on the result."]
  ],
  notes: ["Free: all checks and the verdict; monitoring, scheduling, kill-switch hints and history are in Pro.", "For an accurate DNS leak check, run LeakTest once without the VPN: the app remembers your ISP and will then recognize its DNS when the VPN is on.", "WebRTC can only be checked in a browser — LeakTest explains how to close that leak.", "The app changes nothing in the system; it only uses api.ipify.org, api64/api6.ipify.org and ip-api.com.", null],
  changes: [
    ["AkeeTech Ultra professional features: stability analytics, Telegram and webhook alerts, HTML / CSV / JSON reports, command line", "New “★ Analytics” section: protection index, chart, networks, recommendations", "Every check remembers the Wi-Fi network and leak type", "Telegram / webhook alerts with anti-spam", "Report export to HTML, CSV and JSON", "Command-line mode /check and /export"],
    [null]
  ],
  shots: ["LeakTest: the VPN is on, but the ISP's DNS is visible and IPv6 bypasses the tunnel"],
  req: [null, null, null, "Internet access for the check"],
  tags: ["VPN", "privacy", "DNS", "IPv6", "leaks"],
  pro: ["Continuous monitoring: a notification if the VPN drops and the IP changes", "Kill-switch hints and scheduled checks", "Check history", null]
},
"adshield": {
  short: "Block ads, trackers and malicious sites in every browser, app and game at once — through the system hosts file, no extensions or proxies.",
  description: [
    "A browser blocker only works in the browser. AdShield works at the Windows level: domains of ad networks, trackers and malicious sites are written to the hosts file, and no app can load them — not the browser, not a messenger, not a game launcher. It uses the open, regularly updated StevenBlack list from GitHub.",
    "AdShield writes only its own section between the “# CISOFT AdShield BEGIN / END” markers and doesn't touch your entries. “Turn off” removes that section, and a copy of the original hosts is saved before the first change — it can be restored with one button. Domains are written in the recommended “0.0.0.0 domain” format, one per line, and the app warns you if hosts becomes too large for the DNS Client service."
  ],
  features: [
    ["For every app", "Ads and trackers are blocked system-wide: in any browser, messengers, apps and games."],
    ["Open lists", "The unified StevenBlack list (ads, tracking, malware and scams) — downloaded from GitHub and format-checked before writing."],
    ["On/off in one click", "Its own section between markers: turning it on again creates no duplicates, turning it off doesn't touch other lines."],
    ["Copy of the original hosts", "The file is saved before the first change; “Restore original hosts” brings it back completely."],
    ["Extra lists", "Social media, gambling and 18+ content — for focus or a family computer (Pro)."],
    ["Your own rules and auto-update", "A whitelist with subdomains, your own domains to block and weekly list updates via Task Scheduler (Pro)."],
    ["★ Ultra: List analytics", "List sizes and uniqueness, top blocked sites and zones, heuristic recommendations (overlaps, redundant entries, an oversized hosts)."],
    ["★ Ultra: Category schedule", "Social media, gambling and 18+ are blocked only on set days and hours (“parental control”); a background task rebuilds hosts by itself."],
    ["★ Ultra: Advanced rules and tester", "Wildcards, regex, “||site^” and “@@” exceptions; the “Why is it blocked?” tester shows which layer decides a domain's fate."],
    ["★ Ultra: Hosts log and reports", "A history of every hosts change with a +/− diff and a size chart; HTML, CSV and JSON report export."]
  ],
  notes: ["The hosts file blocks whole domains: ads a site serves from its own domain (e.g. built into a video) can't be removed this way — that needs an in-browser blocker.", "A very large hosts (over ~150,000 domains) can slow down the Windows DNS Client service — enable only the extra lists you need.", "A browser in strict “secure DNS” (DoH) mode may bypass hosts — in that case switch it to the regular or automatic mode.", "Some antivirus programs warn about hosts changes — that's expected; AdShield only changes its own section.", null],
  changes: [
    ["AkeeTech Ultra professional features: list analytics, category schedule, advanced rules and tester, hosts log and reports", "New “★ Ultra” menu section: Analytics, Schedule, Rules and tester, Hosts log", "Category schedule and the AdShield Schedule task", "wildcard/regex/@@ rules expanded over known domains and the DNS cache", "A hosts change log with a chart", "Report export to HTML, CSV and JSON"],
    [null]
  ],
  shots: ["AdShield: protection on, 77,391 ad and tracker domains blocked via hosts"],
  req: [null, null, "Admin rights to change the hosts file", "Internet access to download the lists (≈2 MB)"],
  tags: ["ads", "blocker", "hosts", "privacy", "trackers"],
  pro: ["Extra lists (social media, gambling, malware)", "Whitelist and your own domains", "Weekly list auto-update", null]
},
"pixa": {
  short: "An on-screen color picker: a ×8 magnifier on Ctrl+Shift+P and one-click copying in HEX, RGB, HSL and other formats.",
  description: [
    "Pixa lives in the tray and picks the color of any pixel on screen — in a browser, a game, a photo or another app. Press Ctrl+Shift+P: a ×8 magnifier with a pixel grid appears next to the cursor; click, and the color is already on the clipboard in the format you need. The arrow keys move the cursor exactly one pixel, Esc cancels.",
    "For every color Pixa shows HEX, RGB and HSL, and in Pro also HSV, CMYK, the nearest Minecraft color (a § code for chat and signs) and the CSS name. Recent colors are kept in a history. Pro adds palettes with export to CSS, JSON and GIMP, harmonies and shades, and a WCAG text/background contrast check."
  ],
  features: [
    ["×8 magnifier at the cursor", "A pixel grid and a highlighted center make it easy to hit the right spot; arrows move the cursor 1 pixel, Shift — 10."],
    ["Hotkey and tray", "Ctrl+Shift+P works in any app; clicking the tray icon opens the window, its menu lets you pick a color or exit."],
    ["Formats in one click", "HEX, RGB, HSL, HSV, CMYK, Minecraft § and CSS name: a click copies, a right-click makes a format the “auto” one after picking."],
    ["Color history", "Recently picked colors are kept between launches: click to bring a color back, right-click to delete."],
    ["Palettes and harmonies", "Project color sets with export to CSS variables, JSON and .gpl; complementary, triad, tetrad, tints and shades."],
    ["WCAG contrast", "The text/background contrast ratio, AA/AAA checks and finding the nearest text shade that passes."]
  ],
  notes: ["Free version: the picker with a magnifier, HEX, RGB and HSL formats, a 20-color history (200 in Pro, plus HSV, CMYK, Minecraft and CSS names).", "If Ctrl+Shift+P is already taken by another app, start the picker with a button in the window or from the tray icon menu.", "The Minecraft color is matched to the nearest of the 16 standard § codes; for an exact color in 1.16+ use HEX.", null],
  changes: [[null]],
  shots: ["Pixa: the picked color in every format, one-click copying and the color history"],
  req: [null, null, null],
  tags: ["color", "color picker", "design", "HEX", "Minecraft"],
  pro: ["Palettes and export (CSS, JSON, .gpl)", "Harmonies and shades", "WCAG contrast check", null]
},
"pixel-bastion": {
  short: "Tower defense in warm pixel art: 18 levels in 6 worlds, 8 towers with branches, weather and night, a Commander, challenges and an Arena.",
  description: [
    "Defend the kingdom from hordes of monsters! Build archer towers, cannons, mages, frost and tesla towers, upgrade them and pick a specialization — every tower has two upgrade branches.",
    "A 15-level campaign across forest, desert, snowfields, swamps and a volcano, heroic and endless modes, a star-based upgrade tree, the Meteor and Reinforcements abilities, 22 achievements. The game is in English, Russian and Ukrainian and supports gamepads."
  ],
  features: [
    ["15 levels, 5 worlds", "From the forest edge to the volcano's crater — with different paths and enemies."],
    ["6 towers × 2 branches", "Three upgrade levels and a specialization choice at the fourth."],
    ["18 enemies and 5 bosses", "Armored, flying, invisible, healers, slimes that split…"],
    ["Upgrade tree", "32 upgrades for stars — replay completed levels to do better."],
    ["Heroic and endless modes", "For those who want more than the campaign."],
    ["Gamepad and 3 languages", "Fullscreen mode, saves, original music."]
  ],
  notes: [null, null],
  changes: [
    ["New world “Sky Islands”: 3 levels, 6 new enemies and the Storm Titan boss; forking roads and flyer air routes", "2 new towers: the Ballista against flyers and the Barracks with soldiers, 4 new specializations, 2 new upgrade columns", "A Commander with levels and skills, the Frost Wave and Thunder Strike spells", "Weather and night that change the fight: darkness, thunderstorms with lightning, fog, snowfall", "8 challenges with special rules, an Arena with a map generator and records, a daily challenge", "Post-battle damage stats, 6 tower skins, a reference in the Encyclopedia", "11 new achievements, 3 new tracks; 1.0 saves are fully compatible"],
    [null]
  ],
  shots: [null, "Night and the Storm Titan", "A thunderstorm and 8 towers", "A fork, flyers and a frost wave", "Sky Islands", "Snowfall and barracks", "The Arena and the daily challenge"],
  req: [null, null, null],
  tags: ["game", "tower defense", "pixel art", "strategy"]
},
"deep-drill": {
  short: "An incremental drilling game: 10 planet layers down to the Singularity, drill heads, specialist drones, two prestige tiers, quests, mini-games and a museum of finds.",
  description: [
    "Drill deep into the planet: soil, stone, crystal caves, lava, ancient ruins, the mantle, the core — and what lies beyond. Every layer has its own ores, obstacles and creatures.",
    "Upgrade the drill, hire collector drones, refine ore into alloys, unlock 28 research projects and 12 artifacts. The “New Well” prestige, up to 8 hours of offline income, 24 achievements. English, Russian and Ukrainian, gamepad support."
  ],
  features: [
    ["8 planet layers", "Each brings a new look, ores and hazards, and at the end — a boss guarding the core."],
    ["Drones and offline income", "The drill keeps working even when the game is closed (up to 8 hours)."],
    ["Refining and research", "Alloy production chains and a tree of 28 technologies."],
    ["Active events", "Gas pockets, overheating and underground creatures — it's not just clicking."],
    ["Prestige", "“New Well” with cores and permanent bonuses."],
    ["Gamepad and 3 languages", "Fullscreen mode, autosave."]
  ],
  notes: [null, null],
  changes: [
    ["Two new layers beyond the core — the Pale Abyss and the Singularity — with new ores, creatures and the Void Lord boss", "Drill heads (diamond, laser, plasma, quantum), 5 specialist drones and 2 new mining drones", "“New Planet” — a second prestige tier with star shards and constellations", "Daily and weekly quests, drone expeditions and a museum of 30 finds", "Random events (meteorite, trader, gold vein) and mini-games: rhythm strike and gas defusing", "Automation rules with a spending budget and auto-selling old ore", "15 research projects, 6 artifacts, 4 alloys, 12 achievements; stats charts, cosmetics, new music; 1.0 saves are compatible"],
    [null]
  ],
  shots: [null, "The journey begins", "The Pale Abyss and Operations", "Drill upgrades", "The museum of finds", "Fighting the Void Lord", "The Singularity and New Planet"],
  req: [null, null, null],
  tags: ["game", "idle", "clicker", "pixel art"]
},
"voidswarm": {
  short: "A neon 3D survival game in the spirit of Vampire Survivors: thousands of enemies, 18 weapons with evolutions, 6 pilots, 4 sectors, relics, mutators and daily runs.",
  description: [
    "Hold out for 15 minutes against a growing void swarm. Weapons fire on their own — your job is to move, collect experience crystals and choose upgrades. Lasers, orbital drones, rockets, chain lightning, a gravity wave — every weapon has 5 levels and evolves when paired with the matching passive bonus.",
    "4 heroes, 3 sectors with their own enemies and music, elite enemies and a three-phase boss, an endless mode, permanent upgrades between runs, 23 achievements. English, Russian and Ukrainian, gamepad support."
  ],
  features: [
    ["Thousands of enemies on screen", "Up to 2,700 enemies at once — at a steady 60+ FPS."],
    ["13 weapons × evolutions", "Every weapon levels up to 5 and turns into a powerful version."],
    ["4 heroes and 3 sectors", "Different starting weapons, enemies, colors and music."],
    ["The “Heart of the Void” boss", "Three phases: rings, spirals, summons and dashes."],
    ["Upgrades between runs", "10 branches of permanent upgrades and an arsenal of new weapons."],
    ["Gamepad and 3 languages", "Fullscreen mode, key remapping, saves."]
  ],
  notes: [null, null],
  changes: [
    ["VoidSwarm 3D: the whole game moved to 3D graphics — a 3/4 camera, a glowing sector grid above stars and nebulae", "All pilots, enemies, items and projectiles are neon 3D models; every enemy has its own silhouette", "Bosses made of animated parts: the spiked rings of the Heart of the Void, crystal frames and the shield dome of the Prismatic Sovereign", "Neon glow (bloom) and three quality presets — from integrated graphics to RTX, picked automatically", "A living camera: zooms out for bosses, tilts and shakes from explosions", "Thousands of enemies at 60+ FPS — the 3D renderer is faster than the old 2D", "Classic 2D mode in one click; saves and progress carry over unchanged"],
    ["New Sector IV “Crystal Maelstrom”: 4 new enemies, the Monolith elite and the Prismatic Sovereign boss with crystal shield phases", "Two new pilots — Aurora and Forge — and 5 new weapons with evolutions, plus 4 new passives", "A daily run with a shared seed and 7 challenge mutators with bigger rewards", "12 relics, 5 mid-run events and champion enemies with modifiers", "Containers with a roulette and jackpot, banishing options on level-up, 7 new upgrade branches", "Cosmetics: ship colors and trails; a codex of weapons, modules and relics; extended stats", "12 new achievements (35 in total), new music and sounds; 1.0 saves carry over without loss"],
    [null]
  ],
  shots: [null, "Sector IV “Crystal Maelstrom” in 3D", "The Prismatic Sovereign boss", "A golden swarm and relics", "Choosing an upgrade", "The Heart of the Void boss", "The neon swarm"],
  req: [null, null, null],
  tags: ["game", "roguelite", "bullet heaven", "neon"]
},
"driverhunt": {
  short: "Shows every device without a driver, explains what the device is and helps you find a driver by Hardware ID.",
  description: [
    "DriverHunt finds devices Windows didn't install a driver for: “Unknown device”, “PCI Simple Communications Controller”, code 28, and devices with errors 1, 10, 18, 24, 31, 43 — and explains in plain words what each error means.",
    "From the Hardware ID the app identifies the manufacturer (Intel, AMD, NVIDIA, Realtek, Qualcomm, MediaTek, Broadcom, Logitech and others) and suggests what it most likely is: Wi-Fi, audio, a touchpad, Intel ME, the chipset. One button opens a driver search in the official Microsoft Update Catalog."
  ],
  features: [
    ["Every device without a driver", "Code 28, “Unknown device”, the “Other devices” class and errors 1, 10, 18, 24, 31, 43 — with a clear explanation."],
    ["ID decoding", "VEN/DEV, VID/PID and ACPI codes: the manufacturer and “what it most likely is” by device class."],
    ["Find a driver", "The Microsoft Update Catalog searched by Hardware ID, a web search and copying all IDs."],
    ["Windows Update", "Rescan devices (pnputil /scan-devices) and open “Optional updates” with drivers."],
    ["All installed ✓", "If there are no problems, a clear screen with the number of devices checked; disabled and hidden ones via a switch."],
    ["Auto-check", "Plug in a new device and DriverHunt checks it again by itself."],
    ["★ Ultra: Device stability", "Check history revealing intermittent and chronic failures, error codes over time and a connect/disconnect log."],
    ["★ Ultra: Fix plan", "A step-by-step plan for each problem device based on the error code, bus and manufacturer — save it and hand it to a technician."],
    ["★ Ultra: Command line", "DriverHunt.exe /scan, /plan, /history with an HTML, JSON or CSV report and an exit code for scripts."]
  ],
  notes: ["The app doesn't download anything itself: you choose the driver in the Microsoft catalog or on the manufacturer's site.", "Installing from a folder runs pnputil /add-driver \"folder\\*.inf\" /subdirs /install and asks for confirmation.", "Manually disabled (code 22) and disconnected (code 45) devices are hidden by default — they usually don't need a driver.", "Chipset, touchpad and laptop hotkey drivers are best taken from the laptop manufacturer's site for your model.", null],
  changes: [
    ["AkeeTech Ultra professional features: device stability, fix plan, command line", "Ultra: check history, intermittent and chronic failures, a connection log", "Ultra: a step-by-step fix plan for each device", "Ultra: CLI /scan /plan /history and HTML/JSON/CSV reports"],
    [null]
  ],
  shots: ["DriverHunt: three devices without a driver, VEN_8086 (Intel) decoded and all Hardware IDs for searching"],
  req: [null, null, "Admin rights — only for installing drivers and scanning via pnputil"],
  tags: ["drivers", "devices", "unknown device", "code 28", "Windows"],
  pro: ["One-click driver installation from a folder", "A report for a technician/friend (HTML/text with all IDs)", "A notification when a device without a driver is connected", null]
},
"tunnelbox": {
  short: "Your own VPN through an SSH tunnel to your server or VPS: a SOCKS5 proxy via Windows' built-in OpenSSH, a one-click system proxy, external IP check and port forwarding.",
  description: [
    "TunnelBox turns any server with SSH — a rented VPS, a Raspberry Pi at home or a work PC — into a personal VPN. The app runs Windows' built-in OpenSSH client in the background without a window, brings up an encrypted SOCKS5 tunnel on this computer and can route the Windows system proxy through it, so browsers and apps go online with your server's IP.",
    "Key-only sign-in, no stored passwords: the “Create key” wizard makes an ed25519 key and copies a command that adds it to the server once. Previous proxy settings are saved, and “Restore” brings them back exactly. The IP check shows which address websites see directly and through the tunnel."
  ],
  features: [
    ["SOCKS5 tunnel over SSH", "ssh -N -D 127.0.0.1:port with ServerAliveInterval and BatchMode, in the background without a window; status, uptime and an ssh log with clear error hints."],
    ["Windows system proxy", "While the tunnel is connected, the Windows proxy points to it; on disconnect and exit the previous settings come back automatically or with the “Restore” button."],
    ["External IP check", "A small built-in SOCKS5 client queries api.ipify.org directly and through the tunnel — you instantly see that websites see the server's IP."],
    ["Key wizard", "Creates an ed25519 key with ssh-keygen in %USERPROFILE%\\.ssh and copies a PowerShell command that adds the public key to authorized_keys on the server."],
    ["-L/-R port forwarding", "Open a Minecraft server, RDP or a database on the VPS as localhost:port — or the other way round, expose a local site through the server's port."],
    ["Reconnect and kill-switch", "If the connection drops, the tunnel comes back up with an increasing pause; the kill-switch blocks direct traffic, and a tray notification reports the drop."],
    ["★ Ultra: Uptime log and chart", "Tunnel sessions, drops, recovery time, availability, MTBF and latency over 1 h / 24 h / 7 days with a chart and losses."],
    ["★ Ultra: Tunnel watchdog", "A real connection through SOCKS5 to a check host; after N failures in a row a hung ssh is restarted automatically."],
    ["★ Ultra: Split tunnel (PAC)", "Domain, mask and subnet rules: what goes through the tunnel and what goes direct; the PAC is served by a local server at 127.0.0.1."],
    ["★ Ultra: Wi-Fi auto-connect and reports", "On untrusted networks the tunnel comes up by itself, on trusted ones it disconnects; tunnel reports in HTML, CSV and JSON."]
  ],
  notes: ["The free version has 1 server profile, a SOCKS5 tunnel, the system proxy and the IP check.", "Key-only sign-in: ssh.exe running in the background can't ask for a password, so passwords and passphrase-protected keys aren't supported — the wizard creates a key without a passphrase.", "The Windows system proxy is passed to apps as SOCKS; apps with their own proxy settings (e.g. Firefox) are configured separately to 127.0.0.1 and the tunnel port.", "Settings and saved previous proxy values are stored in %APPDATA%\\CISOFT\\tunnelbox\\settings.ini.", null],
  changes: [
    ["AkeeTech Ultra professional features: uptime log and chart, tunnel watchdog, split tunnel (PAC), Wi-Fi auto-connect and reports", "New “Ultra ★” page: uptime, watchdog, split tunnel, Wi-Fi rules", "A 90-day session log and 48 hours of latency measurements", "PAC script generation and a local PAC server without admin rights", "Report export to HTML, CSV and JSON"],
    [null]
  ],
  shots: ["TunnelBox: the tunnel is connected, the system proxy goes through the server, the external IP and the ssh log"],
  req: [null, null, "The OpenSSH client (built into Windows; if missing — Settings → Apps → Optional features)", "Your own server with key-based SSH access", null],
  tags: ["VPN", "SSH", "SOCKS5", "proxy", "port forwarding", "network"],
  pro: ["Unlimited profiles and tunnel autostart", "Port forwarding (-L/-R)", "Auto-reconnect and a kill-switch notification on drops", null]
},
"stickerlab": {
  short: "Telegram and Discord stickers from any image: drag in files and get PNGs of the right size and weight, with a white outline, a shadow and a caption.",
  description: [
    "Drag images into the StickerLab window and choose what they're for: a Telegram sticker or emoji, a Discord server sticker or emoji. The app trims empty margins, fits the image to the right size (512 px on the longest side, 100×100, 320×320 or 128×128), adds the signature white outline and a light shadow, and makes sure the file stays within the weight limit.",
    "A solid background is removed in one click: the color is taken from a corner or with the eyedropper, the threshold and edge smoothing are adjustable, and the light halo along the outline is cleaned up. Finished files are saved to a “stickers” folder next to the originals, and the “How to upload” page explains step by step how to build a set via the @Stickers bot and upload stickers to a Discord server."
  ],
  features: [
    ["Telegram and Discord sizes", "Telegram sticker — one side exactly 512 px, emoji — 100×100; Discord sticker — 320×320, emoji — 128×128. The transparent background is kept."],
    ["Weight within the limit", "If the PNG is heavier than 512 KB (or 256 KB for Discord emoji), the app carefully reduces the color depth until the file fits."],
    ["Sticker-style white outline", "Alpha mask dilation with exact distance: a smooth rounded outline of any thickness and color, plus a soft shadow."],
    ["Solid background removal", "Color from a corner or the eyedropper, threshold, edge smoothing, a “only background touching the edges” mode — white details inside the drawing won't disappear."],
    ["Trimming and caption", "Empty margins are trimmed to the content, and you can add a bold outlined caption under the sticker."],
    ["WebM video stickers", "From a GIF or a short video — VP9 WebM with transparency, up to 3 seconds, no sound and up to 256 KB, as Telegram requires."]
  ],
  notes: ["Free version: 512 px PNG and all Telegram/Discord sizes, trimming, outline, shadow, caption, up to 10 images at a time.", "Background removal is designed for a solid background (white, green, studio); the app doesn't cut out complex photo backgrounds.", "Source files aren't modified; results are saved with an _tg, _dc etc. suffix and never overwrite existing files.", null],
  changes: [[null]],
  shots: ["StickerLab: a Telegram sticker with the background removed, a white outline, a shadow and a caption"],
  req: [null, null, "FFmpeg — only for WebP and WebM, downloaded by the app on request (~100 MB, shared by AkeeTech apps)", null],
  tags: ["stickers", "Telegram", "Discord", "emoji", "images"],
  pro: ["Background removal", "WebP and WebM video stickers (from GIF/video, ≤3 s, VP9)", "Unlimited batch processing", null]
},
"lumo": {
  short: "A light, fast photo viewer: opens instantly, browses a folder with the arrows and the wheel, shows EXIF and understands WebP, AVIF and HEIC.",
  description: [
    "Open a photo with a double-click, by dragging it in or from the “Open with” menu — Lumo shows it right away and preloads neighboring shots, so browsing with the arrows, Space or the mouse wheel has no delays. Files are ordered just like in Explorer: IMG_2 before IMG_10.",
    "Ctrl+wheel zooms precisely to the cursor, “fit” and 100% are one key away, rotation respects EXIF orientation, and a double-click toggles fullscreen. At the bottom there's a thumbnail strip, on the right the shot's details: camera, lens, shutter speed, aperture, ISO, date and GPS coordinates. Deleting to the Recycle Bin and copying to the clipboard take one key."
  ],
  features: [
    ["Instant browsing", "Neighboring photos load in advance and frames are drawn with double buffering. Natural name sorting: img2 < img10."],
    ["Zoom to the cursor", "Ctrl+wheel (or just the wheel, by setting) zooms exactly where you're looking; 0 — fit, 1 — 100%, drag with the mouse."],
    ["EXIF and GPS", "Camera, lens, shutter speed, aperture, ISO, focal length, capture date and coordinates (copied with one click, no map)."],
    ["EXIF rotation", "Phone photos are upright right away; R and Shift+R rotate the view, and the thumbnail strip respects orientation too."],
    ["GIF, TIFF, ICO and more", "JPG, PNG, animated GIF, BMP, TIFF, ICO, and in Pro — WebP, AVIF and HEIC via FFmpeg with caching."],
    ["Recycle Bin, clipboard, “Open with”", "Del — to the Recycle Bin, Ctrl+C — image and file to the clipboard. Lumo can be added to “Open with” without changing the default app, and removed again."]
  ],
  notes: ["Free version: viewing JPG, PNG, GIF, BMP, TIFF and ICO, browsing, zoom, rotation, fullscreen, EXIF, Recycle Bin and clipboard.", "Associations are written only to HKCU\\Software\\Classes (the “CISOFT.Lumo” ProgID and “Open with”) and are fully removed with a button in settings.", "Quick edits never overwrite the original: a “name_edit” copy is saved next to it.", null],
  changes: [[null]],
  shots: ["Lumo: a photo filling the canvas, the thumbnail strip and EXIF details with GPS"],
  req: [null, null, "FFmpeg — only for WebP/AVIF/HEIC, downloaded by the app on request (~100 MB, shared by AkeeTech apps)", null],
  tags: ["photos", "viewer", "EXIF", "HEIC", "WebP"],
  pro: ["WebP, AVIF and HEIC", "Slideshow and side-by-side comparison of two photos", "Quick edits: crop, brightness/contrast, saving a copy", null]
},
"disk-space": {
  short: "Shows what's taking up disk space: the biggest folders, files and file types.",
  description: [
    "Drive C: red again? DiskAtlas scans the whole drive in tens of seconds — even with a million files — and shows where the space went.",
    "Open folders with a double-click, see the top 300 largest files or which file types take up the most. Unneeded files can go straight to the Recycle Bin."
  ],
  features: [
    ["Fast scanning", "The whole system drive in about 10–30 seconds."],
    ["Folders by size", "Tree navigation with share bars, just like in Explorer."],
    ["Large files", "The top 300 heaviest files on the drive with their paths."],
    ["File types", "How much space videos, games, archives and everything else take."],
    ["Delete to the Recycle Bin", "Unneeded files go straight to the Recycle Bin; system folders are protected."],
    ["Any drive or folder", "All drives with one button, or pick a single folder."]
  ],
  notes: ["Without admin rights some system folders aren't visible — run the app as administrator to count everything.", null],
  changes: [[null]],
  shots: ["Which file types take up the most space"],
  req: [null],
  tags: ["Windows", "disk", "cleanup"]
},
"net-scanner": {
  short: "A local network scanner: every device with IPs, names, MACs, manufacturers and open ports.",
  description: [
    "In 15–20 seconds NetRadar walks the subnet and shows everything on it: computers, the router, printers, phones, cameras. It even finds devices that don't answer ping (via ARP).",
    "For every device: its name (DNS or NetBIOS), MAC and manufacturer, response time and open ports: SSH, HTTP/HTTPS, SMB, RDP. Right from the list you can open its web interface, connect via RDP or browse its shared folders."
  ],
  features: [
    ["Fast scan", "64 threads, results appear as they're found."],
    ["Names and manufacturers", "DNS, NetBIOS and a built-in MAC manufacturer database."],
    ["Open ports", "21, 22, 80, 443, 445, 3389, 8080 — you instantly see what kind of device it is."],
    ["One-click actions", "Browser, RDP, shared folders, ping in a console, copying IP and MAC."],
    ["Several networks", "Interface selection; VPN and virtual adapters at the end of the list."],
    ["Export", "The device list to CSV for Excel."],
    ["★ Ultra: Network snapshot comparison", "Every scan is saved as a snapshot; any two snapshots can be compared: new and missing devices, IP/MAC changes, ports that opened and closed."],
    ["★ Ultra: Spoofing detector and network audit", "Finds one MAC on several IPs and MAC changes for an IP (signs of ARP spoofing), risky open ports; HTML/CSV report."],
    ["★ Ultra: Telegram and webhook alerts", "After every scan or watch cycle, important changes go to your Telegram bot and/or a webhook (Slack, Discord, n8n)."],
    ["★ Ultra: Command line for scripts", "NetScanner.exe --scan --diff --notify --html report.html — a windowless scan for Task Scheduler, with exit codes."]
  ],
  notes: ["Scan only your own networks or networks you administer.", null],
  changes: [
    ["AkeeTech Ultra professional features: network snapshot comparison, spoofing detector and network audit, Telegram and webhook alerts, command line for scripts", "Ultra: network snapshots and comparison over time", "Ultra: ARP spoofing and risky port detection, HTML/CSV reports", "Ultra: Telegram/webhook alerts", "Ultra: --scan CLI mode for scripts", null],
    [null, null],
    [null]
  ],
  shots: ["Devices on the local network (names and MACs hidden)"],
  req: [null],
  tags: ["network", "LAN", "RDP", "ports"],
  pro: ["Watch the network: notification about a new device", "Custom names and notes for devices", "Your own list of ports to check", "History of devices appearing on the network", null]
},
"port-monitor": {
  short: "Which apps listen on ports and who they're connected to — a clear netstat with live updates.",
  description: [
    "PortWatch shows all TCP and UDP ports (IPv4 and IPv6): who opened them, which address they listen on and who they're connected to right now. Data refreshes every 2 seconds, and new connections are highlighted.",
    "Handy for figuring out which process took a port, which app is “phoning home” or where a mysterious server on your computer came from."
  ],
  features: [
    ["Listening ports", "All open TCP and UDP ports with the owning process."],
    ["Active connections", "Remote addresses and connection states in plain words."],
    ["Live updates", "Every 2 seconds, new rows are highlighted."],
    ["Search", "By port, PID, process or address."],
    ["Actions", "End the process, open the file location, search online."],
    ["Accuracy", "The data matches netstat -ano."],
    ["★ Ultra: Port baseline and comparison", "Save a “baseline” of listening ports and compare against it: new ports, closed ports, a port taken by another process."],
    ["★ Ultra: Exposure audit", "What's reachable from the network, risky services (RDP, Telnet, databases, VNC), servers running from temp folders — with recommendations and an HTML/CSV report."],
    ["★ Ultra: Rules and alerts", "port:/proc:/remote:/listen:/baseline rules trigger on new ports and connections, write a log and send an alert to Telegram or a webhook."],
    ["★ Ultra: Command line for scripts", "PortMonitor.exe --list/--audit/--baseline/--check with CSV/JSON/HTML output and exit codes for Task Scheduler."]
  ],
  notes: [null],
  changes: [
    ["AkeeTech Ultra professional features: port baseline and comparison, exposure audit, rules and alerts, command line for scripts", "Ultra: a listening port baseline and comparison against it", "Ultra: exposure audit with an HTML/CSV report", "Ultra: rules with a trigger log and Telegram/webhook alerts", "Ultra: CLI mode for scripts", null],
    [null, null],
    [null]
  ],
  shots: ["Listening ports (local addresses hidden)"],
  req: [null, "Admin rights — recommended (to see the paths of all processes)"],
  tags: ["network", "ports", "netstat", "security"],
  pro: ["Alerts about newly opened ports", "A log of new connections saved to a file", "CSV export", null]
},
"service-manager": {
  short: "Windows services: start, stop, startup type and finding problem services.",
  description: [
    "Servio is a handy replacement for services.msc: search, filters, color-coded states and details for every service — description, executable, DLL, dependencies.",
    "The “Problems” tab instantly shows automatic services that for some reason aren't running — a common cause of glitches. Harmless services that Windows stops itself don't show up there."
  ],
  features: [
    ["Finding problems", "Automatic services that aren't running — in a separate tab."],
    ["Control", "Start, stop and restart, taking dependent services into account."],
    ["Startup type", "Automatic, delayed, manual or disabled."],
    ["Details", "Description, file path, DLL, account, dependencies."],
    ["Search and filters", "By display name, name and description; running and stopped."],
    ["Safe without admin", "Without admin rights it's view-only, with a restart button."],
    ["★ Ultra: Service security audit", "Finds unquoted paths with spaces, service files in user-writable folders, missing files, autostart failures and third-party services; HTML/CSV report."],
    ["★ Ultra: Service watchdog", "Watches selected services: restarts them if they stop (up to 3 times an hour), writes a log and alerts via Telegram/webhook."],
    ["★ Ultra: Remote PC services and comparison", "Connects to PCs on the network via WMI (read-only) and shows differences from this PC: startup types, states, extra and missing services."],
    ["★ Ultra: Command line for scripts", "ServiceManager.exe --export/--audit [--computer PC] with CSV/JSON/HTML output and exit codes."]
  ],
  notes: ["Don't disable services you don't know the purpose of — that can break Windows.", null],
  changes: [
    ["AkeeTech Ultra professional features: service security audit, service watchdog, remote PC services and comparison, command line for scripts", "Ultra: service security audit with a report", "Ultra: a service watchdog with auto-restart and Telegram/webhook alerts", "Ultra: viewing and comparing remote PC services via WMI", "Ultra: CLI mode for scripts", null],
    [null, null],
    [null]
  ],
  shots: ["The service list and details"],
  req: [null, "Admin rights for managing services (viewing works without them)"],
  tags: ["services", "Windows", "diagnostics"],
  pro: ["Changing service startup types", "A service snapshot and one-click rollback to it", "A service report in HTML/CSV", null]
},
"log-analyzer": {
  short: "Errors and warnings from Windows logs, with a summary of the most frequent problems.",
  description: [
    "Your computer is glitching and Event Viewer is too clunky? In a fraction of a second LogLens collects critical events, errors and warnings from the System and Application logs for a day, week or month.",
    "The “Summary” tab groups identical events and shows what repeats most often — usually that's the cause of the problem. Every event has a button to search for a solution online."
  ],
  features: [
    ["Fast", "A month of logs is read in under a second."],
    ["Problem summary", "Grouped by source and code: how many times, when first and last seen."],
    ["Filters", "Critical, errors, warnings, time period and text search."],
    ["Details", "The full event text in one click."],
    ["Find a solution", "Searches Google by the event's code and source right away."],
    ["Export", "Events or the summary to CSV."],
    ["★ Ultra: Correlation rules", "“N events in M minutes” rules (4625 password brute force, unexpected reboots, disk failures, log clearing) with background monitoring, a log and Telegram/webhook alerts."],
    ["★ Ultra: Anomalies against a baseline", "Compares a period with past ones: new error sources, ×3 spikes and problems that stopped; HTML/CSV report."],
    ["★ Ultra: Logs from network PCs", "Polls a list of PCs via event log RPC (read-only) and builds a fleet summary with each PC's main problem and rule hits."],
    ["★ Ultra: Command line for scripts", "LogAnalyzer.exe --query/--rules/--anomalies [--computer PC] with CSV/JSON/HTML output and exit codes."]
  ],
  notes: [null],
  changes: [
    ["AkeeTech Ultra professional features: correlation rules, anomalies against a baseline, logs from network PCs, command line for scripts", "Ultra: correlation rules and background monitoring with alerts", "Ultra: anomaly detection against a baseline", "Ultra: collecting logs from several PCs on the LAN", "Ultra: CLI mode for scripts", null],
    [null, null],
    [null]
  ],
  shots: ["Events from the last 24 hours"],
  req: [null],
  tags: ["logs", "events", "diagnostics"],
  pro: ["A 30-day period and any dates", "Security log (sign-ins) — with admin rights", "An HTML report with a problem summary", "Hourly auto-check and a notification about new critical errors", null]
},
"pc-inventory": {
  short: "PC inventory: hardware, software, updates and security — with an HTML report.",
  description: [
    "In 10 seconds SpecSheet gathers everything about your computer: the system, CPU, motherboard and BIOS with serial numbers, memory, GPUs, drives, network, installed apps and updates.",
    "The “Security” section checks the antivirus, firewall, UAC, Secure Boot, BitLocker and how recent the updates are — with recommendations. Everything is saved to one neat HTML report, handy for keeping track of equipment."
  ],
  features: [
    ["Full summary", "Hardware with serial numbers, OS, drives, network."],
    ["Apps", "All installed apps with version, publisher and date; uninstall in one click."],
    ["Updates", "Installed updates and a warning if none were installed for a long time."],
    ["Security", "Defender, third-party antivirus, firewall, UAC, Secure Boot, BitLocker."],
    ["HTML report", "One file with all sections and an app search."],
    ["CSV", "The app list for Excel."],
    ["★ Ultra: PC fleet inventory over the network", "Polls a list of PCs via WMI (read-only): model, serial number, CPU, RAM, disk, OS, user, IP, antivirus, uptime; HTML/CSV report."],
    ["★ Ultra: Compliance rules", "Thresholds for RAM, free space, update age, uptime, Windows build and antivirus presence — checking this PC and the whole fleet."],
    ["★ Ultra: Auto-snapshots with alerts", "PCInventory.exe --snapshot --notify from Task Scheduler: a snapshot, comparison with the previous one and sending software/hardware/security changes to Telegram/webhook."],
    ["★ Ultra: Command line for scripts", "PCInventory.exe --fleet PC1,PC2 --html/--csv/--json with exit codes on violations."]
  ],
  notes: ["The report contains serial numbers and the computer name — don't publish it openly.", null],
  changes: [
    ["AkeeTech Ultra professional features: PC fleet inventory over the network, compliance rules, auto-snapshots with alerts, command line for scripts", "Ultra: inventory of several PCs via WMI", "Ultra: compliance rules with a report", "Ultra: auto-snapshots and Telegram/webhook change alerts", "Ultra: CLI mode for scripts", null],
    [null, null],
    [null]
  ],
  shots: ["Computer summary (PC name and user hidden)"],
  req: [null, "Admin rights — for BitLocker status"],
  tags: ["inventory", "report", "security"],
  pro: ["HTML report and apps in CSV", "Comparison with a previous snapshot: what changed", "Reports for several PCs in one folder", null]
},
"craftcalc": {
  short: "Minecraft calculators: Nether coordinates, stacks, XP, time of day, enchantments and crafting.",
  description: [
    "CraftCalc is a pocket helper for Minecraft players. It converts coordinates between the Overworld and the Nether, counts how many stacks, shulkers and chests your items will take, and how many XP points you need to reach a level.",
    "The Pro version adds an enchantment reference with max levels and incompatibilities, 30 popular recipes, portal and base bookmarks, time of day with moon phases and a farm calculator. Everything works offline."
  ],
  features: [
    ["Nether ↔ Overworld coordinates", "Dividing and multiplying by 8 with correct rounding of negative coordinates — portals link on the first try."],
    ["Stacks and storage", "How many stacks, slots, shulkers and chests N items take with a stack size of 64, 16 or 1."],
    ["XP calculator", "Level → XP points and how many points you need from your current level to the target — using the wiki formulas."],
    ["Time of day", "Ticks ↔ hours, when night starts, whether you can sleep and the moon phase."],
    ["Enchantment reference", "40+ enchantments: max level, what they apply to, what they're incompatible with."],
    ["30 popular recipes", "Anvil, beacon, enchanting table, pistons and more — in plain text with search."]
  ],
  notes: ["Works offline and without permissions. Formulas are for Java Edition. An unofficial app, not affiliated with Mojang or Microsoft. Installing the APK: allow “Install from unknown sources” for your browser."],
  changes: [[null]],
  shots: ["CraftCalc — Minecraft calculators"],
  req: [null],
  tags: ["Minecraft", "calculator", "games", "coordinates", "enchantments"],
  pro: ["Enchantment and recipe reference", "Portal and base bookmarks with coordinates", "Farm calculator and time of day", null]
},
"timekit": {
  short: "A stopwatch with laps, multiple timers, interval workouts and Pomodoro — in big digits.",
  description: [
    "TimeKit has everything you need for timing: a precise stopwatch with laps, several timers at once, Pomodoro for work and an interval timer for workouts.",
    "Timers and Pomodoro fire even when the app is closed: a notification with an alarm sound and vibration. In Pro: unlimited timers with presets, interval workouts (Tabata, HIIT) and custom sounds and vibration."
  ],
  features: [
    ["Stopwatch with laps", "Hundredths of a second, laps with the best and worst times; keeps running even if you close the app."],
    ["Several timers", "Run timers in parallel, pause them and name them: “Tea”, “Pasta”, “Laundry”."],
    ["Alerts with the app closed", "Exact Android alarms and a notification with sound and vibration when time's up."],
    ["Pomodoro", "25/5, 50/10 and 15/3 modes, a long break after 4 cycles and notifications at every switch."],
    ["Interval workouts", "Work/rest × rounds, signals on every switch, a countdown of the last 3 seconds, the screen stays on."],
    ["Big digits", "A dark theme and large monospaced digits — readable from across the room."]
  ],
  notes: ["Permissions: notifications (Android 13+) and exact alarms (Android 12+; you can decline — the alert will just come slightly late), vibration. No internet needed. Installing the APK: allow “Install from unknown sources” for your browser."],
  changes: [[null]],
  shots: ["TimeKit — stopwatch, timers and intervals"],
  req: [null],
  tags: ["timer", "stopwatch", "pomodoro", "workouts", "tabata"],
  pro: ["Unlimited timers and presets", "Interval workouts", "Custom sounds and vibration", null]
},
"notik": {
  short: "Notes and to-do lists in a dark grid of cards: colors, pinning, search and a 30-day trash.",
  description: [
    "Notik is quick notes and checklists for Android. Cards in different colors in two columns, important things pinned on top, and search that finds what you need as you type.",
    "Everything is stored only on your phone, with no accounts or ads. Deleted notes stay in the trash for 30 days — an accidental deletion is easy to undo."
  ],
  features: [
    ["Notes and checklists", "Plain text or a list with checkboxes; a note turns into a list and back with one tap."],
    ["Colors and pinning", "Nine calm card colors, and pinned notes always on top."],
    ["Instant search", "Searches titles, text, folders and labels as you type."],
    ["Sorting", "By modified or created date, by title or by color."],
    ["30-day trash", "Deleted items can be restored, and the trash empties itself after 30 days."],
    ["Phone only", "Notes live in a local SQLite database; the app doesn't need the internet."]
  ],
  notes: ["For reminders, Android 13+ will ask for notification permission.", "A backup is a regular JSON file you can keep anywhere.", null],
  changes: [[null]],
  shots: ["A grid of notes and lists in Notik"],
  req: [null],
  tags: ["notes", "to-do lists", "checklist", "reminders", "organizer"],
  pro: ["Timed reminders", "Folders and labels", "Export/import and backup to a file", null]
},
"convertix": {
  short: "A converter for everything: 12 physical quantities and NBU exchange rates with instant recalculation.",
  description: [
    "Convertix converts length, mass, volume, temperature, area, speed, time, data, pressure, energy, fuel consumption and angles. The result updates as you type, and below you instantly see the value in every unit of the category.",
    "Currencies use the official rate of the National Bank of Ukraine: rates are cached and work offline. No ads and no unnecessary permissions."
  ],
  features: [
    ["12 categories", "From millimeters to nautical miles, from calories to kWh, from psi to mmHg."],
    ["Instant recalculation", "The result changes with every digit, no “Calculate” button."],
    ["Swap", "One ⇅ button swaps the units and puts the result into the input field."],
    ["All units at once", "Below the result — the value in every unit of the category; tap to pick one."],
    ["Honest bytes", "MB and MiB, GB and GiB, bits and megabits — the difference between decimal and binary units."],
    ["NBU rates offline", "Official bank.gov.ua rates are saved on the phone and available without a connection."]
  ],
  notes: ["Internet is needed only to update exchange rates.", "Fuel consumption is converted taking the inverse relationship into account (L/100 km ↔ mpg).", null],
  changes: [[null]],
  shots: ["Unit conversion in Convertix"],
  req: [null],
  tags: ["converter", "units", "exchange rates", "NBU", "calculator"],
  pro: ["Currencies at the NBU rate", "Favorite pairs and history", "A calculator right in the input field (2+3*4)", null]
},
"decibel": {
  short: "A pocket sound level meter: noise in decibels on a needle gauge, min/avg/max and scale hints.",
  description: [
    "Decibel measures the loudness of ambient sound through your phone's microphone and shows it on a needle gauge with colored zones. Next to it are the minimum, average and maximum levels for the session, and a hint scale explains what the sound compares to: a whisper, a street, a concert.",
    "If the noise becomes harmful to hearing (85 dB and above), the app warns you. In Pro: a chart of the last minute and a session log, calibration for your phone and frequency analysis with a spectrum and the peak frequency."
  ],
  features: [
    ["Needle gauge", "A smooth needle from 0 to 130 dB with green, yellow and red zones and a large number in the center."],
    ["Min, avg and max", "Session stats update 10 times a second; the “Reset” button starts over."],
    ["Hint scale", "From a whisper (30 dB) and a street (70 dB) to a concert (110 dB) — the current level is highlighted."],
    ["Harmful noise warning", "At 85+ dB — a warning about long exposure, at 100+ dB — about danger to hearing."],
    ["Honest readings", "A phone microphone isn't a certified instrument, so values are marked as approximate."],
    ["Frequency spectrum", "In Pro: 32 bands from 40 Hz to 16 kHz via the fast Fourier transform, plus the peak frequency."]
  ],
  notes: ["Microphone access is required — sound is analyzed on the device and is never recorded or sent anywhere. Readings are approximate (±5–10 dB depending on the model). Installing the APK: allow “Install from unknown sources” for your browser."],
  changes: [[null]],
  shots: ["Decibel — a sound level meter with a needle gauge"],
  req: [null],
  tags: ["sound meter", "decibels", "dB", "sound", "noise", "microphone", "spectrum", "Android"],
  pro: ["Chart and session recording", "Calibration for your phone", "Frequency analysis (spectrum)", null]
},
"levelup": {
  short: "A bubble level and compass in your phone: tilt angles, azimuth and cardinal directions.",
  description: [
    "LevelUp turns your phone into a bullseye level: the bubble moves along two axes, and precise X and Y angles are shown to a tenth of a degree. When the surface is level, the app gives a short beep and vibration.",
    "The compass card shows the azimuth and cardinal direction — from north to northwest. In Pro: a full-screen ruler in centimeters and inches, a protractor/plumb, zero calibration with value hold, and true north corrected for magnetic declination."
  ],
  features: [
    ["Two-axis level", "A round bubble, X and Y angles and overall tilt to 0.1° accuracy."],
    ["Signal when level", "A short sound and vibration when the deviation is under 0.5° — no need to look at the screen."],
    ["Compass card", "Azimuth in degrees and the cardinal direction, plus a warning about magnetic interference."],
    ["On-screen ruler", "In Pro: centimeters and inches based on your phone's real screen density."],
    ["Protractor/plumb", "In Pro: put the phone's edge against a surface to find its angle from vertical and horizontal."],
    ["True north", "In Pro: correction for magnetic declination by approximate location (GeomagneticField)."]
  ],
  notes: ["Works offline. The level needs an accelerometer, the compass a magnetometer. Approximate location is requested only for true north and used only on the device. Installing the APK: allow “Install from unknown sources” for your browser."],
  changes: [[null]],
  shots: ["LevelUp — level and compass"],
  req: [null],
  tags: ["level", "bubble level", "compass", "azimuth", "ruler", "protractor", "inclinometer", "tools", "Android"],
  pro: ["Ruler and protractor", "Calibration and value hold", "True north (by coordinates, GeomagneticField)", null]
},
"chargeguard": {
  short: "Battery care: charging current and power, time to full, an 80% alarm and charging history.",
  description: [
    "ChargeGuard shows how your phone really charges: level, current in milliamps, power in watts, voltage, temperature and time to the percentage you want.",
    "Turn on “Watch charging” and the app alerts you when the battery reaches 80%. Lithium-ion batteries last longer if you don't keep them at 100%."
  ],
  features: [
    ["Charging speed", "Current in mA and power in W in real time — you instantly see whether charging is fast or slow."],
    ["Time to full", "The Android 9+ system estimate or the app's own calculation from capacity and current."],
    ["80% alarm", "A notification and sound when the charge hits the threshold — so you can unplug in time."],
    ["Low battery", "A reminder to plug in when the battery drops to 15%."],
    ["Everything about the battery", "Temperature, voltage, health, charger type and a capacity estimate from the charge counter."],
    ["Gentle on the battery", "Monitoring runs only while charging and turns itself off when the cable is unplugged."]
  ],
  notes: ["On Android 13+ the app will ask for notification permission — without it the alarm can't warn you.", "Current and the charge counter are reported by the phone's firmware; on some models they're unavailable or approximate.", null],
  changes: [[null]],
  shots: ["Current, power and time to 80% in ChargeGuard"],
  req: [null],
  tags: ["battery", "charging", "battery pack", "battery wear", "charge alarm"],
  pro: ["Custom thresholds and sound", "Charging history and wear (capacity estimate)", "Overheating warning", null]
},
"wordup": {
  short: "English words on flashcards: flip, pronunciation, spaced repetition and quizzes. Translations into Russian or Ukrainian.",
  description: [
    "WordUp helps you learn English words a little every day. A card shows the word and its transcription; tap it and it flips to reveal the translation. The speaker button pronounces the word in an American voice.",
    "Built-in sets — “Basics”, “Games and internet” and “Travel” — with 50 words each. Translations are into Russian or Ukrainian, switched with one button."
  ],
  features: [
    ["Flip cards", "The word and transcription on the front, the translation on the back, with a smooth animation."],
    ["Pronunciation", "Every word can be heard: system text-to-speech with American pronunciation."],
    ["Russian or Ukrainian", "Choose the translation language — EN → RU or EN → UA — at any time."],
    ["Leitner repetition", "Five boxes: known words come back less and less often, hard ones more often."],
    ["“Pick the translation” quiz", "Ten questions with four answer options from the same set."],
    ["No internet", "All words are built into the app, and progress is stored only on the phone."]
  ],
  notes: ["Pronunciation needs text-to-speech with an English voice (usually already installed — Google TTS).", "The free version includes the “Basics” set with cards and pronunciation.", null],
  changes: [[null]],
  shots: ["A card with a word and transcription in WordUp"],
  req: [null],
  tags: ["English", "words", "flashcards", "dictionary", "learning"],
  pro: ["All sets and your own words", "Quizzes and spaced repetition", "Stats and daily goals", null]
},
"hertzlab": {
  short: "Max screen refresh rate of 90/120/144 Hz on Xiaomi, Redmi, POCO and other Android phones, an on-screen FPS counter and game profiles.",
  description: [
    "HertzLab shows which refresh rates your display supports and enables the one you want — 60, 90, 120, 144 Hz or the maximum. Without a PC, an on-screen overlay holds the rate, and ready-made ADB commands generated by the app set it permanently. You see the result right away from the screen's real refresh rate.",
    "Everything is honest and legal: games and their files aren't modified, and the phone model isn't spoofed. The app only controls the display's refresh rate; in-game FPS still depends on the game itself and the processor."
  ],
  features: [
    ["Display modes", "All supported refresh rates and resolutions, the current Hz, the phone model and the MIUI/HyperOS version."],
    ["Forced refresh rate", "60/90/120/144 Hz or the maximum — without a PC, via a display-mode holding overlay, with a check of the real rate."],
    ["Permanent ADB commands", "Ready settings put commands for the chosen rate (peak/min_refresh_rate, MIUI user/miui_refresh_rate) with a copy button."],
    ["Restore", "Original values are remembered on first launch — rollback commands are ready, and the hold is released with one button."],
    ["On-screen counter", "The current Hz and the system frame rate — draggable, with adjustable size and opacity."],
    ["Guide for Xiaomi", "Step by step: developer mode, USB debugging, platform-tools; a PC-free option via wireless debugging."]
  ],
  notes: ["Android doesn't let apps change system refresh rate keys, so without a PC the rate is held by an on-screen overlay (needs the “Display over other apps” permission; doesn't work on every firmware). Permanent setup is via ADB commands; no root needed.", "The refresh rate can't go above the display's maximum; some firmware lowers the rate in certain apps and when idle.", null],
  changes: [[null]],
  shots: ["Display modes and refresh rate selection in HertzLab"],
  req: [null],
  tags: ["120 Hz", "refresh rate", "FPS", "Xiaomi", "HyperOS", "MIUI", "games"],
  pro: ["Refresh rate profiles for apps and games", "Battery saving: 60 Hz on low battery, max while charging", "A 60 ↔ max quick settings tile and a smoothness test with a chart", null]
},
"phone-info": {
  short: "Everything about your phone in detail, AIDA64-style: CPU, GPU, cameras, codecs, sensors and temperatures.",
  description: [
    "Inside shows 14 sections with hundreds of parameters: system and kernel, the CPU with big.LITTLE clusters and real-time core frequencies, display, memory, storage, battery, network, sensors, cameras, codecs, temperatures, device capabilities and apps.",
    "Search across all parameters, copy a line or a section with a long press, a text report in one tap. Pro unlocks detailed AIDA64-level sections, live sensor values, charts and a full HTML report without a watermark."
  ],
  features: [
    ["14 AIDA64-style sections: from the SoC and Linux kernel to Wi-Fi 6/7 and Bluetooth LE", null],
    ["CPU: big.LITTLE clusters, Cortex core names, per-core frequencies every second, the governor", null],
    ["Display, memory and storage: refresh rates, HDR, /proc/meminfo, zRAM, partition file systems", null],
    ["Battery: current, power, capacity, wear estimate, charge cycles (Android 14+)", null],
    ["Every sensor with its range, resolution, power and latency", null],
    ["Search across all parameters, copying and sharing as text", null]
  ],
  notes: [null, "The app needs no internet and no personal data — only device information."],
  changes: [
    ["Detailed AIDA64-level information: 14 sections", "GPU, cameras, codecs, temperatures, DRM, every sensor", "Search across all parameters and copying"],
    [null, null],
    [null]
  ],
  shots: ["14 sections, just like AIDA64", "CPU: real-time core frequencies"],
  req: [null],
  tags: ["phone info", "AIDA64", "CPU", "GPU", "OpenGL", "Vulkan", "camera", "codecs", "Widevine", "sensors", "battery", "temperature", "Android"],
  pro: ["Cameras, codecs, GPU and DRM — like AIDA64", "Temperatures and live sensor values", "Battery and CPU charts", "A full HTML report without a watermark", null]
},
"net-tools": {
  short: "Network tools in your phone: Wi-Fi and IP, ping, port checks and a home network scanner.",
  description: [
    "NetKit is a sysadmin's pocket toolkit. It shows everything about the current connection: Wi-Fi, signal strength, frequency, local and external IP, gateway and DNS.",
    "Ping any address with statistics, check one port or the popular ones at once, and scan your home network to find devices and their open ports."
  ],
  features: [
    ["Connection", "Wi-Fi, signal in dBm and %, link speed, band, IP, gateway, DNS."],
    ["Ping", "5 requests with min/avg/max and loss, quick addresses."],
    ["Port check", "One port or 14 popular ones at once, including Minecraft's 25565."],
    ["Network scanner", "Devices on the subnet, names and open ports."],
    ["External IP", "At the press of a button — which IP the internet sees."],
    ["No ads", "No ads and no data collection."]
  ],
  notes: [null, "Android shows the Wi-Fi network name only with location permission — the app asks for it with a button."],
  changes: [[null, null], [null]],
  shots: ["Network details and ping"],
  req: [null],
  tags: ["Android", "network", "Wi-Fi", "ping"],
  pro: ["Unlimited network scanner", "Check 14 popular ports at once", "Continuous ping and a custom request count", "Export results", null]
},
"mc-server-status": {
  short: "Check Minecraft servers from your phone: online status, players, version, ping and a colored MOTD.",
  description: [
    "Enter a server address and instantly see whether it's up, how many players are online, which version it runs, the latency and the server description in color, just like in the game.",
    "Java Edition and Bedrock Edition are supported, as well as addresses with SRV records. Favorite servers can be saved and refreshed with one button."
  ],
  features: [
    ["Java and Bedrock", "Both Minecraft editions, default ports 25565 and 19132."],
    ["Everything about a server", "Online status, players, version, ping, server icon."],
    ["Colored MOTD", "The server description with colors and styles, like in the game."],
    ["Favorites", "A list of your servers with one-click refresh."],
    ["SRV records", "Short server addresses work without specifying a port."],
    ["Player list", "Player nicknames, if the server shows them."]
  ],
  notes: [null, "Minecraft is a trademark of Mojang. This is an unofficial app, not affiliated with Mojang/Microsoft."],
  changes: [[null, null], [null]],
  shots: ["Favorite servers and a detailed check"],
  req: [null, "Internet"],
  tags: ["Android", "Minecraft", "server"],
  pro: ["Unlimited favorites (3 servers for free)", "Auto-refresh favorites every 1–10 minutes", "A 24-hour chart of online players", "The full player list", null]
},
"video-editor": {
  short: "Editing like in Premiere: a multitrack timeline, titles, 22 transitions, color grading and effects — simple and free.",
  description: [
    "FrameCut 2.0 is laid out like Adobe Premiere Pro: Project, Program and Effect Controls panels and a multitrack timeline — yet it stays easy for beginners. Drag a video into the window and start editing.",
    "Layer picture-in-picture, titles and music on separate tracks, cut with the razor, add transitions, color and effects — all visible in the preview right away, no rendering. The finished video is saved for YouTube, Telegram, TikTok and Shorts."
  ],
  features: [
    ["Editing like in Premiere", "Project, Program and Effect Controls panels and a timeline, all resizable."],
    ["Many tracks", "Video and audio on separate tracks: picture-in-picture, titles and music layered on top of each other."],
    ["Real-time preview", "Transitions, color, effects and titles are visible right away, no rendering."],
    ["Razor and ripple edits", "Cut with one click (C or S), delete fragments and close the gap (Shift+Delete)."],
    ["Smart snapping", "Clips snap to the playhead, their neighbors and markers."],
    ["Titles in a second", "Headlines, lower thirds, subtitles and end credits with animation; edit the text right on the picture."],
    ["22 transitions", "Drag one onto the joint between two clips and adjust its length by the edge."],
    ["Color grading", "Brightness, contrast, temperature and “cinematic” presets in one click."],
    ["Vertical video", "Formats for Shorts, TikTok and Reels (1080×1920) and a 1080×1080 square."],
    ["Projects and autosave", ".cisproj files, recent projects and recovery after a crash."],
    ["★ Ultra: Chapters from markers", "Timeline markers become chapters: timestamps for the YouTube description with rule checks, and chapters embedded right into the MP4 on export."],
    ["★ Ultra: Batch export", "One project into several formats at once: YouTube 1080p, Shorts 9:16 (1080×1920), Telegram, 720p, 4K, GIF and audio."],
    ["★ Ultra: Audio mastering", "EBU R128 loudness normalization (−14/−16/−23 LUFS) and afftdn noise reduction for the whole project's audio on export."],
    ["★ Ultra: Auto-cut by silence", "Finds pauses in a clip's audio (silencedetect) and cuts them out, leaving only the speech fragments on the timeline."]
  ],
  notes: ["On first launch the app downloads the free FFmpeg component (~76 MB) once — it's needed for video processing.", "With an NVIDIA GPU saving is several times faster — if the app says “encoding on the CPU”, update your NVIDIA driver.", null, null],
  changes: [
    ["AkeeTech Ultra professional features: chapters from markers, batch export, audio mastering, auto-cut by silence", "The “★ Ultra” menu and the golden ULTRA badge", "Chapters from markers: YouTube timestamps and chapters inside MP4", "Batch export to several formats, including Shorts 9:16", "Audio mastering on export: EBU R128 loudnorm and noise reduction", "Removing pauses in a clip by silence"],
    ["A Premiere-like interface: Project, Program and Effect Controls panels", "A multitrack timeline: razor, ripple edits, snapping, markers, In/Out", "Animated titles, 22 transitions, color grading with presets, effects and chroma key", ".cisproj projects with autosave, vertical formats for Shorts and TikTok"],
    [null, null],
    [null]
  ],
  shots: ["The timeline with tracks, a title over the video", "A transition, a color preset and a vignette"],
  req: [null, "The FFmpeg component (~76 MB) — the app downloads it itself on first launch"],
  tags: ["video", "editing", "Premiere", "YouTube", "TikTok", "titles"],
  pro: ["Export in 1080p, 4K and “as source” without a watermark", "Up to 8 video and 8 audio tracks (3 each for free)", "All 22 transitions, all color presets and title animations", "All effects, including chroma key (green screen), glow and shake", "GIF and fast NVIDIA GPU encoding", null]
},
"screen-recorder": {
  short: "Screen recording to MP4 on F9: full screen, an area or a window — with the microphone and system sound.",
  description: [
    "RecCast is simple screen recording to MP4 in one click or on F9. Record the full screen, a selected area or a single window, with the microphone and system sound.",
    "A small recording bar with a timer doesn't end up in the video, and finished clips appear in a list with previews right away — open, rename, delete or turn into a GIF."
  ],
  features: [
    ["Screen, area or window", "Pick a monitor, draw around the area you need with the mouse or choose a window from the list."],
    ["Invisible recording bar", "Timer, file size, pause and stop are always at hand, but they won't be in the video."],
    ["System sound and microphone", "Game, browser or music audio is recorded together with your voice and stays in sync with the picture."],
    ["Hotkeys", "F9 — start and stop, F10 — pause; a 3-2-1 countdown gives you time to get ready."],
    ["60 fps and NVIDIA", "In Pro — smooth video encoded on the GPU, with almost no CPU load."],
    ["GIF from a recording", "A short fragment turns into a light GIF for a chat or a how-to."],
    ["★ Ultra: Markers and chapters", "The F8 key drops markers while recording; chapters are checked against YouTube's rules, copied for the description and embedded into the MP4 without re-encoding."],
    ["★ Ultra: Smart cutting", "Auto-editing: a clip for each chapter, cutting out pauses by silence (silencedetect) or splitting the recording at pauses into separate files."],
    ["★ Ultra: Batch export", "Several recordings × presets — YouTube 1080p, Telegram, Compressed, GIF, MP3 — in one run that can be stopped at any time."],
    ["★ Ultra: Studio sound", "EBU R128 loudness normalization (loudnorm −16 LUFS) and afftdn noise reduction with hum removal on export."]
  ],
  notes: ["Recordings are saved to “Videos\\CISOFT Recorder”.", null, null],
  changes: [
    ["AkeeTech Ultra professional features: markers and chapters, smart cutting, batch export, studio sound", "Ultra: markers while recording on F8, with chapters saved next to the file", "Ultra: the “Chapters and markers” window — chapter export for YouTube and embedding chapters into MP4", "Ultra: smart cutting by markers and by silence, removing pauses", "Ultra: batch export with presets, loudnorm (EBU R128) and afftdn noise reduction"],
    [null]
  ],
  shots: ["Recording settings and the list of recent clips"],
  req: [null, "The FFmpeg component (~76 MB) — downloads itself once and is shared by all AkeeTech apps"],
  tags: ["screen recording", "video", "streaming", "games"],
  pro: ["Recording system sound (games, browser, music)", "60 frames per second and NVIDIA GPU recording (NVENC)", "Recording with no time limit (up to 15 minutes for free)", "Saving short clips as GIF", null]
},
"audio-converter": {
  short: "Batch-convert music to MP3, AAC, OGG, Opus, WAV and FLAC + extract audio from any video.",
  description: [
    "WaveShift converts music and recordings to MP3, AAC, OGG, Opus, WAV, FLAC and ALAC — one file at a time or whole folders at once. It extracts audio from video (MP4, MKV, WebM, AVI, MOV).",
    "Tags and cover art carry over to the new file, conversion runs on all CPU cores, and at the end you see how much space was saved."
  ],
  features: [
    ["Batch on all cores", "Hundreds of files are converted in parallel, with progress and cancel."],
    ["Audio from any video", "Drag in an MP4 or MKV and get an MP3 in seconds."],
    ["Tags aren't lost", "Title, artist, album and cover art carry over even to OGG and Opus."],
    ["Consistent loudness", "In Pro — EBU R128 normalization to −14 or −16 LUFS, like on streaming services."],
    ["No silence at the edges", "In Pro, blank seconds at the start and end of a track are trimmed automatically."],
    ["Smart names", "The {artist}\\{album}\\{track} - {title} template sorts your music into folders by itself."]
  ],
  notes: [null, null],
  changes: [[null]],
  shots: ["Formats, quality and the file queue"],
  req: [null, "The FFmpeg component (~76 MB) — downloads itself once and is shared by all AkeeTech apps"],
  tags: ["audio", "mp3", "converter", "music"],
  pro: ["Loudness leveling (EBU R128) — every track equally loud", "Trimming silence at the start and end", "Tag and cover art editor", "Lossless formats: FLAC and ALAC", null]
},
"image-converter": {
  short: "Compress, resize and convert hundreds of photos at once — with a before/after preview.",
  description: [
    "PicPress is batch photo processing in a couple of clicks: drag in a folder, choose the format, size and quality — the app compresses hundreds of shots in parallel and shows how much space was saved.",
    "A before/after preview with a slider instantly shows the final quality and file size. Ready-made presets for Telegram, email and social media."
  ],
  features: [
    ["Before/after comparison", "A slider over the live result with the exact file size and 100% zoom."],
    ["Estimate in advance", "Before you start you already see how many megabytes will be freed."],
    ["Compress for sending", "Telegram, Email, Social media and Messenger presets in one click."],
    ["Everything in parallel", "Up to 4 threads, progress, cancel and a “before / after” summary."],
    ["WebP and AVIF", "In Pro — 2–3 times lighter than JPG at the same quality."],
    ["Privacy", "In Pro — removing GPS and EXIF, a watermark and names by capture date."]
  ],
  notes: ["Phone photos are automatically rotated correctly (by EXIF).", null],
  changes: [[null]],
  shots: ["The photo list, preview and settings"],
  req: [null, "For WebP, AVIF and HEIC — the FFmpeg component (downloads itself on first use)"],
  tags: ["photos", "compression", "webp", "converter"],
  pro: ["Watermark: text or a logo", "WebP and AVIF formats — 2–3 times lighter than JPG", "Removing personal data from photos (EXIF, GPS)", "Batch renaming by a template with the capture date", null]
},
"music-player": {
  short: "A beautiful player for your own music: albums with covers, playlists, search and media keys.",
  description: [
    "Melodia is a player for the music collection on your computer. It finds your music itself, reads tags and covers and organizes everything by album, artist and folder.",
    "Playlists, a queue, search and media keys — in a dark interface that adapts to the colors of the album cover."
  ],
  features: [
    ["Your whole collection in seconds", "MP3, FLAC, M4A, OGG/Opus and WAV with covers and tags in any script, including Cyrillic."],
    ["Albums like a shop window", "A grid of covers, album and artist pages, instant search."],
    ["Cover colors", "The window background flows smoothly into the colors of the playing album."],
    ["Playlists", "Drag tracks onto a playlist, reorder with the mouse, M3U import and export."],
    ["Sound your way", "In Pro — a 10-band equalizer with presets and up to 12 seconds of crossfade."],
    ["Music before bed", "In Pro — a sleep timer with a gentle fade-out and a mini player on top of other windows."],
    ["★ Ultra: EBU R128 / ReplayGain loudness leveling", "Measures each track per ITU-R BS.1770 and levels loudness during playback by track or album (−14…−23 LUFS) without peak clipping, with a CSV report."],
    ["★ Ultra: Smart playlists", "Rule-based playlists (genre, year, plays, skips, recency, loudness…) with sorting and a limit, updated automatically after a scan."],
    ["★ Ultra: Listening stats", "Tracks real playing time: top tracks and artists, activity by hour, an HTML and CSV report per track."],
    ["★ Ultra: Duplicate finder", "Finds copies of the same track in different folders and formats, marks the best one and moves the extras to a separate folder or playlist."]
  ],
  notes: ["Keyboard media keys (Play/Pause, next, previous) work even when the window is minimized.", null],
  changes: [
    ["AkeeTech Ultra professional features: EBU R128 / ReplayGain loudness leveling, smart playlists, listening stats, duplicate finder", "“★ Ultra” section in the side menu", "EBU R128 loudness analysis and normalization during playback (ReplayGain 2.0)", "Rule-based smart playlists", "Listening stats and HTML/CSV reports", "Finding and moving duplicate tracks"],
    [null]
  ],
  shots: ["Albums and the Now Playing panel", "Equalizer (Pro)"],
  req: [null, null],
  tags: ["music", "player", "mp3", "flac"],
  pro: ["10-band equalizer with presets", "Smooth transitions between tracks (crossfade)", "Sleep timer", "Mini player on top of all windows", null]
},
"cisoft-lan": {
  short: "Like Radmin VPN, only easier: your own local network with friends over the internet — Minecraft and LAN games, chat, files.",
  description: [
    "SquadLAN is a virtual local network over the internet for playing with friends. Create a network, send a friend the link — and it's as if you're on the same router: Minecraft, Terraria and other LAN games see each other.",
    "The connection goes directly between computers (P2P), without third-party relay servers; if a direct connection isn't possible, traffic goes through a friend on the same network. All traffic is encrypted. You sign in with your AkeeTech account, and the app has a network chat and notifications."
  ],
  features: [
    ["Minecraft with no setup", "A friend's world opened to LAN shows up in your Multiplayer list by itself — no need to type an IP."],
    ["Join by link", "An invite link opens the app with the network already filled in."],
    ["Your own permanent IP", "A permanent 10.77.x.y address on every network, copied in one click."],
    ["See connection quality", "Ping and connection type (direct or via a friend) for each member."],
    ["Network chat", "Agree on a game without leaving the app; “friend online” notifications."],
    ["Encryption", "ECDH keys and AES-256 with HMAC — only members can see the traffic."],
    ["Direct connection", "STUN and UPnP punch through NAT to keep ping as low as possible."],
    ["File transfer", "In Pro — send mods and maps straight to a friend, no clouds."],
    ["★ Ultra: Connection quality monitor", "Latency, jitter, availability and connection type (direct/relay) history for each member for up to 3 days, with a chart and a score."],
    ["★ Ultra: Firewall between members (ACL)", "Allow/deny rules by member, direction, protocol and ports, accounting for replies to your own connections, with a block log."],
    ["★ Ultra: Connection alerts", "A notification on high latency, lost connection or a member switching to a relay."],
    ["★ Ultra: HTML / CSV / JSON reports", "A connection quality report with charts, firewall rules and blocks — for troubleshooting or a server admin."]
  ],
  notes: ["The app runs with admin rights — Windows will ask for permission: this is needed for the virtual network adapter (the Wintun driver from the WireGuard authors).", "How to add a friend: “Create network” → “Invite” → send the link and, separately, the password.", null],
  changes: [
    ["AkeeTech Ultra professional features: connection quality monitor, firewall between members (ACL), connection alerts, HTML / CSV / JSON reports", "“★ Ultra” button in the main window: connection quality, firewall (ACL), reports", "Monitoring history is kept between launches", "Ready-made firewall rule templates (close SMB/NetBIOS, RDP/VNC remote access, “games only”)", "Report export to HTML, CSV and JSON"],
    [null]
  ],
  shots: ["Networks, members and friends' Minecraft worlds", "Network chat"],
  req: [null, "Admin rights (for the virtual network adapter)", "An AkeeTech account — the same one as on this site"],
  tags: ["LAN", "Radmin", "Hamachi", "Minecraft", "playing with friends"],
  pro: ["Up to 20 networks and up to 64 people per network (free: 3 networks of 10)", "File transfer to friends over the network", "Invite by link without a password", "Priority direct connection", null]
},
"cisoft-vpn": {
  short: "A free one-click VPN: changes your IP and helps get around blocks. No sign-up and no drivers.",
  description: [
    "HopVPN connects to the open servers of VPN Gate — an academic project of the University of Tsukuba (Japan). It changes your IP address and helps open blocked websites.",
    "It works on Windows' built-in VPN client (SSTP, with L2TP/IPsec as a fallback): nothing to install, no drivers or accounts. You see the country, ping and speed of each server, your IP before and after connecting, the time and the traffic."
  ],
  features: [
    ["One-click connection", "A big button or a double-click on a server — and the VPN is on."],
    ["About 100 servers", "Their own ping, speed, session count, a country filter and search."],
    ["No drivers", "SSTP via Windows' built-in client, L2TP/IPsec if that fails."],
    ["Lives in the tray", "A green shield means protected; disconnect notifications and start with Windows."],
    ["The fastest server", "In Pro — picks the best server itself and reconnects if the connection drops."],
    ["Only the sites you need", "In Pro, only selected sites go through the VPN, everything else goes direct at full speed."],
    ["★ Ultra: Session log and traffic analytics", "A history of all connections with a daily traffic chart, per-server stats and reliability scores."],
    ["★ Ultra: Auto-connect by Wi-Fi network", "On untrusted and open networks the VPN turns on by itself, on trusted ones (home, office) it turns off."],
    ["★ Ultra: Kill switch for apps", "If the VPN drops, it instantly closes selected apps (torrent client, messenger, browser) so they don't run with your real IP."],
    ["★ Ultra: HTML / CSV / JSON report export", "A session report with a chart and a server reliability table — for archiving, Excel or scripts."]
  ],
  notes: ["VPN Gate servers are free and run by volunteers around the world — speeds vary between servers. For banking and passwords, use only HTTPS websites.", "Servers located in Russia are hidden from the list by default.", null],
  changes: [
    ["AkeeTech Ultra professional features: session log and traffic analytics, auto-connect by Wi-Fi network, kill switch for apps, HTML / CSV / JSON report export", "★ Log, ★ Wi-Fi networks and ★ Kill switch buttons in the main window", "A session log with crash recovery and a 14/30-day traffic chart", "Server reliability from the log is factored in when picking the fastest server", "VPN auto-connect/disconnect rules by SSID and network type", "A kill switch with a soft mode (only if reconnecting fails)", "Log export to HTML, CSV and JSON"],
    [null]
  ],
  shots: ["Connection and the server list"],
  req: [null, null],
  tags: ["vpn", "ip", "blocks", "privacy"],
  pro: ["Automatically pick the fastest server", "Auto-reconnect when the connection drops", "Favorite servers and countries", "VPN only for selected sites (split tunneling)", null]
},
"cisoft-vpn-android": {
  name: "HopVPN for Android",
  alias: "AkeeTech VPN for Android",
  short: "Free VPN servers by country on your phone — connect with one tap via OpenVPN.",
  description: [
    "A catalog of free VPN Gate servers on your phone: choose a country and a server by speed, ping and load — and connect with one tap via the OpenVPN app.",
    "No sign-up, logins or ads. The “Your IP” card instantly shows that the VPN works."
  ],
  features: [
    ["One tap", "The profile opens straight in OpenVPN for Android or OpenVPN Connect."],
    ["Live list", "Speed, ping, sessions and uptime, flags and countries."],
    ["⚡ Fastest", "In Pro — picks the best server by speed, ping and load."],
    ["Real ping", "In Pro — pings all servers in parallel, with progress."],
    ["Your IP", "IP, country and ISP — you can see that the VPN is on."]
  ],
  notes: ["VPN Gate servers are free and run by volunteers around the world — speeds vary between servers. For banking and passwords, use only HTTPS websites.", "One Pro purchase unlocks Pro in both the Windows and Android versions.", "When installing the APK, allow installs from this source."],
  changes: [[null]],
  shots: ["Servers by country", "A server card"],
  req: [null, "The free “OpenVPN for Android” or “OpenVPN Connect” app from Google Play"],
  tags: ["vpn", "android", "openvpn"],
  pro: ["Automatically pick the fastest server", "Favorite servers and countries", "Real ping check to servers", "Filter by speed and load", null]
},
"messenger": {
  short: "A messenger with video and voice calls: private and group chats, photos, works in the browser, on Windows and Android.",
  description: [
    "Pingo is our own messenger: sign up with your email, pick an @username and find friends by theirs. Private and group chats, photos, replies, editing and deleting, “online” and “typing…” status, read receipts.",
    "Video and voice calls right from the chat — with mic and camera mute. One account works everywhere: in the browser, in the Windows app (lives in the tray and sends notifications) and in the Android app."
  ],
  features: [
    ["Video calls", "One-on-one video and audio, toggling the camera and microphone."],
    ["Chats and groups", "Private chats and groups of up to 50 people."],
    ["Photos", "Send with a button, by pasting from the clipboard or by dragging."],
    ["Like the big messengers", "Replies, editing, deleting, “typing…”, ✓✓ read."],
    ["Everywhere", "Browser, Windows and Android — one account and one conversation history."],
    ["Protection", "Only chat members can read a chat — the server enforces it."]
  ],
  notes: ["Notifications arrive while the messenger is open: the tray app on Windows, the app in the background on a phone, an open tab in the browser.", "Calls go directly between devices. On some mobile and corporate networks the connection may fail.", "The Android app isn't from Google Play: allow your browser to “Install unknown apps”.", null],
  changes: [["First release: chats, groups, photos, video and voice calls"]],
  shots: ["Chat on a computer", "The Android app"],
  req: ["Browser: Chrome, Edge, Firefox, Safari (on PC and phone)", "Windows 10 or 11 — the desktop app", "Android 7.0 and newer — the mobile app"],
  tags: ["messenger", "calls", "video calls", "chat"]
},
"game-booster": {
  short: "Game mode in one click: high performance, free memory and priority for the game — and everything back to normal after you play.",
  description: [
    "TurboPlay gets your PC ready for gaming with one button: turns on High performance, closes the background apps you've chosen, frees up RAM and gives the game high priority.",
    "When the game closes, everything goes back to how it was — even after a crash or a PC shutdown. The app never touches system processes, Steam or anti-cheat software."
  ],
  features: [
    ["One button", "The PC is ready for gaming, and everything reverts by itself afterwards."],
    ["Recognizes games", "Minecraft, CS2, Valorant, Fortnite, Roblox, GTA 5 and a couple dozen more."],
    ["Closes only the extras", "Only apps from your list; system processes and anti-cheats — never."],
    ["Overlay over the game", "In Pro — CPU, GPU, temperatures, VRAM, RAM and ping (Ctrl+Shift+O)."],
    ["Monitoring", "5-minute charts and a session summary: average and maximum temperatures."],
    ["Ping check", "To Google, Cloudflare, Hypixel and Steam — with jitter and loss."]
  ],
  notes: ["The overlay is visible in windowed and borderless game modes; in exclusive fullscreen Windows doesn't show it.", null],
  changes: [[null]],
  shots: ["Game mode", "Overlay over the game (Pro)"],
  req: [null, "For GPU data in the overlay — an NVIDIA GPU with its driver (nvidia-smi)"],
  tags: ["games", "FPS", "speed-up", "Minecraft", "CS2", "overlay"],
  pro: ["Auto mode: turns on by itself when a game launches", "Overlay over the game: CPU, GPU, temperatures and ping", "The Ultimate Performance power plan", "Profiles for each game", null]
},
"cleaner": {
  short: "Safe PC cleanup: temporary files, browser caches, the Recycle Bin, startup apps and uninstalling programs along with their leftovers.",
  description: [
    "Sweep finds what clutters your computer: temporary files, browser and game caches, the Recycle Bin, error reports and old downloads — and shows every file before deleting it.",
    "Safety comes first: it deletes only in known folders, skips locked and system files, and never touches browser history, passwords or cookies. The same app manages startup apps, uninstalls programs and runs scheduled auto-cleanup."
  ],
  features: [
    ["PC score", "A health score and “You can free X GB” in one click."],
    ["Nothing blind", "A list of files for each category before deletion."],
    ["Safe", "A strict folder list, links aren't followed, locked files are skipped, downloads go to the Recycle Bin."],
    ["Startup", "Enable and disable apps like in Task Manager — reversibly."],
    ["Uninstalling programs", "An uninstaller, and in Pro — finding leftovers with a registry backup."],
    ["Auto-cleanup", "In Pro — on a schedule, with a “Freed X” notification."],
    ["★ Ultra: Junk trends", "A history of scans and cleanups with a chart, accumulation rate by category, a forecast and snapshot comparison."],
    ["★ Ultra: Space audit", "Finds large, forgotten and duplicate files and old installers in user folders and gives recommendations — without deleting anything."],
    ["★ Ultra: Smart auto-cleanup", "Scheduled auto-cleanup runs only when needed: junk above a threshold or low space on the system drive."],
    ["★ Ultra: Command line", "Cleaner.exe /scan, /trend, /audit with an HTML, JSON or CSV report — for scripts and Task Scheduler."]
  ],
  notes: ["Browser caches are cleaned only when the browser is closed. History, passwords and cookies aren't touched.", "System folders (Windows\\Temp, the update cache) — after “Restart as administrator”.", null],
  changes: [
    ["AkeeTech Ultra professional features: junk trends, space audit, smart auto-cleanup, command line", "Ultra: junk trends with history, a chart and a forecast", "Ultra: space audit — large, old and duplicate files", "Ultra: smart auto-cleanup by thresholds", "Ultra: CLI /scan /trend /audit and HTML/JSON/CSV reports"],
    [null]
  ],
  shots: ["Overview and PC health score"],
  req: [null],
  tags: ["cleanup", "junk", "startup", "speed-up", "uninstaller"],
  pro: ["Removing leftovers after uninstalling programs", "Clearing traces: recent files, Run history, DNS", "Scheduled auto-cleanup", "Managing Task Scheduler tasks in startup", null]
},
"duplicate-finder": {
  short: "Finds duplicate files and similar photos and frees up gigabytes of space — safely, via the Recycle Bin.",
  description: [
    "Over time your computer piles up the same phone photos, re-downloaded videos and copies of documents in Downloads. Twins finds exact copies by content (not by name) and shows how much space you can free.",
    "Deletion goes only to the Recycle Bin and is protected: the app won't let you delete every copy of a file, checks that the file hasn't changed since the search, and stays away from system folders. The free version fully finds duplicates and deletes up to 100 files — try it before buying."
  ],
  features: [
    ["Exact search", "Comparison by content (SHA-256) — matching names don't matter."],
    ["Similar photos", "Finds the same shot in different sizes and compression (Pro)."],
    ["Safe", "Only to the Recycle Bin, and at least one copy always remains."],
    ["Fast", "Multithreaded search, hashing only files of the same size."],
    ["Preview", "Photo thumbnails and file details before deletion."],
    ["Smart auto-select", "Mark all extra copies in one click (Pro)."]
  ],
  notes: ["Download the free version — Pro is unlocked with a key after purchase, no reinstall needed.", "The license is for one person, on their computers. You get the key right after payment.", null],
  changes: [["Pro price lowered"], [null]],
  shots: ["Found duplicates and a preview"],
  req: [null],
  tags: ["duplicates", "photos", "cleanup", "disk"],
  pro: ["Unlimited deletion (up to 100 files in the free version)", "Finding similar photos: different sizes and quality of the same shot", "Auto-select: keep the newest, the oldest or the one in a given folder", "Export a report to CSV", null]
},
"uptime-monitor": {
  short: "Watches websites, servers and routers and messages you in Telegram the moment something goes down.",
  description: [
    "UpWatch checks websites (HTTP/HTTPS), servers and network devices (ping, TCP port) on a schedule and shows what's working and what isn't. If a site goes down, you instantly get a Telegram message, and another one when it's back up, with the downtime duration.",
    "For sysadmins, site owners and small offices: a response time chart, uptime for a day, week and month, incident history, and a warning about an expiring SSL certificate. Runs in the tray and starts with Windows."
  ],
  features: [
    ["Telegram", "🔴 down / 🟢 up / ⚠️ SSL expiring — to your phone (Pro)."],
    ["No false alarms", "“Down” only after several failed checks in a row."],
    ["Websites and servers", "HTTP(S) with a page text check, ping, TCP ports."],
    ["Uptime and charts", "Response time over 24 h, uptime for 24 h / 7 d / 30 d, incidents."],
    ["SSL certificates", "Warns in advance that a certificate is about to expire (Pro)."],
    ["Reports", "Export uptime and incidents to CSV and HTML (Pro)."]
  ],
  notes: ["Download the free version — Pro is unlocked with a key after purchase, no reinstall needed.", "The Telegram bot token is stored encrypted on your computer.", null],
  changes: [["Pro price lowered"], [null]],
  shots: ["Monitors, a response time chart and uptime"],
  req: [null],
  tags: ["monitoring", "Telegram", "server", "website"],
  pro: ["Unlimited monitors (3 in the free version)", "Telegram notifications on outages and recovery", "Checks every 30 seconds (every 5 minutes in the free version)", "SSL certificate expiry monitoring", "30-day history and uptime reports in CSV/HTML"]
}
};
