if (getCookie("successPay")){
  $(".tab__page").removeClass("show")
  $(".tab__download").addClass("show");
} else if(getCookie("userId")){
  $(".tab__page").removeClass("show")
  $(".tab__pay").addClass("show");
  showAlertSecurity()
}

function logView(data) {
  amplitude.logEvent(data);
}

function switchTab() {
  window.scrollTo(0, 0);

  const $currentTab = $('.tab__page.show');

  const currentIndex = $currentTab.data('tab');

  const nextIndex = (currentIndex % $('.tab__page').length) + 1;

  $currentTab.removeClass('show');

  $(`.tab__page[data-tab="${nextIndex}"]`).addClass('show');

  $(".popup").removeClass("active")

  sendMetaPixel ()

}

$(".open-animation-tab").on("click", function(){
  switchTab()
  logView("scan_start_click")
  animateLoading();

})

//animation
function startLottiAnimation(container , path , loop){
  const animation = lottie.loadAnimation({
    container: document.querySelector(container),
    renderer: 'svg',
    loop: loop,
    autoplay: true,
    path: `assets/animation/${path}`
  });
}

startLottiAnimation("#lottiImgList" , "SentryFunnel.json" , true)

const items = document.querySelectorAll('.analyzing__item');
const lineTrack = document.querySelector('.analyzing__line-track');

function animateLoading() {
  detectedIssues()
  let totalTime = 8000;
  let itemDuration = totalTime / items.length;
  let width = 0;

  // Увеличиваем ширину линии
  const widthInterval = setInterval(() => {
    width += (100 / (totalTime / 100));
    lineTrack.style.width = width + '%';

    if (width >= 100) {
      clearInterval(widthInterval);

      setTimeout(()=>{
        $(".popup-scan").addClass("active");
        logView("scan_finish_view")
      },500)

    }
  }, 100);

  // Добавляем активный класс к элементам
  items.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('active');
    }, (index + 1) * itemDuration);
  });
}

function detectedIssues(){
  const targetNumber = 23;
  const duration = 8000; // 8 секунд
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easing = Math.pow(progress, 2);
    const currentNumber = Math.floor(easing * targetNumber);

    document.querySelector('#issue-count').textContent = currentNumber;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    }
  }

  requestAnimationFrame(updateCount);
}

$(".btn-popup").on("click", function(){
  $(".popup").removeClass("active");

  if($(this).hasClass("applePaySuccess")){
    $(".tab__page").removeClass("show");
    $(".tab__download").addClass("show");
  }else if($(this).closest(".popup-success").length){
    switchTab()
  }else{
    const productId = $('.tariff__item-pay:checked').val();
    postData(productId)
  }
})

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function getCookie(name) {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return cookie.substring(nameEQ.length);
    }
  }
  return undefined;
}

$("#offerSkip").on("click", switchTab)

function sendMetaPixel (){
  let tabEvent = $(".tab__page.show").attr("data-meta")
  if(tabEvent){
    fbq('track', tabEvent);
  }
}
sendMetaPixel ()

$('.tariffs--compact .tariff__item-content').on('click', function(e) {
  $('html, body').css('overflow', 'hidden');

  setTimeout(() => {
    const targetPosition = $('#paymentBlock').offset().top - 50;

    $('html, body').css('overflow', '').animate(
      { scrollTop: targetPosition },
      800
    );
  }, 1000);
});

locationData()

function showAlertSecurity (){
  setTimeout(()=>{
    $(".security-alert").addClass("show");
  },1000)

  setTimeout(()=>{
    $(".security-alert").removeClass("show");
  },4000)
}

$(".alert-btn__content").on("click", ()=>{
  $(".alert-btn__content").addClass("active")
  setTimeout(() => {
    const targetPosition = $('#paymentBlock').offset().top - 50;

    $('html, body').css('overflow', '').animate(
      { scrollTop: targetPosition },
      800
    );

    $(".alert-btn__content").removeClass("active")
  }, 500);
})