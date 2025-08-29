# PC Info App

A Electron-based application that displays detailed computer hardware and system information.

## Features

- **System Overview**: Manufacturer, model, version, serial number, and UUID
- **CPU Information**: Brand, model, cores, speed, architecture, cache details, and real-time load
- **Memory Information**: Total/used/available RAM with usage percentage and detailed module information
- **Operating System**: Platform, distribution, kernel, and architecture details
- **Graphics Cards**: GPU models, VRAM, drivers, and vendor information
- **Storage Devices**: Disk types, sizes, interfaces, and real-time usage statistics
- **Motherboard**: Manufacturer, model, and version details
- **Network Interfaces**: Speed, MAC addresses, and IP information

> Work in progress in some of the features

## Installation & Usage

### Development Mode
```bash
npm install
npm start
```

### Building the Application

```bash
# Using electron-packager 
npm run package

# The executable will be created in: release/pc-info-app-win32-x64/pc-info-app.exe
```

### Running the Built Application
Navigate to `release/pc-info-app-win32-x64/` and double-click `pc-info-app.exe` to run the application.

## Technical Details

- Built with Electron v27
- Uses `systeminformation` library for hardware data collection
- Secure IPC communication between main and renderer processes
- Context isolation enabled for security
- Real-time data refresh capability

## System Requirements

- Windows 10 or later (64-bit)
- Administrator privileges may be required for some hardware information

## Troubleshooting

If you encounter permissions issues when building with electron-builder, use the electron-packager method instead:
```bash
npm run package
```

This creates a portable executable without code signing requirements.

## Development

The application consists of:
- `main.js` - Main Electron process
- `preload.js` - Secure IPC bridge
- `index.html` - UI structure
- `renderer.js` - Frontend logic and data display
- `styles.css` - Modern styling and responsive design

