//animation
if($("#lottiImgList").length){
  const animation = lottie.loadAnimation({
    container: document.querySelector("#lottiImgList"),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: `assets/animation/main.json`
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

//slider

if($(window).width() < 1350 && $(".working-process").length){
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

$(".switch__el").on("click", function(){
  const plan = $(this).attr("data-plan")
  $('.switch__el').removeClass('active');
  $(this).addClass("active")
  $(".plans__elem").removeClass("show");
  $(`.plans__elem[data-plan=${plan}]`).addClass("show");
})


document.addEventListener("DOMContentLoaded", function() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate__animated", "animate__fadeInUp", "animate__fast");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
});