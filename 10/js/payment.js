const url = 'https://rocknlabs.com/solidgate/generate_subscription_payment';

function generateUUIDString(length = 255) {
  // Генерируем UUID
  const uniqueId = generateUUID();

  // Проверяем, не превышает ли длина UUID заданную длину
  if (uniqueId.length > length) {
    throw new Error("UUID exceeds the specified length.");
  }

  // Заполняем оставшуюся часть строки пробелами
  const remainingLength = length - uniqueId.length;
  return uniqueId + ' '.repeat(remainingLength);
}

function postData(product){

  let clickId = getCookie("userId")


  const data = {
    "order_id": generateUUIDString().trim(),
    "product_id" : product,
    "order_description": "Premium package",
    "customer_account_id" : clickId ,
    "product_price_id": "625915e8-9830-45b8-b75e-5953fd589c9e",
    "customer_email": getCookie("userEmail"),
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Сеть ответила с ошибкой: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      const initData = {
        iframeParams: {
          containerId: 'solid-payment-form-container'
        },
        merchantData: {
          merchant: data.merchantId,
          signature: data.signature,
          paymentIntent: data.paymentIntent
        },
        formParams: {
          allowSubmit: false,
          buttonType: 'default',
          submitButtonText: 'Continue',
          isCardHolderVisible: false,
          hideCvvNumbers: false,
          formTypeClass: 'flat',
          autoFocus: false,
          width: "100%",
          responsive: true,
          applePayButtonParams: {
            enabled: true,
            containerId: 'solid-payment-apple-pay',
            color: 'white-outline',
            type: 'check-out',
            buttonOnly: true
          }
        },

        styles: {
          form_body:{
            "width": "100%",
            "min-width": "initial"
          },
          iframe: {
            width: "100%",
            maxWidth: "100%",
            border: "none",
            display: "none"
          },
        }
      }


      const  formPay = PaymentFormSdk.init(initData);

      formPay.on('success', e => {
        setTimeout(function (){
          setCookie('successPay', "true", 90);
          $(".popup-success").addClass("active")
          setCookie('successPay', "true", 90);
          if(e.data.entity === "applebtn"){
            $(".btn-success").addClass("applePaySuccess");
            amplitude.logEvent('apple_pay_success');
          }else{
            amplitude.logEvent('purchase_success');
          }

          amplitude.logEvent('success_view');
        },1000)
      })


    })
    .catch((error) => {
      console.error('Ошибка:', error);
    });
}

$('.tariff__item-pay').on('click', function() {
  const value = $(this).val();
  const price = $(this).next().find(".tariff__period-price-new").text();
  const event = $(this).attr("data-price");
  const period = $(this).next().find(".tariff__subscription-period").text().trim().toLowerCase()
  const cost = $(this).attr("data-cost");
  amplitude.logEvent(event);
  postData(value)
  $("#payWeak").text(price)
  $("#payAll").text(cost)
  if (period === "weekly") {
    $("#payTrial").text("1-week")
  }else{
    $("#payTrial").text("1-month")
  }
});


// Обработка нажатия кнопки
payButton.addEventListener('click', function (){
  $(".loader-container").addClass("active");
  postData("58f1f180-d8c5-489e-b5a6-b6508e8d43ae")
  setTimeout(()=>{
    $(".loader-container").removeClass("active");
  },3000)
});

if(getCookie("userId")){
  postData("58f1f180-d8c5-489e-b5a6-b6508e8d43ae")
  startCountdown(600)
}