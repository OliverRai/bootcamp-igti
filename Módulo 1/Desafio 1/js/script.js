const url = 'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo';

let users = [];
let inputSearch = null;
let buttonSearch = null;
let spinnerLoading = null;

const MIN_LENGTH_SEARCH = 1;


window.addEventListener('load', async () => {
    await fetchUsers();
    mapIds();
    addEvents();
    enableControls();

    showNoUsers();
    showNoStatistics();
});


async function fetchUsers(){
    const res = await fetch(url);
    const json = await res.json();

    users = json.results.map(({login, name, picture, gender, dob}) => {
        const {first, last} = name;
        return{
            id: login.uuid,
            name: `${first} ${last}`,
            filterName: `${first} ${last}`.toLowerCase(),
            picture: picture.large,
            gender: gender,
            age: dob.age
        }
    });

    users.sort((a,b) => a.name.localeCompare(b.name));
}

function mapIds(){
    inputSearch = document.querySelector('#inputSearch');
    buttonSearch = document.querySelector('#buttonSearch');
    spinnerLoading = document.querySelector('#spinnerLoading');
    divUsers = document.querySelector('#divUsers');
    divStatistics = document.querySelector('#divStatistics');
}

function addEvents(){
    inputSearch.addEventListener('keyup', handleChange);
    buttonSearch.addEventListener('click', () => filterUsers(prepareSearch(inputSearch.value)));
}

function enableControls(){
    setTimeout(() => {
        inputSearch.disabled = false;
        inputSearch.focus();

        spinnerLoading.classList.add('hidden');
    }, 1000);
}

function prepareSearch(searchFromInput){
    return searchFromInput.trim();
}

function handleChange(event){
    const searchText = prepareSearch(event.target.value)
    const length = searchText.length;

    buttonSearch.disabled = length < MIN_LENGTH_SEARCH;

    if(event.key !== 'Enter'){
        return;
    }

    if(length < MIN_LENGTH_SEARCH){
        return;
    }

    filterUsers(searchText); 
}

function filterUsers(searchText){
    const lowerCaseSearchText = searchText.toLowerCase();
    const filteredUsers = users.filter((user) => {
        return user.filterName.includes(lowerCaseSearchText);
    });

    handleFilteredUsers(filteredUsers);
}

function handleFilteredUsers(users){
    if(users.length === 0){
        showNoUsers();
        showNoStatistics();
    }

    showUsers(users);
    showStatistics(users);
}

function showNoStatistics(){
    divStatistics.innerHTML = `<h2>Nada a ser exibido</h2>`;
}

function showNoUsers(){
    divUsers.innerHTML = `<h2>Nenhum usuário encontrado</h2>`
}

function showUsers(users){
    const h3 = document.createElement('h3');
    h3.textContent = users.length + ' usuário(s) encontrado(s)';

    const ul = document.createElement('ul');

    users.map(({name, picture, age}) => {
        const li = document.createElement('li');
        li.classList.add('info');

        const img = `<img class="avatar" src=${picture} alt=${name} />`;
        const span = `<span>${name}, ${age} anos</span>`;

        li.innerHTML = `${img} ${span}`;
        ul.appendChild(li);
    });

    divUsers.innerHTML = '';
    divUsers.appendChild(h3);
    divUsers.appendChild(ul);
}

function showStatistics(users){
    const countMale = users.filter((user) => user.gender === 'male').length;
    const countFemale = users.filter((user) => user.gender === 'female').length;
    const sumAges = users.reduce((acc, curr)=> acc + curr.age, 0);
    const averageAges = (sumAges / users.length || 0)
        .toFixed(2)
        .replace('.', ',');

    divStatistics.innerHTML = `
        <h2>Estatísticas</h2>

        <ul>
            <li>Sexo Masculino: <strong>${countMale}</strong></li>
            <li>Sexo Feminino: <strong>${countFemale}</strong></li>
            <li>Soma das idades: <strong>${sumAges}</strong></li>
            <li>Média das idades: <strong>${averageAges}</strong></li>
    `
}
