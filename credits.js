/*globals Arcadia, LevelSelect, LEVELS, localStorage */

var Credits = function () {
    'use strict';

    Arcadia.Scene.apply(this, arguments);

    var title,
        button,
        description;

    this.color = 'purple';

    title = new Arcadia.Label({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 4
        },
        font: '48px monospace',
        text: 'Thanks\nFor\nPlaying!'
    });
    this.add(title);

    description = new Arcadia.Label({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 4 + 200
        },
        font: '20px monospace',
        text: 'Programming by Nathan Demick\nPuzzle concept by Nikoli\n© 2015 Ganbaru Games\nhttp://ganbarugames.com'
    });
    this.add(description);

    button = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT - 100
        },
        color: null,
        border: '2px #fff',
        padding: 15,
        text: 'OK',
        font: '20px monospace',
        action: function () {
            // Clear out saved level data here! start over like a champ
            localStorage.setObject('completed', new Array(LEVELS.length));
            Arcadia.playSfx('button');
            Arcadia.changeScene(LevelSelect);
        }
    });
    this.add(button);
};

Credits.prototype = new Arcadia.Scene();
