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

// Функция для генерации UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
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

function postData(){
    const link = new URL(window.location.href);

    let clickId

    if(getCookie()){
        clickId = getCookie("userId")
    }else{
        clickId = link.searchParams.get('click_id') !== null ? link.searchParams.get('click_id') : generateUUID(10);
    }
    const data = {
        "order_id": generateUUIDString(),
        "product_id" : "0598d54b-7240-4c67-913a-ab188240c14a",
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
                    buttonType: 'default',
                    submitButtonText: 'Pay',
                    isCardHolderVisible: true,
                    hideCvvNumbers: true,
                    headerText: 'Enter your debit or credit card details (from merchant)',
                    titleText: 'Join over 500000 users, who stays protected online',
                    formTypeClass: 'flat',
                    googleFontLink: 'https://fonts.cdnfonts.com/css/sf-pro-display?styles=98774,98773',
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
                        'background-color': '#4040c3;',
                        'font-size': '16px',
                        'font-weight': 'bold',
                        ':hover': {
                            'background-color': '#4040c3;'
                        },
                        form_body: {
                            'font-family': 'SF Pro Display'
                        }
                    },
                    iframe: {
                        width: "100%",
                        maxWidth: "100%",
                        border: "none",
                    },
                }
            }

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
                const data = e.data // InteractionMessage

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

                    if(key === "cardNumber" && field.isValid && cardNumber){
                        amplitude.logEvent('card_field_fill');
                        return  cardNumber = false
                    }

                    if(key === "cardExpiryDate" && field.isValid && cardExpiryDate){
                        console.log(data)
                        amplitude.logEvent('expire_fill');
                        return  cardExpiryDate = false
                    }

                    if(key === "cardCvv" && field.isValid && cardCvv){
                        console.log(data)
                        amplitude.logEvent('cvv_fill');
                        return  cardCvv = false
                    }

                });
            })

            formPay.on('success', e => {
                setTimeout(function (){
                    setCookie('successPay', "true", 90);
                    $(".tab").removeClass("active show");
                    $(".tab-success").addClass("active show")

                    if(e.data.entity === "applebtn"){
                        amplitude.logEvent('apple_pay_success');
                    }else{
                        amplitude.logEvent('purchase_success');
                    }

                    amplitude.logEvent('success_view');
                },1000)
            })

            formPay.on('fail', e => {
                $(".tab").removeClass("active show");
                $(".tab-error-pay").addClass("active show")

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


// Обработка нажатия кнопки
const payButton = document.querySelectorAll(".pay-button");

payButton.forEach((el)=>{
    el.addEventListener('click', function (){
        if(this.classList.contains("btn-error-pay")){
            $(".tab").removeClass("active show");
            setTimeout(function (){
                $(".tab-pay").addClass("active show")
            },1000)
        }
        postData()
    });
})

