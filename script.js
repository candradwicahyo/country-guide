window.onload = () => {
  
  const content = document.querySelector('.content');
  const input = document.querySelector('.input');
  const submitButton = document.querySelector('.btn-submit');
  submitButton.addEventListener('click', () => {
    // value input 
    const value = input.value.trim().toLowerCase();
    // validasi lebih dahulu
    if (validate(value) == true) {
      // render dan tampilkan element
      updateUI(value);
      // bersihkan value input
      input.value = '';
    }
  });
  
  function validate(value) {
    // jika input kosong
    if (!value) return alerts('error', 'Alert', 'field is empty!');
    // jika value input terlalu pendek
    if (value.length < 3) return alerts('error', 'Alert', 'value must be more then 3 character!');
    // jika value input berisikan angka
    if (value.match(/[0-9]/gmi)) return alerts('error', 'Alert', 'value can only contain letters!');
    // jika berhasil melewati semua validasi
    return true;
  }
  
  function alerts(icon, title, text, position = 'center') {
    // plugin sweetalert2
    swal.fire ({
      position: position,
      icon: icon,
      title: title,
      text: text
    });
  }
  
  async function updateUI(value) {
    try {
      // dapatkan data
      const data = await getData(value);
      // kosongkan element content 
      content.innerHTML = '';
      // tampilkan element
      content.insertAdjacentHTML('beforeend', showData(data));
    } catch (error) {
      // jika mengalamai error saat mengambil data
      content.innerHTML = showError(error.message);
    }
  }
  
  function getData(value) {
    return fetch(`https://restcountries.com/v3.1/name/${value}?fullText=true`)
      .then(response => response.json())
      .then(response => {
        // jika data yang dicari tidak ditemukan
        if (response.status == 404) throw new Error(response.message);
        // jika data yang dicari ditemukan
        return response[0];
      })
      .catch(error => {
        // jika mengalami masalah saat mengambil data
        throw new Error(error);
      })
  }
  
  function showError(message) {
    return `
    <div class="alert alert-danger my-auto" role="alert">
      <h1 class="fw-normal mb-2">Error!</h1>
      <p class="fw-light my-auto">${message}</p>
    </div>
    `;
  }
  
  function showData(data) {
    return `
    <li class="list-group-item p-3">
      <img src="${data.flags.png}" alt="country image" class="img-fluid rounded">
    </li>
    <li class="list-group-item p-3">
      <p class="fw-light my-auto">${data.flags.alt}</p>
    </li>
    <li class="list-group-item p-3">
      <div class="d-flex align-items-center">
        <span class="fw-normal me-1">name :</span>
        <span class="fw-light">${data.name.common}</span>
      </div>
    </li>
    <li class="list-group-item p-3">
      <div class="d-flex align-items-center">
        <span class="fw-normal me-1">capital :</span>
        <span class="fw-light">${data.capital[0]}</span>
      </div>
    </li>
    <li class="list-group-item p-3">
      <div class="d-flex align-items-center">
        <span class="fw-normal me-1">continents :</span>
        <span class="fw-light">${data.continents[0]}</span>
      </div>
    </li>
    <li class="list-group-item p-3">
      <div class="d-flex align-items-center">
        <span class="fw-normal me-1">currencies :</span>
        <span class="fw-light">${getCurrencies(data.currencies)}</span>
      </div>
    </li>
    <li class="list-group-item p-3">
      <div class="d-flex align-items-center">
        <span class="fw-normal me-1">languages :</span>
        <span class="fw-light">${getLanguages(data.languages)}</span>
      </div>
    </li>
    <li class="list-group-item p-3">
      <div class="d-flex align-items-center">
        <span class="fw-normal me-1">subregion :</span>
        <span class="fw-light">${data.subregion}</span>
      </div>
    </li>
    `;
  }
  
  function getCurrencies(param) {
    for (const data in param) return param[data].name;
  }
  
  function getLanguages(param) {
    const result = [];
    for (const data in param) {
      result.push(param[data]);
    }
    return result.join(', ');
  }
  
}