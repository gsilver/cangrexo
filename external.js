if (!($ = window.jQuery)) {
  script = document.createElement('script');
  script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
  script.onload = startScraper;
  document.body.appendChild(script);
} else {
  startScraper();
}

function startScraper() {
  //TODO: what about escaping troublesome chars?
  var banner = '<div id="banner" style="position:absolute;top:47px;padding:5px;font-size:20px;left:0;width:100%;background:green;color:#fff"> Scraping</div>';
  $('body').append(banner);
  var localS;
  if (!localStorage.getItem('lessonData')){
    localS = [];
  }
  else {
    localS = JSON.parse(localStorage.getItem('lessonData'));
  }
  var item = {type:'', content:[], choices:[], scale:[]};

  //multiple scale
  if ($('form > table > tbody> tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr').length > 0 &&
    $('form > table > tbody> tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody >tr:nth-child(1) > td').length > 0) {
    item.type = 'multiple_scales';
    console.log(item.type);
    $('#main >  form > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > p').toArray().forEach(function(c) {
      item.content.push($.trim(c.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
    });

    $('table[cellpadding=2] p').toArray().forEach(function(p) {
      item.choices.push($.trim(p.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
    });

    $('table[cellpadding=2] b').toArray().forEach(function(b) {
      item.scale.push($.trim(b.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
    });
  }
  //poll
  if ($('input[type="radio"]').length &&
    $('input[onclick*="multiple_choice"]').length === 0 &&
    $('input[onclick*="true_false"]').length === 0 &&
    $('form > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td').length < 3){
      if ($('form > table > tbody> tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody >tr:nth-child(1) > td').length === 0) {
        item.type = 'poll';
        console.log(item.type);
        $('#main > form > table > tbody > tr > td > p').toArray().forEach(function(c) {
          item.content.push($.trim(c.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
        });

        $('#main > form > table > tbody > tr > td  > table  p').toArray().forEach(function(c) {
          item.choices.push($.trim(c.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
        });


        $('#main > form > table > tbody > tr > td  > table  p').text();
      }

  }

  //single scale
  if ($('#main > form > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) td').length > 3 && $('#main > form > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) td').length === 0) {
    item.type = 'scale';
    console.log(item.type);
    $('#main > form > table > tbody > tr > td  > table > tbody > tr:nth-child(1) > td').toArray().forEach(function(c) {
      item.content.push($.trim(c.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
    });
    item.choices =[];
    $('td[xwidth]').toArray().forEach(function(c) {
      item.scale.push($.trim(c.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
    });


  }

  //short answer
  if ($('input[onclick*="short_answer/reader"]').length && $('#main > form > table > tbody > tr > td em').length ===0) {
    item.type = 'short_answer';
    console.log(item.type);
    $('#main > form > table > tbody > tr > td p').toArray().forEach(function(c) {
      item.content.push($.trim(c.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
    });
  }

  //true/false
  if ($('input[onclick*="true_false"]').length) {
    item.type = 'true_false';
    console.log(item.type);
    $('#main > form > table > tbody > tr > td  > p').toArray().forEach(function(c) {
      item.content.push($.trim(c.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
    });
  }

  //multiple choice
  if ($('input[onclick*="multiple_choice"]').length) {
    item.type = 'multiple_choice';
    console.log(item.type);
    $('#main > form > table > tbody > tr > td  > p').toArray().forEach(function(c) {
      item.content.push($.trim(c.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
    });
    $('#main > form > table  > tbody > tr > td > table > tbody tr > td:nth-child(3)').toArray().forEach(function(c) {
      item.choices.push($.trim(c.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
    });
  }

  //multiple response
  if ($('input[onclick*="multiple_response"]').length) {
    item.type = 'multiple_response';
    console.log(item.type);
    $('#main > form > table > tbody > tr > td  > p').toArray().forEach(function(c) {
      item.content.push($.trim(c.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
    });
    var ma_choices  = $('#main > form > table > tbody > tr > td table p').toArray().forEach(function(c) {
      item.choices.push($.trim(c.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
    });
  }

  // fill in the blanks
  if ($('input[onclick*="short_answer/reader"]').length && $('#main > form > table > tbody > tr > td em').length) {
    item.type = 'fill_blanks';
    console.log(item.type);
    $('#main > form > table > tbody > tr:nth-child(1) > td > p').toArray().forEach(function(c) {
      item.content.push($.trim(c.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
    });
    $('#main > form > table > tbody > tr > td em').toArray().forEach(function(c) {
      item.choices.push($.trim(c.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
    });
  }

  //if none of the above - it is a note
  item.type = item.type || 'note';

  if(item.type === 'note'){
    console.log(item.type);
    $('#main > form > table > tbody > tr > td p').toArray().forEach(function(c) {
      item.content.push($.trim(c.textContent.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '')));
    });
  }
  //remove empties
  item.content = item.content.filter(function(n){ return n !== ''; });

  localS.push(item);
  localStorage.setItem('lessonData', JSON.stringify(localS));
  //TODO: add structure to the content (prompt, choices at least)
  // also multiple scales are not returning content
  var url = $("img[src='/2k/media/icons/inv.next.gif']").parent('a').attr('href').split(':')[1];
  var gotoNext = new Function (url);
  gotoNext();

}
