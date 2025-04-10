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

// Функция для генерации customer_account_id  нужно заменить потом на тот который будет с базы
function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

const btnPayTemplate = ()=>{
  return`
  <div id="solid-form-button-submit" class="btn btn--solid-submit btn--disabled">
                            Continue
  </div>
  `
}

function postData(product){
  $("#solid-form-button-submit").remove()
  $("#solid-payment-form-container").append(btnPayTemplate())
  const link = new URL(window.location.href);

  let clickId = getCookie("userId")


  const data = {
    "order_id": generateUUIDString().trim(),
    "product_id" : product,
    "order_description": "Premium package",
    "customer_account_id" : clickId ,
    "product_price_id": "625915e8-9830-45b8-b75e-5953fd589c9e",
    "customer_email": getCookie("userEmail"),
  };
  amplitude.logEvent('frame_loading_started');

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
          isCardHolderVisible: true,
          hideCvvNumbers: true,
          headerText: 'Enter your debit or credit card details (from merchant)',
          titleText: 'Join over 500000 users, who stays protected online',
          formTypeClass: 'flat',
         /* googleFontLink: 'SF Pro Display',*/
          autoFocus: false,
          width: "100%",
          responsive: true,
          applePayButtonParams: {
            enabled: true,
            containerId: 'solid-payment-apple-pay',
            color: 'white-outline',
            type: 'check-out'
          }
        },

        styles: {
          form_body:{
            "width": "100%",
            "min-width": "initial"
          },
          submit_button: {
            'background-color': '#4c61ff',
            'font-size': '17px',
            'font-weight': '600',
            "border-radius": "100px",
            "text-transform": "none",
            ':hover': {
              'background-color': '#5890ff'
            },
            form_body: {
              /*'font-family': 'SF Pro Display, sans-serif'*/
            }
          },
          iframe: {
            width: "100%",
            maxWidth: "100%",
            border: "none",
          },
        }
      }

      $("#solid-form-button-submit").on("click", ()=> {
        formPay.submit()
      })

      const  formPay = PaymentFormSdk.init(initData);

      formPay.on('mounted', e => {
        amplitude.logEvent('frame_loading_finished');
        if(e.data.entity === "applebtn"){
          amplitude.logEvent('apple_pay_intent');
        }
      })

      let cardNumber = true
      let cardCvv = true
      let cardExpiryDate = true

      formPay.on('interaction', e => {
        const data = e.data ;
        if(data.target.type === "button"){
          amplitude.logEvent('purchase_intent');
          const fieldValues = Object.values(data.cardForm.fields);
          const hasInvalid = fieldValues.some(field => !field.isValid);

          if (hasInvalid){
            amplitude.logEvent('purchase_intent_fail');
          }
        }

        Object.keys(data.cardForm.fields).forEach(key => {
          const field = data.cardForm.fields[key];
          $("#solid-form-button-submit").removeClass("btn--disabled");

          if(key === "cardNumber" && field.isValid && cardNumber){
            amplitude.logEvent('card_field_fill');
            return  cardNumber = false
          }

          if(key === "cardExpiryDate" && field.isValid && cardExpiryDate){
            amplitude.logEvent('expire_fill');
            return  cardExpiryDate = false
          }

          if(key === "cardCvv" && field.isValid && cardCvv){
            amplitude.logEvent('cvv_fill');
            return  cardCvv = false
          }

        });
      })

      formPay.on('success', e => {
        setTimeout(function (){
          setCookie('successPay', "true", 90);
          $(".popup-success").addClass("active")
          if(e.data.entity === "applebtn"){
            $(".btn-success").addClass("applePaySuccess");
            amplitude.logEvent('apple_pay_success');
          }else{
            amplitude.logEvent('purchase_success');
          }

          amplitude.logEvent('success_view');
        },1000)
      })

      formPay.on('fail', e => {
        $(".popup-error").addClass("active")
        if(e.data.entity === "applebtn"){
          amplitude.logEvent('apple_pay_fail');
        }else{
          amplitude.logEvent('purchase_fail');
        }
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
  amplitude.logEvent(event);
  postData(value)
  $("#payWeak").text(price)
});


// Обработка нажатия кнопки
const payButton = document.querySelectorAll(".pay-button");

payButton.forEach((el)=>{
  el.addEventListener('click', function (){
    $(".loader-container").addClass("active");
    postData("58f1f180-d8c5-489e-b5a6-b6508e8d43ae")
    setTimeout(()=>{
      $(".loader-container").removeClass("active");
    },3000)
  });
})

if(getCookie("userId")){
  postData("58f1f180-d8c5-489e-b5a6-b6508e8d43ae")
  startCountdown(600)
}