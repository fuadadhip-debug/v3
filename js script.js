<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FAP-PROGRESS - Task Progress Monitoring</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- Chart.js CDN untuk Diagram Lingkaran -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .sidebar-link.active {
            background-color: #f1f5f9;
            color: #0284c7;
            border-left: 4px solid #0284c7;
            font-weight: 600;
        }
        .kanban-column { min-height: 250px; }
        
        /* Efek overlay agar teks di landing gate tetap terbaca jelas saat menggunakan wallpaper */
        #landingGate::before {
            content: "";
            position: absolute;
            inset: 0;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(4px);
            z-index: -1;
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased h-screen overflow-hidden">

    <!-- SCREEN 1: LANDING GATE SYSTEM (DENGAN KLIK KANAN WALLPAPER) -->
    <div id="landingGate" class="fixed inset-0 bg-white bg-cover bg-center z-50 flex flex-col items-center justify-center p-4 transition-all duration-300 select-none">
        
        <!-- Input File Tersembunyi untuk Wallpaper -->
        <input type="file" id="wallpaperUploadInput" accept="image/*" onchange="handleWallpaperChange(this)" class="hidden">

        <!-- KUSTOM CONTEXT MENU (KLIK KANAN) -->
        <div id="customContextMenu" class="hidden absolute bg-white border border-slate-200 rounded-xl shadow-xl py-1 w-52 z-50 backdrop-blur-sm">
            <button onclick="triggerWallpaperUpload()" class="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-sky-600 flex items-center gap-2 cursor-pointer">
                <i data-lucide="image" class="w-4 h-4 text-sky-600"></i> Ganti Gambar Latar
            </button>
            <button id="ctxResetBtn" onclick="resetWallpaper()" class="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer border-t border-slate-100 hidden">
                <i data-lucide="refresh-cw" class="w-4 h-4 text-rose-500"></i> Reset Latar Belakang
            </button>
        </div>

        <div class="text-center mb-8 max-w-md relative z-10 pointer-events-auto">
            <div class="bg-sky-600 p-3.5 rounded-2xl text-white inline-block mb-4 shadow-xl shadow-sky-600/20">
                <i data-lucide="layout-dashboard" class="w-8 h-8"></i>
            </div>
            <h1 class="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl uppercase">FUAD ADHI PRASETYA</h1>
            <p class="text-sm text-sky-600 font-bold mt-1 tracking-wide uppercase">Task Progress Monitoring</p>
            <p class="text-sm font-semibold text-slate-600 mt-3 bg-white/80 px-4 py-2 rounded-xl inline-block border border-slate-200 shadow-sm backdrop-blur-sm">Product Management VKTR</p>
        </div>

        <!-- SEKSI PILIHAN RUANG KERJA (4 KOLOM) -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-5xl relative z-10 pointer-events-auto">
            <!-- Pilihan 1: Testing -->
            <button onclick="selectRoleGate('testing')" class="flex flex-col items-center text-center p-5 bg-white/90 border border-slate-200 rounded-2xl hover:border-sky-500 hover:bg-white transition-all group cursor-pointer shadow-sm backdrop-blur-sm">
                <div class="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all mb-3 shadow-sm">
                    <i data-lucide="wrench" class="w-6 h-6"></i>
                </div>
                <h3 class="text-sm font-bold text-slate-700 group-hover:text-slate-900">Vehicle Testing Engineer</h3>
                <span class="mt-3 text-[10px] font-semibold text-sky-600 bg-sky-50 px-2 py-1 rounded-full group-hover:bg-sky-600 group-hover:text-white transition-all">Ruang Kerja Testing →</span>
            </button>

            <!-- Pilihan 2: Merged View -->
            <button onclick="selectRoleGate('merged')" class="flex flex-col items-center text-center p-5 bg-white/90 border-2 border-dashed border-indigo-300 rounded-2xl hover:border-indigo-600 hover:bg-white transition-all group cursor-pointer shadow-md transform hover:-translate-y-1 backdrop-blur-sm">
                <div class="w-12 h-12 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-3 shadow-sm">
                    <i data-lucide="layers" class="w-6 h-6"></i>
                </div>
                <h3 class="text-sm font-black text-indigo-950">MERGED VIEW (GABUNGAN)</h3>
                <p class="text-[10px] text-slate-500 mt-1">Gabungan Testing, Market Support & Other</p>
                <span class="mt-3 text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all">Mode Gabungan ⇉</span>
            </button>

            <!-- Pilihan 3: Market Support -->
            <button onclick="selectRoleGate('market_support')" class="flex flex-col items-center text-center p-5 bg-white/90 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-white transition-all group cursor-pointer shadow-sm backdrop-blur-sm">
                <div class="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all mb-3 shadow-sm">
                    <i data-lucide="trending-up" class="w-6 h-6"></i>
                </div>
                <h3 class="text-sm font-bold text-slate-700 group-hover:text-slate-900">Market Support</h3>
                <span class="mt-3 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-all">Ruang Market Support →</span>
            </button>

            <!-- Pilihan 4: Other (Documenting) -->
            <button onclick="selectRoleGate('other')" class="flex flex-col items-center text-center p-5 bg-white/90 border border-slate-200 rounded-2xl hover:border-amber-500 hover:bg-white transition-all group cursor-pointer shadow-sm backdrop-blur-sm">
                <div class="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all mb-3 shadow-sm">
                    <i data-lucide="file-text" class="w-6 h-6"></i>
                </div>
                <h3 class="text-sm font-bold text-slate-700 group-hover:text-slate-900">Other (Documenting)</h3>
                <span class="mt-3 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full group-hover:bg-amber-600 group-hover:text-white transition-all">Ruang Documenting →</span>
            </button>
        </div>
    </div>

    <!-- SCREEN 2: MAIN DASHBOARD APPLICATION -->
    <div class="flex h-screen overflow-hidden">
        
        <!-- SIDEBAR -->
        <aside class="w-64 bg-white flex flex-col justify-between border-r border-slate-200 flex-shrink-0">
            <div>
                <div class="p-5 flex items-center gap-3 border-b border-slate-200">
                    <div class="bg-sky-600 p-2 rounded-lg text-white"><i data-lucide="check-square" class="w-5 h-5"></i></div>
                    <div>
                        <h1 class="font-black text-sm leading-tight tracking-wide text-slate-900">FAP-PROGRESS</h1>
                        <span class="text-[10px] uppercase tracking-wider font-bold block" id="sidebarRoleBadge">Testing Mode</span>
                    </div>
                </div>

                <nav class="px-3 py-4 space-y-1">
                    <button onclick="switchTab('dashboard', this)" class="sidebar-link active w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left cursor-pointer text-slate-700 hover:bg-slate-50">
                        <i data-lucide="grid" class="w-4 h-4"></i> Dashboard Utama
                    </button>
                    <button onclick="switchTab('task-manager', this)" class="sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-sky-600 text-left cursor-pointer">
                        <i data-lucide="list-todo" class="w-4 h-4"></i> Task Management
                    </button>
                    <button onclick="switchTab('kanban', this)" class="sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-sky-600 text-left cursor-pointer">
                        <i data-lucide="kanban" class="w-4 h-4"></i> Tracking Board
                    </button>
                    <button onclick="switchTab('calendar', this)" class="sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-sky-600 text-left cursor-pointer">
                        <i data-lucide="calendar" class="w-4 h-4"></i> Calendar View
                    </button>
                    <button onclick="switchTab('files-manager', this)" class="sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-sky-600 text-left cursor-pointer">
                        <i data-lucide="folder-open" class="w-4 h-4"></i> File Uploaded
                    </button>
                </nav>
            </div>

            <div class="p-4 border-t border-slate-200 bg-slate-50">
                <button onclick="backToGate()" class="w-full bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 p-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm">
                    <i data-lucide="home" class="w-3.5 h-3.5"></i> Back to Home
                </button>
            </div>
        </aside>

        <!-- MAIN CONTENT AREA -->
        <main class="flex-1 flex flex-col overflow-hidden">
            
            <!-- TOP NAVBAR -->
            <header class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
                <div class="flex items-center gap-4">
                    <div class="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button id="btnPeriodDaily" onclick="filterPeriod('Daily')" class="period-btn px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer">Daily</button>
                        <button id="btnPeriodWeekly" onclick="filterPeriod('Weekly')" class="period-btn px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer">Weekly</button>
                        <button id="btnPeriodMonthly" onclick="filterPeriod('Monthly')" class="period-btn px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer">Monthly</button>
                        <button id="btnPeriodYearly" onclick="filterPeriod('Yearly')" class="period-btn px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer">Yearly</button>
                    </div>

                    <div class="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                        <label for="dashboardDatePicker" class="text-[11px] text-slate-600 font-bold flex items-center gap-1">
                            <i data-lucide="calendar" class="w-3.5 h-3.5 text-sky-600"></i> Select Date:
                        </label>
                        <input type="date" id="dashboardDatePicker" onchange="handleCustomDateChange()" class="bg-white text-xs font-bold text-sky-700 font-mono focus:outline-none border border-slate-200 p-1 rounded cursor-pointer">
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <div class="text-right">
                        <span class="text-[10px] text-slate-400 block uppercase tracking-wide">Periode Aktif</span>
                        <span id="activePeriodLabel" class="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">Monthly</span>
                    </div>
                </div>
            </header>

            <!-- CONTAINER KONTEN -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6">
                
                <!-- TAB 1: DASHBOARD UTAMA -->
                <div id="tab-dashboard" class="tab-content space-y-6">
                    
                    <!-- DIAGRAM LINGKARAN MERGED VIEW -->
                    <div id="mergedChartContainer" class="bg-white p-5 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/20 to-white shadow-sm flex flex-col md:flex-row items-center gap-6 hidden">
                        <div class="w-40 h-40 flex-shrink-0 flex items-center justify-center bg-white p-2 rounded-xl border border-slate-100 shadow-inner">
                            <canvas id="mergedPieChart"></canvas>
                        </div>
                        <div class="flex-1 space-y-2 text-center md:text-left">
                            <h4 class="text-sm font-black text-indigo-950 uppercase tracking-wide flex items-center justify-center md:justify-start gap-1.5">
                                <i data-lucide="pie-chart" class="w-4 h-4 text-indigo-600"></i> Proporsi Kerja Berdasarkan Jabatan/Fungsi
                            </h4>
                            <p class="text-xs text-slate-500 max-w-xl leading-relaxed">
                                Grafik lingkaran ini menyajikan perbandingan persentase jumlah penugasan yang aktif secara langsung di antara divisi <strong class="text-sky-600">Vehicle Testing</strong>, <strong class="text-emerald-600">Market Support</strong>, dan <strong class="text-amber-600">Other (Documenting)</strong>.
                            </p>
                            <div class="flex flex-wrap justify-center md:justify-start gap-3 pt-1.5 text-[11px] font-bold">
                                <div class="flex items-center gap-1.5 text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-100">
                                    <span class="w-2 h-2 bg-sky-500 rounded-full"></span> Vehicle Testing: <span id="pie-label-testing" class="font-mono">0%</span>
                                </div>
                                <div class="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                                    <span class="w-2 h-2 bg-emerald-500 rounded-full"></span> Market Support: <span id="pie-label-market_support" class="font-mono">0%</span>
                                </div>
                                <div class="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-100">
                                    <span class="w-2 h-2 bg-amber-500 rounded-full"></span> Other (Doc): <span id="pie-label-other" class="font-mono">0%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- KARTU COUNTER DATA -->
                    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        <div class="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                            <div><p class="text-xs font-medium text-slate-500 uppercase">Total Tasks</p><h3 class="text-2xl font-bold mt-0.5 text-slate-900" id="count-total">0</h3></div>
                            <div class="bg-slate-100 p-2.5 rounded-lg text-slate-500"><i data-lucide="folder" class="w-5 h-5"></i></div>
                        </div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                            <div><p class="text-xs font-medium text-slate-500 uppercase">Completed</p><h3 class="text-2xl font-bold mt-0.5 text-emerald-600" id="count-completed">0</h3></div>
                            <div class="bg-emerald-50 p-2.5 rounded-lg text-emerald-600 border border-emerald-100"><i data-lucide="check-circle" class="w-5 h-5"></i></div>
                        </div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                            <div><p class="text-xs font-medium text-slate-500 uppercase">On Progress</p><h3 class="text-2xl font-bold mt-0.5 text-sky-600" id="count-progress">0</h3></div>
                            <div class="bg-sky-50 p-2.5 rounded-lg text-sky-600 border border-sky-100"><i data-lucide="sliders" class="w-5 h-5"></i></div>
                        </div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                            <div><p class="text-xs font-medium text-slate-500 uppercase">Pending</p><h3 class="text-2xl font-bold mt-0.5 text-amber-600" id="count-pending">0</h3></div>
                            <div class="bg-amber-50 p-2.5 rounded-lg text-amber-600 border border-amber-100"><i data-lucide="clock" class="w-5 h-5"></i></div>
                        </div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm col-span-2 lg:col-span-1">
                            <div><p class="text-xs font-medium text-slate-500 uppercase">Overdue</p><h3 class="text-2xl font-bold mt-0.5 text-rose-600" id="count-overdue">0</h3></div>
                            <div class="bg-rose-50 p-2.5 rounded-lg text-rose-600 border border-rose-100"><i data-lucide="alert-octagon" class="w-5 h-5"></i></div>
                        </div>
                    </div>

                    <!-- LOG TABEL RIWAYAT -->
                    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div class="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h3 class="text-xs font-bold text-slate-600 uppercase tracking-wider" id="dashboardTableTitle">Log Riwayat Pekerjaan</h3>
                            <span id="rangeDisplayLabel" class="text-xs text-sky-700 font-mono font-bold"></span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr class="bg-slate-100 text-slate-600 font-semibold uppercase border-b border-slate-200">
                                        <th class="p-3">Posisi</th>
                                        <th class="p-3">ID Task</th>
                                        <th class="p-3">Judul Tugas</th>
                                        <th class="p-3">PIC</th>
                                        <th class="p-3">Unit Menu</th>
                                        <th class="p-3">Kategori</th>
                                        <th class="p-3">Tanggal Mulai</th>
                                        <th class="p-3">Target Selesai</th>
                                        <th class="p-3">Durasi</th>
                                        <th class="p-3">Lampiran Berkas</th>
                                    </tr>
                                </thead>
                                <tbody id="dashboardHistoryBody" class="divide-y divide-slate-100 text-slate-700"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- TAB 2: TASK MANAGEMENT -->
                <div id="tab-task-manager" class="tab-content hidden space-y-4">
                    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div class="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 class="text-base font-bold text-slate-800" id="taskManagerHeaderTitle">Daftar Penugasan Kerja</h2>
                            <button id="btnAddNewTaskGlobal" onclick="openModal(false)" class="bg-sky-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md hover:bg-sky-500 cursor-pointer">
                                <i data-lucide="plus" class="w-4 h-4"></i> Tambah Task Baru
                            </button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 text-slate-600 text-xs font-semibold uppercase border-b border-slate-200">
                                        <th class="py-3.5 px-4">Posisi</th>
                                        <th class="py-3.5 px-4">No. Task</th>
                                        <th class="py-3.5 px-4">Kategori</th>
                                        <th class="py-3.5 px-4">Unit Menu</th>
                                        <th class="py-3.5 px-4">Judul Tugas</th>
                                        <th class="py-3.5 px-4">PIC</th>
                                        <th class="py-3.5 px-4">Tgl Mulai</th>
                                        <th class="py-3.5 px-4">Target Selesai</th>
                                        <th class="py-3.5 px-4">Lama Kerja</th>
                                        <th class="py-3.5 px-4">Prioritas</th>
                                        <th class="py-3.5 px-4 w-32">Progress</th>
                                        <th class="py-3.5 px-4">Status</th>
                                        <th class="py-3.5 px-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 text-sm text-slate-700" id="taskTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- TAB 3: TRACKING BOARD -->
                <div id="tab-kanban" class="tab-content hidden grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div class="bg-white p-3 rounded-xl border border-slate-200 flex flex-col shadow-sm">
                        <div class="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                            <span class="text-xs font-bold text-slate-500 uppercase tracking-wide">Not Started</span>
                            <span class="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded font-bold" id="kb-count-notstarted">0</span>
                        </div>
                        <div class="kanban-column space-y-3 flex-1 bg-slate-50/50 p-1 rounded-lg" id="kb-col-notstarted"></div>
                    </div>
                    <div class="bg-white p-3 rounded-xl border border-slate-200 flex flex-col shadow-sm">
                        <div class="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                            <span class="text-xs font-bold text-sky-600 uppercase tracking-wide">On Progress</span>
                            <span class="bg-sky-50 text-sky-600 text-[11px] px-2 py-0.5 rounded font-bold" id="kb-count-onprogress">0</span>
                        </div>
                        <div class="kanban-column space-y-3 flex-1 bg-slate-50/50 p-1 rounded-lg" id="kb-col-onprogress"></div>
                    </div>
                    <div class="bg-white p-3 rounded-xl border border-slate-200 flex flex-col shadow-sm">
                        <div class="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                            <span class="text-xs font-bold text-amber-600 uppercase tracking-wide">Pending</span>
                            <span class="bg-amber-50 text-amber-600 text-[11px] px-2 py-0.5 rounded font-bold" id="kb-count-pending">0</span>
                        </div>
                        <div class="kanban-column space-y-3 flex-1 bg-slate-50/50 p-1 rounded-lg" id="kb-col-pending"></div>
                    </div>
                    <div class="bg-white p-3 rounded-xl border border-slate-200 flex flex-col shadow-sm">
                        <div class="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                            <span class="text-xs font-bold text-emerald-600 uppercase tracking-wide">Completed</span>
                            <span class="bg-emerald-50 text-emerald-600 text-[11px] px-2 py-0.5 rounded font-bold" id="kb-count-completed">0</span>
                        </div>
                        <div class="kanban-column space-y-3 flex-1 bg-slate-50/50 p-1 rounded-lg" id="kb-col-completed"></div>
                    </div>
                    <div class="bg-white p-3 rounded-xl border border-slate-200 flex flex-col shadow-sm">
                        <div class="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                            <span class="text-xs font-bold text-rose-600 uppercase tracking-wide">Overdue</span>
                            <span class="bg-rose-50 text-rose-600 text-[11px] px-2 py-0.5 rounded font-bold" id="kb-count-overdue">0</span>
                        </div>
                        <div class="kanban-column space-y-3 flex-1 bg-slate-50/50 p-1 rounded-lg" id="kb-col-overdue"></div>
                    </div>
                </div>

                <!-- TAB 4: CALENDAR VIEW -->
                <div id="tab-calendar" class="tab-content hidden space-y-4">
                    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-sm font-bold text-slate-700" id="calendarMonthYearTitle">Jadwal Kalender Terintegrasi</h2>
                        </div>
                        <div class="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            <span class="text-rose-500">Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
                        </div>
                        <div class="grid grid-cols-7 gap-2" id="calendarDaysGrid"></div>
                    </div>

                    <div id="calendarActiveDayPanel" class="bg-white p-5 rounded-xl border border-slate-200 hidden space-y-4 shadow-sm">
                        <div class="flex justify-between items-center border-b border-slate-200 pb-3">
                            <h3 class="text-sm font-bold text-slate-800">Daftar Aktivitas Tanggal: <span id="selectedDateLabel" class="text-sky-600 font-mono"></span></h3>
                            <button id="btnCalendarAddTask" onclick="triggerAddTaskFromCalendar()" class="bg-sky-600 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 hover:bg-sky-500 cursor-pointer">
                                <i data-lucide="plus" class="w-3.5 h-3.5"></i> Buat Pekerjaan Baru
                            </button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 text-slate-600 uppercase font-medium">
                                        <th class="p-3">Posisi</th>
                                        <th class="p-3">ID</th>
                                        <th class="p-3">Kategori</th>
                                        <th class="p-3">Unit</th>
                                        <th class="p-3">Judul Tugas</th>
                                        <th class="p-3">PIC</th>
                                        <th class="p-3">Status</th>
                                        <th class="p-3">Progress</th>
                                    </tr>
                                </thead>
                                <tbody id="calendarActiveDayTableBody" class="divide-y divide-slate-100"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- TAB 5: FILE MANAGER -->
                <div id="tab-files-manager" class="tab-content hidden space-y-4">
                    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <h2 class="text-base font-bold text-slate-800">File & Dokumen Terupload</h2>
                                <p class="text-xs text-slate-500">Kumpulan berkas yang tersimpan aman di dalam database internal ruang kerja aktif.</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="text" id="fileSearchInput" oninput="syncAndProcessAllViews()" placeholder="Cari nama berkas..." class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-sky-500 w-48 shadow-sm">
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="filesGridContainer"></div>
                    </div>
                </div>

            </div>
        </main>
    </div>

    <!-- FORM MODAL: INPUT/EDIT TUGAS -->
    <div id="taskModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 hidden opacity-0 transition-opacity duration-200">
        <div class="bg-white border border-slate-200 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden transform scale-95 transition-transform duration-200">
            <div class="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 id="modalMainTitle" class="font-black text-base text-slate-800 flex items-center gap-2"></h3>
                <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 cursor-pointer"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            
            <form onsubmit="handleFormSubmit(event)" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <input type="hidden" id="formEditTaskId" value="">

                <!-- INPUT PILIHAN TARGET POSISI KERJA -->
                <div id="formRoleSelectionWrapper" class="bg-indigo-50 border border-indigo-200 p-3 rounded-lg hidden">
                    <label class="block text-xs font-bold text-indigo-900 mb-1">Simpan Tugas Ini Ke Ruang Kerja Mana? <span class="text-rose-500">*</span></label>
                    <div class="flex flex-wrap gap-4 mt-1">
                        <label class="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                            <input type="radio" name="formTargetRole" value="testing" checked onchange="populateFormDropdowns()"> Vehicle Testing
                        </label>
                        <label class="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                            <input type="radio" name="formTargetRole" value="market_support" onchange="populateFormDropdowns()"> Market Support
                        </label>
                        <label class="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                            <input type="radio" name="formTargetRole" value="other" onchange="populateFormDropdowns()"> Other (Documenting)
                        </label>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-xs font-semibold text-slate-600 mb-1">Judul Aktivitas Tugas <span class="text-rose-500">*</span></label>
                        <input type="text" required id="formTitle" placeholder="Ketik rumusan judul tugas..." class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:border-sky-500 shadow-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1">PIC <span class="text-rose-500">*</span></label>
                        <input type="text" required id="formPic" placeholder="Nama penanggung jawab..." class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:border-sky-500 shadow-sm">
                    </div>
                </div>

                <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                    <label class="block text-xs font-semibold text-sky-700">Pilih Kategori Aktivitas <span class="text-rose-500">*</span></label>
                    <div class="flex gap-2">
                        <select id="formCategorySelect" class="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-800 focus:outline-none shadow-sm"></select>
                        <button type="button" onclick="deleteCurrentCategory()" class="bg-rose-100 hover:bg-rose-200 text-rose-600 px-2.5 rounded-lg border border-rose-200 cursor-pointer" title="Hapus Kategori Terpilih"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                    <div class="flex gap-2 pt-1 border-t border-slate-200/60">
                        <input type="text" id="newCategoryInput" placeholder="Tambah Kategori Baru..." class="bg-white border border-slate-200 rounded-lg p-2 text-xs flex-1 focus:outline-none shadow-sm">
                        <button type="button" onclick="addItemCategory()" class="bg-sky-600 text-white hover:bg-sky-500 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer">Tambah</button>
                    </div>
                </div>

                <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                    <label class="block text-xs font-semibold text-emerald-700">Pilih Unit Menu <span class="text-rose-500">*</span></label>
                    <div class="flex gap-2">
                        <select id="formFormUnitSelect" class="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-800 focus:outline-none shadow-sm"></select>
                        <button type="button" onclick="deleteCurrentUnit()" class="bg-rose-100 hover:bg-rose-200 text-rose-600 px-2.5 rounded-lg border border-rose-200 cursor-pointer" title="Hapus Unit Terpilih"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                    <div class="flex gap-2 pt-1 border-t border-slate-200/60">
                        <input type="text" id="newUnitInput" placeholder="Tambah Unit Baru..." class="bg-white border border-slate-200 rounded-lg p-2 text-xs flex-1 focus:outline-none shadow-sm">
                        <button type="button" onclick="addItemUnit()" class="bg-emerald-600 text-white hover:bg-emerald-500 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer">Tambah</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1">Tanggal Mulai <span class="text-rose-500">*</span></label>
                        <input type="date" required id="formStartDate" onchange="calculateDurationForm()" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-800 focus:outline-none cursor-pointer">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1">Tanggal Selesai <span class="text-rose-500">*</span></label>
                        <input type="date" required id="formEndDate" onchange="calculateDurationForm()" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-800 focus:outline-none cursor-pointer">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-500 mb-1">Durasi Kerja</label>
                        <div id="formDurationDisplay" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm font-mono font-bold text-amber-600 text-center shadow-sm">1 Hari</div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1">Prioritas Kerja</label>
                        <div class="flex gap-2 mt-1">
                            <label class="flex-1 bg-white border border-slate-200 p-2 text-center rounded-lg text-xs font-bold cursor-pointer text-slate-500 has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50 has-[:checked]:text-rose-600">
                                <input type="radio" name="priority" value="HIGH" checked class="hidden"> HIGH
                            </label>
                            <label class="flex-1 bg-white border border-slate-200 p-2 text-center rounded-lg text-xs font-bold cursor-pointer text-slate-500 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50 has-[:checked]:text-amber-600">
                                <input type="radio" name="priority" value="MEDIUM" class="hidden"> MEDIUM
                            </label>
                            <label class="flex-1 bg-white border border-slate-200 p-2 text-center rounded-lg text-xs font-bold cursor-pointer text-slate-500 has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50 has-[:checked]:text-sky-600">
                                <input type="radio" name="priority" value="LOW" class="hidden"> LOW
                            </label>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1">Progress Kerja (0 - 100%)</label>
                        <input type="number" id="formProgress" min="0" max="100" value="0" oninput="toggleFileAttachmentSection(this.value)" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-mono text-slate-800 focus:outline-none focus:border-sky-500 shadow-sm">
                    </div>
                </div>

                <div id="fileAttachmentSection" class="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-3 hidden">
                    <div class="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase">
                        <i data-lucide="paperclip" class="w-4 h-4"></i> Lampiran Berkas Selesai Pekerjaan
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[11px] text-slate-600 mb-1">Upload Berkas Komputer</label>
                            <input type="file" id="formLocalFileInput" onchange="processLocalFileAttachment(this)" class="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-600 focus:outline-none cursor-pointer">
                            <div id="localFileStatusLabel" class="text-[10px] text-sky-700 mt-1 font-mono font-bold hidden truncate max-w-xs"></div>
                        </div>
                        <div>
                            <label class="block text-[11px] text-slate-600 mb-1">Tautan Dokumen Cloud</label>
                            <input type="url" id="formFileLink" placeholder="https://drive.google.com/..." class="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono focus:outline-none">
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                    <button type="button" onclick="closeModal()" class="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer">Batal</button>
                    <button type="submit" class="bg-sky-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-sky-500 cursor-pointer shadow-md">Simpan Data</button>
                </div>
            </form>
        </div>
    </div>

    <!-- CORE JAVASCRIPT ENGINE -->
    <script>
        let currentActiveRole = "testing"; 
        let globalTasksMaster = []; 
        let activePeriodFilter = "Monthly"; 
        let globalPieChartInstance = null; 

        let dynamicCategoriesMaster = {
            testing: ["Internal Testing", "Eksternal Evaluasi", "Engine Validation", "Track Testing"],
            market_support: ["Customer Visit", "Technical Proposal", "Product Demo", "Quotation Dev"],
            other: ["Documenting Control", "SOP Review", "Arsip Laporan", "Administrasi VKTR"]
        };
        let dynamicUnitsMaster = ["Unit A-Dashboard", "Unit B-Reporting", "Unit C-Analis", "Unit D-Workshop"];
        let activeCalendarDay = 12; 

        document.addEventListener("DOMContentLoaded", () => {
            loadSavedWallpaper();
            initLandingGateContextMenu();

            const savedDashboardDate = localStorage.getItem('fap_dashboard_date') || "2026-06-12";
            document.getElementById('dashboardDatePicker').value = savedDashboardDate;
            activeCalendarDay = parseInt(savedDashboardDate.split("-")[2]) || 12;

            activePeriodFilter = localStorage.getItem('fap_period_filter') || "Monthly";

            if(localStorage.getItem('fap_tasks_db')) {
                globalTasksMaster = JSON.parse(localStorage.getItem('fap_tasks_db'));
            } else {
                globalTasksMaster = [
                    { id: "TSK-001", roleOwner: "testing", title: "Validasi Engine Speed Sensor", pic: "Fuad Testing Team", cat: "Internal Testing", unitMenu: "Unit A-Dashboard", startDate: "2026-06-12", endDate: "2026-06-15", prog: 40, priority: "HIGH", status: "On Progress", durationDays: 4, fileLink: "", localFileName: "Report_Speed.pdf", localFileData: "data:text/plain;base64,RHVtbXk=" },
                    { id: "TSK-002", roleOwner: "market_support", title: "Presentasi Proposal PT Maju Jaya", pic: "Fuad Market Support Team", cat: "Product Demo", unitMenu: "Unit B-Reporting", startDate: "2026-06-14", endDate: "2026-06-14", prog: 100, priority: "MEDIUM", status: "Completed", durationDays: 1, fileLink: "https://drive.google.com", localFileName: "Quotation_Maju_Jaya.pdf", localFileData: "data:text/plain;base64,RHVtbXk=" },
                    { id: "TSK-003", roleOwner: "other", title: "Penyusunan Dokumentasi SOP VKTR", pic: "Fuad Documenting Team", cat: "Documenting Control", unitMenu: "Unit C-Analis", startDate: "2026-06-12", endDate: "2026-06-13", prog: 100, priority: "LOW", status: "Completed", durationDays: 2, fileLink: "", localFileName: "SOP_Final.pdf", localFileData: "data:text/plain;base64,RHVtbXk=" }
                ];
                localStorage.setItem('fap_tasks_db', JSON.stringify(globalTasksMaster));
            }

            if(localStorage.getItem('fap_cat_master')) {
                dynamicCategoriesMaster = JSON.parse(localStorage.getItem('fap_cat_master'));
                if(!dynamicCategoriesMaster.other) {
                    dynamicCategoriesMaster.other = ["Documenting Control", "SOP Review", "Arsip Laporan", "Administrasi VKTR"];
                }
            }
            if(localStorage.getItem('fap_unit_master')) dynamicUnitsMaster = JSON.parse(localStorage.getItem('fap_unit_master'));

            lucide.createIcons();
            applyPeriodBtnStyle(activePeriodFilter);
        });

        // ================= CONTEXT MENU & WALLPAPER ENGINE =================
        function initLandingGateContextMenu() {
            const gate = document.getElementById('landingGate');
            const menu = document.getElementById('customContextMenu');

            gate.addEventListener('contextmenu', function(e) {
                e.preventDefault(); 
                menu.style.left = `${e.clientX}px`;
                menu.style.top = `${e.clientY}px`;
                menu.classList.remove('hidden');
            });

            document.addEventListener('click', function() {
                menu.classList.add('hidden');
            });
        }

        function triggerWallpaperUpload() {
            document.getElementById('wallpaperUploadInput').click();
        }

        function handleWallpaperChange(input) {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const base64Img = e.target.result;
                    localStorage.setItem('fap_landing_wallpaper', base64Img);
                    applyWallpaper(base64Img);
                };
                reader.readAsDataURL(file);
            }
        }

        function applyWallpaper(base64Data) {
            const gate = document.getElementById('landingGate');
            const resetBtn = document.getElementById('ctxResetBtn');
            if (gate && base64Data) {
                gate.style.backgroundImage = `url('${base64Data}')`;
                if(resetBtn) resetBtn.classList.remove('hidden');
            }
        }

        function loadSavedWallpaper() {
            const savedWallpaper = localStorage.getItem('fap_landing_wallpaper');
            if (savedWallpaper) {
                applyWallpaper(savedWallpaper);
            }
        }

        function resetWallpaper() {
            localStorage.removeItem('fap_landing_wallpaper');
            const gate = document.getElementById('landingGate');
            if (gate) {
                gate.style.backgroundImage = 'none';
            }
            document.getElementById('ctxResetBtn').classList.add('hidden');
            document.getElementById('wallpaperUploadInput').value = "";
        }
        // ===================================================================

        function selectRoleGate(role) {
            currentActiveRole = role;
            document.getElementById('landingGate').classList.add('opacity-0', 'pointer-events-none');
            
            const badge = document.getElementById('sidebarRoleBadge');
            const btnAddNew = document.getElementById('btnAddNewTaskGlobal');
            const btnCalendarAdd = document.getElementById('btnCalendarAddTask');
            const chartWrapper = document.getElementById('mergedChartContainer');

            if(role === 'testing') {
                badge.innerText = "Vehicle Testing Mode";
                badge.className = "text-[10px] text-sky-600 font-mono font-bold uppercase tracking-wider";
                document.getElementById('taskManagerHeaderTitle').innerText = "Daftar Penugasan Kerja (Vehicle Testing)";
                document.getElementById('dashboardTableTitle').innerText = "Log Riwayat Pekerjaan (Vehicle Testing)";
                if(btnAddNew) btnAddNew.classList.remove('hidden');
                if(btnCalendarAdd) btnCalendarAdd.classList.remove('hidden');
                if(chartWrapper) chartWrapper.classList.add('hidden');
            } else if(role === 'market_support') {
                badge.innerText = "Market Support Mode";
                badge.className = "text-[10px] text-emerald-600 font-mono font-bold uppercase tracking-wider";
                document.getElementById('taskManagerHeaderTitle').innerText = "Daftar Penugasan Kerja (Market Support)";
                document.getElementById('dashboardTableTitle').innerText = "Log Riwayat Pekerjaan (Market Support)";
                if(btnAddNew) btnAddNew.classList.remove('hidden');
                if(btnCalendarAdd) btnCalendarAdd.classList.remove('hidden');
                if(chartWrapper) chartWrapper.classList.add('hidden');
            } else if(role === 'other') {
                badge.innerText = "Other (Documenting)";
                badge.className = "text-[10px] text-amber-600 font-mono font-bold uppercase tracking-wider";
                document.getElementById('taskManagerHeaderTitle').innerText = "Daftar Penugasan Kerja (Documenting)";
                document.getElementById('dashboardTableTitle').innerText = "Log Riwayat Pekerjaan (Documenting)";
                if(btnAddNew) btnAddNew.classList.remove('hidden');
                if(btnCalendarAdd) btnCalendarAdd.classList.remove('hidden');
                if(chartWrapper) chartWrapper.classList.add('hidden');
            } else {
                badge.innerText = "Merged View (Gabungan)";
                badge.className = "text-[10px] text-indigo-600 font-mono font-black uppercase tracking-wider";
                document.getElementById('taskManagerHeaderTitle').innerText = "Daftar Penugasan Kerja (Semua Posisi)";
                document.getElementById('dashboardTableTitle').innerText = "Log Riwayat Pekerjaan (Semua Posisi)";
                if(btnAddNew) btnAddNew.classList.add('hidden');
                if(btnCalendarAdd) btnCalendarAdd.classList.add('hidden');
                if(chartWrapper) chartWrapper.classList.remove('hidden');
            }

            populateFormDropdowns();
            switchTab('dashboard', document.querySelector('.sidebar-link'));
        }

        function backToGate() {
            document.getElementById('landingGate').classList.remove('opacity-0', 'pointer-events-none');
        }

        function switchTab(tabId, element) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
            document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));

            document.getElementById(`tab-${tabId}`).classList.remove('hidden');
            if(element) element.classList.add('active');

            syncAndProcessAllViews();
        }

        function handleCustomDateChange() {
            const dateVal = document.getElementById('dashboardDatePicker').value;
            localStorage.setItem('fap_dashboard_date', dateVal);
            if(dateVal) {
                activeCalendarDay = parseInt(dateVal.split("-")[2]);
            }
            syncAndProcessAllViews();
        }

        function filterPeriod(period) {
            activePeriodFilter = period;
            localStorage.setItem('fap_period_filter', period);
            applyPeriodBtnStyle(period);
            syncAndProcessAllViews();
        }

        function applyPeriodBtnStyle(period) {
            document.getElementById('activePeriodLabel').innerText = period;
            document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('bg-white', 'text-sky-600', 'shadow-sm', 'font-bold'));
            const targetBtn = document.getElementById(`btnPeriod${period}`);
            if(targetBtn) targetBtn.classList.add('bg-white', 'text-sky-600', 'shadow-sm', 'font-bold');
        }

        function getRoleScopedTasks() {
            if(currentActiveRole === 'merged') {
                return globalTasksMaster;
            }
            return globalTasksMaster.filter(t => t.roleOwner === currentActiveRole);
        }

        function syncAndProcessAllViews() {
            let scoped = getRoleScopedTasks();
            let filtered = filterTasksByActivePeriod(scoped);

            document.getElementById('count-total').innerText = filtered.length;
            document.getElementById('count-completed').innerText = filtered.filter(t => t.status === "Completed").length;
            document.getElementById('count-progress').innerText = filtered.filter(t => t.status === "On Progress").length;
            document.getElementById('count-pending').innerText = filtered.filter(t => t.status === "Pending").length;
            document.getElementById('count-overdue').innerText = filtered.filter(t => t.status === "Overdue").length;

            renderDashboardHistory(filtered);
            renderTaskTable(scoped);
            renderKanbanBoard(scoped);
            renderCalendarView(scoped);
            renderActiveDayCalendarList(scoped);
            renderFilesManagerTab(scoped);

            if(currentActiveRole === 'merged') {
                renderMergedPieChart(filtered);
            }
        }

        function renderMergedPieChart(filteredTasks) {
            const ctx = document.getElementById('mergedPieChart');
            if(!ctx) return;

            const totalTesting = filteredTasks.filter(t => t.roleOwner === 'testing').length;
            const totalMarketSupport = filteredTasks.filter(t => t.roleOwner === 'market_support').length;
            const totalOther = filteredTasks.filter(t => t.roleOwner === 'other').length;
            const totalAll = totalTesting + totalMarketSupport + totalOther;

            let pctTesting = 0, pctMarketSupport = 0, pctOther = 0;
            if(totalAll > 0) {
                pctTesting = Math.round((totalTesting / totalAll) * 100);
                pctMarketSupport = Math.round((totalMarketSupport / totalAll) * 100);
                pctOther = Math.round((totalOther / totalAll) * 100);
            }

            document.getElementById('pie-label-testing').innerText = `${pctTesting}% (${totalTesting})`;
            document.getElementById('pie-label-market_support').innerText = `${pctMarketSupport}% (${totalMarketSupport})`;
            document.getElementById('pie-label-other').innerText = `${pctOther}% (${totalOther})`;

            if(globalPieChartInstance) {
                globalPieChartInstance.destroy();
            }

            globalPieChartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Vehicle Testing', 'Market Support', 'Other (Doc)'],
                    datasets: [{
                        data: [totalTesting, totalMarketSupport, totalOther],
                        backgroundColor: ['#0ea5e9', '#10b981', '#f59e0b'], 
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }

        function filterTasksByActivePeriod(tasksArray) {
            const pickerValue = document.getElementById('dashboardDatePicker').value;
            if(!pickerValue) return tasksArray;

            let targetDate = new Date(pickerValue);
            let targetYear = targetDate.getFullYear();
            let targetMonth = targetDate.getMonth();

            return tasksArray.filter(task => {
                let start = new Date(task.startDate);
                let end = new Date(task.endDate);
                
                if (activePeriodFilter === 'Daily') {
                    return (start <= targetDate && end >= targetDate);
                } 
                else if (activePeriodFilter === 'Weekly') {
                    let weekStart = new Date(targetDate);
                    weekStart.setDate(targetDate.getDate() - targetDate.getDay() + 1);
                    let weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return (start <= weekEnd && end >= weekStart);
                } 
                else if (activePeriodFilter === 'Monthly') {
                    return (start.getFullYear() === targetYear && start.getMonth() === targetMonth) || 
                           (end.getFullYear() === targetYear && end.getMonth() === targetMonth);
                } 
                else if (activePeriodFilter === 'Yearly') {
                    return (start.getFullYear() === targetYear || end.getFullYear() === targetYear);
                }
                return true;
            });
        }

        function renderDashboardHistory(filteredArray) {
            const tbody = document.getElementById('dashboardHistoryBody');
            const refDateStr = document.getElementById('dashboardDatePicker').value;
            document.getElementById('rangeDisplayLabel').innerText = `[${refDateStr}] - Mode: ${activePeriodFilter}`;

            if(filteredArray.length === 0) {
                tbody.innerHTML = `<tr><td colspan="10" class="p-4 text-center text-slate-400">Tidak ada tugas aktif di rentang tanggal terpilih.</td></tr>`;
                return;
            }

            tbody.innerHTML = "";
            filteredArray.forEach(task => {
                let linkHtml = "";
                if (task.localFileName && task.localFileData) {
                    linkHtml += `<a href="${task.localFileData}" download="${task.localFileName}" class="text-sky-600 hover:underline flex items-center gap-1 mb-1 font-mono text-[11px] font-bold"><i data-lucide="download" class="w-3 h-3"></i> PC File</a>`;
                }
                if (task.fileLink) {
                    linkHtml += `<a href="${task.fileLink}" target="_blank" class="text-emerald-600 hover:underline flex items-center gap-1 text-[11px] font-bold"><i data-lucide="external-link" class="w-3 h-3"></i> Cloud</a>`;
                }
                if (!linkHtml) linkHtml = `<span class="text-slate-400">-</span>`;

                let sFormatted = new Date(task.startDate).toLocaleDateString('id-ID', {day:'2-digit', month:'short'});
                let eFormatted = new Date(task.endDate).toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'});

                let roleBadge = "";
                if(task.roleOwner === 'testing') {
                    roleBadge = `<span class="bg-sky-100 text-sky-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase border border-sky-200">Testing</span>`;
                } else if(task.roleOwner === 'market_support') {
                    roleBadge = `<span class="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase border border-emerald-200">Support</span>`;
                } else {
                    roleBadge = `<span class="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase border border-amber-200">Other</span>`;
                }

                const tr = document.createElement('tr');
                tr.className = "hover:bg-slate-50 border-b border-slate-100";
                tr.innerHTML = `
                    <td class="p-3">${roleBadge}</td>
                    <td class="p-3 font-mono font-bold text-sky-600">${task.id}</td>
                    <td class="p-3 text-slate-800 font-medium">${task.title}</td>
                    <td class="p-3 text-slate-700 font-bold">${task.pic}</td>
                    <td class="p-3 text-slate-500">${task.unitMenu}</td>
                    <td class="p-3 text-slate-500">${task.cat}</td>
                    <td class="p-3 font-mono text-slate-600">${sFormatted}</td>
                    <td class="p-3 font-mono text-slate-600">${eFormatted}</td>
                    <td class="p-3 text-amber-600 font-bold">${task.durationDays} H</td>
                    <td class="p-3">${linkHtml}</td>
                `;
                tbody.appendChild(tr);
            });
            lucide.createIcons();
        }

        function renderTaskTable(scopedArray) {
            const tbody = document.getElementById('taskTableBody');
            tbody.innerHTML = "";
            
            if(scopedArray.length === 0) {
                tbody.innerHTML = `<tr><td colspan="13" class="p-8 text-center text-slate-400">Belum ada tugas terdaftar.</td></tr>`;
                return;
            }

            scopedArray.forEach(task => {
                let statusStyle = task.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : (task.status === "On Progress" ? "bg-sky-50 text-sky-700 border-sky-200" : (task.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-rose-50 text-rose-700 border-rose-200"));

                let roleBadge = "";
                if(task.roleOwner === 'testing') {
                    roleBadge = `<span class="bg-sky-50 text-sky-600 border border-sky-200 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Testing</span>`;
                } else if(task.roleOwner === 'market_support') {
                    roleBadge = `<span class="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Support</span>`;
                } else {
                    roleBadge = `<span class="bg-amber-50 text-amber-600 border border-amber-200 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Other</span>`;
                }

                const tr = document.createElement('tr');
                tr.className = "hover:bg-slate-50 border-b border-slate-100 text-xs";
                tr.innerHTML = `
                    <td class="py-3 px-4">${roleBadge}</td>
                    <td class="py-3 px-4 font-mono font-bold text-sky-600">${task.id}</td>
                    <td class="py-3 px-4 text-slate-500">${task.cat}</td>
                    <td class="py-3 px-4 text-slate-600">${task.unitMenu}</td>
                    <td class="py-3 px-2"><input type="text" id="inline-title-${task.id}" value="${task.title}" class="bg-white border border-slate-200 rounded p-1 w-full focus:border-sky-500 focus:outline-none text-slate-800"></td>
                    <td class="py-3 px-2"><input type="text" id="inline-pic-${task.id}" value="${task.pic}" class="bg-white border border-slate-200 rounded p-1 w-24 text-slate-800 font-bold focus:border-sky-500 focus:outline-none"></td>
                    <td class="py-3 px-2"><input type="date" id="inline-start-${task.id}" value="${task.startDate}" class="bg-white text-[11px] border border-slate-200 rounded p-1 font-mono focus:outline-none"></td>
                    <td class="py-3 px-2"><input type="date" id="inline-end-${task.id}" value="${task.endDate}" class="bg-white text-[11px] border border-slate-200 rounded p-1 font-mono focus:outline-none"></td>
                    <td class="py-3 px-4 text-amber-600 font-bold font-mono">${task.durationDays}H</td>
                    <td class="py-3 px-4">
                        <select id="inline-priority-${task.id}" class="bg-white text-[11px] border border-slate-200 rounded p-1 text-slate-700">
                            <option value="HIGH" ${task.priority==='HIGH'?'selected':''}>HIGH</option>
                            <option value="MEDIUM" ${task.priority==='MEDIUM'?'selected':''}>MEDIUM</option>
                            <option value="LOW" ${task.priority==='LOW'?'selected':''}>LOW</option>
                        </select>
                    </td>
                    <td class="py-3 px-2">
                        <div class="flex items-center gap-1">
                            <input type="number" id="inline-prog-${task.id}" min="0" max="100" value="${task.prog}" class="w-12 bg-white border border-slate-200 rounded p-1 font-mono text-center text-sky-600 focus:outline-none font-bold">
                            <span class="text-slate-400">%</span>
                        </div>
                    </td>
                    <td class="py-3 px-4"><span class="${statusStyle} text-[10px] px-2 py-0.5 rounded-full border font-bold">${task.status}</span></td>
                    <td class="py-3 px-4">
                        <div class="flex items-center justify-center gap-1.5">
                            <button onclick="saveInlineTaskChanges('${task.id}')" class="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1.5 rounded font-bold text-[11px] cursor-pointer flex items-center gap-1 shadow-sm"><i data-lucide="save" class="w-3 h-3"></i> SIMPAN</button>
                            <button onclick="openModal(true, '${task.id}')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1.5 rounded text-[11px] font-bold border border-slate-200 cursor-pointer">Detail</button>
                            <button onclick="deleteTaskPermanent('${task.id}')" class="bg-rose-100 hover:bg-rose-200 text-rose-600 px-2 py-1.5 rounded border border-rose-200 font-bold text-[11px] cursor-pointer flex items-center justify-center" title="Hapus Pekerjaan"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            lucide.createIcons();
        }

        function deleteTaskPermanent(id) {
            if(confirm(`Apakah Anda yakin ingin menghapus data pekerjaan [${id}] ini secara permanen dari sistem?`)) {
                globalTasksMaster = globalTasksMaster.filter(t => t.id !== id);
                localStorage.setItem('fap_tasks_db', JSON.stringify(globalTasksMaster));
                syncAndProcessAllViews();
            }
        }

        function saveInlineTaskChanges(id) {
            let task = globalTasksMaster.find(t => t.id === id);
            if(task) {
                task.title = document.getElementById(`inline-title-${id}`).value;
                task.pic = document.getElementById(`inline-pic-${id}`).value;
                task.startDate = document.getElementById(`inline-start-${id}`).value;
                task.endDate = document.getElementById(`inline-end-${id}`).value;
                task.priority = document.getElementById(`inline-priority-${id}`).value;
                task.prog = Math.min(Math.max(parseInt(document.getElementById(`inline-prog-${id}`).value) || 0, 0), 100);

                let diffTime = Math.abs(new Date(task.endDate) - new Date(task.startDate));
                task.durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                task.status = determineTaskStatus(task.prog, task.endDate);

                localStorage.setItem('fap_tasks_db', JSON.stringify(globalTasksMaster));
                alert(`Data [${id}] Berhasil Diperbarui.`);
                syncAndProcessAllViews();
            }
        }

        let base64FileString = ""; let base64FileName = "";
        function processLocalFileAttachment(inputElement) {
            const file = inputElement.files[0];
            const label = document.getElementById('localFileStatusLabel');
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    base64FileString = e.target.result; base64FileName = file.name;
                    label.innerText = `✓ File siap: ${file.name}`;
                    label.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        }

        function renderFilesManagerTab(scopedArray) {
            const container = document.getElementById('filesGridContainer');
            const searchVal = document.getElementById('fileSearchInput').value.toLowerCase();
            container.innerHTML = "";

            let filesFound = scopedArray.filter(t => t.localFileName && t.localFileData);
            if(searchVal) {
                filesFound = filesFound.filter(f => f.localFileName.toLowerCase().includes(searchVal) || f.id.toLowerCase().includes(searchVal));
            }

            if(filesFound.length === 0) {
                container.innerHTML = `<div class="col-span-full p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">Tidak ada dokumen terupload di ruang kerja ini.</div>`;
                return;
            }

            filesFound.forEach(task => {
                let colTheme = "border-slate-200 bg-slate-50";
                let roleTag = "Other";
                if(task.roleOwner === 'testing') { colTheme = 'border-sky-200 bg-sky-50/20'; roleTag = 'Testing'; }
                else if(task.roleOwner === 'market_support') { colTheme = 'border-emerald-200 bg-emerald-50/20'; roleTag = 'Support'; }
                else if(task.roleOwner === 'other') { colTheme = 'border-amber-200 bg-amber-50/20'; roleTag = 'Other'; }

                const card = document.createElement('div');
                card.className = `${colTheme} border p-4 rounded-xl flex flex-col justify-between space-y-3 shadow-sm`;
                card.innerHTML = `
                    <div class="flex items-start gap-3">
                        <div class="bg-white p-2 rounded-lg text-slate-600 border border-slate-200"><i data-lucide="file-text" class="w-5 h-5"></i></div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-xs font-bold text-slate-800 truncate" title="${task.localFileName}">${task.localFileName}</h4>
                            <p class="text-[10px] text-slate-500 mt-0.5">ID Kerja: <span class="font-mono font-bold text-sky-600">${task.id}</span> [${roleTag}]</p>
                            <p class="text-[10px] text-slate-400 truncate">Kategori: ${task.cat}</p>
                        </div>
                    </div>
                    <div class="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                        <span class="text-slate-400 font-mono text-[9px]">Internal Database</span>
                        <div class="flex gap-1">
                            <a href="${task.localFileData}" download="${task.localFileName}" class="bg-sky-600 text-white px-2.5 py-1 rounded flex items-center gap-1 font-bold shadow-sm hover:bg-sky-500"><i data-lucide="download" class="w-3 h-3"></i> Unduh</a>
                            <button onclick="deleteFileAttachment('${task.id}')" class="bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-2 py-1 rounded font-bold cursor-pointer"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
            lucide.createIcons();
        }

        function deleteFileAttachment(taskId) {
            if(confirm("Hapus lampiran berkas dari tugas ini secara permanen?")) {
                let task = globalTasksMaster.find(t => t.id === taskId);
                if(task) {
                    task.localFileName = ""; task.localFileData = "";
                    localStorage.setItem('fap_tasks_db', JSON.stringify(globalTasksMaster));
                    syncAndProcessAllViews();
                }
            }
        }

        function renderKanbanBoard(scopedArray) {
            const cols = {
                'Not Started': document.getElementById('kb-col-notstarted'),
                'On Progress': document.getElementById('kb-col-onprogress'),
                'Pending': document.getElementById('kb-col-pending'),
                'Completed': document.getElementById('kb-col-completed'),
                'Overdue': document.getElementById('kb-col-overdue')
            };
            Object.values(cols).forEach(c => c.innerHTML = "");

            scopedArray.forEach(task => {
                let sideBorder = 'border-l-4 border-l-slate-400';
                let tagText = 'Other';
                if(task.roleOwner === 'testing') { sideBorder = 'border-l-4 border-l-sky-500'; tagText = 'Testing'; }
                else if(task.roleOwner === 'market_support') { sideBorder = 'border-l-4 border-l-emerald-500'; tagText = 'Support'; }
                else if(task.roleOwner === 'other') { sideBorder = 'border-l-4 border-l-amber-500'; tagText = 'Other'; }

                const card = document.createElement('div');
                card.className = `bg-white p-3 rounded-xl border border-slate-200 ${sideBorder} space-y-2 text-xs shadow-sm`;
                card.innerHTML = `
                    <div class="flex justify-between items-start">
                        <span class="font-mono text-sky-600 font-bold">${task.id} <span class="text-[9px] text-slate-400">(${tagText})</span></span>
                        <span class="text-[9px] text-slate-500 bg-slate-100 px-1 py-0.5 rounded border border-slate-200">${task.priority}</span>
                    </div>
                    <h4 class="font-bold text-slate-800 leading-tight">${task.title}</h4>
                    <div class="text-[10px] text-slate-500">PIC: ${task.pic}</div>
                    <div class="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span class="text-[10px] text-slate-600 font-bold">${task.prog}%</span>
                        <select onchange="updateKanbanStatusDirectly('${task.id}', this.value)" class="bg-slate-50 text-[10px] border border-slate-200 rounded p-0.5 text-sky-700 font-bold focus:outline-none">
                            <option value="Not Started" ${task.status === 'Not Started'?'selected':''}>Not Started</option>
                            <option value="On Progress" ${task.status === 'On Progress'?'selected':''}>On Progress</option>
                            <option value="Pending" ${task.status === 'Pending'?'selected':''}>Pending</option>
                            <option value="Completed" ${task.status === 'Completed'?'selected':''}>Completed</option>
                            <option value="Overdue" ${task.status === 'Overdue'?'selected':''}>Overdue</option>
                        </select>
                    </div>
                `;
                if(cols[task.status]) cols[task.status].appendChild(card);
            });

            document.getElementById('kb-count-notstarted').innerText = scopedArray.filter(t => t.status === "Not Started").length;
            document.getElementById('kb-count-onprogress').innerText = scopedArray.filter(t => t.status === "On Progress").length;
            document.getElementById('kb-count-pending').innerText = scopedArray.filter(t => t.status === "Pending").length;
            document.getElementById('kb-count-completed').innerText = scopedArray.filter(t => t.status === "Completed").length;
            document.getElementById('kb-count-overdue').innerText = scopedArray.filter(t => t.status === "Overdue").length;
        }

        function updateKanbanStatusDirectly(id, newStatus) {
            let task = globalTasksMaster.find(t => t.id === id);
            if(task) {
                task.status = newStatus;
                if(newStatus === "Completed") task.prog = 100;
                if(newStatus === "Not Started") task.prog = 0;
                localStorage.setItem('fap_tasks_db', JSON.stringify(globalTasksMaster));
                syncAndProcessAllViews();
            }
        }

        function renderCalendarView(scopedArray) {
            const grid = document.getElementById('calendarDaysGrid');
            grid.innerHTML = "";

            const refDateValue = document.getElementById('dashboardDatePicker').value || "2026-06-12";
            const currentYear = parseInt(refDateValue.split("-")[0]);
            const currentMonthIndex = parseInt(refDateValue.split("-")[1]) - 1; 

            const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            document.getElementById('calendarMonthYearTitle').innerText = `Jadwal Kalender Terintegrasi (${monthNames[currentMonthIndex]} ${currentYear})`;

            const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay();
            const totalDaysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

            for (let s = 0; s < firstDayOfMonth; s++) {
                const emptyBox = document.createElement('div');
                emptyBox.className = "bg-slate-100/40 border border-slate-100 rounded-lg h-24";
                grid.appendChild(emptyBox);
            }

            for (let i = 1; i <= totalDaysInMonth; i++) {
                let mString = (currentMonthIndex + 1) < 10 ? '0' + (currentMonthIndex + 1) : (currentMonthIndex + 1);
                let dString = i < 10 ? '0' + i : i;
                let currentDayString = `${currentYear}-${mString}-${dString}`;

                let tasksOnThisDay = scopedArray.filter(t => t.startDate <= currentDayString && t.endDate >= currentDayString);

                const dayBox = document.createElement('div');
                let isSelected = (i === activeCalendarDay);
                let borderStyle = isSelected ? "border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-500" : "border-slate-200 bg-white shadow-sm hover:bg-slate-50";
                
                dayBox.className = `${borderStyle} p-2 rounded-lg h-24 overflow-y-auto cursor-pointer flex flex-col justify-between text-left transition-all`;
                dayBox.setAttribute("onclick", `selectCalendarDay(${i})`);

                let badgeHTML = "";
                tasksOnThisDay.slice(0, 2).forEach(t => {
                    let badgeColor = 'bg-slate-50 text-slate-700 border-slate-200';
                    if(t.roleOwner === 'testing') badgeColor = 'bg-sky-50 text-sky-700 border-sky-100';
                    else if(t.roleOwner === 'market_support') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                    else if(t.roleOwner === 'other') badgeColor = 'bg-amber-50 text-amber-700 border-amber-100';

                    badgeHTML += `<div class="${badgeColor} border text-[9px] px-1 rounded truncate mb-0.5 font-medium">${t.title}</div>`;
                });
                if(tasksOnThisDay.length > 2) badgeHTML += `<div class="text-[9px] text-slate-400 font-bold">+${tasksOnThisDay.length - 2} Task</div>`;

                dayBox.innerHTML = `
                    <span class="text-xs font-mono font-bold ${isSelected ? 'text-indigo-600':'text-slate-400'}">${i}</span>
                    <div class="flex-1 mt-1">${badgeHTML}</div>
                `;
                grid.appendChild(dayBox);
            }
        }

        function selectCalendarDay(dayNum) {
            activeCalendarDay = dayNum;
            const currentPickerValue = document.getElementById('dashboardDatePicker').value;
            if(currentPickerValue) {
                let parts = currentPickerValue.split("-");
                parts[2] = dayNum < 10 ? '0' + dayNum : dayNum;
                const newDateStr = parts.join("-");
                document.getElementById('dashboardDatePicker').value = newDateStr;
                localStorage.setItem('fap_dashboard_date', newDateStr);
            }
            syncAndProcessAllViews();
        }

        function renderActiveDayCalendarList(scopedArray) {
            const panel = document.getElementById('calendarActiveDayPanel');
            const tbody = document.getElementById('calendarActiveDayTableBody');
            panel.classList.remove('hidden');
            
            const refDateValue = document.getElementById('dashboardDatePicker').value || "2026-06-12";
            const currentYear = refDateValue.split("-")[0];
            const currentMonth = refDateValue.split("-")[1];
            const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

            let dString = activeCalendarDay < 10 ? '0' + activeCalendarDay : activeCalendarDay;
            let dateStr = `${currentYear}-${currentMonth}-${dString}`;
            
            document.getElementById('selectedDateLabel').innerText = `${activeCalendarDay} ${monthNames[parseInt(currentMonth)-1]} ${currentYear}`;

            let dayTasks = scopedArray.filter(t => t.startDate <= dateStr && t.endDate >= dateStr);
            if(dayTasks.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8" class="p-4 text-center text-slate-400">Tidak ada agenda kerja di tanggal terpilih.</td></tr>`;
                return;
            }

            tbody.innerHTML = "";
            dayTasks.forEach(task => {
                let roleBadge = "";
                if(task.roleOwner === 'testing') {
                    roleBadge = `<span class="bg-sky-100 text-sky-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-sky-200">Testing</span>`;
                } else if(task.roleOwner === 'market_support') {
                    roleBadge = `<span class="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">Support</span>`;
                } else {
                    roleBadge = `<span class="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-200">Other</span>`;
                }

                const tr = document.createElement('tr');
                tr.className = "border-b border-slate-100 text-xs text-slate-700";
                tr.innerHTML = `
                    <td class="p-3">${roleBadge}</td>
                    <td class="p-3 font-mono text-sky-600 font-bold">${task.id}</td>
                    <td class="p-3 text-slate-500">${task.cat}</td>
                    <td class="p-3 text-slate-500">${task.unitMenu}</td>
                    <td class="p-3 font-medium text-slate-800">${task.title}</td>
                    <td class="p-3 text-slate-700 font-bold">${task.pic}</td>
                    <td class="p-3"><span class="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200">${task.status}</span></td>
                    <td class="p-3 font-mono font-bold">${task.prog}%</td>
                `;
                tbody.appendChild(tr);
            });
        }

        function triggerAddTaskFromCalendar() {
            if(currentActiveRole === 'merged') return;
            const refDateValue = document.getElementById('dashboardDatePicker').value || "2026-06-12";
            const currentYear = refDateValue.split("-")[0];
            const currentMonth = refDateValue.split("-")[1];
            let dString = activeCalendarDay < 10 ? '0' + activeCalendarDay : activeCalendarDay;
            let fullDateStr = `${currentYear}-${currentMonth}-${dString}`;

            openModal(false);
            document.getElementById('formStartDate').value = fullDateStr;
            document.getElementById('formEndDate').value = fullDateStr;
            calculateDurationForm();
        }

        function getActiveFormRoleScope() {
            if(currentActiveRole === 'merged') {
                const checkedRadio = document.querySelector('input[name="formTargetRole"]:checked');
                return checkedRadio ? checkedRadio.value : 'testing';
            }
            return currentActiveRole;
        }

        function populateFormDropdowns() {
            const activeRole = getActiveFormRoleScope();
            const catSelect = document.getElementById('formCategorySelect');
            catSelect.innerHTML = "";
            let cats = dynamicCategoriesMaster[activeRole] || [];
            cats.forEach(c => catSelect.options.add(new Option(c, c)));

            const unitSelect = document.getElementById('formFormUnitSelect');
            unitSelect.innerHTML = "";
            dynamicUnitsMaster.forEach(u => unitSelect.options.add(new Option(u, u)));
        }

        function addItemCategory() {
            const activeRole = getActiveFormRoleScope();
            let input = document.getElementById('newCategoryInput');
            let val = input.value.trim();
            if(val && !dynamicCategoriesMaster[activeRole].includes(val)) {
                dynamicCategoriesMaster[activeRole].push(val);
                localStorage.setItem('fap_cat_master', JSON.stringify(dynamicCategoriesMaster));
                populateFormDropdowns();
                document.getElementById('formCategorySelect').value = val;
                input.value = "";
            }
        }

        function deleteCurrentCategory() {
            const activeRole = getActiveFormRoleScope();
            let select = document.getElementById('formCategorySelect');
            let targetVal = select.value;
            if(!targetVal) return;
            
            if(confirm(`Hapus kategori "${targetVal}" dari pilihan list?`)) {
                dynamicCategoriesMaster[activeRole] = dynamicCategoriesMaster[activeRole].filter(c => c !== targetVal);
                localStorage.setItem('fap_cat_master', JSON.stringify(dynamicCategoriesMaster));
                populateFormDropdowns();
            }
        }

        function addItemUnit() {
            let input = document.getElementById('newUnitInput');
            let val = input.value.trim();
            if(val && !dynamicUnitsMaster.includes(val)) {
                dynamicUnitsMaster.push(val);
                localStorage.setItem('fap_unit_master', JSON.stringify(dynamicUnitsMaster));
                populateFormDropdowns();
                document.getElementById('formFormUnitSelect').value = val;
                input.value = "";
            }
        }

        function deleteCurrentUnit() {
            let select = document.getElementById('formFormUnitSelect');
            let targetVal = select.value;
            if(!targetVal) return;

            if(confirm(`Hapus Unit "${targetVal}" dari pilihan list?`)) {
                dynamicUnitsMaster = dynamicUnitsMaster.filter(u => u !== targetVal);
                localStorage.setItem('fap_unit_master', JSON.stringify(dynamicUnitsMaster));
                populateFormDropdowns();
            }
        }

        function calculateDurationForm() {
            let sStr = document.getElementById('formStartDate').value;
            let eStr = document.getElementById('formEndDate').value;
            if(sStr && eStr) {
                let diffTime = Math.abs(new Date(eStr) - new Date(sStr));
                let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                document.getElementById('formDurationDisplay').innerText = `${diffDays} Hari`;
            }
        }

        function toggleFileAttachmentSection(progressVal) {
            const section = document.getElementById('fileAttachmentSection');
            if(section) {
                if(parseInt(progressVal) === 100) section.classList.remove('hidden');
                else section.classList.add('hidden');
            }
        }

        const mEl = document.getElementById('taskModal');
        function openModal(isUpdate = false, taskId = '') {
            base64FileString = ""; base64FileName = "";
            document.getElementById('formLocalFileInput').value = "";
            document.getElementById('localFileStatusLabel').classList.add('hidden');
            
            const roleWrapper = document.getElementById('formRoleSelectionWrapper');

            if(isUpdate) {
                document.getElementById('modalMainTitle').innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-amber-500"></i> Update Detail Pekerjaan`;
                roleWrapper.classList.add('hidden');
                
                let task = globalTasksMaster.find(t => t.id === taskId);
                if(task) {
                    document.getElementById('formEditTaskId').value = task.id;
                    document.getElementById('formTitle').value = task.title;
                    document.getElementById('formPic').value = task.pic;
                    document.getElementById('formStartDate').value = task.startDate;
                    document.getElementById('formEndDate').value = task.endDate;
                    document.getElementById('formProgress').value = task.prog;
                    document.getElementById('formFileLink').value = task.fileLink || "";
                    
                    if(task.localFileName) {
                        document.getElementById('localFileStatusLabel').innerText = `📎 File Terikat: ${task.localFileName}`;
                        document.getElementById('localFileStatusLabel').classList.remove('hidden');
                    }

                    if(!dynamicCategoriesMaster[task.roleOwner]) {
                        dynamicCategoriesMaster[task.roleOwner] = [];
                    }
                    if(!dynamicCategoriesMaster[task.roleOwner].includes(task.cat)) {
                        dynamicCategoriesMaster[task.roleOwner].push(task.cat);
                    }
                    if(!dynamicUnitsMaster.includes(task.unitMenu)) {
                        dynamicUnitsMaster.push(task.unitMenu);
                    }

                    document.querySelectorAll('input[name="formTargetRole"]').forEach(r => {
                        r.checked = (r.value === task.roleOwner);
                    });

                    populateFormDropdowns();
                    document.getElementById('formCategorySelect').value = task.cat;
                    document.getElementById('formFormUnitSelect').value = task.unitMenu;

                    document.querySelectorAll(`input[name="priority"]`).forEach(radio => {
                        radio.checked = (radio.value === task.priority);
                    });
                    calculateDurationForm();
                    toggleFileAttachmentSection(task.prog);
                }
            } else {
                document.getElementById('modalMainTitle').innerHTML = `<i data-lucide="file-plus-2" class="w-5 h-5 text-sky-600"></i> Buat Pekerjaan Tugas Baru`;
                
                if(currentActiveRole === 'merged') {
                    roleWrapper.classList.remove('hidden');
                } else {
                    roleWrapper.classList.add('hidden');
                }

                document.getElementById('formEditTaskId').value = "";
                document.getElementById('formTitle').value = "";
                document.getElementById('formPic').value = "";
                document.getElementById('formStartDate').value = document.getElementById('dashboardDatePicker').value || "2026-06-12";
                document.getElementById('formEndDate').value = document.getElementById('dashboardDatePicker').value || "2026-06-12";
                document.getElementById('formProgress').value = "0";
                document.getElementById('formFileLink').value = "";
                
                populateFormDropdowns();
                calculateDurationForm();
                toggleFileAttachmentSection(0);
            }

            mEl.classList.remove('hidden');
            setTimeout(() => { mEl.classList.remove('opacity-0'); mEl.querySelector('div').classList.remove('scale-95'); }, 10);
            lucide.createIcons();
        }

        function closeModal() {
            mEl.classList.add('opacity-0'); mEl.querySelector('div').classList.add('scale-95');
            setTimeout(() => { mEl.classList.add('hidden'); }, 200);
        }

        function determineTaskStatus(progress, endDateStr) {
            if (parseInt(progress) === 100) return "Completed";
            const targetDate = new Date(endDateStr);
            const baseToday = new Date(document.getElementById('dashboardDatePicker').value || "2026-06-12");
            if (targetDate < baseToday) return "Overdue";
            if (parseInt(progress) > 0) return "On Progress";
            return "Not Started";
        }

        function handleFormSubmit(event) {
            event.preventDefault();

            const editId = document.getElementById('formEditTaskId').value;
            const title = document.getElementById('formTitle').value;
            const pic = document.getElementById('formPic').value;
            const category = document.getElementById('formCategorySelect').value;
            const unitVal = document.getElementById('formFormUnitSelect').value;
            const startDate = document.getElementById('formStartDate').value;
            const endDate = document.getElementById('formEndDate').value;
            const progress = parseInt(document.getElementById('formProgress').value);
            const priority = document.querySelector('input[name="priority"]:checked').value;
            const fileLink = document.getElementById('formFileLink').value;
            const targetRole = getActiveFormRoleScope();

            let diffTime = Math.abs(new Date(endDate) - new Date(startDate));
            let durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            let calculatedStatus = determineTaskStatus(progress, endDate);

            if(editId) {
                let task = globalTasksMaster.find(t => t.id === editId);
                if(task) {
                    task.title = title; task.pic = pic; task.cat = category; task.unitMenu = unitVal;
                    task.startDate = startDate; task.endDate = endDate; task.prog = progress;
                    task.priority = priority; task.status = calculatedStatus; task.durationDays = durationDays;
                    task.fileLink = (progress === 100) ? fileLink : "";
                    
                    if (progress === 100 && base64FileString) {
                        task.localFileName = base64FileName;
                        task.localFileData = base64FileString;
                    }
                }
            } else {
                const newCodeId = `TSK-${String(globalTasksMaster.length + 1).padStart(3, '0')}`;
                let newTaskObj = {
                    id: newCodeId,
                    roleOwner: targetRole, 
                    title: title, pic: pic, cat: category, unitMenu: unitVal,
                    startDate: startDate, endDate: endDate, prog: progress, priority: priority,
                    status: calculatedStatus, durationDays: durationDays, fileLink: (progress === 100) ? fileLink : "",
                    localFileName: (progress === 100) ? base64FileName : "",
                    localFileData: (progress === 100) ? base64FileString : ""
                };
                globalTasksMaster.unshift(newTaskObj);
            }

            localStorage.setItem('fap_tasks_db', JSON.stringify(globalTasksMaster));
            closeModal();
            syncAndProcessAllViews();
        }
    </script>
</body>
</html>