import { app as o, BrowserWindow as t } from "electron";
o.whenReady().then(() => {
  let e = new t({
    width: 800,
    height: 600,
    resizable: !0,
    title: "Sonora Lab",
    webPreferences: {
      nodeIntegration: !0,
      contextIsolation: !1
    }
  });
  e.loadURL(process.env.VITE_DEV_SERVER_URL), e.webContents.openDevTools();
});
