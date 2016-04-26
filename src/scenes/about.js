/*jslint this, browser */
/*global window, Arcadia, sona, LevelSelectScene, LEVELS */

(function (root) {
    'use strict';

    var AboutScene = function () {
        Arcadia.Scene.apply(this);

        Arcadia.cycleBackground();

        var BUTTON_MARGIN = 65;

        var title = new Arcadia.Label({
            text: 'about',
            font: '64px monospace',
            position: {x: 0, y: -200}
        });
        this.add(title);

        var backButton = new Arcadia.Button({
            position: {x: -this.size.width / 2 + 35, y: -this.size.height / 2 + 25},
            size: {width: 60, height: 40},
            color: null,
            border: '2px white',
            text: '<-',
            font: '24px monospace',
            action: function () {
                sona.play('button');
                Arcadia.changeScene(LevelSelectScene);
            }
        });
        this.add(backButton);

        var creditsText = [
            'Programming by Nathan Demick',
            'Puzzle concept by Nikoli',
            '(c) 2015-2016 Ganbaru Games',
            'https://ganbarugames.com'
        ];

        var detailLabel = new Arcadia.Label({
            text: creditsText.join('\n'),
            font: '20px monospace',
            position: {x: 0, y: -75}
        });
        this.add(detailLabel);

        var dataResetButton = new Arcadia.Button({
            position: {x: 0, y: 60},
            size: {width: 240, height: 50},
            color: null,
            border: '2px white',
            text: 'reset data',
            font: '36px monospace',
            action: function () {
                sona.play('button');

                if (window.confirm('Reset all saved data?')) {
                    var completed = [];
                    while (completed.length < LEVELS.length) {
                        completed.push(null);
                    }
                    localStorage.setObject('completed', completed);
                }
            }
        });
        this.add(dataResetButton);

        if (Arcadia.ENV.cordova) {
            var rateButton = new Arcadia.Button({
                position: {x: 0, y: dataResetButton.position.y + BUTTON_MARGIN},
                size: {width: 240, height: 50},
                color: null,
                border: '2px white',
                text: 'feedback',
                font: '36px monospace',
                action: function () {
                    window.sona.play('button');

                    if (Arcadia.ENV.ios) {
                    	window.open('itms-apps://itunes.apple.com/app/id1020197906');
                    } else if (Arcadia.ENV.android && cordova.InAppBrowser) {
                        cordova.InAppBrowser.open('market://details?id=com.ganbarugames.nonogramjs', '_system');
                    }
                }
            });
            this.add(rateButton);

            var moreGamesButton = new Arcadia.Button({
                position: {x: 0, y: rateButton.position.y + BUTTON_MARGIN},
                size: {width: 240, height: 50},
                color: null,
                border: '2px white',
                text: 'more games',
                font: '36px monospace',
                action: function () {
                    window.sona.play('button');

                    if (Arcadia.ENV.ios) {
	                    window.open('itms-apps://itunes.com/apps/ganbarugames');
	                } else if (Arcadia.ENV.android && cordova.InAppBrowser) {
                        cordova.InAppBrowser.open('market://search?q=pub:Ganbaru+Games', '_system');
                    }
                }
            });
            this.add(moreGamesButton);
        }
    };

    AboutScene.prototype = new Arcadia.Scene();

    root.AboutScene = AboutScene;
}(window));
