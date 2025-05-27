function sendResetPassword(){

    const url = "https://rocknlabs.com/api/user/reset_password";
    const data = {
        "email": $("#email").val()
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
            $(".popup").addClass("show")
        } catch (error) {
            console.error('Error:', error);
        }
    }

    sendPostRequest()
}



$('#resetPassword').on('submit', function() {
    event.preventDefault()

    sendResetPassword()
});

$(".popup-btn").on("click" , function (){
    $(".popup").removeClass("show")
})