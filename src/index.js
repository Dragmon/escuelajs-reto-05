window.onload = localStorage.clear();

const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';

const getData = api => {
  console.log("Entra en getData")
  fetch(api)
    .then(response => response.json())
    .then(response => {
      const info = response.info;
      localStorage.setItem('next_fetch', info.next);
      localStorage.setItem('pages', info.pages)
      const characters = response.results;
      console.log(localStorage)

      let output = characters.map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `
      }).join('');
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
}

const loadData = async() => {
  console.log("Entra en loadData")
  console.log(localStorage)
  try {
    if (localStorage.getItem('next_fetch') != null) {
      let myNextUrl = localStorage.getItem('next_fetch')
      await getData(myNextUrl)
    } else if (localStorage.getItem('next_fetch') === "") {
      console.log("Ya no hay personajes")
    } else {
      await getData(API);
    }
  } catch (error) {
    onError(error)
  }
}

function onError(error, nameFunction) {
  console.log(`Ocurrio el sigueinte error: ${error}`);
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);