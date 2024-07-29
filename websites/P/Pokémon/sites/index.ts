import { getInfoCorporate } from "./corporate";
import { getInfoPokemon } from "./pokemon";

export function getHost(host: string, path: string, href: string) {
	switch (host.replace("www.", "")) {
		case "pokemon.com": {
			return getInfoPokemon(path, href);
		}
		case "corporate.pokemon.com": {
			return getInfoCorporate(path);
		}
	}
}
