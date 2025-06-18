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

const  quizContent ={
    1 : {
        "title" : "Identity Theft Risk",
        "text" : "Scammers might be attempting to collect your data for identity theft."
    },
    2 : {
        "title" : "Weak & Exposed Passwords",
        "text" : "Reusing passwords means that if one gets leaked, all your accounts are at risk."
    },
    3 : {
        "title" : "Weak & Exposed Passwords",
        "text" : "Reusing passwords means that if one gets leaked, all your accounts are at risk."
    },
    4 : {
        "title" : "Fraud Risks",
        "text" : "Without regular checks, fraudulent transactions could go unnoticed."
    },
    5 : {
        "title" : "Exposure to Call Fraud",
        "text" : "Scam calls and fake websites often lead to stolen personal or financial information."
    },
    6 : {
        "title" : "Your Device is Compromised",
        "text" : "Clicking on these “Virus“ warnings installs real malware and steals your data."
    },
    7 : {
        "title" : "Data Exposed",
        "text" : "Leaked personal info fuels scams and identity theft."
    },
    8 : {
        "title" : "Phone Not Protected",
        "text" : "Without protection, scam calls and fake sites can trick you."
    },
    9 : {
        "title" : "Accounts Aren’t Safe",
        "text" : "A single data breach could let hackers in."
    },
}

const templateQuizErrorElement = (obj)=>{
    return`
    <div class="scan-result__el">
                    <div class="scan-result__el-icon">
                        <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="12" y="8.5" width="8" height="18" fill="white"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3 16.5C3 9.3203 8.8203 3.5 16 3.5C23.1797 3.5 29 9.3203 29 16.5C29 23.6797 23.1797 29.5 16 29.5C8.8203 29.5 3 23.6797 3 16.5ZM16 11.5C16.5523 11.5 17 11.9477 17 12.5V17.5C17 18.0523 16.5523 18.5 16 18.5C15.4477 18.5 15 18.0523 15 17.5V12.5C15 11.9477 15.4477 11.5 16 11.5ZM16 22.5C16.5523 22.5 17 22.0523 17 21.5C17 20.9477 16.5523 20.5 16 20.5C15.4477 20.5 15 20.9477 15 21.5C15 22.0523 15.4477 22.5 16 22.5Z" fill="#FF453A"/>
                        </svg>
                    </div>
                    <div class="scan-result__el-description">
                        <div class="scan-result__el-title">${obj.title}</div>
                        <div class="scan-result__el-text">${obj.text}</div>
                    </div>
                </div>
    `
}

function addNumbersRecursively(currentNumber ,quizCnt ) {
    if (quizCnt.length < 3) {
        quizCnt.push(currentNumber);
        addNumbersRecursively(currentNumber + 1 , quizCnt);
    }
}


function addErrorQuizElems(quizCnt){
    let containerQuizErrorElems = document.querySelector(".scan-result__list")

    if(quizCnt.length < 3){

        addNumbersRecursively(7 , quizCnt)

        quizCnt.forEach((el) => {
            containerQuizErrorElems.innerHTML +=  templateQuizErrorElement(quizContent[el]);
        });
    }else{
        quizCnt.sort().forEach((el)=>{

            if(el === 3  && quizCnt.includes(2)){
                return
            }

            containerQuizErrorElems.innerHTML +=  templateQuizErrorElement(quizContent[el]);
        })
    }
}

function logView(data) {
    amplitude.logEvent(data);
}

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
let quizError ;

if(getCookie("userId")){
    $(".logo").addClass("hide")
    $(".tab-scan").addClass("d-none")
    quizError = JSON.parse(getCookie('quiz'));
    addErrorQuizElems(quizError)
    currentTab = 9

    timer()
    slider($('.info-slider'))

    window.scrollTo(0, 0);
}else{
    currentTab = 0
    quizError = []
}

$(".tab-start").one("click" , ()=>{
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

        if (currentTab < 7) {
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
            $(".logo").hide()
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

$(".btn").on("click" , function (){
    if(this.classList.contains("disabled")){
        return
    }
    let btnList = $(this).parent().find(".btn");
    $.each(btnList, function(index, el) {
        $(el).removeClass('active');
    });
    $(this).addClass("active")
})

// Обработчик события для кнопок "next"
nextButtons.forEach(button => {
    button.addEventListener('click', function () {
        if(this.classList.contains("disabled")){
            return
        }

        let parent = this.closest(".tab")

        // Проверяем, не достигли ли мы последнего таба
        if (currentTab < tabs.length - 1) {
            currentTab++;

            if(currentTab < 8 && this.classList.contains("show-alert")){

                if (!quizError.includes(currentTab - 1)) {

                    quizError.push(currentTab - 1)
                }

                disableBtn(this.closest(".tab-btn"))

                parent.classList.add("show-alert")
                setTimeout(()=>{
                    updateProgress();
                    backButton.classList.remove('d-none');
                    progressBar.classList.remove('start');
                    setTimeout(()=> parent.classList.remove("show-alert"),100)
                },3000)
            }else{
                updateProgress();
                backButton.classList.remove('d-none');
                progressBar.classList.remove('start');


                let indexQuizError = quizError.indexOf(currentTab - 1)

                if (indexQuizError !== -1) {
                    quizError.splice(indexQuizError, 1);
                }
            }


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


$(".btn--time").on("click" , ()=>{
    logView(objEventAmplitude["protectClick"])
})

$(".pay-button").on("click" , ()=>{
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

const elements = document.querySelectorAll('.scan-animate__el');
let currentIndex = 0;

function animateElement(index) {
    if (index >= elements.length){
        setTimeout(()=>{
            $(".tab-scan").removeClass("z-index")
            $(".tab-scan").addClass("d-none")
            timer()
            slider(".info-slider")
        },1500)
        addErrorQuizElems(quizError)
        setCookie('quiz', JSON.stringify(quizError), 90);
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
            }, 800); // Задержка перед переходом к следующему элементу
        } else {
            // Для всех, кроме первого, добавляем класс .error, если прогресс >= 50
            if (index !== 0 && progress >= 50) {
                element.classList.add('error'); // Добавляем класс .error
            }
            infoNum.textContent = `${progress}%`;
            progressLine.style.width = `${progress}%`;
        }
    }, 100); // Интервал обновления прогресса
}

function startAnimationScan() {
    animateElement(currentIndex);

}

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



let totalSeconds = 4 * 3600 + 22 * 60 + 31;

window.onload = function() {

    function updateTimer() {
        // Вычисляем часы, минуты и секунды
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Обновляем отображение таймера
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        // Уменьшаем общее количество секунд
        if (totalSeconds > 0) {
            totalSeconds--;
        } else {
            clearInterval(timerInterval); // Останавливаем таймер, когда время истекло
        }
    }

// Обновляем таймер каждую секунду
    const timerInterval = setInterval(updateTimer, 1000);
};
