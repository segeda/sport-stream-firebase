'use strict';

function sportStreamApp() {

    var app = document.getElementById('app');

    var sportStreamRef = new Firebase('https://<YOUR-FIREBASE-APP>.firebaseio.com/sport-stream');

    sportStreamRef.child('score').on('value', sportStreamScore);

    sportStreamRef.child('stream').on('child_added', sportStreamItem);

    function sportStreamItem(snapshot) {
        var item = snapshot.val();
        if (item) {
            var li = document.createElement('li');
            li.innerText = item.text;
            var ul = app.getElementsByTagName('ul')[0];
            ul.insertBefore(li, ul.firstChild);
        }
    }

    function sportStreamScore(snapshot) {
        var score = snapshot.val();
        if (score) {
            app.getElementsByTagName('h2')[0].innerHTML = (score.home || 0) + '&nbsp;:&nbsp;' + (score.visitor || 0);
        }
    }

    function init() {
        var h2 = document.createElement('h2');
        h2.innerHTML = '&nbsp;:&nbsp;';
        app.appendChild(h2);

        var ul = document.createElement('ul');
        app.appendChild(ul);
    }

    init();
}

function sportStreamAdmin() {

    var score = {};
    var admin = document.getElementById('admin');
    var input;

    var sportStreamRef = new Firebase('https://<YOUR-FIREBASE-APP>.firebaseio.com/sport-stream');

    sportStreamRef.child('score').on('value', function(snapshot) {
        if (snapshot.val()) {
            score = snapshot.val();
        }
    });

    function handleSubmit(event) {
        event.preventDefault();
        if (input.value && input.value.trim().length !== 0) {
            var itemRef = sportStreamRef.child('stream').push({ text: input.value });
            sportStreamRef.child('stream').child(itemRef.key()).setPriority(-1 * Date.now());
            input.value = '';
        }
    }

    function handleGoal(event) {
        var _score = score[event.target.name] || 0;
        var data = {};
        data[event.target.name] = _score + 1;
        sportStreamRef.child('score').update(data);
        var itemRef = sportStreamRef.child('stream').push({ text: 'Goal ' + event.target.name });
        sportStreamRef.child('stream').child(itemRef.key()).setPriority(-1 * Date.now());
    }

    function init() {
        var div = document.createElement('div');
        admin.appendChild(div);

        var form = document.createElement('form');
        form.addEventListener('submit', handleSubmit, false);
        div.appendChild(form);

        input = document.createElement('input');
        form.appendChild(input);

        var home = document.createElement('button');
        home.name = 'home';
        home.innerText = 'Home';
        home.addEventListener('click', handleGoal, false);
        div.appendChild(home);

        var visitor = document.createElement('button');
        visitor.name = 'visitor';
        visitor.innerText = 'Visitor';
        visitor.addEventListener('click', handleGoal, false);
        div.appendChild(visitor);
    }

    init();
}

window.addEventListener('load', sportStreamApp, false);
window.addEventListener('load', sportStreamAdmin, false);
