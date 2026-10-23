const POKEAPI_BASE = 'https://pokeapi.co/api/v2/pokemon';

//obt el total de pokemon
export async function getTotalPokemonCount() {
  const res = await fetch(`${POKEAPI_BASE}?limit=1`);
  if (!res.ok) {
    throw new Error('Error al conectar con la PokéAPI');
  }
  const data = await res.json();
  return data.count;
}

//obtener los detalles del pokemon
export async function fetchPokemonData(identifier) {
  const cleanIdentifier = identifier.toString().trim().toLowerCase();
  
  const res = await fetch(`${POKEAPI_BASE}/${cleanIdentifier}`);
  if (!res.ok) {
    throw new Error(`El Pokémon "${identifier}" no fue encontrado.`);
  }

  const data = await res.json();
  const totalCount = await getTotalPokemonCount();
  const currentId = data.id;

  //la logica para el listado
  const prevId = currentId <= 1 ? totalCount : currentId - 1;
  const nextId = currentId >= totalCount ? 1 : currentId + 1;

  //limpiar los datos y devolverlos en un mejor formato
  return {
    id: data.id,
    name: data.name,
    image: data.sprites.front_default || data.sprites.other?.['official-artwork']?.front_default || null,
    types: data.types.map((t) => t.type.name),
    experience: data.base_experience ?? 0,
    weight: data.weight,
    height: data.height,
    abilities: data.abilities.map((a) => a.ability.name),
    moves: data.moves.map((m) => m.move.name),
    prevId,
    nextId,
    totalCount
  };
}