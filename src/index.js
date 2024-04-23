import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import Notiflix from 'notiflix';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

const apiKey =
  'live_2iAb0JJ0kYQGOajFpJdtWEgu2YpNS1738lXSkrniIrHsoRdSuAGZG86H0sZSB0O0';

axios.defaults.headers.common['x-api-key'] = apiKey;

let isFirstLoad = true;

async function init() {
  try {
    showLoader();
    const breeds = await fetchBreeds();
    updateSelect(breeds);
  } catch (err) {
    console.error('Error while fetching cat breeds data', err);
    Notiflix.Notify.failure('Oops! Something went wrong!', {
      position: 'center-center',
    });
  } finally {
    hideLoader();
  }
}

async function displayCatInfo(breedId) {
  try {
    if (breedId) {
      showLoader();
      const catData = await fetchCatByBreed(breedId);
      renderCatInfo(catData);
    } else {
      hideCatImage();
    }
  } catch (err) {
    console.error('Error while fetching cat data', err);
    Notiflix.Notify.failure('Oops! Something went wrong!', {
      position: 'center-center',
    });
  } finally {
    hideLoader();
  }
}

function showLoader() {
  loader.style.display = 'inline-block';
  error.style.display = 'none';
  catInfo.innerHTML = '';
  hideCatImage();
}

function hideLoader() {
  loader.style.display = 'none';
}

function updateSelect(breeds) {
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}

function renderCatInfo(catData) {
  const cat = catData[0];
  const catBreed = cat.breeds[0];
  const catImage = document.getElementById('cat-image');
  catImage.src = cat.url;
  catImage.style.display = 'block';
  catInfo.innerHTML = `
    <h2>${catBreed.name}</h2>
    <p><strong>Description:</strong> ${catBreed.description}</p>
    <p><strong>Temperament:</strong> ${catBreed.temperament}</p>
  `;

  if (isFirstLoad) {
    isFirstLoad = false;
  }
}

function hideCatImage() {
  if (isFirstLoad) {
    return;
  }
  const catImage = document.getElementById('cat-image');
  catImage.style.display = 'none';
  catInfo.innerHTML = '';
}

breedSelect.addEventListener('change', () => {
  const breedId = breedSelect.value;
  displayCatInfo(breedId);
});

init();
