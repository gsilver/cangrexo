javascript: (function() {
  console.log('clicked');
  var djsCode = document.createElement('script');
  djsCode.setAttribute('src', 'https://cdn.rawgit.com/gsilver/cangrexo/master/download.js');
  console.log(djsCode);
  document.body.appendChild(djsCode);
}());
