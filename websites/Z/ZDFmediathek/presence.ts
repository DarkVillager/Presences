let elapsed = Math.floor(Date.now() / 1000),
	prevUrl = "";

// Gotta rewrite presence ugh

enum OtherAssets {
	zdf = "https://cdn.rcd.gg/PreMiD/websites/Z/ZDFmediathek/assets/0.png",
	"3sat" = "https://cdn.rcd.gg/PreMiD/websites/Z/ZDFmediathek/assets/1.png",
	phoenix = "https://cdn.rcd.gg/PreMiD/websites/Z/ZDFmediathek/assets/2.png",
	arte = "https://cdn.rcd.gg/PreMiD/websites/Z/ZDFmediathek/assets/3.png",
	zdfinfo = "https://cdn.rcd.gg/PreMiD/websites/Z/ZDFmediathek/assets/4.png",
	zdfneo = "https://cdn.rcd.gg/PreMiD/websites/Z/ZDFmediathek/assets/5.png",
	kika = "https://cdn.rcd.gg/PreMiD/websites/Z/ZDFmediathek/assets/6.png",
}

const enum Assets {
	Logo = "https://cdn.rcd.gg/PreMiD/websites/Z/ZDFmediathek/assets/logo.png",
}
const presence = new Presence({
		clientId: "854999470357217290",
	}),
	// TODO: Add multiLang
	strings = presence.getStrings({
		play: "general.playing",
		pause: "general.paused",
		browsing: "general.browsing",
		browsingThrough: "discord.browseThrough",
		buttonWatchVideo: "general.buttonWatchVideo",
		buttonWatchStream: "general.buttonWatchStream",
	});

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: Assets.Logo,
		},
		video = document.querySelector<HTMLVideoElement>("video"),
		{ pathname, href } = document.location;

	if (href !== prevUrl) {
		prevUrl = href;
		elapsed = Math.floor(Date.now() / 1000);
	}

	if (video) {
		presenceData.smallImageKey = video?.paused ? Assets.Pause : Assets.Play;
		presenceData.smallImageKey = video?.paused
			? (await strings).pause
			: (await strings).play;

		if (pathname.startsWith("/live-tv")) {
			// Livestream
			const mediathekLivechannel = document
					.querySelector<HTMLHeadingElement>(
						"div.item.livetv-item.js-livetv-scroller-cell.m-active-done.m-activated-done.m-activated.m-active h2[class='visuallyhidden']"
					)
					?.textContent?.replace(/ {2}/g, " ")
					?.replace(" im Livestream", "")
					?.replace(" Livestream", ""),
				videoInfoResults = document.querySelectorAll(".zdfplayer-teaser-title");

			let videoInfoTag = "";
			for (const videoInfoResult of videoInfoResults) {
				if (
					videoInfoResult?.textContent
						?.toLowerCase()
						?.includes(` ${mediathekLivechannel?.toLowerCase()} `) ||
					videoInfoResult?.textContent
						?.toLowerCase()
						?.includes(`>${mediathekLivechannel?.toLowerCase()}<`)
				) {
					videoInfoTag = videoInfoResult.textContent;
					break;
				}
			}

			presenceData.largeImageKey =
				OtherAssets[
					mediathekLivechannel?.toLowerCase() as keyof typeof OtherAssets
				] ?? Assets.Logo;
			presenceData.smallImageKey = Assets.Live;
			presenceData.smallImageText = "Live";
			presenceData.details = `${mediathekLivechannel} Live`;
			presenceData.state = videoInfoTag?.substring(
				videoInfoTag?.lastIndexOf(">") + 1,
				videoInfoTag?.length - 1
			);
			presenceData.startTimestamp = elapsed;
			presenceData.buttons = [
				{ label: (await strings).buttonWatchStream, url: prevUrl },
			];
		} else {
			// Video-on-demand
			presenceData.largeImageKey = Assets.Logo;
			const videoInfoTag = document.querySelector(
					".zdfplayer-teaser-title"
				)?.textContent,
				showTitleTag = videoInfoTag?.substring(
					videoInfoTag?.indexOf(">") + 1,
					videoInfoTag?.lastIndexOf("<")
				);

			presenceData.state = videoInfoTag
				?.substring(
					videoInfoTag?.lastIndexOf(">") + 1,
					videoInfoTag?.length - 1
				)
				.trim();
			presenceData.details = showTitleTag?.includes("|")
				? showTitleTag.substring(
						showTitleTag.indexOf("|") + 1,
						showTitleTag.length
				  )
				: showTitleTag;
			[, presenceData.endTimestamp] = presence.getTimestampsfromMedia(video);
			presenceData.buttons = [
				{ label: (await strings).buttonWatchVideo, url: prevUrl },
			];
		}
		if (video?.paused) {
			delete presenceData.startTimestamp;
			delete presenceData.endTimestamp;
		}
	} else {
		presenceData.smallImageKey = Assets.Reading;
		presenceData.smallImageText = (await strings).browsingThrough;
		presenceData.details = (await strings).browsing;
		presenceData.startTimestamp = elapsed;
	}

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
