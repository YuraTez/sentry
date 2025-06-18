const checkInterval = 100;
const maxAttempts = 50;

let attempts = 0;

const checkBlockVisibility = setInterval(() => {
    const block = document.querySelector(".tab-start-page");

    if (block && block.offsetWidth > 0 && block.offsetHeight > 0) {
        logView("landing_page_view")
        clearInterval(checkBlockVisibility); // Останавливаем проверку
    } else if (attempts >= maxAttempts) {
        clearInterval(checkBlockVisibility); // Останавливаем проверку
    }

    attempts++;
}, checkInterval);

setTimeout(()=>{
    $(".risk-line__indicator").addClass("active");
},1000)

// Получаем все элементы табов и кнопки
const body = document.querySelector("body");
const tabs = document.querySelectorAll('.tab');
const progressBarElements = document.querySelectorAll('.progress-bar__el');
const nextButtons = document.querySelectorAll('.next-tab .btn');
const backButton = document.querySelector('.back-tab'); // Кнопка "Назад"
const progressBar = document.querySelector('.progress-bar-content');
const progressNum = document.querySelector('.progress-bar__num span'); // Элемент для отображения прогресса


function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // Устанавливаем время жизни куки
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`; // Записываем куку
}

// Функция для получения куки
function getCookie(name) {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        cookie = cookie.trim(); // Убираем пробелы
        if (cookie.startsWith(nameEQ)) {
            return cookie.substring(nameEQ.length); // Возвращаем значение куки
        }
    }
    return undefined; // Если кука не найдена, возвращаем undefined
}

//time
const timer = () => {
    const timeBlock = document.querySelectorAll('.time-sale__content');

    timeBlock.forEach((el) => {
        let time = el.textContent;
        let [minutes, seconds] = time.split(':').map(Number);

        function updateTime() {
            if (seconds > 0) {
                seconds--;
            } else if (minutes > 0) {
                minutes--;
                seconds = 59;
            }

            const formattedTime =
                String(minutes).padStart(2, '0') + ':' +
                String(seconds).padStart(2, '0');


            el.innerHTML = formattedTime;

            if (minutes === 0 && seconds === 0) {
                clearInterval(timer);
            }
        }

        const timer = setInterval(updateTime, 1000);
    })
}


// Переменная для отслеживания текущего таба
let currentTab ;

if(getCookie("userId")){
    $(".logo").addClass("hide")
    $(".tab-scan").addClass("d-none")
    currentTab = 14

    timer()

    $('.info-slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        prevArrow: false,
        nextArrow: false,
        autoplay: true,
        autoplaySpeed: 2000,
    });
    window.scrollTo(0, 0);
}else{
    currentTab = 0
}

$(".tab-start").on("click" , ()=>{
    $(".progress-bar").removeClass("hide");
    setTimeout(function (){
        $(".tab-start-page").removeClass("active show")

    },300)

    setTimeout(function (){
        $(".tab[data-tab='1']").addClass("active show")
    },300)

    logView("settlement_screen_view")
    window.scrollTo(0, 0);
    currentTabProgressBar ()
    currentTab++

})

function currentTabProgressBar (){
    setTimeout(function () {
        tabs[currentTab].classList.add('show');

        if (tabs[currentTab].classList.contains("tab--purple")) {
            changeThemeColor('#7b40c3');
            body.classList.add('purple-body')
        } else {
            changeThemeColor('#fff');
            body.classList.remove('purple-body')
        }

        if (currentTab < 11) {
            // Обновляем прогресс-бар
            progressBarElements.forEach((el, index) => {
                if (index < currentTab ) {
                    el.classList.add('done');
                } else {
                    el.classList.remove('done');
                }
            });

            // Обновляем отображение количества пройденных табов
            progressNum.textContent = currentTab ;

            // Управляем видимостью кнопки "Назад"
            if (currentTab === 1) {
                progressBar.classList.add('start');
                backButton.classList.add('d-none'); // Скрываем кнопку на первом табе
            } else {
                backButton.classList.remove('d-none'); // Показываем кнопку на остальных табах
            }
        } else {
            $(".progress-bar").hide()
        }
    }, 500)
}

// Функция для обновления прогресс-бара и отображения текущего таба
function updateProgress() {
    window.scrollTo(0, 0);
    if(currentTab - 1 > 0 && tabs[currentTab - 1].getAttribute("data-tab") === "email"){

        if(!validEmail($(".input-email"))){
            currentTab--
            return
        }
    }

    if(currentTab  > 0 && tabs[currentTab].getAttribute("data-tab") === "email"){
       setTimeout(()=>{
           $(".logo").addClass("hide");
       },300)
    }

    setTimeout(function (){
        tabs.forEach(tab => tab.classList.remove('show'));
        tabs.forEach(tab => tab.classList.remove('active'));

        // Добавляем класс active к текущему табу
        tabs[currentTab].classList.add('active');


    },300)

    currentTabProgressBar ()

}


const objEventAmplitude = {
    1: "settlement_screen_view",
    2: "sms_screen_view",
    3: "interlayer1_view",
    4: "card1_view",
    5: "card2_view",
    6: "card3_select_view",
    7: "interlayer2_view",
    8: "password1_view",
    9: "password2_view",
    10: "password3_view",
    "email": "email_view",
    "mailFocus": "email_field_click",
    "checkboxOn": "alert_on",
    "checkboxOff": "alert_off",
    "emailValid" : "is_lead",
    "emailError" : "email_error",
    "scan": "result_view",
    "info": "paywall_view",
    "protectClick" : "protect_click",
    "buy_click" : "buy_click",
    "paywall_end": "paywall_end",
    "pay": "checkout_view",
    "backPay" : "checkout_close"
}


function logView(data) {
    amplitude.logEvent(data);
}


// Обработчик события для кнопок "next"
nextButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Проверяем, не достигли ли мы последнего таба
        if (currentTab < tabs.length - 1) {
            if(currentTab > 0 && tabs[currentTab].getAttribute("data-tab") === "6"){
                if(!$(".checkbox-list__input:checked").length){
                    $('.error-checkbox').addClass("show");
                    setTimeout(()=>{
                        $('.error-checkbox').removeClass("show");
                    },2000)
                    return
                }
            }
            currentTab++;
            updateProgress();
            backButton.classList.remove('d-none');
            progressBar.classList.remove('start');
        } else {
            updateProgress();
            currentTab++;
        }
        let dataCurrentTab = tabs[currentTab].getAttribute("data-tab")
        if (dataCurrentTab === "email") {
            logView(objEventAmplitude[dataCurrentTab])
        }else if(objEventAmplitude[dataCurrentTab] !== undefined){
            logView(objEventAmplitude[dataCurrentTab])
        }

    });
});

$(".input-email").on("focus" , ()=>{
    logView(objEventAmplitude["mailFocus"])
})

$("#securityAlert").on("change" , function (){
    if(this.checked){
        logView(objEventAmplitude["checkboxOn"])
    }else{
        logView(objEventAmplitude["checkboxOff"])
    }
})


// Обработчик события для кнопки "Назад"
backButton.addEventListener('click', () => {
    // Проверяем, не находимся ли мы на первом табе
    if (currentTab > 0) {
        currentTab--;
        updateProgress();
    }

    if (!currentTab) {
        backButton.classList.add('d-none');
        progressBar.classList.add('start');
    }
});

$(".tab-pay .back-tab").on("click" , function (){
    currentTab--;
    updateProgress();
})

// Инициализация
updateProgress();

// Функция для изменения цвета темы
function changeThemeColor(color) {
    // Находим мета-тег с именем theme-color
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    // Если мета-тег найден, обновляем его content
    if (themeColorMeta) {
        themeColorMeta.setAttribute('content', color);
    }
}

$(".btn").on("click" , function (){
    let btnList = $(this).parent().find(".btn");
    $.each(btnList, function(index, el) {
        $(el).removeClass('active');
    });
    $(this).addClass("active")
})

function startAnimationScan() {
    setTimeout(function () {

        changeThemeColor('#ff453a');
        body.classList.remove('blue-body')
        body.classList.add('red-body')
    }, 3500)

    setTimeout(function () {
        $(".tab").removeClass("show active");

        setTimeout(()=>{
          $(".tab-scan").removeClass("z-index")
          $(".tab-scan").addClass("d-none")
        },300)

        $(".tab-result").addClass("show active");
        currentTab++;
    }, 6000)
}

function createUser(){
    const link = new URL(window.location.href);
    const clickId = link.searchParams.get('click_id') !== null ? link.searchParams.get('click_id') : generateUUID(10);

    setCookie('userId', clickId, 90);
    setCookie('userEmail', $(".input-email").val(), 90);

    const url = "https://rocknlabs.com/api/user/create";
    const data = {
        "email": $(".input-email").val(),
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
            console.log('Success:', responseData);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    sendPostRequest()

}

function validEmail (input){
    let emailInput = input.val();
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Регулярное выражение для валидации email

    if (!emailPattern.test(emailInput)) {
        return false
    } else {
       return true
    }
}

$("#openScan").on("click", () => {

    if(validEmail($(".input-email"))){

        $(".logo").addClass("hide");
        setTimeout(function (){
            body.classList.add('blue-body')
        },300)
        changeThemeColor('#4040c3');
        startAnimationScan()
        $(".tab-scan").addClass("z-index")
        var statistics = lottie.loadAnimation({
            container: document.getElementById('lottie'),
            renderer: 'svg', // тип рендерера
            loop: true, // зацикливание
            autoplay: true, // автозапуск
            path: 'animation/SecurityApp_Sсanner.json'
        });

        createUser()

        logView(objEventAmplitude["emailValid"])

    }else{
        $('#error').addClass("show");
        setTimeout(()=>{
            $('#error').removeClass("show");
        },1000)

        logView(objEventAmplitude["emailError"])
    }
})


$(".btn--time").on("click" , ()=>{
    logView(objEventAmplitude["protectClick"])
})

$("#payProtect").on("click" , ()=>{
    logView(objEventAmplitude["buy_click"])
})

$("#appDownload").on("click" , ()=>{
    logView("app_download")
})

$("#backPay").on("click" , ()=>{
    logView(objEventAmplitude["backPay"])
})

const tabInfo = document.querySelector('.tab-info');

// Определите функцию для обработки события прокрутки
function handleScroll() {
    const scrollTop = tabInfo.scrollTop;
    const clientHeight = tabInfo.clientHeight;
    const scrollHeight = tabInfo.scrollHeight;

    if (scrollTop + clientHeight >= scrollHeight - 250) {
        logView(objEventAmplitude["paywall_end"]);

        // Удаление обработчика события
        tabInfo.removeEventListener('scroll', handleScroll);
    }
}

// Добавление обработчика события
tabInfo.addEventListener('scroll', handleScroll);

$("#openInfoPage").on("click", function () {

    changeThemeColor('#fff');

    body.classList.remove('red-body');

    timer()

    $('.info-slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        prevArrow: false,
        nextArrow: false,
        autoplay: true,
        autoplaySpeed: 2000,
    });
})

$('.input-email').on('keydown', function(event) {
    if (event.key === 'Enter') {
        $(this).blur();
    }
});

var statistics = lottie.loadAnimation({
    container: document.getElementById('statistics'),
    renderer: 'svg', // тип рендерера
    loop: true, // зацикливание
    autoplay: true, // автозапуск
    path: 'animation/SecurityApp_Statistics.json'
});

var solution = lottie.loadAnimation({
    container: document.getElementById('solution'),
    renderer: 'svg', // тип рендерера
    loop: true, // зацикливание
    autoplay: true, // автозапуск
    path: 'animation/SecurityApp_Solution.json'
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.scroll-next').addEventListener('click', function() {
        const container = document.querySelector('.tab-info');
        const target = document.getElementById('scrollTarget');
        const targetPosition = target.getBoundingClientRect().top + container.getBoundingClientRect().top + container.scrollTop - 100;
        container.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});