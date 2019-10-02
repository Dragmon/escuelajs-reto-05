window.onload = localStorage.clear();

const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';
let cont = 1;

const getData = api => {
  cont++
  fetch(api)
    .then(response => response.json())
    .then(response => {
      const info = response.info;
      localStorage.setItem('next_fetch', info.next);
      localStorage.setItem('pages', info.pages)
      const characters = response.results;
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

function endData() {
  let message = document.createTextNode('Ya ho hay mas personajes...');
  let newItem = document.createElement('section');
  let newh2 = document.createElement('h2');
  newItem.classList.add('Items');
  newh2.appendChild(message);
  newItem.appendChild(newh2);
  $app.appendChild(newItem);
}

const loadData = async() => {
  try {
    if ((localStorage.getItem('next_fetch') != null) && (cont <= localStorage.getItem('pages'))) {
      let myNextUrl = localStorage.getItem('next_fetch')
      await getData(myNextUrl)
    } else if (localStorage.getItem('next_fetch') === "") {
      await endData();
      intersectionObserver.unobserve($observe);
    } else {
      await getData(API);
    }
  } catch (error) {
    onError(error)
  }
}

function onError(error) {
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