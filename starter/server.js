import express from 'express';
import { fetchPokemonData } from './PokemonDirect/pokemonService.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));

//endpoint de busqueda por ID o nombre
app.get('/api/pokemon/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const pokemonData = await fetchPokemonData(identifier);
    res.json(pokemonData);
  } catch (error) {
    //si no existe el pokemon, devolvemos un 404
    res.status(404).json({ error: error.message });
  }
});

//por defecto cargar el primer pokemon bulbasaur :D 
app.get('/api/pokemon', async (req, res) => {
  try {
    const pokemonData = await fetchPokemonData(1);
    res.json(pokemonData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Pokedex escuchando en http://localhost:${PORT}`);
});