export { fetchCountries };

function fetchCountries(name) {
  console.log(name);
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(data => {
    return data.json();
  });
}