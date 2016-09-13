var sendBtn = $("#sendBtn");
var pagetext = $("#page-text")[0];
var textBox = $("#txtMessage")[0];
var messageObj;
var progBarVisible = "";
toggleProgBar("success"); // Dirty fix, the elements seem to not be initializing their display css property to none from style.css
toggleProgBar("success");
toggleProgBar("warning");
toggleProgBar("warning");
toggleProgBar("danger");
toggleProgBar("danger");
sendBtn.on("click", function () {
    swal({
        title: "Analysing",
        text: "Analysing...one moment..",
        timer: 2000,
        showConfirmButton: false
    });
    var message = formatData(textBox.value);
    sendData(message, function (sentiment) {
        messageObj = new AnalysedMessage(textBox.value, sentiment);
        updateUI(messageObj);
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
        }
        else {
            pagetext.innerHTML = "Error";
        }
    })
        .fail(function (error) {
        pagetext.innerHTML = "Sorry, something went wrong. :( Try again in a bit?";
        console.log(error.getAllResponseHeaders());
    });
}
function updateUI(obj) {
    if (progBarVisible != "") {
        toggleProgBar(progBarVisible);
    }
    pagetext.innerHTML = "Sentiment:";
    var percent = obj.sentiment * 100;
    var colour = getProgressBarColour(obj.sentiment);
    var progBar = $("#prog-bar-" + colour);
    progBar[0].style.width = percent + "%";
    progBar[0].innerHTML = percent + "%";
    toggleProgBar(colour);
    progBarVisible = colour;
}
function toggleProgBar(colour) {
    var bar = document.getElementById('prog-bar-' + colour).parentNode;
    if (!(bar.style.display) || bar.style.display === 'none') {
        bar.style.display = 'block';
    }
    else {
        bar.style.display = 'none';
    }
}
function getProgressBarColour(sentiment) {
    if (sentiment < 0.2) {
        return "danger";
    }
    else if ((sentiment > 0.2) && (sentiment < 0.6)) {
        return "warning";
    }
    else {
        return "success";
    }
}
function formatData(text) {
    return "{\"documents\": [{"
        + "\"language\": \"en\","
        + "\"id\": \"1\","
        + "\"text\": \"" + text + "\"}]}";
}
// Future fields can be added: emoji count, key phrases, language detection
var AnalysedMessage = (function () {
    function AnalysedMessage(text, sentiment) {
        this.text = text;
        this.sentiment = sentiment;
        this.text = text;
        this.sentiment = sentiment;
    }
    return AnalysedMessage;
}());
