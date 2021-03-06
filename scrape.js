if (!($ = window.jQuery)) {
  script = document.createElement('script');
  script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
  script.onload = startScraper;
  document.body.appendChild(script);
} else {
  startScraper();
}
function startScraper() {

  var cleanUpItem = function(item) {
    return $.trim(item.replace(/\n\s*\n|\r\n\s*\r\n|\r\r/g, '').replace(/"/g, '\"'));
  };

  var banner = '<div id="banner" style="position:absolute;top:47px;padding:5px;font-size:20px;left:0;width:100%;background:green;color:#fff"> Scraping</div>';
  $('body').append(banner);
  var localS;
  var localT;
  if (!localStorage.getItem('lessonData')) {
    localS = [];
  } else {
    localS = JSON.parse(localStorage.getItem('lessonData'));
  }

  var item = {
    type: '',
    content: [],
    choices: [],
    scale: []
  };

  //multiple scale
  if ($('form > table > tbody> tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr').length > 0 &&
    $('form > table > tbody> tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody >tr:nth-child(1) > td').length > 0) {
    item.type = 'multiple_scales';
    $('#main >  form > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > p').toArray().forEach(function(c) {
      item.content.push(cleanUpItem(c.textContent));
    });

    $('table[cellpadding=2] p').toArray().forEach(function(c) {
      item.choices.push(cleanUpItem(c.textContent));
    });

    $('table[cellpadding=2] b').toArray().forEach(function(c) {
      item.scale.push(cleanUpItem(c.textContent));
    });
  }
  //poll
  if ($('input[type="radio"]').length &&
    $('input[onclick*="multiple_choice"]').length === 0 &&
    $('input[onclick*="true_false"]').length === 0 &&
    $('form > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td').length < 3) {
    if ($('form > table > tbody> tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody >tr:nth-child(1) > td').length === 0) {
      item.type = 'poll';
      $('#main > form > table > tbody > tr > td > p').toArray().forEach(function(c) {
        item.content.push(cleanUpItem(c.textContent));
      });

      $('#main > form > table > tbody > tr > td  > table  p').toArray().forEach(function(c) {
        item.choices.push(cleanUpItem(c.textContent));
      });
    }
  }

  //single scale
  if ($('#main > form > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) td').length > 3 && $('#main > form > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) td').length === 0) {
    item.type = 'scale';
    $('#main > form > table > tbody > tr > td  > table > tbody > tr:nth-child(1) > td').toArray().forEach(function(c) {
      item.choices.push(cleanUpItem(c.textContent));
    });
    //item.choices = [];
    $('td[xwidth]').toArray().forEach(function(c) {
      item.scale.push(cleanUpItem(c.textContent));
    });
  }

  //short answer
  if ($('input[onclick*="short_answer/reader"]').length && $('#main > form > table > tbody > tr > td em').length === 0) {
    item.type = 'short_answer';
    $('#main > form > table > tbody > tr > td p').toArray().forEach(function(c) {
      item.content.push(cleanUpItem(c.textContent));
    });
  }

  //true/false
  if ($('input[onclick*="true_false"]').length) {
    item.type = 'true_false';
    $('#main > form > table > tbody > tr > td  > p').toArray().forEach(function(c) {
      item.content.push(cleanUpItem(c.textContent));
    });
    item.choices =['True', 'False'];
  }

  //multiple choice
  if ($('input[onclick*="multiple_choice"]').length) {
    item.type = 'multiple_choice';
    $('#main > form > table > tbody > tr > td  > p').toArray().forEach(function(c) {
      item.content.push(cleanUpItem(c.textContent));
    });
    $('#main > form > table  > tbody > tr > td > table > tbody tr > td:nth-child(3)').toArray().forEach(function(c) {
      item.choices.push(cleanUpItem(c.textContent));
    });
  }

  //multiple response
  if ($('input[onclick*="multiple_response"]').length) {
    item.type = 'multiple_response';
    $('#main > form > table > tbody > tr > td  > p').toArray().forEach(function(c) {
      item.content.push(cleanUpItem(c.textContent));
    });
    $('#main > form > table > tbody > tr > td table p').toArray().forEach(function(c) {
      item.choices.push(cleanUpItem(c.textContent));
    });

  }

  if ($('input[type="checkbox"]').length && $('input[onclick*="multiple_response"]').length ===0) {
    item.type = 'multiple_response_with_sauce';
    $('#main > form > table > tbody > tr > td  > p').toArray().forEach(function(c) {
      item.content.push(cleanUpItem(c.textContent));
    });
    $('#main > form > table > tbody > tr > td table tr > td:nth-child(3)').toArray().forEach(function(c) {
      var extra_sauce ='';
      if($(c).find('textarea').length ||$(c).find('input[type="text"]').length) {
        extra_sauce = '**** Export Note ****: this should be a text entry - edit with Qualtrics';
      }
      item.choices.push(cleanUpItem(c.textContent) + ' ' + extra_sauce);
    });
  }

  // fill in the blanks
  if ($('input[onclick*="short_answer/reader"]').length && $('#main > form > table > tbody > tr > td em').length) {
    item.type = 'fill_blanks';
    $('#main > form > table > tbody > tr:nth-child(1) > td > p').toArray().forEach(function(c) {
      item.content.push(cleanUpItem(c.textContent));
    });
    $('#main > form > table > tbody > tr > td em').toArray().forEach(function(c) {
      item.choices.push(cleanUpItem(c.textContent));
    });
  }

  if ($('input[type="text"]').length) {
    item.type = 'text_input';
    $('#main > form > table > tbody > tr > td > table > tbody > tr > td > p').toArray().forEach(function(c) {
      item.content.push(cleanUpItem(c.textContent) + '**** Export Note: ***** the original question had fill in the blanks - edit with Qualtrics');
    });
  }

  //if none of the above - it is a note
  item.type = item.type || 'note';

  if (item.type === 'note') {
    $('#main > form > table > tbody > tr > td p').toArray().forEach(function(c) {
      item.content.push(cleanUpItem(c.textContent));
    });
  }
  //remove empties
  item.content = item.content.filter(function(n) {
    return n !== '';
  });
  localS.push(item);

  localStorage.setItem('lessonData', JSON.stringify(localS));

  if ($("img[src='/2k/media/icons/inv.next.gif']").length) {
    var url = $("img[src='/2k/media/icons/inv.next.gif']").parent('a').attr('href').split(':')[1];
    var gotoNext = new Function(url);
    gotoNext();
  } else {
    $('#banner').fadeOut();
    alert('This does not seem to be a Lessons question, sorry. Did you mean to download the question?');
  }
}
