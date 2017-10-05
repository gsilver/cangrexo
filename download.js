if (!($ = window.jQuery)) {
  script = document.createElement('script');
  script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
  script.onload = startDownload;
  document.body.appendChild(script);
} else {
  startDownload();
}

function downloadCSVFile(data) {
  var outputFilename = encodeURI($('body  > table > tbody > tr > td > b:nth-child(1) > font').text() + '.json');
  // credit: http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
  var jsonContent = "data:application/json;charset=utf-8,";
  jsonContent = jsonContent + JSON.stringify(data, null, '\t');
  var encodedUri = encodeURI(jsonContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", outputFilename);
  document.body.appendChild(link); // Required for FF
  setTimeout(function() {
    link.click();
    localStorage.removeItem('lessonData');
  }, 800);
}

function startDownload() {

  if (!localStorage.getItem('lessonData')) {
    alert('No lesson data to download - scrape questions and try again');
  } else {
    if (window.confirm("When you download the scrape results you will also reset them.\n Are you sure you are done scraping this lesson?")) {
      localS = JSON.parse(localStorage.getItem('lessonData'));
      downloadCSVFile(localS);
    }
  }
}
