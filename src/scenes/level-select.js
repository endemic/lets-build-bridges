/*jslint sloppy: true, plusplus: true */
/*globals Arcadia, GameScene, EditorScene, Vertex, LEVELS, localStorage, window */

var LevelSelectScene = function (options) {
    Arcadia.Scene.apply(this, arguments);

    options = options || {};

    // Show 25 levels per page
    var rows = 5;
    var columns = 5;

    // vars for displaying level buttons
    var spacing = Vertex.SIZE + 10;
    var centerX = 0;
    var centerY = 0;
    var gridWidth = rows * spacing;
    var gridHeight = columns * spacing;
    var startX = centerX - gridWidth / 2 + spacing / 2;
    var startY = centerY - gridHeight / 2 + spacing / 2;
    var animationDuration = 2000;
    var self = this;

    // Background/vertex color
    Vertex.DEFAULT_COLOR = Arcadia.cycleBackground();

    this.levels = [];
    this.selected = null;
    this.buttonPadding = 15;

    var levels = localStorage.getObject('levels') || LEVELS;
    var completed = localStorage.getObject('completed') || [];

    while (completed.length < LEVELS.length) {
        completed.push(null);
    }

    // Object that tracks player's cursor/finger; used for collision detection
    this.cursor = new Arcadia.Shape({
        size: {width: 8, height: 8},
        vertices: 0
    });
    this.add(this.cursor);
    this.deactivate(this.cursor);

    // Draw grid of level buttons
    this.pages = [
        [], [], [], []
    ];

    this.selected = options.selected || completed.indexOf(null); // First incomplete level
    this.currentPage = Math.floor(this.selected / (rows * columns));

    setTimeout(function () {
        self.levels[self.selected].highlight();
    }, animationDuration);

    var page = 0;
    var counter = 0;
    var x;
    var y;
    var offset;
    var shape;

    for (page; page < this.pages.length; page += 1) {
        for (y = startY; y < startY + gridHeight; y += spacing) {
            for (x = startX; x < startX + gridWidth; x += spacing) {
                if (page < this.currentPage) {
                    offset = -Arcadia.VIEWPORT_WIDTH;
                } else if (page > this.currentPage) {
                    offset = Arcadia.VIEWPORT_WIDTH;
                } else {
                    offset = 0;
                }
                shape = new Vertex({
                    number: (counter + 1),
                    position: { x: x + offset, y: y },
                    scale: page === this.currentPage ? 0 : 1 // make current page smaller
                });
                this.add(shape);
                this.levels.push(shape);
                this.pages[page].push(shape);
                if (completed[counter]) {
                    shape.color = Vertex.CORRECT_COLOR;
                }
                if (this.isLocked() && counter >= 15) {
                    shape.color = Vertex.INCORRECT_COLOR;
                }
                counter += 1;
            }
        }
    }

    // Animate level icons into view
    this.pages[this.currentPage].forEach(function (vertex) {
        vertex.tween('scale', 1, animationDuration, 'elasticOut');
    });

    if (this.isLocked()) {
        var unlockButton = new Arcadia.Button({
            position: { x: 0, y: startY - 150 },
            color: null,
            border: '2px #fff',
            padding: this.buttonPadding,
            text: 'unlock all puzzles',
            font: '26px monospace',
            action: function () {
                Arcadia.changeScene(UnlockScene);
            }
        });
        this.add(unlockButton);
    } else {
        var aboutButton = new Arcadia.Button({
            position: { x: 0, y: startY - 150 },
            color: null,
            border: '2px #fff',
            text: '?',
            size: {width: Vertex.SIZE, height: Vertex.SIZE},
            vertices: 0,
            font: '26px monospace',
            action: function () {
                sona.play('button');
                Arcadia.changeScene(AboutScene);
            }
        });
        this.add(aboutButton);
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
            x: 0,
            y: this.size.height / 2 - 125
        },
        color: null,
        border: '2px #fff',
        padding: this.buttonPadding,
        text: 'play',
        font: '26px monospace',
        action: function () {
            sona.play('button');

            if (self.isLocked() && self.selected >= 15) {
                Arcadia.changeScene(UnlockScene);
            } else {
                Arcadia.changeScene(GameScene, { level: self.selected });
            }
        }
    });
    this.add(this.playButton);

    // TODO: Eventually re-enable the editor for users
    // this.editButton = new Arcadia.Button({
    //     position: {
    //         x: Arcadia.VIEWPORT_WIDTH / 2,
    //         y: Arcadia.VIEWPORT_HEIGHT - 75
    //     },
    //     color: null,
    //     border: '2px #fff',
    //     padding: this.buttonPadding,
    //     text: 'edit',
    //     font: '26px monospace',
    //     action: function () {
    //         sona.play('button');
    //         Arcadia.changeScene(EditorScene, { level: self.selected });
    //     }
    // });
    // this.add(this.editButton);

    if (this.currentPage === 0) {
        this.previousButton.alpha = 0.5;
    } else if (this.currentPage === this.pages.length - 1) {
        this.nextButton.alpha = 0.5;
    }
};

LevelSelectScene.prototype = new Arcadia.Scene();

LevelSelectScene.prototype.onPointStart = function (points) {
    Arcadia.Scene.prototype.onPointStart.call(this, points); // "super()"

    // Move the "cursor" object to the mouse/touch point
    this.cursor.position = {
        x: points[0].x,
        y: points[0].y
    };
};

LevelSelectScene.prototype.onPointMove = function (points) {
    Arcadia.Scene.prototype.onPointMove.call(this, points); // "super()"

    this.cursor.position = {
        x: points[0].x,
        y: points[0].y
    };
};

LevelSelectScene.prototype.onPointEnd = function (points) {
    Arcadia.Scene.prototype.onPointEnd.call(this, points); // "super()"

    var i = this.levels.length;
    var level;

    while (i--) {
        level = this.levels[i];

        if (this.cursor.collidesWith(level) && this.selected !== i) {
            level.highlight();
            sona.play('button');

            if (this.selected !== null) {
                this.levels[this.selected].lowlight();
            }

            this.selected = i;
            return;
        }
    }
};

LevelSelectScene.prototype.nextPage = function () {
    var offset = -Arcadia.VIEWPORT_WIDTH;
    var self = this;

    if (this.currentPage < this.pages.length - 1) {
        sona.play('button');
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

        window.setTimeout(function () {
            self.nextButton.disabled = false;
            if (self.currentPage < self.pages.length - 1) {
                self.nextButton.alpha = 1;
            }
        }, 500);

        if (this.previousButton.alpha < 1) {
            this.previousButton.alpha = 1;
        }
    }
};

LevelSelectScene.prototype.previousPage = function () {
    var offset = Arcadia.VIEWPORT_WIDTH,
        self = this;

    if (this.currentPage > 0) {
        sona.play('button');
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

        window.setTimeout(function () {
            self.previousButton.disabled = false;
            if (self.currentPage > 0) {
                self.previousButton.alpha = 1;
            }
        }, 500);

        if (this.nextButton.alpha < 1) {
            this.nextButton.alpha = 1;
        }
    }
};

LevelSelectScene.prototype.isLocked = function () {
    return window.store !== undefined && localStorage.getBoolean('unlocked') === false;
};
