var sendBtn = $("#sendBtn");
var pagetext = $("#page-text")[0];
var textBox = $("#txtMessage")[0];

sendBtn.on("click", function () {
  swal({
    title: "Analyzing",
    text: "Analyzing...one moment..",
    timer: 2000,
    showConfirmButton: false
  });
  message = formatData(textBox.value);
  sendData(message, function (sentiment) {
    updateUI(sentiment);
  });
});

function sendData(message, callback) {
  $.ajax({
    url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment",
    beforeSend: function (xhrObj) {
      // Request headers
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "4b90f1b4682d46228aa274663c50c322");
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader("Accept", "application/json");
    },
    type: "POST",
    data: message,
    processData: false
  })
    .done(function (data) {
      if (data.length != 0) {
        var score = data.documents[0].score;
        callback(score); // Success
      } else {
        pagetext.innerHTML = "Error";
      }
    })
    .fail(function (error) {
      pagetext.innerHTML = "Sorry, something went wrong. :( Try again in a bit?";
      console.log(error.getAllResponseHeaders());
    });
}

function updateUI(sentiment) {
  pagetext.innerHTML = "Sentiment:";
  var percent = sentiment * 100;
  var colour = getProgressBarColour(sentiment);
  var progBar = $("#prog-bar-" + colour);
  progBar[0].style.width = percent + "%";
  progBar[0].innerHTML = percent + "%";
  toggleProgBar(colour);
  toggleProgBar(colour); // For some reason this statement needs to execute twice to work
}

function toggleProgBar(colour) {
  var bar = document.getElementById('prog-bar-' + colour).parentNode;
  if (bar.style.display === 'none') {
    bar.style.display = 'block';
  } else {
    bar.style.display = 'none';
  }
}

function getProgressBarColour(sentiment) {
  if (sentiment < 0.2) {
    return "danger";
  } else if ((sentiment > 0.2) && (sentiment < 0.6)) {
    return "warning";
  } else {
    return "success";
  }
}

function formatData(text) { // This is the format the API requires
  return "{\"documents\": [{"
    + "\"language\": \"en\","
    + "\"id\": \"1\","
    + "\"text\": \"" + text + "\"}]}";
}