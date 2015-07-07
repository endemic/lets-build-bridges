/*jslint sloppy: true, plusplus: true */
/*globals Arcadia */

var Title = function () {
    Arcadia.Scene.apply(this, arguments);

    this.color = 'blue';

    // Title
    var title = new Arcadia.Label({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 4
        },
        color: '#fff',
        font: '48px monospace',
        text: "Let's Build Bridges"
    });
    this.add(title);

    // Start button
    var button = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT - 100
        },
        color: null,
        border: '2px #fff',
        padding: 15,
        text: 'start',
        font: '20px monospace',
        action: function () {
            Arcadia.changeScene(Game);
        }
    });
    this.add(button);
};

Title.prototype = new Arcadia.Scene();
