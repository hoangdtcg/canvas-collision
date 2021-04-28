// "use strict";

// Declare as variable



class GameObject
{
    constructor (context, x, y, vx, vy, mass,restitution){
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.restitution = restitution;

        this.isColliding = false;
    }
}

class Circle extends GameObject
{
    constructor (context, x, y, vx, vy, mass, showAngle, bounceOfEdges){
        //Pass params to super class
        super(context, x, y, vx, vy, mass, 0.9);

        //Set default width and height
        this.radius = mass > 0.5?25:10; //25;
        this.showAngle = showAngle;
        this.bounceOfEdges = bounceOfEdges;
    }

    draw() {
        //Draw a simple square
        this.context.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';

        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fill();

        if (this.showAngle) {
            this.frameCenterX = (this.x - this.radius) + (this.radius * 2) / 2; //(this.column * this.frameWidth) + this.frameWidth / 2;
            this.frameCenterY = (this.y - this.radius) + (this.radius * 2) / 2; //this.frameHeight / 2; //(this.row * this.frameHeight) + this.frameHeight / 2;

            //this.context.save();
            this.context.translate(this.frameCenterX, this.frameCenterY); //let's translate
            this.context.rotate(Math.PI / 180 * (this.angle + 90)); //increment the angle and rotate the image
            this.context.translate(-this.frameCenterX, -this.frameCenterY);

            this.context.beginPath();
            this.context.moveTo(this.x, this.y);
            this.context.lineTo(this.x, this.y - 30);
            this.context.stroke();

            // Reset transformation matrix to the identity matrix
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            // this.context.restore();
        }
    }


    update(secondsPassed){
        let g = 9.81 * 20;
        const canvasWidth = 750;
        const canvasHeight = 400;

        if (this.bounceOfEdges){
            // Apply g acceleration
            this.vy += g * secondsPassed;


            /*let g = 9.81 * 20;
            const canvasWidth = 750;
            const canvasHeight = 400;

            if (this.x < this.radius) {
                this.vx = Math.abs(this.vx) * 0.90;
                //obj1.x = obj1.radius;
                this.isColliding = true;
            } else if (this.x > canvasWidth - this.radius) {
                this.vx = -Math.abs(this.vx) * 0.90;
                //obj1.x = canvasWidth - obj1.radius;
                this.isColliding = true;
            }
            if (this.y < obj1.radius) {
                this.vy = Math.abs(this.vy) * 0.90;
                //obj1.y = obj1.radius;
                this.isColliding = true;
            } else if (this.y > canvasHeight - this.radius) {
                this.vy = -Math.abs(this.vy) * 0.90;
                //obj1.y = canvasHeight - obj1.radius;
                this.isColliding = true;
            }*/
        }


        //Move with velocity x/y
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;

        if (this.showAngle){
            let angleRadians = Math.atan2(this.vy, this.vx); //in radians
            let degrees = 180*angleRadians/Math.PI; // to degrees
            this.angle =  degrees; //(360+Math.round(degrees))%360;
        }
    }
}

class Square extends GameObject
{
    constructor (context, x, y, vx, vy, mass){
        //Pass params to super class
        super(context, x, y, vx, vy, mass, 1);

        //Set default width and height
        this.width = 50;
        this.height = 50;
    }

