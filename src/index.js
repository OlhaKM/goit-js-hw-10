import './css/styles.css';
import Notiflix from 'notiflix';
import { debounce } from 'debounce';
import { fetchCountries } from './js/fetchCountries'

const DEBOUNCE_DELAY = 300;
const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
searchInput.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(event) {
    event.preventDefault();
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    const inputClearOfSpace = searchInput.value.trim();
    if(inputClearOfSpace === ""){
        return Notiflix.Notify.warning("Dont mess with me and enter country");
    }
    fetchCountries(inputClearOfSpace).then(country => {
        if (country.length > 10) {
            Notiflix.Notify.info(`Too many matches found. Please enter a more specific name.`)
        }else if (country.length <= 10 && country.length > 1 && searchInput.value !== undefined && searchInput.value !== "") {
            buildListMarkup(country);
        } else if (country.length === 1 && searchInput.value !== undefined && searchInput.value !== "") {
            countryInfo.innerHTML = buildCountryCard(country);
        }
    }).catch(error => {console.log(error)
      Notiflix.Notify.failure(`Oops, there is no country with that name`)});
}

function buildListMarkup(countries) {
    countryInfo.innerHTML = '';
    const markup = countries.map((element) => {
        return `
        <li class="profile-small">
        <img
        src="${element.flags.svg}"
        width="80"
        height="40"
        alt="Country flag"
        class="flag"/>
        <h2 class="name-small">${element.name.official}</h2>
        </li>`})
        .join();
    countryList.insertAdjacentHTML('afterbegin', markup);

    const extraElement = countryList.childNodes;
    for (let i = 0; i < extraElement.length; i += 1) {
        if (extraElement[i].value % 2 !== 0) {
        extraElement[i].remove();
        };
    };
}

function buildCountryCard(country) {
    countryList.innerHTML = '';
    for (let i = 0; i < country.length; i += 1) {
        return `<div class="profile">
    <img
    src="${country[i].flags.svg}"
    width="160"
    height="160"
    alt="Country flag"
    class="flag"
    />
    <div class="meta">
    <h2 class="name">${country[i].name.official}</h2>
    <ul class="info">
    <li>
        Capital: ${country[i].capital}
      </li>
      <li>
        Population: ${country[i].population}
      </li>
      <li>
        Languages: ${Object.keys(country[i].languages)}
      </li>
    </ul>
  </div>
</div>`
    };
};