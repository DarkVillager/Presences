const presence = new Presence({
		clientId: "762522704128901131",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

presence.on("UpdateData", async () => {
	let presenceData: PresenceData = {
		largeImageKey: "https://cdn.rcd.gg/PreMiD/websites/M/MEGA/assets/logo.png",
		startTimestamp: browsingTimestamp,
	};
	const [privacy, buttons] = await Promise.all([
			presence.getSetting<boolean>("privacy"),
			presence.getSetting<boolean>("buttons"),
		]),
		{ pathname, hostname, href } = document.location,
		ioStaticPages: Record<string, PresenceData> = {
			"/": {
				details: "Viewing the homepage",
			},
			"/business": {
				details: privacy
					? "Viewing a page"
					: "Viewing MEGA's business solutions",
			},
			"/bug-bounty": {
				details: privacy
					? "Viewing a page"
					: "Viewing MEGA's bug bountry program",
			},
			"/contact": {
				details: privacy ? "Viewing a page" : "Viewing MEGA's contact page",
			},
			"/pricing": {
				details: "Viewing pricing",
			},
			"/storage": {
				details: privacy ? "Viewing a product" : "Viewing product",
				state: "Storage",
				buttons: [
					{
						label: "View Product",
						url: href,
					},
				],
			},
			"/chatandmeetings": {
				details: privacy ? "Viewing a product" : "Viewing product",
				state: "Chat and meetings",
				buttons: [
					{
						label: "View Product",
						url: href,
					},
				],
			},
			"/syncing": {
				details: privacy ? "Viewing a product" : "Viewing product",
				state: "Syncing",
				buttons: [
					{
						label: "View Product",
						url: href,
					},
				],
			},
			"/megabackup": {
				details: privacy ? "Viewing a product" : "Viewing product",
				state: "Backups",
				buttons: [
					{
						label: "View Product",
						url: href,
					},
				],
			},
			"/share": {
				details: privacy ? "Viewing a product" : "Viewing product",
				state: "Sharing",
				buttons: [
					{
						label: "View Product",
						url: href,
					},
				],
			},
			"/mediafiles": {
				details: privacy ? "Viewing a product" : "Viewing product",
				state: "Media files",
				buttons: [
					{
						label: "View Product",
						url: href,
					},
				],
			},
			"/objectstorage": {
				details: privacy ? "Viewing a product" : "Viewing product",
				state: "Object storage",
				buttons: [
					{
						label: "View Product",
						url: href,
					},
				],
			},
			"/vpn": {
				details: privacy ? "Viewing a product" : "Viewing product",
				state: "VPN",
				buttons: [
					{
						label: "View Product",
						url: href,
					},
				],
			},
			"/individuals": {
				details: privacy ? "Viewing a solution" : "Viewing solution for",
				state: "Individuals",
				buttons: [
					{
						label: "View Solution",
						url: href,
					},
				],
			},
			"/freelancers": {
				details: privacy ? "Viewing a solution" : "Viewing solution for",
				state: "Freelancers",
				buttons: [
					{
						label: "View Solution",
						url: href,
					},
				],
			},
			"/small-business": {
				details: privacy ? "Viewing a solution" : "Viewing solution for",
				state: "Small buisness",
				buttons: [
					{
						label: "View Solution",
						url: href,
					},
				],
			},
		},
		nzStaticPages: Record<string, PresenceData> = {
			"/": {
				details: "Viewing the homepage",
			},
		};

	switch (hostname) {
		case "mega.io": {
			switch (pathname) {
				default: {
					for (const [path, data] of Object.entries(ioStaticPages)) {
						if (pathname !== path && pathname.startsWith(path))
							presenceData = { ...presenceData, ...data };
						else if (pathname === path)
							presenceData = { ...presenceData, ...data };
					}
				}
			}
			break;
		}
		case "mega.nz": {
			switch (true) {
				case pathname.includes("/fm"): {
					const activeFolder = document
						.querySelector(".content-area.js-myfiles-panel")
						.querySelector(".selected");
					switch (true) {
						case pathname.includes("/shares"): {
							break;
						}
						case pathname.includes("/out-shares"): {
							break;
						}
						case pathname.includes("/public-links"): {
							break;
						}
						case pathname.includes("/file-requests"): {
							break;
						}
						case pathname.includes("/photos"): {
							break;
						}
						case pathname.includes("/chat"): {
							break;
						}
						case pathname.includes("/devices"): {
							break;
						}

						default: {
							switch (true) {
								case !!activeFolder?.textContent: {
									presenceData.details = privacy
										? "Viewing files"
										: `Drive - ${activeFolder?.textContent}`;
									break;
								}
							}
						}
					}

					break;
				}
				default: {
					for (const [path, data] of Object.entries(nzStaticPages)) {
						if (pathname !== path && pathname.startsWith(path))
							presenceData = { ...presenceData, ...data };
						else if (pathname === path)
							presenceData = { ...presenceData, ...data };
					}
				}
			}
			break;
		}
	}
	if (privacy && presenceData.state) delete presenceData.state;
	if (!buttons) delete presenceData.buttons;

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
