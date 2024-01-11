function searching(input) {
    input.classList.add("active");
    var input, filter, ul, li, a, i, txtValue;
    filter = input.value.toUpperCase();
    ul = document.getElementById("search-results");
    li = ul.getElementsByTagName("div");
    for (i = 0; i < li.length; i++) {
        a = li[i];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function fun(obj){
   obj.classList.add("active");
}