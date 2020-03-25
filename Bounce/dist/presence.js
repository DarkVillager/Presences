var presence = new Presence({clientId: "545248528750870530"});
let sartist, strack, slisteners, sdj;
setInterval(newStats, 5000)
newStats();

async function newStats() {
  let data = await window.fetch("https://wearebounce.net/api/?request=stats").then(res => res.json());
  strack = data.song.track;
  sartist = data.song.artist;
  sdj = data.presenter.name;
  slisteners = data.listeners.unique;
}

let info = {};
info.largeImageKey = "bouncelogo";
info.startTimestamp = Math.floor(Date.now() / 1000);

presence.on("UpdateData", () => {
    info.details = `Streaming to ${slisteners} listeners`;
    info.state = `${strack} - ${sartist}`;
    info.smallImageText = `${sdj} is live!`;
    if(sdj.toLowerCase() !== "autodj") {info.smallImageKey = "bouncelive"} else {info.smallImageKey = ""};
    presence.setActivity(info);
});
