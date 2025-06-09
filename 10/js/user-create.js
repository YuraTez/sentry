$("#openEmailTab").on("click", ()=>{
  $(".header").removeClass("hide")
  switchTab()
  logView("pop_click")
  logView("email_view")
})

const emailInput = $('#inputEmail');
const userCreateButton = $('#userCreate');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Функция для проверки валидности email
function validateEmail() {
  const emailValue = emailInput.val().trim();
  if (emailPattern.test(emailValue)) {
    emailInput.removeClass('error');
    userCreateButton.removeClass('btn--disabled');
  } else {
    emailInput.addClass('error');
    userCreateButton.addClass('btn--disabled');
  }
}

// Слушатель на ввод в поле email
emailInput.on('input', function() {
  validateEmail();
});

$('.email-domains__item').on('click', function() {
  const domain = $(this).text();
  const currentValue = emailInput.val().trim();

  const atIndex = currentValue.lastIndexOf('@');
  if (atIndex !== -1) {
    emailInput.val(currentValue.substring(0, atIndex) + domain);
  } else {
    emailInput.val(currentValue + domain);
  }

  validateEmail();
});

// Функция для генерации UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function createUser(){
  const link = new URL(window.location.href);
  const clickId = link.searchParams.get('click_id') !== null ? link.searchParams.get('click_id') : generateUUID(10);
  const domain = window.location.hostname;
  setCookie('userId', clickId, 90);
  setCookie('userEmail', emailInput.val(), 90);

  const url = "http://159.203.93.84/api/user/create";
  const data = {
    "email": emailInput.val(),
    "click_id": clickId,
    "first_product_id": "0598d54b-7240-4c67-913a-ab188240c14a",
  }

  async function sendPostRequest() {
    try {
      const response = await fetch(url, {
        method: 'POST', // Метод запроса
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      // Проверяем, успешен ли ответ
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      // Получаем данные из ответа
      const responseData = await response.json();
      setCookie('userToken', responseData.token, 90);
      logView("is_lead")
    } catch (error) {
      console.error('Error:', error);
    }
  }

  sendPostRequest()

}

function startCountdown(duration) {
  let timer = duration, minutes, seconds;

  let inner = document.querySelector(".time")

  if (inner){
    const interval = setInterval(() => {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      document.getElementById('minutes').textContent = minutes;
      document.getElementById('seconds').textContent = seconds;

      if (--timer < 0) {
        clearInterval(interval);
        console.log("Время вышло!");
      }
    }, 1000);
  }
}


userCreateButton.on('click', ()=>{
  createUser()
  switchTab()
  startCountdown(600)
  logView("email_click")
  logView("paywall_view")

});