/*jslint sloppy: true, plusplus: true */
/*globals Arcadia */

var Credits = function () {
    Arcadia.Scene.apply(this, arguments);

    var title,
        button,
        description;

    this.color = 'blue';

    title = new Arcadia.Label({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 4
        },
        font: '48px monospace',
        text: 'Thanks For Playing!'
    });
    this.add(title);

    description = new Arcadia.Label({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 4 + 200
        },
        font: '20px monospace',
        text: 'Programming by Nathan Demick\nPuzzle concept by Nikoli\n&copy; 2015 Ganbaru Games'
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
            Arcadia.changeScene(Title);
        }
    });
    this.add(button);
};

Credits.prototype = new Arcadia.Scene();
