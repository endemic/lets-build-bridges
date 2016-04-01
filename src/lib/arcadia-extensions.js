/*jslint sloppy: true */
/*globals Arcadia, window, document, localStorage */

Arcadia.isLocked = function () {
    return window.store !== undefined && localStorage.getBoolean('unlocked') === false;
};

Arcadia.cycleBackground = function () {
    var COLORS = ['red', 'green', 'purple', 'blue', 'teal', 'grey', 'maroon', 'black'],
        currentColorIndex;

    currentColorIndex = parseInt(localStorage.getItem('currentColorIndex'), 10) || 0;

    currentColorIndex += 1;

    if (currentColorIndex >= COLORS.length) {
        currentColorIndex = 0;
    }

    localStorage.setItem('currentColorIndex', currentColorIndex);
    document.body.style['background-color'] = COLORS[currentColorIndex];
    return COLORS[currentColorIndex];
};
