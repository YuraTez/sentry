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


if(getCookie("successPay")){
    $(".progress-bar").hide()
    $(".logo").addClass("hide")
    $(".tab-scan").addClass("d-none")
    $(".tab-success").addClass("active show")
}else if(getCookie("userId")){
    $(".logo").addClass("hide")
    $(".tab-scan").addClass("d-none")
    currentTab = 12

    setTimeout(()=>{
        $(".risk-line").addClass("active");
    },1000)

    timer()

    slider(".info-slider")

    window.scrollTo(0, 0);
    updateProgress();
}else{
    currentTab = 0
    updateProgress();
}


/*$(".tab-start").on("click" , ()=>{
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

})*/

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
        if (currentTab < 10) {
            // Обновляем прогресс-бар
            progressBarElements.forEach((el, index) => {
                if (index < currentTab + 1 ) {
                    el.classList.add('done');
                } else {
                    el.classList.remove('done');
                }
            });

            // Обновляем отображение количества пройденных табов
            progressNum.textContent = currentTab + 1 ;

            // Управляем видимостью кнопки "Назад"
            if (!currentTab) {
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
    if(currentTab  > 0 && tabs[currentTab - 1].getAttribute("data-tab") === "email"){

        if(!validEmail($(".input-email"))){
            currentTab--
            return
        }
    }

    if(currentTab  > 0 && tabs[currentTab - 1].getAttribute("data-tab") === "email"){
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

function disableBtn(container){
    let list = container.querySelectorAll(".btn")
    list.forEach((el)=>{
        el.classList.add("disabled")
    })

    setTimeout(()=>{
        list.forEach((el)=>{
            el.classList.remove("disabled")
        })
    },3000)
}

// Обработчик события для кнопок "next"
nextButtons.forEach(button => {
    button.addEventListener('click', function () {

        if(this.classList.contains("disabled")){
            return
        }

        if(currentTab < 10){
            disableBtn(this.closest(".tab-btn"))
        }

        // Проверяем, не достигли ли мы последнего таба
        if (currentTab < tabs.length - 1) {
            if(currentTab > 0 && tabs[currentTab - 1].getAttribute("data-tab") === "5"){
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

const elements = document.querySelectorAll('.scan-animate__el');
let currentIndex = 0;

function animateElement(index) {
    if (index >= elements.length){
        setTimeout(()=>{
            $(".tab-scan").removeClass("z-index")
            $(".tab-scan").addClass("d-none")

            timer()

            slider(".info-slider")

            $(".risk-line").addClass("active");

        },1500)
        currentTab++;
        updateProgress();
        return;
    }

    const element = elements[index];
    const progressLine = element.querySelector('.scan-animate__el-progress-line');
    const infoNum = element.querySelector('.scan-animate__el-info-num');
    const infoIcon = element.querySelector('.scan-animate__el-info-icon');
    let progress = 0;

    // Устанавливаем цвет полоски для первого элемента
    if (index === 0) {
        progressLine.style.backgroundColor = 'blue'; // Синяя полоска для первого элемента
    }

    // Добавляем класс show к текущему элементу
    element.classList.add('show');

    const interval = setInterval(() => {
        progress += 5; // Увеличиваем прогресс на 5%
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            infoNum.textContent = `${progress}%`;
            progressLine.style.width = `${progress}%`;

            // Сначала скрываем текст, затем показываем иконку
            setTimeout(() => {
                infoNum.style.display = 'none'; // Скрываем текст
                infoIcon.classList.remove('d-none'); // Показываем иконку
            }, 300); // Задержка перед показом иконки

            // Скрываем полоску прогресса
            setTimeout(() => {
                element.querySelector('.scan-animate__el-progress').style.display = 'none';
                // Добавляем класс .done после скрытия полоски
                element.classList.add('done');
            }, 600); // Задержка перед добавлением класса .done

            setTimeout(() => {
                animateElement(index + 1); // Запускаем следующий элемент
            }, 1000); // Задержка перед переходом к следующему элементу
        } else {
            // Для всех, кроме первого, добавляем класс .error, если прогресс >= 50
            if (index !== 0 && progress >= 50) {
                element.classList.add('error'); // Добавляем класс .error
            }
            infoNum.textContent = `${progress}%`;
            progressLine.style.width = `${progress}%`;
        }
    }, 150); // Интервал обновления прогресса
}

function startAnimationScan() {
    setTimeout(()=>{
        animateElement(currentIndex);
    },1500)
    setTimeout(()=>{
        startCounter()
    },3000)
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

        startAnimationScan()
        $(".tab-scan").addClass("z-index")
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


$(".btn-ampletude").on("click" , ()=>{
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


$('.input-email').on('keydown', function(event) {
    if (event.key === 'Enter') {
        $(this).blur();
    }
});

function slider(element){
    $(element).slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        prevArrow: false,
        nextArrow: false,
        autoplay: true,
        autoplaySpeed: 2000,
    });
}

$('.video-btn__start, .video-btn__stop').on('click', function() {
    let $sliderEl = $(this).closest('.info-slider__el');
    let $video = $sliderEl.find('.info-slider__el-video video').get(0);

    $('.info-slider__el-video video').each(function() {
        if (this !== $video) {
            this.muted = true;
            $(this).closest('.info-slider__el').find('.video-btn__start').addClass('active');
            $(this).closest('.info-slider__el').find('.video-btn__stop').removeClass('active');
        }
    });

    if ($(this).hasClass('video-btn__start')) {
        $(this).removeClass('active');
        $sliderEl.find('.video-btn__stop').addClass('active');
        $video.muted = false;
    } else {
        $(this).removeClass('active');
        $sliderEl.find('.video-btn__start').addClass('active');
        $video.muted = true;
    }
});

function startCounter() {
    const digits = document.querySelectorAll('.digit');
    const targetNumber = Math.floor(Math.random() * (60 - 50 + 1)) + 50; // Генерируем случайное число от 50 до 150
    const duration = 14000; // Время анимации в миллисекундах
    const stepTime = Math.abs(Math.floor(duration / targetNumber)); // Время на каждый шаг

    let currentNumber = 0;

    const interval = setInterval(() => {
        if (currentNumber < targetNumber) {
            currentNumber++;
            updateDigits(currentNumber);
        } else {
            clearInterval(interval);
        }
    }, stepTime);
}

function updateDigits(number) {
    const digits = String(number).padStart(3, '0').split('');
    digits.forEach((digit, index) => {
        const span = document.getElementById(`digit${index + 1}`);
        span.textContent = digit; // Обновляем цифру
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault(); // Отменяем стандартное поведение ссылки

        const targetId = this.getAttribute('href'); // Получаем ID якоря
        const targetElement = document.querySelector(targetId); // Находим элемент по ID

        if (targetElement) {
            // Прокручиваем к элементу
            targetElement.scrollIntoView({ behavior: 'smooth' });

            // Удаляем якорь из URL после задержки
            setTimeout(() => {
                history.replaceState(null, null, ' '); // Удаляем якорь
            }, 500);
        }
    });
});