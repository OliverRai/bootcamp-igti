let allPeoples = [];

let foundAges = [];

filterNames = [];   

let divUsers = null;

let divDescricao = null;

let inputSearch = null;

let wordTyped = null;

let soma = 0;
let count = 0;
let totalIdade = 0;

let = mensagemErro = null;



window.addEventListener('load', () => {
    divUsers = document.querySelector('#user');
    divDescricao = document.querySelector('#desc');
    inputSearch = document.querySelector('#search');
    buttonSearch = document.querySelector('#btn');
    mensagemErro = document.querySelector('#mensagem');
    inputSearch.addEventListener('keyup', typing);
    inputSearch.focus();
    fetchPeoples();

    
});

function typing(event) {
    wordTyped = inputSearch.value;

    if(event.key === 'Enter'){
        searchNames();
    }
}

function searchNames() {
    const totalDeLetras = wordTyped.length;

    if(totalDeLetras > 0){  
        filterNames = allPeoples.filter(person => person.name.toLowerCase().indexOf(wordTyped) != -1 || person.lastName.toLowerCase().indexOf(wordTyped) != -1);
        renderUsersList(filterNames);
        renderDescInfo(filterNames);
        sumAges(filterNames);
    }

    console.log(filterNames)

}
//fullname = person.name + ' ' + person.lastName;   
//console.log(fullname)

async function fetchPeoples() {
    const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo/results');
    const json = await res.json();
    const api = json.results
    allPeoples = api.map(person => {
        return {
            name: person.name.first,
            lastName: person.name.last,
            pic: person.picture.thumbnail,
            dob: person.dob.age,
            gender: person.gender
        }
    });
    console.log(allPeoples)
    
}

function renderUsersList(found) {
    
    let userHTML = '<div>';
    found.forEach(person => {
        const { name, pic, dob, lastName, gender } = person;
        const total = found.length
        const peopleHTML = `
        <h2 class="title">${total} encontrados </h2>
        <div id="user-info">
            <img src="${pic}">
            <p>${name}</p>
            <p id="lastname">${lastName},</p>
            <p>${dob}</p>
        </div>
    `;
        userHTML += peopleHTML;
    });

    divUsers.innerHTML = userHTML;
}

function sumAges(found) {   
//contar sexo fem
    const fem = found.filter(person => {
        return person.gender === 'female'
    });

    const female = fem.length;

//contar sexo masc
    const masc = found.filter(person => {
        return person.gender === 'male'
    });

    const male = masc.length;

    const totalIdade = found.reduce((accumulator, current) => {
        return accumulator + current.dob;
    },0);
    const media = totalIdade / found.length;

    renderDescInfo(totalIdade, media, female, male);
    
    
}

function renderDescInfo(ages, total, fem, masc) {
    
    const c = parseFloat(total);
    const b = c.toFixed(2);
    
    let userDescHTML = '<div>';
        const descHTML = `
        <div id="desc-info">
            <h2>Estatísticas </h2>
            <p>Sexo masculinho: ${masc}</p>
            <p>Sexo feminino: ${fem}</p>
            <p>Soma das idades: ${ages}</p>
            <p>Média formatada: ${b}</p>
        </div>
    `;
    userDescHTML += descHTML;
    

    divDescricao.innerHTML = userDescHTML;
}