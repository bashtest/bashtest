$(function() {

    VK.init();

    var main = {};
    main.page = ko.observable('start');
    main.page.subscribe(function(){
        VK.callMethod('resizeWindow', document.getElementById('body').offsetWidth, document.getElementById('body').clientHeight);
    });
    main.page.valueHasMutated();

    ko.applyBindings(main, document.body);
});
