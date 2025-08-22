const container = document.getElementById('pokemon-container');
const errorDiv = document.getElementById('error');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const searchInput = document.getElementById('search');
const modeToggle = document.getElementById('mode-toggle');
const backToTop = document.getElementById('back-to-top');

// Modal elements
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalName = document.getElementById('modal-name');
const modalImg = document.getElementById('modal-img');
const modalTypes = document.getElementById('modal-types');
const modalHeight = document.getElementById('modal-height');
const modalWeight = document.getElementById('modal-weight');
const modalAbilities = document.getElementById('modal-abilities');

let offset = 0;
const limit = 10;

const typeColors = {
  fire: '#FDDFDF', water: '#DEF3FD', grass: '#DEFDE0', electric: '#FCF7DE',
  psychic: '#EAEDA1', normal: '#F5F5F5', fighting: '#E6E0D4', flying: '#F5F5F5',
  poison: '#E0D4E6', ground: '#F0E0C4', rock: '#D4C4B1', bug: '#E0F0C4',
  ghost: '#D8D8F0', steel: '#F0F0F0', ice: '#D4F0F8', dragon: '#D4D0F0',
  dark: '#B8B8B8', fairy: '#F8D4F0'
};

// Fetch Pokémon
async function fetchPokemon() {
  container.innerHTML = '';
  errorDiv.textContent = '';

  for (let i = 0; i < limit; i++) {
      const skeleton = document.createElement('div');
      skeleton.classList.add('skeleton');
      container.appendChild(skeleton);
  }

  try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();

      container.innerHTML = '';

      for (let pokemon of data.results) {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          const card = document.createElement('div');
          card.classList.add('card');

          const types = details.types.map(t => t.type.name).join(', ');
          const abilities = details.abilities.map(a => a.ability.name).join(', ');

          card.innerHTML = `
            <div class="card-inner">
              <div class="card-front">
                <h3>${details.name.charAt(0).toUpperCase() + details.name.slice(1)}</h3>
                <img src="${details.sprites.front_default}" alt="${details.name}">
              </div>
              <div class="card-back">
                <p>Type: ${types}</p>
                <p>Height: ${details.height}</p>
                <p>Weight: ${details.weight}</p>
              </div>
            </div>
          `;

          card.querySelector('.card-back').style.backgroundColor = typeColors[details.types[0].type.name] || '#ef5350';

          // Click to open modal + confetti
          card.addEventListener('click', () => {
              modalName.textContent = details.name.charAt(0).toUpperCase() + details.name.slice(1);
              modalImg.src = details.sprites.other['official-artwork'].front_default || details.sprites.front_default;
              modalTypes.textContent = `Types: ${types}`;
              modalHeight.textContent = `Height: ${details.height}`;
              modalWeight.textContent = `Weight: ${details.weight}`;
              modalAbilities.textContent = `Abilities: ${abilities}`;
              modal.style.display = 'flex';

              // Confetti effect
              confetti({
                  particleCount: 150,
                  spread: 120,
                  colors: ['#ef5350','#ffca28','#66bb6a','#29b6f6','#ab47bc'],
                  origin: { y: 0.5 }
              });
          });

          container.appendChild(card);
      }
  } catch (err) {
      console.error(err);
      errorDiv.textContent = 'Oops! Something went wrong.';
  }
}

// Pagination
prevBtn.addEventListener('click', () => { if (offset > 0) { offset -= limit; fetchPokemon(); } });
nextBtn.addEventListener('click', () => { offset += limit; fetchPokemon(); });

// Search filter
searchInput.addEventListener('input', () => {
  const filter = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
      const name = card.querySelector('.card-front h3').textContent.toLowerCase();
      card.style.display = name.includes(filter) ? '' : 'none';
  });
});

// Dark / Light mode
modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
    modeToggle.textContent = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Modal close
modalClose.addEventListener('click', () => { modal.style.display = 'none'; });
window.addEventListener('click', (e) => { if(e.target === modal) modal.style.display = 'none'; });

// Back to top
window.addEventListener('scroll', () => { backToTop.style.display = window.scrollY > 300 ? 'block' : 'none'; });
backToTop.addEventListener('click', () => { window.scrollTo({ top:0, behavior:'smooth' }); });

// Initial fetch
fetchPokemon();
