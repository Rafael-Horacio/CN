const playlistInput = document.getElementById("playlistInput");
const addPlaylistBtn = document.getElementById("addPlaylistBtn");
const channelInput = document.getElementById("channelInput");
const uploadFileBtn = document.getElementById("uploadFileBtn");
const fileInput = document.getElementById("fileInput");
const playlistMenu = document.getElementById("playlistMenu");
const channelNameDisplay =
    document.getElementById("channelNameDisplay");
const playlists = [];
let currentIndex = 0;

const videoPlayer = videojs("videoPlayer", {
    autoplay: true,
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
    channelNameDisplay.textContent = playlists[currentIndex].name;
    updateActivePlaylistItem();
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
                    throw new Error(
                        `HTTP error! status: ${response.status}`,
                    );
                }
                return response.text();
            })
            .then((data) => {
                // Dividir a lista de reprodução em vários canais
                const lines = data
                    .split("\n")
                    .filter((line) =>
                        line.trim().startsWith("http"),
                    );
                console.log("Lista de canais adicionada:");
                lines.forEach((line, index) => {
                    const channelUrl = line.trim();
                    const channelName = name + (index +
                    1); // Adicionar um número para diferenciar os canais
                    playlists.push({
                        url: channelUrl,
                        name: channelName,
                    });
                    console.log(`${channelName}: ${channelUrl}`);
                    const listItem = document.createElement("li");
                    listItem.className = "list-group-item";
                    listItem.innerHTML = `<i class="fas fa-tv mx-2"></i>${channelName}`;
                    listItem.addEventListener("click", () =>
                        playVideo(
                            playlists.length - lines.length + index,
                        ),
                    );
                    playlistMenu.appendChild(listItem);
                    // Se a lista estava vazia, começar a reprodução do primeiro vídeo
                    if (playlists.length === lines.length) {
                        playVideo(playlists.length - lines.length);
                    }
                });
            })
            .catch((error) => {
                console.error(
                    "Erro ao carregar lista de reprodução:",
                    error,
                );
                alert(
                    `Erro ao carregar lista de reprodução: ${error.message}`,
                );
            });
    }
}

function addChannel(url, name) {
    // Verifica se a URL contém "?"
    const queryStringIndex = url.indexOf('?');
    // Se "?"" for encontrado, corta a URL até esse ponto
    const cleanedUrl = queryStringIndex !== -1 ? url.substring(0, queryStringIndex) : url;

    if (cleanedUrl !== "") {
        playlists.push({
            url: cleanedUrl,
            name,
        });

        const index = playlists.length - 1;
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.innerHTML = `<i class="fas fa-tv mx-2"></i>${name}`;
        listItem.addEventListener("click", () => playVideo(index));
        playlistMenu.appendChild(listItem);

        // Se a lista estava vazia, começar a reprodução do primeiro vídeo
        if (playlists.length === 1) {
            playVideo(0);
        }
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
    // Avança para o próximo vídeo quando o atual termina
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
    currentIndex =
        (currentIndex - 1 + playlists.length) % playlists.length;
    playVideo(currentIndex);
});

const clearPlaylistBtn =
    document.getElementById("clearPlaylistBtn");

clearPlaylistBtn.addEventListener("click", () => {
    playlists.length = 0; // Limpa a lista de reprodução
    playlistMenu.innerHTML = ""; // Remove todos os itens do menu
    videoPlayer.pause(); // Pausa o vídeo atual, se estiver reproduzindo
    channelNameDisplay.textContent = ""; // Limpa o nome do canal exibido
});