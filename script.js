const playlistInput = document.getElementById("playlistInput");
const addPlaylistBtn = document.getElementById("addPlaylistBtn");
const channelInput = document.getElementById("channelInput");
const uploadFileBtn = document.getElementById("uploadFileBtn");
const fileInput = document.getElementById("fileInput");
const playlistMenu = document.getElementById("playlistMenu");
const channelNameDisplay = document.getElementById("channelNameDisplay");
const playlists = [];
let currentIndex = 0;

const videoPlayer = videojs("videoPlayer", {
    controls: true,
});

function playVideo(index) {
    currentIndex = index;
    const url = playlists[currentIndex].url;
    let type;

    if (url.endsWith(".m3u8")) {
        type = "application/x-mpegURL";
    } else if (url.endsWith(".mp4")) {
        type = "video/mp4";
    } else if (url.endsWith(".webm")) {
        type = "video/webm";
    } else if (url.endsWith(".ogv")) {
        type = "video/ogg";
    } else {
        console.warn("Formato não suportado: " + url);
        return;
    }

    console.log("URL do vídeo:", url);
    console.log("Tipo MIME:", type);

    videoPlayer.src({
        src: url,
        type: type,
    });

    channelNameDisplay.classList.remove("hidden");
    
    channelNameDisplay.textContent = playlists[currentIndex].name;
    updateActivePlaylistItem();
    videoPlayer.play(); // Auto play quando um canal é selecionado
}

document.addEventListener("DOMContentLoaded", () => {
    const videoPlayer = videojs("videoPlayer", {
        autoplay: true,
        controls: true,
    });

    //URL para teste
    addChannel(
        "https://bal02.vivartec.com.br:8088/hls/livechannel1.m3u8",
        "JOGO 01",
    );
    addChannel(
        "https://bal01.vivartec.com.br:8088/hls/livechannel2.m3u8",
        "JOGO 02",
    );

    addChannel(
        "https://bal02.vivartec.com.br:8088/hls/livechannel3.m3u8",
        "JOGO 03",
    );

    addChannel(
        "https://bal02.vivartec.com.br:8088/hls/livechannel4.m3u8",
        "JOGO 04",
    );

    addChannel(
        "https://bal02.vivartec.com.br:8088/hls/livechannel5.m3u8",
        "JOGO 05",
    );

    addChannel(
        "https://brflu.walk-tv.com/5756/tracks-v1a1/mono.m3u8",
        "Globo RJ",
    );
    addChannel(
        "https://cdn-1.nxplay.com.br/RECORD_PAULISTA_PFZ_NXPLAY_01/tracks-v1a1/mono.m3u8",
        "Record SP",
    );
    addChannel(
        "https://cdn.jmvstream.com/w/LVW-10801/LVW10801_Xvg4R0u57n/playlist.m3u8",
        "SBT SP",
    );
    addChannel(
        "https://brflu.walk-tv.com/5815/index.m3u8",
        "History",
    );
    addChannel(
        "https://cdn-3.nxplay.com.br/GLOBO_SP_TK/index.m3u8",
        "Globo SP",
    );
    addChannel(
        "https://brflu.walk-tv.com/5932/tracks-v1a1/mono.m3u8",
        "Sportv",
    );
    addChannel(
        "https://brflu.walk-tv.com/5931/tracks-v1a1/mono.m3u8",
        "Sportv 2",
    );
    addChannel(
        "https://brflu.walk-tv.com/5901/tracks-v1a1/mono.m3u8",
        "Telecine Fun"
    );
    addChannel(
        "https://cdn-3.nxplay.com.br/ESPN_2/index.m3u8",
        "Espn 2"

    );
    addChannel(
        "https://brflu.walk-tv.com/5912/tracks-v1a1/mono.m3u8",
        "Espn BR"
    );
    addChannel(
        "https://brflu.walk-tv.com/5928/tracks-v1a1/mono.m3u8",
        "Band Sports"
    );
    addChannel(
        "https://cdn-3.nxplay.com.br/TNT/index.m3u8",
        "TNT"
    );
});


