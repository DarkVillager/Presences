const presence = new Presence({
		clientId: "612299892764966923",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000),
	subsection = new URL(document.location.href).searchParams.get("subsection");

const enum Assets {
	Logo = "https://cdn.rcd.gg/PreMiD/websites/S/Steam/assets/logo.png",
}

presence.on("UpdateData", async () => {
	let presenceData: PresenceData = {
		details: "Unknown page",
		startTimestamp: browsingTimestamp,
		largeImageKey: Assets.Logo,
	};
	const { href, hostname, pathname } = document.location,
		subTab =
			document.querySelector('[class="workshop_browse_tab active"]') //Active tab
				?.textContent ??
			document.querySelector('[class="searchedTermsContainer"]')?.textContent ?? //Items/Collection ur browsing in workshop
			document.querySelector('[class="apphub_sectionTab active "]')
				?.textContent,
		mainTab = document.querySelector(
			'[class="apphub_AppName ellipsis"]'
		)?.textContent;

	switch (hostname) {
		case "steamcommunity.com": {
			presenceData.details = "Steam Community";
			switch (true) {
				case pathname === "/":
				case !pathname: {
					if (subsection) presenceData.state = `Browsing ${subsection}.`;
					else presenceData.state = "Home";
					break;
				}
				case pathname.match(/\/app\/[0-9]{7}\/discussions\//gm)?.length > 0: {
					presenceData.details = `${mainTab} - ${subTab}`;
					presenceData.state =
						document.querySelector('[class="topic"]')?.textContent;
					presenceData.buttons = [
						{ label: "View Discussion", url: href },
						{
							label: "View Game",
							url: document
								.querySelector('[class="apphub_sectionTab  "]')
								?.getAttribute("href"),
						},
					];
					break;
				}
				case pathname.includes("/workshop/"):
				case pathname.includes("/app/"): {
					presenceData.details = mainTab;
					presenceData.state = subTab;
					presenceData.buttons = [{ label: "View Game", url: href }];
					break;
				}
				case pathname.includes("/followedgames"): {
					presenceData.state = "Browsing follwing games.";
					break;
				}
				case pathname.includes("/discussions/forum"): {
					const topicTitle = document.querySelector("div.topic"),
						topicAuthor = document.querySelector("div.authorline > a");

					if (topicTitle && topicAuthor) {
						presenceData.details = `Topic: ${topicTitle.textContent}`;

						presenceData.state = `Author: ${topicAuthor.textContent}`;
					} else presenceData.state = "Browsing steam forums.";
					break;
				}
				case pathname === "/workshop/": {
					presenceData.details = "Steam Workshop";

					presenceData.state = "Home";
					break;
				}
				case pathname.includes("/discussions/"): {
					presenceData.state = "Browsing discussions.";
					break;
				}
				case pathname.includes("/search/users"): {
					presenceData.details = "Searching for a user: ";

					presenceData.state = `Username: ${
						document
							.querySelector<HTMLInputElement>("#search_text_box")
							?.value?.toLowerCase() ?? "unknown"
					}`;
					presenceData.smallImageKey = Assets.Search;
					break;
				}

				case pathname.includes("/broadcast/watch/"): {
					presenceData.details = "Watching a broadcast.";
					presenceData.state = `${
						document.querySelector("#BroadcastGame")?.textContent //Broadcast Title
					} - ${
						document.querySelector("[class='BroadcastProfileName'] > a")
							?.textContent //Broadcaster
					}`;
					presenceData.smallImageKey = Assets.Live;
					break;
				}
				case pathname === "/market": {
					presenceData.state = "Community Market.";
					break;
				}
				case pathname.includes("/market/listings"): {
					presenceData.details = "Community Market.";

					presenceData.state = `${
						document.querySelector("#largeiteminfo_item_name")?.textContent // itemname
					} (${
						document.querySelector(
							"#market_commodity_forsale > span:nth-child(2)"
						).textContent
						// item Price
					}).`;
					break;
				}
				case pathname.includes("/profiles/"):
				case pathname.includes("/id/"): {
					const avatar =
						document
							.querySelector('[class*="playerAvatar medium"] > img')
							?.getAttribute("src") ??
						document
							.querySelector('[class="playerAvatarAutoSizeInner"] > img')
							?.getAttribute("src");

					presenceData.details = document.querySelector(
						'[class="actual_persona_name"],[class="profile_small_header_name"]'
					)?.textContent;
					presenceData.state = document.querySelector(
						'[class="profile_small_header_location"]'
					)?.textContent;
					if (pathname.includes("/id/")) {
						presenceData.buttons = [
							{
								label: "View User",
								url:
									document
										.querySelector(
											'[class="whiteLink persona_name_text_content"]'
										)
										?.getAttribute("href") ?? "",
							},
							{
								label: "View Games",
								url: `${
									document
										.querySelector(
											'[class="whiteLink persona_name_text_content"]'
										)
										?.getAttribute("href") ?? ""
								}/games`,
							},
						];
					} else {
						presenceData.buttons = [
							{
								label: "View User",
								url:
									href.match(
										/https:\/\/steamcommunity[.]com\/profiles\/[0-9]{17}/gm
									)?.[0] ?? href,
							},
							{
								label: "View Games",
								url: `${
									href.match(
										/https:\/\/steamcommunity[.]com\/profiles\/[0-9]{17}/gm
									)?.[0] ?? href
								}/games`,
							},
						];
					}
					presenceData.largeImageKey = avatar ?? Assets.Logo;
					if (avatar) presenceData.smallImageKey = Assets.Logo;
					break;
				}
				default: {
					presenceData.details = "Browsing an unknown page";
				}
			}
			break;
		}
		case "store.steampowered.com": {
			presenceData.details = "Steam Store";
			const parts = href.split("/");

			switch (true) {
				case pathname === "/": {
					presenceData.state = "Home";
					break;
				}
				case pathname.includes("/app/"): {
					presenceData.state = document.querySelector(
						"[div.apphub_AppName]"
					)?.textContent;
					break;
				}
				case pathname.includes("/category/"): {
					presenceData.details = `Steam Store - ${
						document
							.querySelector('[class*="ContentHubTitle"]')
							?.textContent?.toLowerCase() // Category
					} games/software`;
					presenceData.state = document.querySelector(
						'[class*="SaleTab Selected"]'
					)?.textContent;
					break;
				}
				default: {
					const pages: Record<string, PresenceData> = {
						"/about": { state: "About steam" },
						"/cart": { state: "Cart" },
						"/checkout": { state: "Checkout" },
						"/wishlist": { state: "Wishlist" },
						"/games": { state: "Games" },
						"/explore": { state: "Exploring games" },
						"/updated": { state: "Recently updated games" },
						"/stats": { state: "Steam & game stats" },
						"/search/": {
							state: `Searching for ${new URL(href).searchParams.get("term")}`,
							smallImageKey: Assets.Search,
						},
						"/tags": {
							state: parts[parts.length - 2]
								.replaceAll("%20", " ")
								.replaceAll("%26", "&"),
						},
						"/genre": {
							state: `Genre: ${parts[parts.length - 2].replaceAll("%20", " ")}`,
						},
					};
					for (const [path, data] of Object.entries(pages)) {
						if (pathname.includes(path))
							presenceData = { ...presenceData, ...data };
					}
					if (!presenceData.state) presenceData.state = "Unknown page";
				}
			}
			break;
		}
		case "help.steampowered.com": {
			const gameHref = document
				.querySelector('[class="help_header_link"] > a')
				?.getAttribute("href");
			presenceData.details = "Steam support";
			switch (true) {
				case pathname.includes("/wizard/"): {
					presenceData.state = document
						.querySelector("#wizard_contents > div > div.breadcrumbs")
						.textContent.split("Home > ")[1];
					if (gameHref) {
						presenceData.buttons = [
							{
								label: "View Support Page",
								url: href,
							},
							{
								label: "View Game",
								url: document
									.querySelector('[class="help_header_link"] > a')
									?.getAttribute("href"),
							},
						];
					} else {
						presenceData.buttons = [
							{
								label: "View Support Page",
								url: href,
							},
						];
					}
					break;
				}
				case pathname.split("/").length < 2: {
					presenceData.state = "Main page";
					break;
				}
				case pathname.includes("/faqs/"): {
					presenceData.state = "Reading FAQ";
					break;
				}
				default: {
					presenceData.state = "Unknown page";
				}
			}
			break;
		}
	}

	presence.setActivity(presenceData);
});
