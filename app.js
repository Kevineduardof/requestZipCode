const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", checkCEP);

async function checkCEP() {
    let cep = document.getElementById('cep-input').value.trim();
    let result = document.getElementById('result');
    let map = document.getElementById('map');

    result.innerHTML = '';
    map.innerHTML = '';

    if (cep.length !== 8 || isNaN(cep)) {
        result.innerHTML = '<p>CEP inválido!</p>';
        return;
    }

    document.body.style.cursor = 'wait';

    setTimeout(() => {
        fetch(`https://cep.awesomeapi.com.br/json/${cep}`)
        .then(response => {
            document.body.style.cursor = 'default';
            if (!response.ok) {
                result.innerHTML = '<p>Erro ao consultar o CEP!</p>';
                return;
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.erro) {
                result.innerHTML = '<p>CEP não encontrado!</p>';
                return;
            }
    
            result.innerHTML = 
            `
            <p>Endereço: ${data.address}</p>
            <p>Bairro: ${data.district}</p>
            <p>Cidade: ${data.city}</p>
            <p>Estado: ${data.state}</p>
            <p>Latitude: <span id="lat">${data.lat}</span></p>
            <p>Longitude: <span id="lng">${data.lng}</span></p>
            `;
    
            result.innerHTML += '<button id="show-button">Exibir Mapa</button>';
            
            const showButton = document.getElementById("show-button");
            showButton.addEventListener("click", showMap);
        })
        .catch(error => {
            console.error('Erro ao tentar consultar o CEP:', error);
            result.innerHTML = '<p>Ocorreu um erro ao consultar o CEP!</p>';
        });    
    }, 400);
}

function showMap() {
    let lat = document.getElementById('lat').innerText;
    let lng = document.getElementById('lng').innerText;

    if (!lat || !lng) {
        map.innerHTML = '<p>Latitude e Longitude indisponíveis para exibir o mapa!</p>';
        return;
    }

    document.body.style.cursor = 'wait';

    setTimeout(() => {
        let mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=pt&z=14&output=embed`;
        map.innerHTML = `<iframe src="${mapUrl}"></iframe>`;
        document.getElementById("show-button").style.display = 'none';
        document.body.style.cursor = 'default';
    }, 700);
}

