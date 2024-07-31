const presence = new Presence({
		clientId: "626481021843669044",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

const enum Assets {
	Logo = "https://cdn.rcd.gg/PreMiD/websites/B/Bukkit/assets/logo.png",
}
presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: Assets.Logo,
			startTimestamp: browsingTimestamp,
		},
		{ pathname, href } = document.location,
		search = document.querySelector<HTMLInputElement>(".b-search-input")?.value;

	switch (true) {
		case !!search: {
			presenceData.details = "Searching for:";
			presenceData.state = search;
			presenceData.smallImageKey = Assets.Search;
			break;
		}
		case pathname === "/": {
			presenceData.details = "Viewing the homepage";
			break;
		}
		case pathname.includes("projects"): {
			presenceData.details = "Viewing project";
			presenceData.state =
				document.querySelector(".project-title")?.textContent;
			presenceData.buttons = [{ label: "View Project", url: href }];
			presenceData.largeImageKey =
				document
					.querySelector(".e-avatar64.lightbox")
					?.querySelector<HTMLImageElement>("img")?.src ?? Assets.Logo;
		}
	}

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
