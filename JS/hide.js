    var urlObj = new window.URL(window.location.href);
    var url = "https://games-site.github.io/";
 
    if (url) {
        var win;
 
        document.getElementById('hide').onclick = function() {
            if (win) {
                win.focus();
            } 
            else {
                win = window.open();
                win.document.body.style.margin = '0';
                win.document.body.style.height = '100vh';
                var iframe = win.document.createElement('iframe');
                iframe.style.border = 'none';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.margin = '0';
                iframe.src = url;
                win.document.body.appendChild(iframe);
                location.replace("https://classroom.google.com/");
            }
        };
    }