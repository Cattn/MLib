function displayAllSongs(isMore) {
  const openRequest = indexedDB.open("songs_db", 2);

  openRequest.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("songs")) {
          db.createObjectStore("songs", {
              keyPath: "name"
          });
      }
  };

  openRequest.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(["songs"], "readonly");
      const objectStore = transaction.objectStore("songs");
      let songName;
      const songsDiv = document.getElementById("songsDiv");
      let i = 0;
      const allSongs = [];
      objectStore.openCursor().onsuccess = function (event) {
          const cursor = event.target.result;
          if (cursor) {
              allSongs.push(cursor.value);
              console.log(allSongs);
              cursor.continue();
          } else {
              const showMoreSongs = function () {
                  displayAllSongs(true);
              };
              const showAllSongsBtn = document.createElement("div");
              showAllSongsBtn.classList.add("show-moreSongs");
              showAllSongsBtn.innerText = "Show All Songs";
              showAllSongsBtn.addEventListener("click", showMoreSongs);
              if (isMore) {
                  songsDiv.innerHTML = "";
                  allSongs.forEach(function (song) {
                      i++;
                      const songDiv = document.createElement("div");
                      songDiv.classList.add("songDiv");
                      if (song.name == "Unknown Title") {
                          songName = song.filename;
                      } else {
                          songName = song.name;
                      }
                      if (song.artist == "Unknown Artist") {
                          song.artist = "";
                      }
                      songDiv.innerHTML = `<img loading="lazy" class="songImage" src="${song.image || '../assets/defaultSong.jpg'}" onclick="playSong('${song.name}'); currentSongIndex = ${i};">
                            <div class="songTitle">${songName}</div>
                            <div class="songArtist">${song.artist || ''}</div>`;
                      songsDiv.appendChild(songDiv);
                  });
              } else {
                  const addSong = function () {
                      i++;
                      const song = allSongs[i - 1];
                      const songDiv = document.createElement("div");
                      songDiv.classList.add("songDiv");
                      if (song.name == "Unknown Title") {
                          songName = song.filename;
                      } else {
                          songName = song.name;
                      }
                      if (song.artist == "Unknown Artist") {
                          song.artist = "";
                      }
                      songDiv.innerHTML = `<img loading="lazy" class="songImage" src="${song.image || '../assets/defaultSong.jpg'}" onclick="playSong('${song.name}'); currentSongIndex = ${i};">
                          <div class="songTitle">${songName}</div>
                          <div class="songArtist">${song.artist || ''}</div>`;
                      songsDiv.appendChild(songDiv);
                      if (i < 14 && i < allSongs.length) {
                          setTimeout(addSong, 0);
                      } else if (allSongs.length > 14) {
                          songsDiv.appendChild(showAllSongsBtn);
                      }
                  };
                  setTimeout(addSong, 0);
              }
          }
      };
  };

  openRequest.onerror = function (event) {
      console.error("IndexedDB error: ", event.target.errorCode);
  };
}



displayAllSongs();




async function openSongsDB() {
  const dbName = "songs_db";
  const dbVersion = 2;

  return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, dbVersion);

      request.onerror = function (event) {
          console.error("IndexedDB error: ", event.target.errorCode);
          reject(event.target.errorCode);
      };

      request.onsuccess = function (event) {
          const db = event.target.result;
          console.log("Database opened successfully");
          resolve(db);
      };
  });
}

function getSong(objectStore, name) {
  return new Promise((resolve, reject) => {
      const request = objectStore.get(name);

      request.onerror = function (event) {
          reject(new Error('Error retrieving song from database'));
      };

      request.onsuccess = function (event) {
          const song = event.target.result;
          if (!song) {
              const error = new Error(`Song '${name}' not found in database`);
              error.name = "SongNotFoundError";
              reject(error);
              return;
          }

          if (song.image) {
              const imageData = song.image;
              const dataUrl = imageData;
              song.image = dataUrl;
          }

          song.data = URL.createObjectURL(new Blob([song.data], {
              type: 'audio/mpeg'
          }));
          resolve(song);
      };
  });
}

function createEventListeners() {
  let menuExpand = document.getElementById("menuExpand");
  let hamburgerMenu = document.getElementById("hamburgerMenu");
  let menuExpanded = document.getElementById("menuExpanded");
  let menuContent = document.getElementById("menuContent");
  let navBar = document.getElementById("nav");
  menuExpand.addEventListener("click", function () {
      if (menuExpanded.classList.contains("menuExpandOpen")) {
          menuExpanded.classList.remove("menuExpandOpen");
          menuExpanded.classList.add("menuExpandClosed");
          menuExpanded.style.height = "";
          menuExpanded.style.width = "";
          menuContent.style.display = "none";
          navBar.style.display = "none";
      } else {
          menuExpanded.classList.remove("menuExpandClosed");
          menuExpanded.classList.add("menuExpandOpen");
          hamburgerMenu.style.height = "";
          hamburgerMenu.style.width = "";
          menuContent.style.display = "block";
          navBar.style.display = "block";
      }
  });
  let nameTitle = document.getElementById("nameTitle");
  if (localStorage.getItem("referredName") === null) {
      nameTitle.innerHTML = "Hello User!";
  } else {
      nameTitle.innerHTML = ("Hello " + localStorage.getItem("referredName") + "!");
  }
}



