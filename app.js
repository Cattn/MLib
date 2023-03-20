const { BrowserWindow } = xen;

const win = new BrowserWindow({
  width: 1200,
  height: 600,
  show: true,
  alwaysOnTop: false,
  frame: true,
  dragableClass: "dragable"
});

win.loadFile('/index.html');

win.on('albumBg', function(data) {
  // if data is blob url

  win.requestModifySetting('customBackdrop', data);
})

win.on('notiSend', function(songName, songArt, songArtist) {
win.requestDispatchNotification(
	"Now playing",
	`${songName} - ${songArtist}`,
  songArt,
);
 
  setTimeout(function () {
      console.log("retracting")
      win.retractNotification("Now playing");
    }, 5000);
});
win.on('openNewWindow', function(name, loc) {
  console.log('oncall')
  win.openNewWindow(name, loc)
})
console.log('Mlib Loaded.')