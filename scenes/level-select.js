/*jslint sloppy: true, plusplus: true */
/*globals Arcadia, Game, Editor, Vertex, LEVELS, localStorage, window */

var LevelSelect = function (options) {
    Arcadia.Scene.apply(this, arguments);

    if (options === undefined) {
        options = {};
    }

    // Puzzles hidden behind IAP wall will be red, normal will be purple,
    // completed will be green

    var spacing = Vertex.SIZE + 10,
        completed,
        levels,
        counter = 0,
        rows = 5,   // Show 25 levels per page
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
        offset,
        shape,
        self;

    self = this;
    this.color = 'purple';
    this.levels = [];
    this.selected = null;
    completed = localStorage.getObject('completed') || Array(LEVELS.length);
    levels = localStorage.getObject('levels') || LEVELS;

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
                    shape.color = Vertex.CORRECT_COLOR;
                }
                if (!levels[counter]) {
                    shape.color = Vertex.INCORRECT_COLOR;
                }
                counter += 1;
            }
        }
    }

    this.previousButton = new Arcadia.Button({
        position: {
            x: startX,
            y: startY - spacing
        },
        color: null,
        border: '2px #fff',
        text: '<-',
        size: {
            width: Vertex.SIZE,
            height: Vertex.SIZE
        },
        vertices: 0,
        font: '26px monospace',
        action: function () {
            self.previousPage();
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
        size: {
            width: Vertex.SIZE,
            height: Vertex.SIZE
        },
        vertices: 0,
        font: '26px monospace',
        action: function () {
            self.nextPage();
        }
    });
    this.add(this.nextButton);

    this.pageLabel = new Arcadia.Label({
        text: (this.currentPage + 1) + ' / ' + this.pages.length,
        font: '26px monospace',
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
        font: '26px monospace',
        action: function () {
            Arcadia.playSfx('button');
            Arcadia.changeScene(Game, { level: self.selected });
        }
    });
    this.add(this.playButton);

    // TODO: Remove this before publishing 1st draft
    this.editButton = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT - 100
        },
        color: null,
        border: '2px #fff',
        padding: 15,
        text: 'edit',
        font: '26px monospace',
        action: function () {
            Arcadia.playSfx('button');
            Arcadia.changeScene(Editor, { level: self.selected });
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

LevelSelect.prototype.nextPage = function () {
    var offset = -Arcadia.WIDTH,
        self = this;

    if (this.currentPage < this.pages.length - 1) {
        Arcadia.playSfx('button');
        this.nextButton.disabled = true;
        this.nextButton.alpha = 0.5;

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

        window.setTimeout(function () {
            self.nextButton.disabled = false;
            self.nextButton.alpha = 1;
        }, 500);
    }
};

LevelSelect.prototype.previousPage = function () {
    var offset = Arcadia.WIDTH,
        self = this;

    if (this.currentPage > 0) {
        Arcadia.playSfx('button');
        this.previousButton.disabled = true;
        this.previousButton.alpha = 0.5;

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

        window.setTimeout(function () {
            self.previousButton.disabled = false;
            self.previousButton.alpha = 1;
        }, 500);
    }
};
