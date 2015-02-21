$(function() {

    VK.init();

    var main = {};
    main.page = ko.observable('start');
    main.page.subscribe(function(){
        VK.callMethod('resizeWindow', {
            width: document.body.offsetWidth,
            height: document.body.clientHeight
        });
    });

    ko.applyBindings(main, document.body);
});
