/*globals Arcadia, LevelSelect, LEVELS, localStorage */

var InAppPurchaseScene = function () {
    'use strict';

    Arcadia.Scene.apply(this, arguments);

    this.initializeStore();

    var noButton,
        yesButton,
        description;

    this.color = 'purple';

    description = new Arcadia.Label({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 4 + 200
        },
        font: '20px monospace',
        text: 'I hope you\'ve enjoyed building bridges so far. Would you like to unlock the 85 remaining puzzles for only $0.99?'
    });
    this.add(description);

    yesButton = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT - 100
        },
        color: null,
        border: '2px #fff',
        padding: 15,
        text: 'Yes!',
        font: '20px monospace',
        action: function () {
            Arcadia.changeScene(LevelSelect);
        }
    });
    this.add(yesButton);

    noButton = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT - 150
        },
        color: null,
        border: '2px #fff',
        padding: 15,
        text: 'No thanks',
        font: '20px monospace',
        action: function () {
            Arcadia.changeScene(LevelSelect);
        }
    });
    this.add(noButton);
};

InAppPurchaseScene.prototype = new Arcadia.Scene();

InAppPurchaseScene.prototype.initializeStore = function () {
    // Let's set a pretty high verbosity level, so that we see a lot of stuff
    // in the console (reassuring us that something is happening).
    store.verbosity = store.INFO;

    // We register a dummy product. It's ok, it shouldn't
    // prevent the store "ready" event from firing.
    store.register({
        id: 'com.ganbarugames.bridges.unlock',
        alias: 'Unlock all puzzles',
        type: store.NON_CONSUMABLE
    });

    // When purchase of the full version is approved,
    // show some logs and finish the transaction.
    store.when('Unlock all puzzles').approved(function (order) {
        log('You just unlocked the FULL VERSION!');
        order.finish();
    });

    // When every goes as expected, it's time to celebrate!
    store.ready(function() {
        console.log("\\o/ STORE READY \\o/");
    });

    // After we've done our setup, we tell the store to do
    // it's first refresh. Nothing will happen if we do not call store.refresh()
    store.refresh();
};
