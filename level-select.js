/*jslint sloppy: true, plusplus: true */
/*globals Arcadia */

var LevelSelect = function (options) {
    Arcadia.Scene.apply(this, arguments);

    if (options === undefined) {
        options = {};
    }

    // Create grid of puzzle buttons - clicking one will take you to
    // the puzzle immediately (but temporarily will need a play/edit distinction
    // so that levels can be created)

    // Puzzles hidden behind IAP wall will be red, normal will be purple,
    // completed will be green

    // Need to allow circular buttons in Arcadia.Button

    // Probably need pagination, as well, since will have more puzzles than
    // can fit on one screen

    // Can link to a more info/feedback view from here as well
    
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
        page,
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
    this.pages = [
        [], [], [], []
    ];
    this.currentPage = parseInt(localStorage.getItem('currentPage'), 10) || 0;

    for (page = 0; page < this.pages.length; page += 1) {
        for (y = startY; y < startY + gridHeight; y += spacing) {
            for (x = startX; x < startX + gridWidth; x += spacing) {
                if (page < this.currentPage) {
                    offset = -Arcadia.WIDTH;
                } else if (page > this.currentPage) {
                    offset = Arcadia.WIDTH;
                } else {
                    offset = 0;
                }
                shape = new Vertex({
                    number: (counter + 1),
                    position: { x: x + offset, y: y }
                });
                this.add(shape);
                this.levels.push(shape);
                this.pages[page].push(shape);
                if (completed[counter]) {
                    shape.color = 'lime';
                }
                if (!levels[counter]) {
                    shape.color = 'red';
                }
                counter += 1;
            }
        }
    }

    // TODO: support circular buttons?
    this.previousButton = new Arcadia.Button({
        position: {
            x: startX,
            y: startY - spacing
        },
        color: null,
        border: '2px #fff',
        text: '<-',
        font: '20px monospace',
        action: function () {
            Arcadia.playSfx('button');
            _this.previousPage();
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
        text: '->',
        font: '20px monospace',
        action: function () {
            Arcadia.playSfx('button');
            _this.nextPage();
        }
    });
    this.add(this.nextButton);

    this.pageLabel = new Arcadia.Label({
        text: (this.currentPage + 1) + ' / ' + this.pages.length,
        font: '20px monospace',
        position: {
            x: centerX,
            y: startY - spacing
        }
    });
    this.add(this.pageLabel);

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

    if (options.selected !== undefined) {
        this.selected = options.selected;
        this.levels[this.selected].highlight();
    }
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

// TODO: fix Arcadia tween to allow for compound values
LevelSelect.prototype.nextPage = function () {
    var offset = -Arcadia.WIDTH;

    if (this.currentPage < this.pages.length - 1) {
        // Move (old) current page to the left
        this.pages[this.currentPage].forEach(function (shape) {
            shape.tween('position', { x: shape.position.x + offset, y: shape.position.y }, 500, 'expoInOut');
        });
        // increment currentPage
        this.currentPage += 1;
        // Move (new) current page to the left
        this.pages[this.currentPage].forEach(function (shape) {
            shape.tween('position', { x: shape.position.x + offset, y: shape.position.y }, 500, 'expoInOut');
        });

        this.pageLabel.text = (this.currentPage + 1) + ' / ' + this.pages.length;
        localStorage.setItem('currentPage', this.currentPage);
    }
};

LevelSelect.prototype.previousPage = function () {
    var offset = Arcadia.WIDTH;
    if (this.currentPage > 0) {
        // Move (old) current page to the right
        this.pages[this.currentPage].forEach(function (shape) {
            shape.tween('position', { x: shape.position.x + offset, y: shape.position.y }, 500, 'expoInOut');
        });
        // decrement currentPage
        this.currentPage -= 1;
        // Move (new) current page to the right
        this.pages[this.currentPage].forEach(function (shape) {
            shape.tween('position', { x: shape.position.x + offset, y: shape.position.y }, 500, 'expoInOut');
        });

        this.pageLabel.text = (this.currentPage + 1) + ' / ' + this.pages.length;
        localStorage.setItem('currentPage', this.currentPage);
    }
};
