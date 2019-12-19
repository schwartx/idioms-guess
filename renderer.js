document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("#page-1 button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", loadGame);
    }
});

let parse = require('csv-parse');
let fs = require('fs');
let idioms = [];
let parser = parse({delimiter: ';'}, function(err, data) {idioms = data});
fs.createReadStream('fs_read.csv').pipe(parser);

function loadGame(btn) {
    s("#page-1").setAttribute("class", "page hide");
    s("#page-1").addEventListener("webkitAnimationEnd", transition);
    s("#page-1").addEventListener("mozAnimationEnd", transition);
    s("#page-1").addEventListener("animationend", transition);

    const difficulty = parseInt(btn.target.getAttribute("data-limit"));
    let select_idiom_i = 0;
    let curr_difficulty = 1;
    s("#page-2 h2 span").innerHTML = idioms[select_idiom_i][curr_difficulty];

    s("#page-2 input").addEventListener("keypress", function (e) {
        if (e.keyCode === 13) {
            s("#page-2 button").click();
        }
    });

    s("#page-2 button").addEventListener("click", function () {
        const input = s("#page-2 input").value;
        saveInput(input);
        if (input === idioms[select_idiom_i][0]) {
            if (select_idiom_i < idioms.length-1) {
                select_idiom_i++;
                curr_difficulty = 1;
                s("#page-2 h2 span").innerHTML = idioms[select_idiom_i][curr_difficulty];
                s(".used span").innerHTML = "";
            }
            else {
                game_end();
            }
        }
        else if (input === "") {
            s(".response").innerHTML = "Please enter something!";
            return;
        }
        else {
            s(".response").innerHTML = "Try again!";
            if (curr_difficulty < difficulty) {
                curr_difficulty++;
                s("#page-2 h2 span").innerHTML += "<br>" + idioms[select_idiom_i][curr_difficulty];
            }
        }
        s("body").setAttribute("class", "alert");
        setTimeout(function () {
            s("body").removeAttribute("class");
        }, 900);
        updateCounter();
        s("#page-2 input").value = null;
    });
}

function transition() {
    s("#page-1").style.display = "none";
    s("#page-2").style.display = "block";
    s("#page-2").setAttribute("class", "page show");
}

function updateCounter() {
	const num = s(".tries span");
	const intNum = parseInt(num.innerHTML);
	num.innerHTML = intNum + 1;
}

function saveInput(input) {
    if (input) {
        if (s(".tries span").innerHTML !== "0") {
            s(".used span").innerHTML = s(".used span").innerHTML + ", " + input;
        } else {
            s(".used span").innerHTML = input;
        }
    }
}

function s(e) {
    return document.querySelector(e);
}

function game_end() {
    updateCounter();
    const tries = parseInt(s(".tries span").innerHTML);
    s("#page-2").style.display = "none";
    s("#page-3").style.display = "block";
    s("#page-3").setAttribute("class", "page show");
    s("#page-3 p span").innerHTML = tries;

    if (tries === idioms.length) {
        s("#page-3>p").innerHTML = "WOW! all A's!";
        s(".tip").innerHTML = "Impressive!";
    } else if (tries < idioms.length * 2) {
        s(".tip").innerHTML = "That's pretty good!";
    }
}