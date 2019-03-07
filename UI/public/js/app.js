window.onload = function () {
    const button = document.getElementById('mybtn');
    button.addEventListener('click', function (e) {
        fetch('/query', {method: 'GET'})
        .then(function(response) {
          if(response.ok) {
            console.log('click was recorded');
            return;
          }
          throw new Error('Request failed.');
        })
        .catch(function(error) {
          console.log(error);
        });

    });
}