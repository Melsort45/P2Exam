export async function fetchPokemonFromAPI(nombre) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);

  if (!res.ok) {
    throw new Error('Pokémon no encontrado');
  }

  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`
  };
}
