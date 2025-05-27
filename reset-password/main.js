$('.eye').on('click', function() {
    const $input = $(this).siblings('input');
    const $eyeClose = $(this).find('.eye__close');
    const $eyeOpen = $(this).find('.eye__open');

    // Переключаем тип поля и вид иконки
    const isPassword = $input.attr('type') === 'password';
    $input.attr('type', isPassword ? 'text' : 'password');

    // Переключаем классы для видимости иконок
    $eyeClose.toggleClass('visible', !isPassword);
    $eyeOpen.toggleClass('visible', isPassword);
});

function getToken(){
    const currentUrl = window.location.href;


    const urlObj = new URL(currentUrl);


    const token = urlObj.searchParams.get('token');

    return token
}

function sendResetPassword(){
    const url = "https://rocknlabs.com/api/user/change_password";
    const data = {
        "new_plain_password": $("#password").val(),
        "token" : getToken()
    }

    async function sendPostRequest() {
        try {
            const response = await fetch(url, {
                method: 'POST',
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
            console.log('Success:');
            $(".popup--success").addClass("show")
        } catch (error) {
            console.error('Error:', error);
        }
    }

    sendPostRequest()
}



$('#resetPassword').on('submit', function() {
    event.preventDefault()
    const password = $('#password').val();
    const confirmPassword = $('#newPassword').val();
    const inputPassword =  $("#newPassword");

    // Проверка на совпадение паролей
    if (password !== confirmPassword) {
        inputPassword.addClass("error")
        inputPassword.closest(".form-group").addClass("error")
        return;
    }

    // Проверка на соответствие требованиям
    const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?~`-]{8,}$/;

    if (!passwordRequirements.test(password)) {
       $(".popup-error").addClass("show")
        return;
    }

    inputPassword.removeClass("error")
    inputPassword.closest(".form-group").removeClass("error")
    sendResetPassword()
});

$(".popup-btn").on("click" , function (){
    $(".popup").removeClass("show")
})