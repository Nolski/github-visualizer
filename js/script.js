$(document).ready(function () {
	$('#submit').click(submit);
	$('#canvas').attr('width', $('#contain').width());
});

function submit() {
	var username = $('#username').val().toLowerCase(),
		repo = $('#repo').val().toLowerCase();

	var query = 'https://api.github.com/repos/' + username + '/' + repo;
	$('#data').show();
	$('#form').empty();
	$.getJSON(query, function ( data ) {
		console.log('asd ', data);
		drawData(data);
	});
}


function drawData( data ) {
	$('#username-info').append(data.owner.login);
	$('#profile-pic').attr('src', data.owner.avatar_url);

	var namelink = '<a href="' + data.homepage + '">' + data.name + '</a>';
	$('#name').append(namelink);
	$('#description').append(data.description);

	if(data.fork) {
		$('#forked').append('Yes! <img class="fork" src="img/fork.png" alt="" />');
	} else {
		$('#forked').append('<p>Nope! This project is 100% original! (We hope)</p>');
	}

	console.log('issues: ', data.open_issues);
	console.log('forks: ', data.forks / 20);

	if (data.open_issues > data.forks / 20) {
		var message = '<p>Yes, this repo has <code>' + data.open_issues + 
			"</code> open issues vs it's <code>" + data.forks + "</code> current forks" + '</p>';
		$('#repo-sucks').append(message);
	} else {
		var message = '<p>Nope! This repo has <code>' + data.open_issues + 
			"</code> open issues vs it's  <code>" + data.forks + "</code> current forks" + '</p>';
		$('#repo-sucks').append(message);
	}

	$('#language').append(codify(data.language));

	var commentsURL = data.comments_url;
	commentsURL = commentsURL.replace('{/number}', '');
	console.log(commentsURL);
	$.getJSON(commentsURL, loadComments);

	$.getJSON(data.contributors_url, loadGraph);
}

function loadComments ( data ) {
	for (var i = 0; i < 4; i++) {
		var comment = data[i],
			message = '<p class="comment">"' + comment.body + '" - ' + comment.user.login
				+ '</p>';
		$('#comments').append(message);
	}
}

function loadGraph( data ) {
	var canvas = document.getElementById('canvas'),
		context = canvas.getContext('2d'),
		i = 0;

	var graphData = {
		labels: [],
		datasets : [
			{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				data : []
			}
		]
	};
	console.log(data[2]);

	for(var i = 0; i < 20; i++) {
		var user = data[i];
		console.log('user: ', user);
		console.log(user.login);
		graphData.labels.push(user.login);
		graphData.datasets[0].data.push(user.contributions);
	}
	console.log(graphData);
	var contributors = new Chart(context).Bar(graphData, {});
}

function codify ( string ) {
	return '<code>' + string + '</code>';
}
