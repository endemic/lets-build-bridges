/*globals Arcadia, LevelSelectScene, LEVELS, localStorage */

var UnlockScene = function () {
    'use strict';

    Arcadia.Scene.apply(this, arguments);

    var noButton,
        restoreButton,
        yesButton,
        description;

    this.color = 'purple';

    // Should never occur; for testing on desktop only
    if (window.PRODUCT_DATA === undefined) {
        window.PRODUCT_DATA = { price: '$999' };
    }

    description = new Arcadia.Label({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 3
        },
        font: '20px monospace',
        text: 'I hope you\'ve enjoyed\nbuilding bridges so far.\nWould you like to\nunlock 85 more puzzles\nfor only ' + window.PRODUCT_DATA.price + '?'
    });
    this.add(description);

    /* Buttons */

    yesButton = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT - 250
        },
        color: null,
        border: '2px #fff',
        padding: 15,
        text: 'Yes, please',
        font: '20px monospace',
        action: function () {
            window.store.order(UnlockScene.PRODUCT_ID);
        }
    });
    this.add(yesButton);

    noButton = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT - 200
        },
        color: null,
        border: '2px #fff',
        padding: 15,
        text: 'No, thanks',
        font: '20px monospace',
        action: function () {
            Arcadia.changeScene(CreditsScene);
        }
    });
    this.add(noButton);

    restoreButton = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT - 100
        },
        color: null,
        border: '2px #fff',
        padding: 15,
        text: 'Restore purchase',
        font: '20px monospace',
        action: function () {
            window.store.order(UnlockScene.PRODUCT_ID);
        }
    });
    this.add(restoreButton);
};

UnlockScene.prototype = new Arcadia.Scene();

UnlockScene.PRODUCT_ID = 'com.ganbarugames.bridges.unlock';

UnlockScene.initializeStore = function () {
    if (window.store === undefined) {
        return;
    }

    // Let's set a pretty high verbosity level, so that we see a lot of stuff
    // in the console (reassuring us that something is happening).
    store.verbosity = store.INFO;

    // We register a dummy product. It's ok, it shouldn't
    // prevent the store "ready" event from firing.
    store.register({
        id: UnlockScene.PRODUCT_ID,
        alias: 'Unlock all puzzles',
        type: store.NON_CONSUMABLE
    });


    store.when('Unlock all puzzles').updated(function (p) {
        // p = {id, price, loaded, valid, canPurchase }
        window.PRODUCT_DATA = p;
    });

    // When purchase of the full version is approved,
    // show some logs and finish the transaction.
    store.when('Unlock all puzzles').approved(function (order) {
        console.log('You just unlocked the FULL VERSION!');
        
        localStorage.setBoolean('unlocked', true);
        order.finish();

        Arcadia.changeScene(LevelSelectScene);
    });

    // When every goes as expected, it's time to celebrate!
    store.ready(function() {
        console.log("\\o/ STORE READY \\o/");
    });

    // After we've done our setup, we tell the store to do
    // it's first refresh. Nothing will happen if we do not call store.refresh()
    store.refresh();
};
