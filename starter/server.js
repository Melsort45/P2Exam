import express from 'express';
import { fetchPokemonFromAPI } from './PokemonDirect/pokemonService.js';
const app = express();
const PORT = process.env.PORT || 3001;

// Serve the static frontend from ./public
app.use(express.static('public'));

app.get('/api/pokemon/:nombre', async (req, res) => {
  try {
    const data = await fetchPokemonFromAPI(req.params.nombre);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
