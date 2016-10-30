'use strict';

(($) => {
  $(() => {

    const API_BASE_URL = 'http://localhost:9000/api';

    // tickers: trial.tickers_train.join(','),
    // predict_ticker: trial.ticker_predict,
    // date_start: trial.date_train_start,
    // date_end: trial.date_end,
    // date_test_start: trial.date_test_start,

    $('#tickers-train').material_chip({
      placeholder: 'add more tags',
      secondaryPlaceholder: 'Training Tickers',
      data: [{
        tag: 'MSFT'
      }, {
        tag: 'AMZN'
      }]
    });

    $('#tickers-predict').material_chip({
      placeholder: 'add more tags',
      secondaryPlaceholder: 'Predict Tickers',
      data: [{
        tag: 'MSFT'
      }]
    });

    // Enable datepickers
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15 // Creates a dropdown of 15 years to control year
    });

    const data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "First",
            fill: false,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 90]
        }, {
            label: "Second",
            fill: false,
            backgroundColor: "rgba(142, 68, 173,0.4)",
            borderColor: "rgba(142, 68, 173,1.0)",
            pointBorderColor: "rgba(142, 68, 173,1.0)",
            pointBackgroundColor: "#fff",
            pointHoverBackgroundColor: "rgba(142, 68, 173,1.0)",
            pointHoverBorderColor: "rgba(142, 68, 173,1.0)",
            data: [65, 69, 70, 41, 56, 59, 73]
        }]
    };

    const myLineChart = new Chart(document.getElementById('chart'), {
      type: 'line',
      data: data
    });

    // When a form is submitted
    $('#predict-form').on('submit', (ev) => {
      ev.preventDefault();

      const $loader = $('#loader');
      $loader.toggleClass('hide');

      const parseDateInput = (date_str) => {
        const d = new Date(date_str);
        const m = d.getMonth() + 1;
        return `${d.getFullYear()}-${m >= 10 ? m : '0' + m}-${d.getDate()}`;
      }

      const form_data = {
        train_tickers: $('#tickers-train').material_chip('data').map(v => v.tag),
        predict_tickers: $('#tickers-predict').material_chip('data').map(v => v.tag),
        date_train_start: parseDateInput($('#date-train-start').val()),
        date_test_start: parseDateInput($('#date-test-start').val()),
        date_end: parseDateInput($('#date-end').val())
      };

      $.ajax({
        method: 'post',
        url: `${API_BASE_URL}/learner/train-predict`,
        data: {
          form: JSON.stringify(form_data)
        }
      })
      .then(resp => {
        $loader.toggleClass('hide');
        $('#results').html(resp);
        return null;
      })
      .catch(err => {
        $loader.toggleClass('hide');
        console.debug('Failed to trian model.', err)
      });
    })

    // to update a chart
    // setTimeout(() => {
    //   myLineChart.data.datasets[0].data = [65, 59, 80, 81, 56, 55, 100];
    //   myLineChart.update();
    // }, 2000);

  });
})(jQuery);
