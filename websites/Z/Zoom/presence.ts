const presence = new Presence({
		clientId: "765876503161733140",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

function videoEnabled() {
	return (
		document.querySelector<HTMLButtonElement>(
			".send-video-container > button"
		) &&
		document
			.querySelector<HTMLButtonElement>(".send-video-container > button")
			?.getAttribute("aria-label") &&
		document
			.querySelector<HTMLButtonElement>(".send-video-container > button")
			?.getAttribute("aria-label") !== "start sending my video"
	);
}

function memberCount() {
	const counter = document.querySelector<HTMLSpanElement>(
		".footer-button__participants-icon > .footer-button__number-counter > span"
	);
	return counter === null ? null : Number(counter.textContent);
}

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey:
				"https://cdn.rcd.gg/PreMiD/websites/Z/Zoom/assets/logo.png",
		},
		{ pathname } = document.location;

	if (pathname.startsWith("/wc/")) {
		if (document.querySelector("#prompt > h4") && pathname.endsWith("start"))
			presenceData.details = "Joining a meeting";
		else if (pathname.endsWith("leave"))
			presenceData.details = "Leaving an meeting";
		else if (videoEnabled()) {
			presenceData.details = "In video meeting";
			presenceData.smallImageKey = Assets.VideoCall;
		} else {
			presenceData.details = "In meeting";
			presenceData.smallImageKey = Assets.Call;
		}
		if (memberCount()) {
			presenceData.state = `${memberCount()} user${
				memberCount() ?? 0 > 1 ? "s" : ""
			} in room`;
		}
		presenceData.startTimestamp = browsingTimestamp;
	} else {
		const pages: {
			[name: string]: PresenceData;
		} = {
			"/": { details: "Viewing home page" },
			"/signin": { details: "Singing in" },
			"/singup": { details: "Creating an account" },
			"/profile": { details: "Viewing their profile" },
			"/webinar": { details: "Viewing webinars" },
			"/recording": { details: "Viewing recordings" },
			"/settings": { details: "Editing their settings" },
			"meeting/schedule": { details: "Scheduling a meeting" },
			"/meetings": { details: "Viewing their meetings" },
			"/s/": { details: "Joining a meeting" },
			"/meeting": { details: "Viewing their meeting" },
		};
		for (const [i, v] of Object.entries(pages)) {
			if (i === "/" && pathname === "/") presenceData.details = v.details;
			else if (pathname.includes(i) && i !== "/")
				presenceData.details = v.details;
		}
	}

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
