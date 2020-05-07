'use strict';
// DAY 1
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth'),//кнопка войти
      modalAuth = document.querySelector('.modal-auth'),//модальное окно
      CloseAuth = document.querySelector('.close-auth'),//кнопка закрытия
      logInForm = document.querySelector('#logInForm'),//форма авторизации
      loginInput = document.querySelector('#login'),//логин в форме авторизации
      userName = document.querySelector('.user-name'),
      buttonOut = document.querySelector('.button-out'),
      cardsRestaurants = document.querySelector('.cards-restaurants'),
      containerPromo = document.querySelector('.container-promo'),
      restaurants = document.querySelector('.restaurants'),
      menu = document.querySelector('.menu'),
      logo = document.querySelector('.logo'),
      cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('DeliveryAuthLogin');

const getData = async function(url) {//такую функцию можно вызыватьь только после ее обьявления

  const response = await fetch(url);//обещает сделать запрос на бз и пендинг значит ожидает
  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
    статус ошибки ${response.status}!`)
  }
  return await response.json();

};

getData('./db/partners.json');

const valid = function(str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
}
      /* modalAuth.classList.add('hello') добавляет класс */
      /* console.log(modalAuth.classList.contains('hello')); есть ли такой класс,возвращает true*/
      /* modalAuth.classList.toggle('modal-auth') если есть класс уберет если нет добавит */
  /* console.dir(modalAuth); возвратит обьект а не верстку например*/
function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
  loginInput.style.borderColor = '';
}

function autorized() {

  function logOut() {
    login = null;//для обнуление логина возвратит фолз в аутентефикации
    localStorage.removeItem('DeliveryAuthLogin');
    userName.style.display = '';//пустая строка вернет к свойству которое прописано в css
    buttonOut.style.display = '';
    buttonAuth.style.display = 'block';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }
  console.log('авторизован');

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
  console.log('не авторизован');

  function logIn(e) {
    event.preventDefault();
    if(valid(loginInput.value)) {
      /* console.log(event); */
    login = loginInput.value;
    localStorage.setItem('DeliveryAuthLogin', login);//сохранение логина в локал сторедж, первое значение будет кей второй вэлью и передается сверху в значение логин
    toggleModalAuth();
    buttonAuth.removeEventListener('click', toggleModalAuth);//чтобы при повторении входа все срабатывало заново
    CloseAuth.removeEventListener('click', toggleModalAuth);
    logInForm.removeEventListener('submit', logIn);
    logInForm.reset();//чтбы не сохранять значение логина в строке для логина

    checkAuth();
    /* console.log('login: ' + login + '!'); */
    } else {
      alert('Вы не верно ввели логин!');
      /* toggleModalAuth(); */
      loginInput.style.borderColor = 'red';
    } 
  } 
  
  buttonAuth.addEventListener('click', toggleModalAuth);// use because have remove eventlistener
  CloseAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);//при нажатии на отправку страница не перезагружается и происходит функция logIn которая говорит что человек зашел в аккаунт
}

function checkAuth() {
  if(login) {//пустая строка передаст false и функция не сработает, если там есть значение будет выполнена функция
    autorized();
  } else {
    notAuthorized();
  }
}

//2 day

function createCardRestaurant(restaurant) {
  /* console.log(restaurant); */
  const { image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery } = restaurant;//деструктуризация делегирование
  
  const card = `
        <a class="card card-restaurant" data-products="${products}">
				  	<img src="${image}" alt="image" class="card-image"/>
					  <div class="card-text">
						  <div class="card-heading">
							  <h3 class="card-title">${name}</h3>
							  <span class="card-tag tag">${timeOfDelivery} мин</span>
  						</div>
		  				<div class="card-info">
			  				<div class="rating">
				  				${stars}
					  		</div>
						  	<div class="price">От ${price} ₽</div>
  							  <div class="category">${kitchen}</div>
	  					</div>
		  		</div>
			</a>
  `;

  cardsRestaurants.insertAdjacentHTML('afterbegin', card);// вставить верстку до первого элемента методов - 4 beforeend, beforebegin, afterend
}

function createCardGood( { description, image, name, price } ) {//вызываем до опенгуд

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
						<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">${description}
								</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">${price} ₽</strong>
							</div>
						</div>
  `;
  cardsMenu.insertAdjacentElement('beforeend', card); // вставляем кард в кардс меню
}

function openGoods(event) {//обьект евент запускается при событии
  const target = event.target;//для определения по какой карточке кликнул
  /* console.log(event.target);кликни на какой либо элемент на сайте и чекни консоль */ 
  const restaurant = target.closest('.card-restaurant');
  //console.log(restaurant); кликунули и получили родителя элемента
  if (restaurant) {//при клике на элемент у которого родитель с классом выше будут происходить следующее
    /* console.log(restaurant.dataset.products);для получения значение дата атрибута обьекта используй датасет */

    restaurants.classList.add('hide');
    containerPromo.classList.add('hide');
    menu.classList.remove('hide');
    cardsMenu.textContent = '';
    getData(`./db/${restaurant.dataset.products}`).then(function(data) {
      /* console.log(data); */
      data.forEach(createCardGood);
    });
  }
}

function init() {
  getData('./db/partners.json').then(function(data) {
    /* console.log(data); */
    data.forEach(createCardRestaurant);
    
  });
  
  cartButton.addEventListener("click", toggleModal);
  
  close.addEventListener("click", toggleModal);
  
  cardsRestaurants.addEventListener('click', openGoods);
  
  logo.addEventListener('click', function() {//возыврат в индекс хтмл при клике на лого
      restaurants.classList.remove('hide');
      containerPromo.classList.remove('hide');
      menu.classList.add('hide');
  })
  
  new Swiper('.container-promo', {
    loop:true,
    autoplay: {
      delay: 20000,
    },
    sliderPerView: 1,
    sliderPerColumn: 1,
  })
  
  checkAuth();  
}
init();