'use strict';

const $form = document.querySelector('form');
const $containerContacts = document.querySelector('.container__contacts');
const $inputCodigo = document.querySelector('#input-codigo');
const $inputNome = document.querySelector('#input-nome');
const $inputEmail = document.querySelector('#input-email');
const $inputTelefone = document.querySelector('#input-telefone');
const $btnSave = document.querySelector('#btn-save');
const $containerSearch = document.querySelector('.container__search');
const $containerNotFound = document.querySelector('.container__notFound');
const $totalContacts = document.querySelector('.totalContacts')
const aData = [  
  { codigo : '001001' , nome: 'Jose da Silva', 
  email : 'jose@email.com' , telefone : '(11) 99901-1234' } ,
  { codigo : '001002' , nome: 'Marcio de Souza', 
  email : 'marcio@email.com' , telefone : '(11) 99902-1234' },
  { codigo : '001003' , nome: 'Mauricio Cruz', 
  email : 'mauricio@email.com' , telefone : '(11) 99903-1234' },
  { codigo : '001004' , nome: 'Fabiana Dias', 
  email : 'fabiana@email.com' , telefone : '(11) 99904-1234' }
];

// criar o objeto no localStorage
const localStorageContacts = JSON.parse(localStorage
  .getItem('contacts'));  

  // criar o array do localStorage
let newListContacts = localStorage.
getItem('contacts') !== null ? localStorageContacts  : [] ;

// atualizar o localStorage
const updateLocalStorage = () => {
  localStorage.setItem('contacts', JSON.stringify(newListContacts));
}

// adicionar os dados da primeira lista à lista de contatos
const addData = (list, newList) => {
  list.forEach(item => newList.push(item));
  return newList;
}

// pegar os dados de array-objeto(lista) e renderiza
const getData = (newList) => {
  // organizar a lista
  sortList(newList);
  newList.filter(data => renderData(data));
}


// mostrar na tela os dados da lista de contatos
const renderData = (data) => {  

  const { codigo, nome, email, telefone } = data;
  const renderHtml = 
  `<div class="card text-dark bg-warning shadow mb-3" style="max-width:16em;">
      <div class="card-header">
          <h3>${codigo}</h3>
      </div>
      <div class="card-body">
        <p class="card-title">${nome}</p>
        <p class="card-text">${email}</p>
        <p class="card-text">${telefone}</p>
        <button class="card-link link-edit">
          <i class="fa fa-pen"></i> 
          <span class="screen-only">editar</span>   
        </button>       
        <button class="card-link link-trash">
         <i class="fa fa-trash"></i> 
         <span class="screen-only">apagar</span>   
        </button>                  
      </div>
    </div>
    `;
    $containerContacts.insertAdjacentHTML("beforeend", renderHtml);
}

// apertei enter no form
const hasBoardButtonSave = (e) => {
  e.preventDefault();
  const enterBtnSave = e.code === 'Enter';
  return enterBtnSave;
}

// verificando se cliquei no botão 'Salvar'
const hasClickButtonSave = (e) => {
  e.preventDefault();
  const btnSave = e.target.id === 'btn-save';
  return btnSave;
}

// pegar os inputs ao clicar no botao salvar
const getInputs = () => {
  const codigo = $inputCodigo.value;
  const nome = $inputNome.value;
  const email = $inputEmail.value;
  const telefone = $inputTelefone.value;
  return {codigo,nome,email,telefone};
}


// adicionar cor se o codigo, ome, email e telefone
// nao forem passados ou se foram
// tempo para a borda de erro/evio correto aparecer
const timeStyle = (input, classValidation) => {
  input.classList.add(classValidation);
  setTimeout(function(){
    input.classList.remove(classValidation);
  }, 3500);
}

// verificar Dados do input
const hasInputDatas = ({codigo,nome,email,telefone}) => {
  //verificar a regex de nome e codigo e telefone e email
  //fazer funcao pra retornar as propriedades abaixo
  if( (!!codigo && !!nome) && (!!telefone || !!email) ){
    return {codigo,nome,email,telefone};
  }
  else{
    alert('Ops, você esqueceu de preencher os campos do formulário.');
    !codigo ? timeStyle($inputCodigo,'invalid') : '';
    !nome ? timeStyle($inputNome,'invalid') : '';
    !email ? timeStyle($inputEmail,'invalid') : '';
    !telefone ? timeStyle($inputTelefone,'invalid') : '';
  }
  
  clearTimeout();
}

// limpar inputs ao apertar 'enter'
const cleanInputs = () => {
  $inputCodigo.value = '';
  $inputNome.value = '';
  $inputEmail.value = '';
  $inputTelefone.value = '';
}

//retornar o map dos códigos
const mapDataCode = (newList) => {
  const resultCode = newList.map( data => data.codigo);
  return resultCode;
}

// boolean verificar duplicadas no array de novos dados
const duplicateDatas = (newList) => {
  const result = mapDataCode(newList);
  const hasDuplicate = result.some( (item,i,arr) => {
    return arr.lastIndexOf(item) !== i;
  });
  
  return hasDuplicate;
}