function resizeGrid() {
  let subheadings = document.getElementsByClassName("subheading");
  if (subheadings[0].style.fontSize === "2vw") {
      // Revert all back to default values
      for (let i = 0; i < subheadings.length; i++) {
          subheadings[i].style.fontSize = "";
      }
      let songTitles = document.getElementsByClassName("song-Title");
      for (let i = 0; i < songTitles.length; i++) {
          songTitles[i].style.display = "";
      }
      let songImages = document.getElementsByClassName("song-image");
      for (let i = 0; i < songImages.length; i++) {
          songImages[i].style.width = "";
          songImages[i].style.height = "";
      }
      let songImage = document.getElementsByClassName("songImage");
      for (let i = 0; i < songImage.length; i++) {
          songImage[i].style.width = "10vw";
          songImage[i].style.height = "10vw";
          songImage[i].style.marginLeft = "";
      }
      // Get all elements with songArtist, songAlbum, songYear and display them
      let songArtist = document.getElementsByClassName("songArtist");
      for (let i = 0; i < songArtist.length; i++) {
          songArtist[i].style.display = "";
      }
      let resizeColor = document.getElementById("resizeColor");
      resizeColor.style.color = "var(--h1-color)";
  } else {
      //For each subheading change font size to 2vw
      for (let i = 0; i < subheadings.length; i++) {
          subheadings[i].style.fontSize = "2vw";
      }
      // Get all elements with the class song-Title and don't display them
      let songTitles = document.getElementsByClassName("song-Title");
      for (let i = 0; i < songTitles.length; i++) {
          songTitles[i].style.display = "none";
      }
      // Get all elements with the class song-Image and change their width to 10vw
      let songImages = document.getElementsByClassName("song-image");
      for (let i = 0; i < songImages.length; i++) {
          songImages[i].style.width = "5vw";
          songImages[i].style.height = "5vw";
      }
      // Get all elements with the name songImage and change their width and height to 4vw
      let songImage = document.getElementsByClassName("songImage");
      for (let i = 0; i < songImage.length; i++) {
          songImage[i].style.width = "4vw";
          songImage[i].style.height = "4vw";
          songImage[i].style.marginLeft = "3vw";
      }

      // Get all elements with songTitle, songArtist, songAlbum, songYear and don't display them
      let songArtist = document.getElementsByClassName("songArtist");
      for (let i = 0; i < songArtist.length; i++) {
          songArtist[i].style.display = "none";
      }
      let resizeColor = document.getElementById("resizeColor");
      resizeColor.style.color = "var(--media-icon-color)";
  }


}

function showAlbums() {
  const openRequest = indexedDB.open("songs_db", 2);
  openRequest.onerror = (event) => {
      console.log("Failed to open database");
  };
  openRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("songs", "readonly");
      const objectStore = transaction.objectStore("songs");


      request.onsuccess = (event) => {
          const songs = event.target.result;
          const albumCounts = {};

          songs.forEach((song) => {
              const album = song.album;
              if (album) {
                  if (albumCounts[album]) {
                      albumCounts[album]++;
                  } else {
                      albumCounts[album] = 1;
                  }
              }
          });

          const albums = Object.keys(albumCounts).filter(
              (album) => albumCounts[album] > 1
          );

          const albumList = document.getElementById("albumsDiv");
          albumList.innerHTML = "";

          albums.forEach((album) => {
              const albumDiv = document.createElement("div");
              albumDiv.classList.add("album");

              const albumArt = document.createElement("img");
              albumArt.classList.add("album-art");
              albumArt.src = songs.find((song) => song.album === album).image;
              // Add onclick that will link to albuminfo.html with query of ?album=albumName
              albumArt.onclick = () => {
                  let baseUrl = location.href.replace(/\/index\.html$/, '');
                  let url = baseUrl + "/albuminfo.html?album=" + album;
                  const {
                      parent
                  } = xen;
                  parent.send('openNewWindow', "MLib Album View", url);
                  console.log('sender')
              };

              const albumName = document.createElement("p");
              albumName.classList.add("album-name");
              albumName.textContent = album;

              albumDiv.appendChild(albumArt);
              albumDiv.appendChild(albumName);

              albumList.appendChild(albumDiv);
          });
      };

      request.onerror = (event) => {
          console.log("Failed to get songs");
      };
  };
}

showAlbums();


function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {
      type: mimeString
  });
  return blob;

}

function autoSetXenBg() {
  console.log("workeded")
  var autoChange = localStorage.getItem('autoXenBg');
  console.log(autoChange);
  if (autoChange == "on") {
      setXenBg();
  }
}

function setXenBg() {
  const {
      parent
  } = xen;
  let currentBg = localStorage.getItem("songArt");
  let bgSet = dataURItoBlob(currentBg);
  let url = URL.createObjectURL(bgSet)
  parent.send('albumBg', url);
}

function sendXenNoti() {
  const {
      parent
  } = xen;
  var songTitle = localStorage.getItem('songTitle')
  var songArt = localStorage.getItem('songArt');
  var artist = localStorage.getItem('songArtist')
  parent.send('notiSend', songTitle, songArt, artist);
}

function autoSendNoti() {
  var notiSend = localStorage.getItem('autoNotiSend');
  if (notiSend == "on") {
      sendXenNoti();
  }
}