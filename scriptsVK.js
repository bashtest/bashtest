function getRandomArray(arr, how) {
	return arr.slice().sort(function(){ return 0.5-Math.random(); }).slice(0,how);
}

function getLevel(partball){
	var percent = Math.round(partball*100);
	var level = levels.filter(function(item){
		return item.min <= percent && item.max >= percent;
	});
	return level[0].level;
}

function getDescr(partball){
	var percent = Math.round(partball*100);
	var level = levels.filter(function(item){
		return item.min <= percent && item.max >= percent;
	});
	return level[0].descr;
}

$(function() {

	var ishttps = location.protocol == 'https:';
	var userid = +location.href.match(/viewer_id\=(\d+)\&/)[1];

    var main = {};

    main.page = ko.observable('start');
    main.ball = ko.observable(0);
    main.questions = ko.computed(function(){
    	var testQuestions = [];
    	for (var i=0; i<questions.length; i++){
    		var part = questions[i].data.map(function(item){
    			item.tasktext = questions[i].tasktext;
    			return item;
    		});//раздел
    		var how = questions[i].fortest;//сколько вопросов нужно с раздела
    		testQuestions = testQuestions.concat(getRandomArray(part, how));//получаем how вопросов случайных из массива part
			// console.log(how,getRandomArray(part, how));
    	}
    	return testQuestions;
    });
    main.count = ko.computed(function(){
    	return main.questions().length;
    });


	main.partball = ko.computed(function(){
		return main.ball()/main.count();
	});
	main.level = ko.computed(function(){
		return getLevel(main.partball());
	});
	main.description = ko.computed(function(){
		return getDescr(main.partball());
	});

    main.current = ko.observable(0);
    main.currentQuestion = ko.computed(function(){
    	return main.questions()[main.current()];
    });

    main.toAnswer = function(answer){
    	if (main.currentQuestion().variants[main.currentQuestion().answer] == answer)
    		main.ball(main.ball()+1);
		if (main.current()+1 == main.count()){
			main.page('result');
			$.get('db.php', {act: 'add', id: userid, ball: main.ball()});
		} else {
    		main.current(main.current()+1);
			$('#progress').progress('increment');
		}
    }

    main.current.subscribe(function(current){
		if (current == 1) {
	    	$('#progress').progress({
				value: 1,
				total: main.count()
			});
		    main.ball(0);
		}
    //     VK.callMethod('resizeWindow', document.getElementById('body').offsetWidth, document.getElementById('body').clientHeight);
    });

	main.postResult = function(){

	};

	main.rating = ko.observableArray();
	main.ratingFull = ko.observableArray();
	main.rating.subscribe(function (newValues){
		var ids = newValues.map(function(item){ return item.id }).join(',');
		VK.api('users.get', {user_ids: ids, fields: 'photo_50'}, function(response){
			var res = newValues.map(function(item, i){
				var data = response.response[i];
				var partball = Math.round((+item.ball)/main.count() * 100);
				return {
					id: item.id,
					name: data.first_name + ' ' + data.last_name,
					ava: data.photo_50,
					ball: partball + '%',
					level: getLevel(partball/100)
				};
			});
			main.ratingFull(res);
		});
	});

    main.refreshRating = function(){
	    $.get('db.php', {act: 'get'}, function(res){
	    	main.rating($.parseJSON(res));
	    });
	}

    main.page.subscribe(function(newPage){
    	if (newPage == 'rating')
    		main.refreshRating();
    	if (newPage == 'tests') {
    		main.current(0);
		    main.ball(0);
		    $('#progress').progress('reset');
    	}

    });

    main.myava = ko.observable('');
    main.refreshMyava = function(){
    	VK.api('users.get', {id: userid, fields: 'photo_400_orig'}, function(response){ console.log(response);
    		var photo = response.response[0].photo_400_orig;
    		main.myava(photo);
    	})
    }

	VK.init(function(){
	    ko.applyBindings(main, document.body);
	    main.refreshRating();
	    main.refreshMyava();
	    main.page.valueHasMutated();
	},function(){
		alert('Error initialing VK!');
	});

    window.main = main;
});
