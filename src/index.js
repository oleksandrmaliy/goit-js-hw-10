import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
  event.preventDefault();

  clearHtml();

  const inputName = event.target.value.trim();

  if (inputName === '') {
    Notiflix.Notify.failure('Please enter valid country name!');
    input.value = '';
    return;
  }

  fetchCountries(inputName)
    .then(response => {
      if (response.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (response.length > 2 && response.length <= 10) {
        createMarkupAll(response);
        return;
      } else if (response.length === 1) {
        createMarkupOne(response);
        return;
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function clearHtml() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function createMarkupOne(response) {
  const { name, capital, population, flags, languages } = response[0];
  const markup = `<div>
            <img src="${flags.svg}" alt="flag of ${name.official}" width="40px">
            <span style="font-size: 30px;"><b>${name.official}</b></span>
        </div>
        <ul style="list-style-type: none; padding-left: 0px">
            <li style="margin-top: 10px;">
                <span><b>Capital</b>: ${capital}</span>
            </li>
            <li style="margin-top: 10px;">
                <span><b>Population</b>: ${population}</span>
            </li>
            <li style="margin-top: 10px;">
                <span><b>Languages</b>: ${Object.values(languages).join(
                  ', '
                )}</span>
            </li>
        </ul>`;

  return (countryInfo.innerHTML = markup);
}

function createMarkupAll(response) {
  const markup = response
    .map(
      ({ name, flags }) =>
        `<li style="margin-top: 10px;">
            <img src="${flags.svg}" alt="flag of ${name.official}" width="40px" />
            <span style="margin-left: 5px; vertical-align: 5px;">${name.official}</span>
        </li>`
    )
    .join('');

  return (countryList.innerHTML = markup);
}
