/*globals Arcadia, LevelSelectScene, LEVELS, localStorage */

var CreditsScene = function () {
    'use strict';

    Arcadia.Scene.apply(this, arguments);

    var title,
        button,
        description;

    Arcadia.cycleBackground();

    title = new Arcadia.Label({
        position: { x: 0, y: -167 },
        font: '48px monospace',
        text: 'Thanks\nFor\nPlaying!'
    });
    this.add(title);

    description = new Arcadia.Label({
        position: { x: 0, y: 33 },
        font: '20px monospace',
        text: 'Programming by Nathan Demick\nPuzzle concept by Nikoli\n© 2015 Ganbaru Games\nhttp://ganbarugames.com'
    });
    this.add(description);

    button = new Arcadia.Button({
        position: { x: 0, y: 200 },
        color: null,
        border: '2px #fff',
        padding: 10,
        text: 'OK',
        font: '20px monospace',
        action: function () {
            // Clear out saved level data here! start over like a champ
            localStorage.setObject('completed', new Array(LEVELS.length));
            sona.play('button');
            Arcadia.changeScene(LevelSelectScene);
        }
    });
    this.add(button);
};

CreditsScene.prototype = new Arcadia.Scene();
