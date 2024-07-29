export function getInfoCorporate(path: string) {
	let presenceData: PresenceData = {};
	const pathname = path.replace(
		`/${document.querySelector("[data-locale]")?.getAttribute("data-locale")}`,
		""
	);
	switch (true) {
		case pathname === "":
		case pathname === "/": {
			presenceData.details = "Pokemon Corporate - Viewing the homepage";
			break;
		}
		case pathname === "/about/": {
			presenceData.details = "Pokemon Corporate - About us";
		}
	}
	return presenceData;
}