    draw(){
        //Draw a simple square
        this.context.fillStyle = this.isColliding?'#ff8080':'#0099b0';
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    update(secondsPassed){

        /*if (this.gravityAndMass){
            this.vy += (9.81 * 3) * secondsPassed;
        }*/

        //Move with velocity x/y
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}

class GameWorld {
// Trigger init function when the page has loaded

    constructor(showCollision, showCircles, bounce, gravityAndMass, showAngle, bounceOfEdges) {
        this.canvas = null;
        this.context = null;
        this.oldTimeStamp = 0;
        this.gameObjects = [];
        this.resetCounter = 0;
        this.showCollision = showCollision;
        this.showCircles = showCircles;
        this.bounce = bounce;
        this.gravityAndMass = gravityAndMass;
        this.showAngle = showAngle;
        this.bounceOfEdges = bounceOfEdges;
    }

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.createWorld();

        // Request an animation frame for the first time
        // The gameLoop() function will be called as a callback of this request

        window.requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp));
    }

    createWorld() {
        if (!this.showCircles) {
            this.gameObjects = [
                new Square(this.context, 250, 50, 0, 50, 1),
                new Square(this.context, 250, 300, 0, -50, this.gravityAndMass?200:1),
                /*new Square(this.context, 200, 0, 50, 50),*/
                new Square(this.context, 150, 0, 50, 50, 1),
                new Square(this.context, 250, 150, 50, 50, 1),
                /*new Square(this.context, 300, 75, -50, 50),*/
                new Square(this.context, 350, 75, -50, 50, 1),
                new Square(this.context, 300, 300, 50, -50, 1)

                /*new Square(this.context, 250, 50, 0, 50),
                new Square(this.context, 250, 300, 0, -50),
                /!*new Square(this.context, 200, 0, 50, 50),*!/
                new Square(this.context, 150, 0, 50, 50),
                new Square(this.context, 250, 150, 50, 50),
                /!*new Square(this.context, 300, 75, -50, 50),*!/
                //new Square(this.context, 350, 75, -50, 50),
                new Square(this.context, 300, 300, 50, -50)*/
            ];
        } else {
            if (this.gravityAndMass) {
                this.gameObjects = [];

                let numObjects = this.bounceOfEdges?25:30;

                for (var i = 0; i < numObjects; i++) {
                    this.gameObjects.push(new Circle(this.context, 50 + (Math.random() * 300), 0 + (Math.random() * 200), 0 + (Math.random() * 50), 0 + (Math.random() * 50), 0.5, this.showAngle, this.bounceOfEdges));
                }

                if (!this.bounceOfEdges){

                    this.gameObjects.push(new Circle(this.context, 250, 300, 0, -50, 200, this.showAngle, this.bounceOfEdges));
                    this.gameObjects.push(new Circle(this.context, 130, 0, 50, 50, 200, this.showAngle, this.bounceOfEdges));
                }
            }else{
                this.gameObjects = [
                    new Circle(this.context, 250, 50, 0, 50, 1),
                    new Circle(this.context, 250, 300, 0, -50, 1),
                    /*new Circle(this.context, 200, 0, 50, 50),*/
                    new Circle(this.context, 150, 0, 50, 50, 1),
                    new Circle(this.context, 250, 150, 50, 50, 1),
                    /*new Circle(this.context, 300, 75, -50, 50),*/
                    new Circle(this.context, 350, 75, -50, 50, 1),
                    new Circle(this.context, 300, 300, 50, -50, 1)
                ];
            }
        }
    }


    gameLoop(timeStamp) {

        // Calculate how much time has passed
        let secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
        this.oldTimeStamp = timeStamp;

        secondsPassed = Math.min(secondsPassed, 0.1);

        if (true) {
            this.resetCounter += secondsPassed;
            if (this.resetCounter > (this.bounceOfEdges ? 15 : 5)) {
                this.resetCounter = 0;
                this.createWorld();
            }

            for (let i = 0; i < this.gameObjects.length; i++) {
                this.gameObjects[i].update(secondsPassed);
            }

            if (this.showCollision) {
                this.detectCollisions(secondsPassed);
            }

            this.clearCanvas();

            for (let i = 0; i < this.gameObjects.length; i++) {
                this.gameObjects[i].draw();
            }
        }

        // The loop function has reached it's end
        // Keep requesting new frames
        //if ($(this.canvas).hasClass('in-viewport')){
        window.requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp));
        //}
    }

    detectCollisions(secondsPassed) {
        var obj1;
        var obj2;

        //console.log("[GameWorld] " + "secondspassed: ", secondsPassed);
        for (var i = 0; i < this.gameObjects.length; i++) {
            obj1 = this.gameObjects[i];
            obj1.isColliding = false;
            //obj1.oldVx = obj1.vx;
            //obj1.oldVy = obj1.vy;

            if (this.bounceOfEdges) {
                //let g = 9.81 * 20;
                const canvasWidth = 750;
                const canvasHeight = 400;
                if (obj1.x < obj1.radius) {
                    obj1.vx = Math.abs(obj1.vx) * 0.9;
                    obj1.x = obj1.radius;
                    obj1.isColliding = true;
                } else if (obj1.x > canvasWidth - obj1.radius) {
                    obj1.vx = -Math.abs(obj1.vx) * 0.90;
                    obj1.x = canvasWidth - obj1.radius;
                    obj1.isColliding = true;
                }
                if (obj1.y < obj1.radius) {
                    obj1.vy = Math.abs(obj1.vy) * 0.90;
                    obj1.y = obj1.radius;
                    obj1.isColliding = true;
                } else if (obj1.y > canvasHeight - obj1.radius) {
                    obj1.vy = -Math.abs(obj1.vy) * 0.90;
                    obj1.y = canvasHeight - obj1.radius;
                    obj1.isColliding = true;
                }
            }
        }

        for (var i = 0; i < this.gameObjects.length; i++) {
            obj1 = this.gameObjects[i];
            //obj1.isColliding = false;
            for (var j = i + 1; j < this.gameObjects.length; j++) {
                obj2 = this.gameObjects[j];

                if (this.showCircles) {
                    if (this.circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)) {
                        obj1.isColliding = true;
                        obj2.isColliding = true;


                        if (this.bounce) {


                            var vecCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                            //Distance between the two objects
                            var distance = this.getDistance(obj1.x, obj1.y, obj2.x, obj2.y);

                            //console.log("[GameWorld] " + "distance: " + distance);
                            //Normalized. Dit is de collision normal
                            //It is in the same direction but with norm (length) 1
                            var vecCollisionNorm = {x: vecCollision.x / distance, y: vecCollision.y / distance};
                            var vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
                            var speed = vRelativeVelocity.x * vecCollisionNorm.x + vRelativeVelocity.y * vecCollisionNorm.y;

                            if (speed < 0){
                                //console.log("[GameWorld] " + "p: " + p + "objects move away from each other");
                                break;
                            }
                            if (this.gravityAndMass) {

                                //let restitution = 0.90;
                                if (this.bounceOfEdges){
                                    speed *= Math.min(obj1.restitution, obj2.restitution);
                                }

                                var impulse = 2 * speed / (obj1.mass + obj2.mass);

                                //var restitution = 1 + Math.max(obj1.bounce, obj2.bounce);

                                /*if (this.bounceOfEdges){
                                    obj1.vx -= (impulse * obj2.mass * vecCollisionNorm.x) * restitution;
                                    obj1.vy -= (impulse * obj2.mass * vecCollisionNorm.y) * restitution;
                                    obj2.vx += (impulse * obj1.mass * vecCollisionNorm.x) * restitution;
                                    obj2.vy += (impulse * obj1.mass * vecCollisionNorm.y) * restitution;
                                }else {*/


                                obj1.vx -= (impulse * obj2.mass * vecCollisionNorm.x);
                                obj1.vy -= (impulse * obj2.mass * vecCollisionNorm.y);
                                obj2.vx += (impulse * obj1.mass * vecCollisionNorm.x);
                                obj2.vy += (impulse * obj1.mass * vecCollisionNorm.y);
                                /*}*/



                            }else{
                                obj1.vx -= (speed * vecCollisionNorm.x);
                                obj1.vy -= (speed * vecCollisionNorm.y);
                                obj2.vx += (speed * vecCollisionNorm.x);
                                obj2.vy += (speed * vecCollisionNorm.y);
                            }
                        }
                    }
                } else {
                    if (this.rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)) {

                        obj1.isColliding = true;
                        obj2.isColliding = true;

                        //if (obj1.isColliding || obj2.isColliding){
                        //console.log("[GameWorld] " + "waren al in botsing");
                        //}


                        if (this.bounce) {

                            var vecCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                            //Distance between the two objects
                            var distance = this.getDistance(obj1.x, obj1.y, obj2.x, obj2.y);

                            //Normalized. Dit is de collision normal
                            //It is in the same direction but with norm (length) 1
                            //var vecCollisionNorm = {x: vecCollision.x / distance, y: vecCollision.y / distance};

                            //https://ericleong.me/research/circle-circle/
                            //bereken de snelheid p, doe die vervolgens keer je collision norm. Dan krijg je weer een ongenormaliseerde vector.
                            //Die trek je voor de een af, en bij de ander doe je heb erbij
                            //var speed = obj1.vx * vecCollisionNorm.x + obj1.vy * vecCollisionNorm.y - obj2.vx * vecCollisionNorm.x - obj2.vy * vecCollisionNorm.y;
                            var vecCollisionNorm = {x: vecCollision.x / distance, y: vecCollision.y / distance};
                            var vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
                            var speed = vRelativeVelocity.x * vecCollisionNorm.x + vRelativeVelocity.y * vecCollisionNorm.y;

                            if (speed < 0){
                                //console.log("[GameWorld] " + "p: " + p + "objects move away from each other");
                                break;
                            }

                            if (this.gravityAndMass) {


                                var impulse = 2 * speed / (obj1.mass + obj2.mass);
                                //var restitution = 0.5; //1 + Math.max(0, 0);
                                //impulse *= restitution;

                                //var restitution = 1 + Math.max(obj1.bounce, obj2.bounce);

                                obj1.vx -= (impulse * obj2.mass * vecCollisionNorm.x);
                                obj1.vy -= (impulse * obj2.mass * vecCollisionNorm.y);
                                obj2.vx += (impulse * obj1.mass * vecCollisionNorm.x);
                                obj2.vy += (impulse * obj1.mass * vecCollisionNorm.y);

                            }else{
                                obj1.vx -= (speed * vecCollisionNorm.x);
                                obj1.vy -= (speed * vecCollisionNorm.y);
                                obj2.vx += (speed * vecCollisionNorm.x);
                                obj2.vy += (speed * vecCollisionNorm.y);
                            }
                        }

                    }
                }
            }
        }
    }

    getAngle(x1, x2, y1, y2) {

        // angle in radians
        //var angleRadians = Math.atan2(y2 - y1, x2 - x1);
        //return angleRadians;

        var angleDeg = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        return angleDeg;

        // angle in degrees
        //var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    }

    getDistance(x1, y1, x2, y2){
        return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
    }


    circleIntersect(x1, y1, r1, x2, y2, r2) {

        // Calculate the distance between the two circles
        //var distance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
        var distance = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);

        // When the distance is smaller or equal to the sum
        // of the two radius, the circles overlap
        return distance <= ((r1 + r2) * (r1 + r2))
    }

    rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {

        // Check x and y for overlap
        if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
            return false;
        }

        return true;
    }

    clearCanvas() {
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function init(canvasId, showCollision, showCircles, bounce, gravityAndMass, showAngle, bounceOfEdges){
    var gameWorld = new GameWorld(showCollision, showCircles, bounce, gravityAndMass, showAngle, bounceOfEdges);
    gameWorld.init(canvasId);
}