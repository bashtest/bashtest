function getRandomArray(arr, how) {
	return arr.slice().sort(function(){ return 0.5-Math.random(); }).slice(how);
}


$(function() {

    //VK.init();

    var main = {};

    main.ball = ko.observable(0);
    main.page = ko.observable('start');

    main.questions = ko.computed(function(){
    	var testQuestions = [];
    	for (var i=0; i<questions.length; i++){
    		var part = questions[i].data.map(function(item){
    			item.tasktext = questions[i].tasktext;
    			return item;
    		});//раздел
    		var how = part.fortest;//сколько вопросов нужно с раздела
    		testQuestions = testQuestions.concat(getRandomArray(part, how));//получаем how вопросов случайных из массива part
    	}
    	return testQuestions;
    });
    main.count = ko.computed(function(){
    	console.log(main.questions());
    	return main.questions().length;
    });

    main.current = ko.observable(0);
    main.currentQuestion = ko.computed(function(){
    	return main.questions()[main.current()];
    });
    // main.numTitle = ko.computed(function(){
    // 	return (main.current()+1) + '/' + main.count();
    // });
    main.toAnswer = function(answer){
    	if (main.currentQuestion().variants[main.currentQuestion().answer] == answer)
    		main.ball(main.ball()+1);
    	main.current(main.current()+1);
    }

    main.current.subscribe(function(current){
    	$('#progress').progress();
    //     VK.callMethod('resizeWindow', document.getElementById('body').offsetWidth, document.getElementById('body').clientHeight);
    });
    main.page.valueHasMutated();

    ko.applyBindings(main, document.body);

    $('#progress').progress();
});