function updateActivePlaylistItem() {
    const items = playlistMenu.querySelectorAll("li");
    items.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

function addPlaylist(url, name) {
    if (url !== "") {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then((data) => {
                const lines = data.split("\n").filter((line) => line.trim().startsWith("http"));
                console.log("Lista de canais adicionada:");
                lines.forEach((line, index) => {
                    const channelUrl = line.trim();
                    const channelName = name + (index + 1);
                    playlists.push({ url: channelUrl, name: channelName });
                    console.log(`${channelName}: ${channelUrl}`);
                    const listItem = document.createElement("li");
                    listItem.className = "list-group-item";
                    listItem.innerHTML = `<i class="fas fa-tv mx-2"></i>${channelName}`;
                    listItem.addEventListener("click", () => playVideo(playlists.length - lines.length + index));
                    playlistMenu.appendChild(listItem);
                });
            })
            .catch((error) => {
                console.error("Erro ao carregar lista de reprodução:", error);
                alert(`Erro ao carregar lista de reprodução: ${error.message}`);
            });
    }
}

function addChannel(url, name) {
    const queryStringIndex = url.indexOf('?');
    const cleanedUrl = queryStringIndex !== -1 ? url.substring(0, queryStringIndex) : url;

    if (cleanedUrl !== "") {
        playlists.push({ url: cleanedUrl, name });

        const index = playlists.length - 1;
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.innerHTML = `<i class="fas fa-tv mx-2"></i>${name}`;
        listItem.addEventListener("click", () => playVideo(index));
        playlistMenu.appendChild(listItem);
    }
}

function handleFileInput(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        const playlist = reader.result;
        const lines = playlist.split("\n");
        let currentName = "";
        lines.forEach((line) => {
            if (line.trim().startsWith("#EXTINF")) {
                currentName = line.split(",")[1].trim();
            } else if (line.trim().startsWith("http")) {
                addChannel(line.trim(), currentName);
            }
        });
    };
    reader.readAsText(file);
}

addPlaylistBtn.addEventListener("click", () => {
    const playlistUrl = playlistInput.value.trim();
    if (playlistUrl !== "") {
        addPlaylist(playlistUrl, "Canal ");
        playlistInput.value = "";
    }
});

addChannelBtn.addEventListener("click", () => {
    const channelUrl = channelInput.value.trim();
    if (channelUrl !== "") {
        addChannel(channelUrl, "Canal ");
        channelInput.value = "";
    }
});
uploadFileBtn.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", handleFileInput);

videoPlayer.on("ended", () => {
    currentIndex = (currentIndex + 1) % playlists.length;
    playVideo(currentIndex);
});

const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

playBtn.addEventListener("click", () => {
    videoPlayer.play();
});

pauseBtn.addEventListener("click", () => {
    videoPlayer.pause();
});

stopBtn.addEventListener("click", () => {
    videoPlayer.pause();
    videoPlayer.currentTime(0);
});

nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % playlists.length;
    playVideo(currentIndex);
});
prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + playlists.length) % playlists.length;
    playVideo(currentIndex);
});

const clearPlaylistBtn = document.getElementById("clearPlaylistBtn");

clearPlaylistBtn.addEventListener("click", () => {
    playlists.length = 0;
    playlistMenu.innerHTML = "";
    videoPlayer.pause();
    channelNameDisplay.textContent = "";
});


let keyPressed = ''; // Armazena as teclas pressionadas

document.addEventListener("keydown", function(event) {
    const key = event.key;

    // Se a tecla pressionada for um número válido, adicione-a à string de teclas pressionadas
    if (!isNaN(key)) {
        keyPressed += key;

        // Mostra o número do canal na tela
        channelNameDisplay.textContent = keyPressed;
        
        // Define um tempo limite para aguardar a entrada do próximo dígito
        setTimeout(() => {
            const index = parseInt(keyPressed) - 1; // Converte a string para um índice (subtraindo 1 porque os índices começam em 0)
        
            if (!isNaN(index) && index >= 0 && index < playlists.length) {
                playVideo(index);
            }

            // Limpa a string de teclas pressionadas para permitir novas entradas
            keyPressed = '';

            // Limpa o número do canal exibido na tela após um curto período
            setTimeout(() => {
                channelNameDisplay.textContent = playlists[currentIndex].name;
            }, 1000);
        }, 1000); // Tempo limite de 1 segundo
    }
});




