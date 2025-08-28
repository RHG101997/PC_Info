let systemData = {};
let dynamicData = {};

async function loadSystemInfo() {
    showLoading(true);
    
    try {
        const [sysInfo, dynInfo] = await Promise.all([
            window.electronAPI.getSystemInfo(),
            window.electronAPI.getDynamicInfo()
        ]);
        
        systemData = sysInfo;
        dynamicData = dynInfo;
        
        displaySystemInfo();
        showLoading(false);
    } catch (error) {
        console.error('Error loading system info:', error);
        showError('Failed to load system information');
        showLoading(false);
    }
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    const tabContainer = document.getElementById('tab-container');
    
    if (show) {
        loading.style.display = 'flex';
        tabContainer.style.display = 'none';
    } else {
        loading.style.display = 'none';
        tabContainer.style.display = 'block';
    }
}

function showError(message) {
    const loading = document.getElementById('loading');
    loading.innerHTML = `<div class="error">${message}</div>`;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatFrequency(hz) {
    if (!hz) return 'N/A';
    return (hz / 1000000000).toFixed(2) + ' GHz';
}

function displaySystemInfo() {
    if (systemData.error) {
        showError(systemData.error);
        return;
    }

    displaySystemOverview();
    displayCPUInfo();
    displayMemoryInfo();
    displayOSInfo();
    displayGraphicsInfo();
    displayStorageInfo();
    displayMotherboardInfo();
    displayNetworkInfo();
    displayCPULoadInfo();
    displayMemoryUsageInfo();
    displayDiskUsageInfo();
    displayProcessesInfo();
}

function displaySystemOverview() {
    const container = document.getElementById('system-info');
    const system = systemData.system || {};
    
    container.innerHTML = `
        <div class="info-item"><strong>Manufacturer:</strong> ${system.manufacturer || 'N/A'}</div>
        <div class="info-item"><strong>Model:</strong> ${system.model || 'N/A'}</div>
        <div class="info-item"><strong>Version:</strong> ${system.version || 'N/A'}</div>
        <div class="info-item"><strong>Serial:</strong> ${system.serial || 'N/A'}</div>
        <div class="info-item"><strong>UUID:</strong> ${system.uuid || 'N/A'}</div>
    `;
}

function displayCPUInfo() {
    const container = document.getElementById('cpu-info');
    const cpu = systemData.cpu || {};
    
    container.innerHTML = `
        <div class="info-item"><strong>Brand:</strong> ${cpu.brand || 'N/A'}</div>
        <div class="info-item"><strong>Manufacturer:</strong> ${cpu.manufacturer || 'N/A'}</div>
        <div class="info-item"><strong>Family:</strong> ${cpu.family || 'N/A'}</div>
        <div class="info-item"><strong>Model:</strong> ${cpu.model || 'N/A'}</div>
        <div class="info-item"><strong>Speed:</strong> ${formatFrequency(cpu.speed * 1000000)}</div>
        <div class="info-item"><strong>Cores:</strong> ${cpu.cores || 'N/A'}</div>
        <div class="info-item"><strong>Physical Cores:</strong> ${cpu.physicalCores || 'N/A'}</div>
        <div class="info-item"><strong>Processors:</strong> ${cpu.processors || 'N/A'}</div>
        <div class="info-item"><strong>Socket:</strong> ${cpu.socket || 'N/A'}</div>
        <div class="info-item"><strong>Architecture:</strong> ${cpu.arch || 'N/A'}</div>
        <div class="info-item"><strong>Cache L1D:</strong> ${cpu.cache ? formatBytes(cpu.cache.l1d) : 'N/A'}</div>
        <div class="info-item"><strong>Cache L1I:</strong> ${cpu.cache ? formatBytes(cpu.cache.l1i) : 'N/A'}</div>
        <div class="info-item"><strong>Cache L2:</strong> ${cpu.cache ? formatBytes(cpu.cache.l2) : 'N/A'}</div>
        <div class="info-item"><strong>Cache L3:</strong> ${cpu.cache ? formatBytes(cpu.cache.l3) : 'N/A'}</div>
    `;
}

function displayMemoryInfo() {
    const container = document.getElementById('memory-info');
    const mem = systemData.memory || {};
    
    container.innerHTML = `
        <div class="info-item"><strong>Total:</strong> ${formatBytes(mem.total)}</div>
        <div class="info-item"><strong>Free:</strong> ${formatBytes(mem.free)}</div>
        <div class="info-item"><strong>Used:</strong> ${formatBytes(mem.used)}</div>
        <div class="info-item"><strong>Available:</strong> ${formatBytes(mem.available)}</div>
        <div class="info-item"><strong>Usage:</strong> ${((mem.used / mem.total) * 100).toFixed(1)}%</div>
    `;
}

function displayOSInfo() {
    const container = document.getElementById('os-info');
    const os = systemData.os || {};
    
    container.innerHTML = `
        <div class="info-item"><strong>Platform:</strong> ${os.platform || 'N/A'}</div>
        <div class="info-item"><strong>Distribution:</strong> ${os.distro || 'N/A'}</div>
        <div class="info-item"><strong>Release:</strong> ${os.release || 'N/A'}</div>
        <div class="info-item"><strong>Codename:</strong> ${os.codename || 'N/A'}</div>
        <div class="info-item"><strong>Kernel:</strong> ${os.kernel || 'N/A'}</div>
        <div class="info-item"><strong>Architecture:</strong> ${os.arch || 'N/A'}</div>
        <div class="info-item"><strong>Hostname:</strong> ${os.hostname || 'N/A'}</div>
    `;
}

function displayGraphicsInfo() {
    const container = document.getElementById('graphics-info');
    const graphics = systemData.graphics || {};
    
    if (graphics.controllers && graphics.controllers.length > 0) {
        let html = '';
        graphics.controllers.forEach((gpu, index) => {
            html += `
                <div class="gpu-item">
                    <h4>GPU ${index + 1}</h4>
                    <div class="info-item"><strong>Model:</strong> ${gpu.model || 'N/A'}</div>
                    <div class="info-item"><strong>Vendor:</strong> ${gpu.vendor || 'N/A'}</div>
                    <div class="info-item"><strong>VRAM:</strong> ${gpu.vram ? formatBytes(gpu.vram * 1024 * 1024) : 'N/A'}</div>
                    <div class="info-item"><strong>Bus:</strong> ${gpu.bus || 'N/A'}</div>
                    <div class="info-item"><strong>Driver Version:</strong> ${gpu.driverVersion || 'N/A'}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    } else {
        container.innerHTML = '<div class="info-item">No graphics information available</div>';
    }
}

function displayStorageInfo() {
    const container = document.getElementById('storage-info');
    const storage = systemData.storage || [];
    
    if (storage.length > 0) {
        let html = '';
        storage.forEach((disk, index) => {
            html += `
                <div class="disk-item">
                    <h4>Disk ${index + 1}</h4>
                    <div class="info-item"><strong>Name:</strong> ${disk.name || 'N/A'}</div>
                    <div class="info-item"><strong>Type:</strong> ${disk.type || 'N/A'}</div>
                    <div class="info-item"><strong>Size:</strong> ${formatBytes(disk.size)}</div>
                    <div class="info-item"><strong>Interface Type:</strong> ${disk.interfaceType || 'N/A'}</div>
                    <div class="info-item"><strong>Vendor:</strong> ${disk.vendor || 'N/A'}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    } else {
        container.innerHTML = '<div class="info-item">No storage information available</div>';
    }
}

function displayMotherboardInfo() {
    const container = document.getElementById('motherboard-info');
    const mb = systemData.motherboard || {};
    
    container.innerHTML = `
        <div class="info-item"><strong>Manufacturer:</strong> ${mb.manufacturer || 'N/A'}</div>
        <div class="info-item"><strong>Model:</strong> ${mb.model || 'N/A'}</div>
        <div class="info-item"><strong>Version:</strong> ${mb.version || 'N/A'}</div>
        <div class="info-item"><strong>Serial:</strong> ${mb.serial || 'N/A'}</div>
        <div class="info-item"><strong>Asset Tag:</strong> ${mb.assetTag || 'N/A'}</div>
    `;
}

function displayNetworkInfo() {
    const container = document.getElementById('network-info');
    const network = systemData.network || [];
    
    if (network.length > 0) {
        let html = '';
        network.forEach((iface, index) => {
            if (!iface.internal) {
                html += `
                    <div class="network-item">
                        <h4>${iface.iface}</h4>
                        <div class="info-item"><strong>Type:</strong> ${iface.type || 'N/A'}</div>
                        <div class="info-item"><strong>Speed:</strong> ${iface.speed ? iface.speed + ' Mbps' : 'N/A'}</div>
                        <div class="info-item"><strong>MAC:</strong> ${iface.mac || 'N/A'}</div>
                        <div class="info-item"><strong>IP4:</strong> ${iface.ip4 || 'N/A'}</div>
                        <div class="info-item"><strong>IP6:</strong> ${iface.ip6 || 'N/A'}</div>
                    </div>
                `;
            }
        });
        container.innerHTML = html || '<div class="info-item">No network interfaces found</div>';
    } else {
        container.innerHTML = '<div class="info-item">No network information available</div>';
    }
}

function displayCPULoadInfo() {
    const container = document.getElementById('cpu-load-info');
    const cpuLoad = dynamicData.cpuLoad || {};
    const temp = dynamicData.temperature || {};
    
    container.innerHTML = `
        <div class="info-item"><strong>Current Load:</strong> ${cpuLoad.currentLoad ? cpuLoad.currentLoad.toFixed(1) + '%' : 'N/A'}</div>
        <div class="info-item"><strong>User Load:</strong> ${cpuLoad.currentLoadUser ? cpuLoad.currentLoadUser.toFixed(1) + '%' : 'N/A'}</div>
        <div class="info-item"><strong>System Load:</strong> ${cpuLoad.currentLoadSystem ? cpuLoad.currentLoadSystem.toFixed(1) + '%' : 'N/A'}</div>
        <div class="info-item"><strong>CPU Temperature:</strong> ${temp.main ? temp.main + '°C' : 'N/A'}</div>
        <div class="info-item"><strong>Max Temperature:</strong> ${temp.max ? temp.max + '°C' : 'N/A'}</div>
    `;
}

function displayMemoryUsageInfo() {
    const container = document.getElementById('memory-usage-info');
    const memLayout = dynamicData.memLayout || [];
    
    if (memLayout.length > 0) {
        let html = '';
        memLayout.forEach((mem, index) => {
            html += `
                <div class="memory-module">
                    <h4>Memory Module ${index + 1}</h4>
                    <div class="info-item"><strong>Size:</strong> ${formatBytes(mem.size)}</div>
                    <div class="info-item"><strong>Type:</strong> ${mem.type || 'N/A'}</div>
                    <div class="info-item"><strong>Speed:</strong> ${mem.clockSpeed ? mem.clockSpeed + ' MHz' : 'N/A'}</div>
                    <div class="info-item"><strong>Manufacturer:</strong> ${mem.manufacturer || 'N/A'}</div>
                    <div class="info-item"><strong>Part Number:</strong> ${mem.partNum || 'N/A'}</div>
                    <div class="info-item"><strong>Bank:</strong> ${mem.bank || 'N/A'}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    } else {
        container.innerHTML = '<div class="info-item">No memory module information available</div>';
    }
}

function displayDiskUsageInfo() {
    const container = document.getElementById('disk-usage-info');
    const diskUsage = dynamicData.diskUsage || [];
    
    if (diskUsage.length > 0) {
        let html = '';
        diskUsage.forEach((disk) => {
            const usedPercent = ((disk.used / disk.size) * 100).toFixed(1);
            html += `
                <div class="disk-usage-item">
                    <h4>${disk.fs}</h4>
                    <div class="info-item"><strong>Mount:</strong> ${disk.mount || 'N/A'}</div>
                    <div class="info-item"><strong>Type:</strong> ${disk.type || 'N/A'}</div>
                    <div class="info-item"><strong>Size:</strong> ${formatBytes(disk.size)}</div>
                    <div class="info-item"><strong>Used:</strong> ${formatBytes(disk.used)} (${usedPercent}%)</div>
                    <div class="info-item"><strong>Available:</strong> ${formatBytes(disk.available)}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${usedPercent}%"></div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    } else {
        container.innerHTML = '<div class="info-item">No disk usage information available</div>';
    }
}

function displayProcessesInfo() {
    const container = document.getElementById('processes-info');
    const processes = dynamicData.processes || [];
    
    if (processes.length > 0) {
        let html = '<div class="processes-table">';
        html += '<div class="process-header"><span>Name</span><span>CPU%</span><span>Memory</span></div>';
        
        processes.forEach((proc) => {
            html += `
                <div class="process-row">
                    <span class="process-name">${proc.name || 'N/A'}</span>
                    <span class="process-cpu">${proc.cpu ? proc.cpu.toFixed(1) + '%' : '0%'}</span>
                    <span class="process-mem">${formatBytes(proc.mem * 1024)}</span>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    } else {
        container.innerHTML = '<div class="info-item">No process information available</div>';
    }
}

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });
}

document.getElementById('refresh-btn').addEventListener('click', loadSystemInfo);

document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    loadSystemInfo();
});