// adicionar os dados na nova lista de contatos e se tiver duplicidade elimina
const newListData = (newList,input,e) => {
  e.preventDefault();
  if ( !!hasInputDatas(getInputs()) ) { 
    newList.push(getInputs());
  }
  if( !!duplicateDatas(newList) ){
    alert('Esse código já existe em outro contato.');
    timeStyle(input,'invalid');
    newList.pop();
  }
}


// eliminar item igual na lista
const deleteItemList = (newList, code) => {
  const itemFound = newList.find(item => {
    return item.codigo === code
  });
  const indexItem = newList.indexOf(itemFound);
  newList.splice(indexItem, 1);
}

// eliminar da tela
const deleteOfScreen = (card) => {
  card.remove();
}


// tem o código só da lista nova
const similarCodeClick = (code,list,newList) => {
  const itemNewList = mapDataCode(newList).indexOf(code);
  const itemList = mapDataCode(list).indexOf(code);
  const similarItem = !(itemNewList === itemList);
  return similarItem;
}

// eliminar itens clicados
const removeItem = (card,code,list,newList) => {
  if( !!similarCodeClick(code,list,newList) ){
    //remover o card
    deleteOfScreen(card);
    //remover na nova lista
    deleteItemList(newList, code);
  }
  else{
    alert('Este contato não pode ser apagado.');
  }
  
}

// funcao que ordena a lista final de arrays
const sortList = (newList) => {
  newList.sort( (a,b) => {
    return a.codigo > b.codigo;
  });
}

// atualizar total dos contatos
const updateContacts = (newList) => {
  $totalContacts.textContent = `(${newList.length})`;
} 


// gerar cards na tela e limpa inputs
const displayDatas = (e) => {
  e.preventDefault();
  if( !!hasClickButtonSave(e) || !!hasBoardButtonSave(e)){
    newListData(newListContacts, $inputCodigo,e);
    $containerContacts.textContent = ``;
    getData(newListContacts);
    updateLocalStorage();
    updateContacts(newListContacts);
  }
}

// chamar função com primeira lista de contatos
// se a segunda(nova lista) estiver vazia
const displayFirstList = () => {
  if( newListContacts.length === 0 ){
    addData(aData,newListContacts);
    getData(aData);
    updateContacts(aData);
    document.querySelector('#input-search').focus();
  }
  else{
    getData(newListContacts);
    updateContacts(newListContacts);
  }
}


// pegar da lista e passar para o input
const putDataToInput = (code,newList) => {
  const datas = newList.filter( item => item.codigo === code);
  // $inputCodigo.disabled = true;
  $inputCodigo.value = datas[0].codigo;
  $inputNome.value = datas[0].nome; 
  $inputEmail.value = datas[0].email;
  $inputTelefone.value = datas[0].telefone;
}

// editar Item na lista nova
const editItem = (code,list,newList) => {
  if( !!similarCodeClick(code,list,newList ) ){
    putDataToInput(code,newList);
    // focus no nome do form
    $inputNome.focus();
    deleteItemList(newList, code);
  }
  else{
    alert('Este contato não pode ser editado.');
  }
  
}

//acao com botoes edit e remove
const actionButton = (e,list,newList) => {
  e.preventDefault();
  const cardTrash = e.target.parentElement.parentElement.offsetParent;
  const codeCardTrash = cardTrash.firstElementChild.innerText;
  if( e.target.classList.contains('fa-trash') ) {
    removeItem(cardTrash,codeCardTrash,list,newList);
    updateLocalStorage();
    updateContacts(newListContacts);
    
  }
  if( e.target.classList.contains('fa-pen') ){
    editItem(codeCardTrash,list,newList);
    updateLocalStorage();
  }
  
}


// pesquisar contato na barra de pesquisa
const search = (e, newList) => {
  e.preventDefault();
  if( e.target.id === 'input-search' ) {    
    const searchText = e.target.value;
    let matches = newList.filter( item => {
      const regex = new RegExp(`^${searchText}`,'gi');
      return item.nome.match(regex) || item.codigo.match(regex);
    });
    if( matches.length === 0 ) {
      matches = [];
      $containerContacts.textContent = ``;
      const renderSearch = `
      <p class = "text__notFound">Contato não encontrado.</p>`;
      $containerContacts.insertAdjacentHTML("beforeend", renderSearch);
    }
    else {
      $containerContacts.textContent = '';
      getData(matches);
    }
  }
}



// colocar a primeira lista na tela
displayFirstList();

// clicar no botão de salvar ou apertar 'Enter'
$form.addEventListener('click', displayDatas);
$form.addEventListener('keyup', displayDatas);


// clicar no link editar e lixeira
$containerContacts.addEventListener('click', (e) => 
  actionButton(e,aData,newListContacts)
);

// pesquisar contato
$containerSearch.addEventListener('input', (e) => 
  search(e,newListContacts)
);