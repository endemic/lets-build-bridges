/*globals Arcadia, LevelSelectScene, LEVELS, localStorage */

(function (root) {
    'use strict';

    var CreditsScene = function () {

        Arcadia.Scene.apply(this, arguments);

        Arcadia.cycleBackground();

        var title = new Arcadia.Label({
            position: { x: 0, y: -167 },
            font: '48px monospace',
            text: 'Thanks\nFor\nPlaying!'
        });
        this.add(title);

        var creditsText = [
            'Programming by Nathan Demick',
            'Puzzle concept by Nikoli',
            '(c) 2015-2016 Ganbaru Games',
            'https://ganbarugames.com'
        ];

        var description = new Arcadia.Label({
            position: { x: 0, y: 33 },
            font: '20px monospace',
            text: creditsText.join('\n')
        });
        this.add(description);

        var button = new Arcadia.Button({
            position: { x: 0, y: 200 },
            color: null,
            border: '2px #fff',
            padding: 20,
            text: 'OK',
            font: '20px monospace',
            action: function () {
                sona.play('button');
                Arcadia.changeScene(LevelSelectScene);
            }
        });
        this.add(button);
    };

    CreditsScene.prototype = new Arcadia.Scene();

    root.CreditsScene = CreditsScene;
}(window));
