if (!($ = window.jQuery)) {
  script = document.createElement('script');
  script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
  script.onload = startDownload;
  document.body.appendChild(script);
} else {
  startDownload();
}


function itemTypeResolver(type) {
  switch (type) {
    case 'note':
      return '[[Question:Text]]';
    case 'short_answer':
      return '[[Question:TextEntry]]';
    case 'multiple_choice':
      return '[[Question:MC:SingleAnswer]]';
    case 'multiple_response':
      return '[[Question:MC:MultipleAnswer:Vertical]]';
    case 'scale':
      return '[[Question:Matrix]]';
    case 'multiple_scales':
      return '[[Question:Matrix]]';
    case 'poll':
      return '[[Question:MC:SingleAnswer]]';
    case 'true_false':
      return '[[Question:MC:SingleAnswer]]';
    case 'fill_blanks':
      return '[[Essay]]';
    default:

  }
}

function textify(data) {
  var txt = '[[AdvancedFormat]]' + '\n' ;
  var i = 0;
  data.forEach(
    function(item) {
      if (item.type !== 'fill_blanks') {
        txt = txt + '\n' + itemTypeResolver(item.type) + '\n' + item.content + '\n';
        if (item.choices.length) {
          txt = txt + '[[Choices]]' + '\n';
        }
        item.choices.forEach(
          function(choice) {
            txt = txt + choice + '\n';
          });

        if (item.type === "multiple_scales") {

          if (item.scale.length) {
            txt = txt + '[[AdvancedAnswers]]';
          }

          item.scale.forEach(
            function(scale) {
              txt = txt + '\n' + '[[Answer]]' + '\n' + scale + '\n';
            });

        } else {

          if (item.scale.length) {
            txt = txt + '[[Choices]]' + '\n';
          }

          item.scale.forEach(
            function(scale) {
              txt = txt + scale + '\n';
            });

        }


      }
    }
  );
  return txt;
}


function downloadJSON(data) {
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


function downloadTxtFile(data) {
  var outputFilename = encodeURI($('body  > table > tbody > tr > td > b:nth-child(1) > font').text() + '.txt');
  // credit: http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
  var txtContent = "data:text/plain;charset=utf-8,";
  txtContent = txtContent + textify(data);
  console.log(txtContent);
  var encodedUri = encodeURI(txtContent);
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
      downloadTxtFile(localS);
    }
  }
}
