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
  gtag('event', data);
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

const items = Array.from(document.querySelectorAll('.analyzing__item'));
const lineTrack = document.querySelector('.analyzing__line-track');

function animateLoading() {
  detectedIssues()
  let totalTime = 10000;
  let itemDuration = totalTime / items.length;
  let width = 0;

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
}

function detectedIssues(){
  const targetNumber = 34;
  const duration = 10000; // 8 секунд
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easing = Math.pow(progress, 2);
    const currentNumber = Math.floor(easing * targetNumber);

    document.querySelector('#issue-count').textContent = currentNumber;

    if (currentNumber > 0){
      items[currentNumber - 1].classList.add('active');
    }



   /* items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('active');
      }, (index + 1) * itemDuration);
    });*/


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

document.querySelector('.switcher input').addEventListener('change', function() {

  if(this.checked){
    setTimeout(() => {
      const targetPosition = $('#paymentBlock').offset().top - 50;

      $('html, body').css('overflow', '').animate(
        { scrollTop: targetPosition },
        800
      );
    }, 1000);
  }

});

function showAlertSecurity (){
  setTimeout(()=>{
    $(".security-alert").addClass("show");
  },1000)

  setTimeout(()=>{
    $(".security-alert").removeClass("show");
  },4000)
}

$(document).ready(function() {
  const $fixedBtn = $(".btn-fixed");
  const $formSubmitBtn = $("#paymentFormSubmit");
  let isFixedBtnHidden = false;

  // Плавный скролл к форме при клике
  $fixedBtn.on("click", function() {
    $("html, body").animate({
      scrollTop: $formSubmitBtn.offset().top - 50
    }, 800);
  });

  $(window).on("scroll", function() {
    const formBtnTop = $formSubmitBtn.offset().top;
    const scrollPosition = $(window).scrollTop() + $(window).height();
    const fixedBtnHeight = $fixedBtn.outerHeight();

    // Если прокрутили ДО кнопки формы (с учетом высоты фиксированной кнопки)
    if (scrollPosition >= formBtnTop + fixedBtnHeight) {
      if (!isFixedBtnHidden) {
        $fixedBtn.fadeOut(0);
        isFixedBtnHidden = true;
      }
    }
    // Если скроллим вверх — показываем кнопку
    else if (isFixedBtnHidden) {
      $fixedBtn.fadeIn(200);
      isFixedBtnHidden = false;
    }
  });
});