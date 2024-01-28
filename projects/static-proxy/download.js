const form = document.querySelector('form');
const input = document.querySelector('input');

form.addEventListener('submit', async event => {
    event.preventDefault();
    window.navigator.serviceWorker.register('./sw.js', {
        scope: __uv$config.prefix
    }).then(() => {
        let url = input.value.trim();
        if (!isUrl(url)) url = 'https://www.google.com/search?q=' + url;
        else if (!(url.startsWith('https://') || url.startsWith('http://'))) url = 'http://' + url;
        url = url.replace("you", "000");
      document.querySelector("iframe").src=__uv$config.prefix + __uv$config.encodeUrl(url);
      function timeout(){
      document.body.innerHTML = document.querySelector('iframe').contentWindow.document.querySelector("#downloadPage").outerHTML;
        document.body.style.backgroundColor ='white';
        document.body.innerHTML +='<video controls src="" style="border:hidden;overflow:hidden;position:absolute;top:0;left:0%;bottom:0%;right:0%;width:100%;height:100%;display:none;"></video>';
      }
      function timeout2(){
      var x = document.querySelectorAll("a");
        for(var i = 0; i < x.length; i++){
          x[i].outerHTML += "<button class='" + x[i].className + "' onclick='playUrl(" + JSON.stringify(x[i].href) + ")'>Play</button>";
        }
      }
      setTimeout(timeout2, 5100);
      setTimeout(timeout, 5000);
    });
});

function isUrl(val = ''){
    if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
    return false;
};
