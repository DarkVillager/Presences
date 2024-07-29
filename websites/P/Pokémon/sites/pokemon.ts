export function getInfoPokemon(path: string, href: string) {
	let presenceData: PresenceData = {};
	const pathname = path.replace(
		`/${document.querySelector("body").className.split(" ")[0]}`,
		""
	);
	switch (true) {
		case pathname === "":
		case pathname === "/": {
			presenceData.details = "Pokemon - Viewing the homepage";
			break;
		}
		case pathname === "/about/": {
			presenceData.details = "Pokemon - About us";
			break;
		}
		case pathname === "/pokedex": {
			const pokedexSearch =
				document.querySelector<HTMLInputElement>("#searchInput")?.value;
			if (pokedexSearch) {
				presenceData.details = "Searching the pokedex for";
				presenceData.state = pokedexSearch;
				presenceData.smallImageKey = Assets.Search;
			} else presenceData.details = "Viewing the pokedex";
			break;
		}
		case pathname.includes("/pokedex"): {
			presenceData.details = "Viewing pokémon";
			presenceData.state = document.querySelector(
				".pokedex-pokemon-pagination-title"
			)?.textContent;
			presenceData.buttons = [
				{
					label: "View Pokémon",
					url: href,
				},
			];
			break;
		}

		default: {
			return;
		}
	}
	return presenceData;
}
