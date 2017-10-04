if (!($ = window.jQuery)) {
  script = document.createElement('script');
  script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
  script.onload = startScraper;
  document.body.appendChild(script);
} else {
  startScraper();
}

function startScraper() {

  var localS = JSON.parse(localStorage.getItem('lessonData'));
  if (!localStorage.getItem('lessonData')){
    localS = [];
  }
  else {
    localS = JSON.parse(localStorage.getItem('lessonData'));
  }
  var item = {type:'', content:'', choices:[], scale:[]};
  var type;
  var content;

  //console.log($('table[cellpadding=2] p'));
  //multiple scale
  if ($('form > table > tbody> tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr').length > 0 &&
    $('form > table > tbody> tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody >tr:nth-child(1) > td').length > 0) {
    item.type = 'multiple_scales';
    item.content = 'multiple_scales';
    var a  = $('table[cellpadding=2] p').toArray();
    //TODO: trim these of line endings

    a.forEach(function(p) {
      item.choices.push(p.textContent);
    });

    $('table[cellpadding=2] b').toArray().forEach(function(b) {
      item.scale.push(b.textContent);
    });

//*[@id="main"]/form/table/tbody/tr/td/table/tbody/tr[2]/td[2]/table/tbody/tr[2]/td[1]

  }

  //poll
  if ($('input[type="radio"]').length) {
    if ($('input[onclick*="multiple_choice"]').length === 0) {
      if ($('form > table > tbody> tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody >tr:nth-child(1) > td').length === 0) {
        item.type = 'poll!';
        item.content = $('#main > form > table > tbody > tr > td  > table  p').text();
      }
    }
  }
  //single scale
  if ($('#main > form > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) td').length > 3 && $('#main > form > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) td').length === 0) {
    item.type = 'scale';
    item.content = $('#main > form > table > tbody > tr > td  > table  p').text();
  }
  //short answer

  if ($('input[onclick*="short_answer/reader"]').length) {
    item.type = 'short_answer';
    item.content = $('#main > form > table > tbody > tr > td p').text();
  }
  //true/false
  if ($('input[onclick*="true_false"]').length) {
    item.type = 'true_false';
    item.content = $('#main > form > table > tbody > tr > td  > p').text();
  }
  //multiple choice
  if ($('input[onclick*="multiple_choice"]').length) {
    item.type = 'multiple_choice';
    item.content = $('#main > form > table > tbody > tr > td  > p').html() + $('#main > form > table  > tbody > tr > td > table > tbody tr > td:nth-child(3)').text();
  }
  //multiple response
  if ($('input[onclick*="multiple_response"]').length) {
    item.type = 'multiple_response';
    item.content = $('#main > form > table > tbody > tr > td  > p').text() + $('#main > form > table > tbody > tr > td table p').text();
  }
  if ($('input[onclick*="short_answer/reader"]').length && $('#main > form > table > tbody > tr > td em').length) {
    item.type = 'fill_blanks';
    item.content = $('#main > form > table > tbody > tr > td p').html();
  }


  //if none of the above - it is a note
  item.type = item.type || 'note';


  if(item.type === 'note'){
    item.content = $('#main > form > table > tbody > tr > td p').text();
  }

  item.content = item.content.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '\n');
  localS.push(item);
  localStorage.setItem('lessonData', JSON.stringify(localS));
  //TODO: add structure to the content (prompt, choices at least)
  // also multiple scales are not returning content

}
