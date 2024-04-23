import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

const apiKey =
  'live_2iAb0JJ0kYQGOajFpJdtWEgu2YpNS1738lXSkrniIrHsoRdSuAGZG86H0sZSB0O0';

axios.defaults.headers.common['x-api-key'] = apiKey;

async function init() {
  try {
    showLoader();
    const breeds = await fetchBreeds();
    updateSelect(breeds);
  } catch (err) {
    console.error('Error while fetching cat breeds data', err);
    showError();
  } finally {
    hideLoader();
  }
}

async function displayCatInfo(breedId) {
  try {
    showLoader();
    const catData = await fetchCatByBreed(breedId);
    renderCatInfo(catData);
  } catch (err) {
    console.error('Error while fetching cat data', err);
    showError();
  } finally {
    hideLoader();
  }
}

function showLoader() {
  loader.style.display = 'block';
  error.style.display = 'none';
  catInfo.innerHTML = '';
}

function hideLoader() {
  loader.style.display = 'none';
}

function showError() {
  error.style.display = 'block';
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
  catInfo.innerHTML = `
    <h2>${catBreed.name}</h2>
    <p><strong>Description:</strong> ${catBreed.description}</p>
    <p><strong>Temperament:</strong> ${catBreed.temperament}</p>
    <img src="${cat.url}" alt="Cat Image">
  `;
}

breedSelect.addEventListener('change', () => {
  const breedId = breedSelect.value;
  if (breedId !== '') {
    displayCatInfo(breedId);
  }
});

init();
