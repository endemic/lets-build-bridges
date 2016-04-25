/*globals Arcadia, LevelSelectScene, CreditsScene, localStorage, store, window */

(function (root) {
    'use strict';

    var ReviewNagScene = function (options) {
        Arcadia.Scene.apply(this, arguments);

        Arcadia.cycleBackground();

        options = options || {};

        // Never show again
        localStorage.setBoolean('nagShown', true);

        var text = [
            'I hope you\'ve enjoyed',
            'building bridges so far.',
            'Would you mind reviewing',
            'my app? I love feedback!'
        ];

        var description = new Arcadia.Label({
            position: {x: 0, y: -100},
            font: '20px monospace',
            text: text.join('\n')
        });
        this.add(description);

        /* Buttons */

        var buttonPadding = 15;

        var yesButton = new Arcadia.Button({
            position: { x: 0, y: 75 },
            color: null,
            border: '2px #fff',
            padding: buttonPadding,
            text: 'Sure thing',
            font: '20px monospace',
            action: function () {
                sona.play('button');

                // Go to game for when they come back
                Arcadia.changeScene(GameScene, {level: options.level});

                // Open app store
                if (Arcadia.ENV.ios) {
                    window.open('itms-apps://itunes.apple.com/app/id1020197906');
                } else if (Arcadia.ENV.android) {
                    window.open('market://details?id=com.ganbarugames.bridges', '_system');
                }
            }
        });
        this.add(yesButton);

        var noButton = new Arcadia.Button({
            position: { x: 0, y: 150 },
            color: null,
            border: '2px #fff',
            padding: buttonPadding,
            text: 'Don\'t bother me',
            font: '20px monospace',
            action: function () {
                sona.play('button');
                Arcadia.changeScene(GameScene, {level: options.level});
            }
        });
        this.add(noButton);
    };

    ReviewNagScene.prototype = new Arcadia.Scene();

    root.ReviewNagScene = ReviewNagScene;
}(window));
