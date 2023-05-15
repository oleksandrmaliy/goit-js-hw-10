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

  const inputName = event.target.value.trim();

  fetchCountries(inputName)
    .then(data => {
      clearHtml();
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (data.status === 404) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        return;
      } else if (data.length > 2 && data.length <= 10) {
        createMarkupAll(data);
        return;
      } else if (data.length === 1) {
        createMarkupOne(data);
        return;
      }
    })
    .catch(error => {
      error;
    });
}

function clearHtml() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function createMarkupOne(data) {
  const { name, capital, population, flags, languages } = data[0];
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

function createMarkupAll(data) {
  const markup = data
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
