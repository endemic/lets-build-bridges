/*jslint sloppy: true, plusplus: true */
/*globals Arcadia */

var LevelSelect = function () {
    Arcadia.Scene.apply(this, arguments);
    
    var spacing = 52, // for 40x40 objects
        completed,
        levels,
        counter = 0,
        rows = 5,   // Show 25 levels per page; maybe shoot for 100 levels?
        columns = 5,
        centerX = Arcadia.WIDTH / 2,
        centerY = Arcadia.HEIGHT / 2,
        gridWidth = rows * spacing,
        gridHeight = columns * spacing,
        startX = centerX - gridWidth / 2 + spacing / 2,
        startY = centerY - gridHeight / 2 + spacing / 2,
        y,
        x,
        shape,
        _this;

    _this = this;
    this.color = 'purple';
    this.levels = [];
    this.selected = null;
    completed = localStorage.getObject('completed') || [];
    levels = localStorage.getObject('levels') || [];

    // Object that tracks player's cursor/finger; used for collision detection 
    this.cursor = new Arcadia.Shape({
        size: { width: 8, height: 8 },
        vertices: 0,
        color: 'white'
    });
    this.add(this.cursor);
    this.deactivate(this.cursor);

    // Draw grid of level buttons
    // TODO: support circular buttons?
    for (y = startY; y < startY + gridHeight; y += spacing) {
        for (x = startX; x < startX + gridWidth; x += spacing) {
            shape = new Vertex({
                number: (counter + 1),
                position: { x: x, y: y }
            });
            this.add(shape);
            this.levels.push(shape);
            if (completed[counter]) {
                shape.color = 'lime';
            }
            if (!levels[counter]) {
                shape.color = 'red';
            }
            counter += 1;
        }
    }

    this.previousButton = new Arcadia.Button({
        position: {
            x: startX,
            y: startY - spacing
        },
        color: null,
        border: '2px #fff',
        text: '<=',
        font: '20px monospace',
        action: function () {
            Arcadia.playSfx('button');
            // TODO: show previous page of levels
        }
    });
    this.add(this.previousButton);

    this.nextButton = new Arcadia.Button({
        position: {
            x: startX + gridWidth - spacing,
            y: startY - spacing
        },
        color: null,
        border: '2px #fff',
        text: '=>',
        font: '20px monospace',
        action: function () {
            Arcadia.playSfx('button');
            // TODO: show previous page of levels
        }
    });
    this.add(this.nextButton);

    this.pageLabel = new Arcadia.Label({
        text: '1 / 4',
        font: '20px monospace',
        position: {
            x: centerX,
            y: startY - spacing
        }
    });
    this.add(this.pageLabel);
    // Create grid of puzzle buttons - clicking one will take you to
    // the puzzle immediately (but temporarily will need a play/edit distinction
    // so that levels can be created)

    // Puzzles hidden behind IAP wall will be red, normal will be purple,
    // completed will be green

    // Need to allow circular buttons in Arcadia.Button

    // Probably need pagination, as well, since will have more puzzles than
    // can fit on one screen

    // Can link to a more info/feedback view from here as well

    this.playButton = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT - 150
        },
        color: null,
        border: '2px #fff',
        padding: 15,
        text: 'play',
        font: '20px monospace',
        action: function () {
            Arcadia.playSfx('button');
            Arcadia.changeScene(Game, { level: _this.selected });
        }
    });
    this.add(this.playButton);

    this.editButton = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT - 100
        },
        color: null,
        border: '2px #fff',
        padding: 15,
        text: 'edit',
        font: '20px monospace',
        action: function () {
            Arcadia.playSfx('button');
            Arcadia.changeScene(Editor, { level: _this.selected });
        }
    });
    this.add(this.editButton);
};

LevelSelect.prototype = new Arcadia.Scene();

LevelSelect.prototype.onPointStart = function (points) {
    // Move the "cursor" object to the mouse/touch point
    this.cursor.position = {
        x: points[0].x,
        y: points[0].y
    };
};

LevelSelect.prototype.onPointMove = function (points) {
    this.cursor.position = {
        x: points[0].x,
        y: points[0].y
    };
};

LevelSelect.prototype.onPointEnd = function () {
    var i = this.levels.length,
        level;

    while (i--) {
        level = this.levels[i];

        if (this.cursor.collidesWith(level) && this.selected !== i) {
            level.highlight();
            Arcadia.playSfx('button');

            if (this.selected !== null) {
                this.levels[this.selected].lowlight();
            }

            this.selected = i;
            return;
        }
    }
};
