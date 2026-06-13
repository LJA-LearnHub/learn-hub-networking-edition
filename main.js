const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
let updateCheckStarted = false;
let updateRetryCount = 0;
const MAX_UPDATE_RETRIES = 3;
const UPDATE_RETRY_DELAY_MS = 5 * 60 * 1000;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    icon: path.join(__dirname, "build", "icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, "index.html"));
  win.webContents.on("did-finish-load", () => {
    const appVersion = app.getVersion();
    win.webContents
      .executeJavaScript(
        `window.dispatchEvent(new CustomEvent("learn-hub-version", { detail: ${JSON.stringify(appVersion)} }));`,
        true
      )
      .catch(() => {});
  });
}

function setupAutoUpdates() {
  if (!app.isPackaged || updateCheckStarted) {
    return;
  }
  updateCheckStarted = true;

  autoUpdater.autoDownload = false;

  autoUpdater.on("error", (error) => {
    const message = error == null ? "" : error.message;
    console.error("Auto-update error:", message);
    if (updateRetryCount < MAX_UPDATE_RETRIES) {
      updateRetryCount += 1;
      setTimeout(() => {
        autoUpdater.checkForUpdates().catch(() => {});
      }, UPDATE_RETRY_DELAY_MS);
    }
  });

  autoUpdater.on("update-available", async (info) => {
    updateRetryCount = 0;
    const result = await dialog.showMessageBox({
      type: "info",
      buttons: ["Download", "Later"],
      defaultId: 0,
      cancelId: 1,
      title: "Update available",
      message: `Version ${info.version} is available.`,
      detail: "Download and install the latest version now?",
    });

    if (result.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on("update-downloaded", async () => {
    updateRetryCount = 0;
    const result = await dialog.showMessageBox({
      type: "info",
      buttons: ["Restart now", "Later"],
      defaultId: 0,
      cancelId: 1,
      title: "Update ready",
      message: "The update has been downloaded.",
      detail: "Restart the app to install the update.",
    });

    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });

  autoUpdater.checkForUpdates();
}

app.whenReady().then(() => {
  createWindow();
  setupAutoUpdates();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
