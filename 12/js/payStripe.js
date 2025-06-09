const stripe = Stripe("pk_test_51QkRlsJEAmaCVRCyzp14ggTmoGS1jvAwy8qctOUi2NmRDl4fY4cdI7EtBj2OfWnoCe3jywI9nM4pu1a70y9cH6db00ToNMBu7z",{
  betas: ['elements_link_autofill_never_v2']
});

const elementStyles = {
  base: {
    color: '#2e2e2e',
    fontSize: '17px',
    lineHeight: '22px',
    letterSpacing: '-0.073px',
    fontFamily: 'SF Pro Display, sans-serif',
    '::placeholder': {
      color: 'rgba(46, 46, 46, 0.70)',
      fontSize: '17px',
      lineHeight: '22px',
      fontWeight: "normal"
    }
  }
};

let elements;
let cardNumber, cardExpiry, cardCvc;


async function initialize() {
  try {

    elements = stripe.elements({
      appearance: {
        theme: 'stripe'
      }
    });

    cardNumber = elements.create('cardNumber', {
      style: elementStyles,
      placeholder: '1234 1234 1234 1234'
    });
    cardNumber.mount('#card-number-element');

    cardExpiry = elements.create('cardExpiry', {
      style: elementStyles,
      placeholder: 'MM/YY'
    });
    cardExpiry.mount('#card-expiry-element');

    cardCvc = elements.create('cardCvc', {
      style: elementStyles,
      placeholder: 'CVC'
    });
    cardCvc.mount('#card-cvc-element');

    $(".form-loader").addClass("hide")

    const handleInteraction = () => {
      $("#paymentFormSubmit").removeClass("btn--disabled")
    };

    cardNumber.on('focus', handleInteraction);
    cardExpiry.on('focus', handleInteraction);
    cardCvc.on('focus', handleInteraction);

    cardNumber.on('change', (event) => {
      if (event.complete) {
        cardExpiry.focus();
      }
    });

    cardExpiry.on('change', (event) => {
      if (event.complete) {
        cardCvc.focus();
      }
    });

    cardCvc.on('change', (event) => {
      if (event.complete) {
        $("#card-holder-element").focus();
      }
    });

  } catch (error) {
    console.error("Initialization error:", error);
    showMessage("Failed to initialize subscription form");
  }
}

// Получаем данные подписки с API
async function fetchSubscriptionData(paymentMethod) {
  const input = $(".tariff__item-pay:checked")
  const email = getCookie("userEmail");
  const trialPrice = input.attr("data-trial") ? input.attr("data-trial"): "price_1RGHEsJEAmaCVRCyyFouq8LT";
  const mainPrice = input.attr("data-main") ? input.attr("data-main"): "price_1RGHEsJEAmaCVRCyyFouq8LT";
  const response = await fetch('http://159.203.93.84/api/stripe/subscription_schedule_form', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: email,
      "trial_price_id": trialPrice,
      "regular_price_id": mainPrice,
      "payment_method_id": paymentMethod
    })
  });

  const data = await response.json();
  return {
    clientSecret: data.client_secret,
  };
}

//PaymentMethod
async function handleSubmit(e) {
  e.preventDefault();

  const userNameInput = $("#card-holder-element");

  if(!userNameInput.val()){
    userNameInput.addClass("StripeElement--invalid")
    return
  }else{
    userNameInput.removeClass("StripeElement--invalid")
  }

  setLoading(true);

  const email = getCookie("userEmail");

  try {
    // 1. Создаем PaymentMethod
    const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumber,
      billing_details: {
        email: email,
        address: { country: 'US' }
      }
    });

    if (pmError) throw pmError;

    // 2. Сразу подтверждаем платеж на клиенте
    const {clientSecret} = await fetchSubscriptionData(paymentMethod.id);

    const { paymentIntent, error: piError } = await stripe.confirmCardPayment(
      clientSecret, // clientSecret из initialize()
      {
        payment_method: paymentMethod.id,
        receipt_email: email
      }
    );

    if (piError) throw piError;

    // 3. Обработка результата
    switch (paymentIntent.status) {
      case 'succeeded':
        $(".popup-success").addClass("active")
        setCookie('successPay', "true", 90);
        await completeSubscription(paymentIntent.id);
        break;
      case 'requires_action':
        await stripe.handleCardAction(clientSecret);
        break;
      default:
        $(".popup-error").addClass("active")
        setCookie('successPay', "true", 90);
        throw new Error(`Unexpected status: ${paymentIntent.status}`);
    }

  } catch (error) {
    $(".popup-error").addClass("active")
    showMessage(error.message);
  } finally {
    setLoading(false);
  }
}

async function completeSubscription(paymentIntentId) {
  // Здесь можно добавить вызов вашего API для подтверждения подписки
  showMessage("Subscription activated successfully!");
  // Перенаправление или другие действия после успешной подписки
}

// UI helpers остаются без изменений
function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");
  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function() {
    messageContainer.classList.add("hidden");
    messageContainer.textContent = "";
  }, 4000);
}

function setLoading(isLoading) {
  if (isLoading) {
    document.querySelector("#paymentFormSubmit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#paymentFormSubmit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}

$('.tariff__item-pay').on('click', function() {
  const event = $(this).attr("data-price");
  amplitude.logEvent(event);
  initialize();

  const price = $(this).next().find(".tariff__period-price-new").text();
  $("#payWeak").text(price)

});

const payButton = document.querySelector(".pay-button");

payButton.addEventListener('click', function (){
  $(".loader-container").addClass("active");
  initialize();
  setTimeout(()=>{
    $(".loader-container").removeClass("active");
  },3000)
});

if(getCookie("userId")){
  initialize();
  startCountdown(600)
}

document.querySelector("#payment-form").addEventListener("submit", handleSubmit);















