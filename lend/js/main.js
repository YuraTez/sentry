//animation
const animation = lottie.loadAnimation({
  container: document.querySelector("#lottiImgList"),
  renderer: 'svg',
  loop: false,
  autoplay: true,
  path: `assets/animation/main.json`
});

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

//slider

if($(window).width() < 1350){
  $('.working-process').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    prevArrow: false,
    nextArrow: false,
    /*autoplay: true,
    autoplaySpeed: 2000,*/
  });
}

$(".burger-js").on("click", function(){
  $(".burger-content").toggleClass("show");
})