//getting all the references 
let userpaddle = document.getElementById("userpaddle");
let aipaddle = document.getElementById("aipaddle");
let ball = document.getElementById("ball");
let gamebox = document.getElementById("gamebox");
let userscore = document.getElementById("userscore");
let aiscore = document.getElementById("aiscore");

let zpressed = false;  //key moving upwards
let xpressed = false;  //key moving downwards

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if(e.key == 'z'){
        zpressed = true; //key is pressed
    }else if(e.key == 'x') {
        xpressed = true; //key is pressed
    }
}

function keyUpHandler(e){
    if(e.key == 'z'){
        zpressed = false; //key is released
    } else if(e.key == 'x'){
        xpressed = false; //key is released
    }
}

// ball movement in 2-dimensional direction, it will have some velocity in x and y direction, 
// and we will update the position of the ball by adding the velocity to the position of the ball
// and we will also check if the ball is hitting the wall or the paddle, if it is hitting the wall, we will change the direction of the ball
// and if it is hitting the paddle, we will change the direction of the ball and increase the speed of the ball.
// the velocity of the ball can be represented by a vector, it can be decomposed into Vx and Vy ( x and y components of the velocity vector).
// the formula is -> v = sqrt ( Vx^2 + Vy^2 )  (pythagoras theorem)

let Vx = -2;
let Vy = -3;

let V = Math.sqrt(Math.pow(Vx, 2) + Math.pow(Vy, 2));

function reset() { //setting ball's initial position in the center of the gamebox
    ball.style.left = "50%";
    ball.style.top = "50%";

    Vx = -2;
    Vy = -3;

    V = Math.sqrt(Math.pow(Vx, 2) + Math.pow(Vy, 2));
}

function checkCollision(activepaddle) {
    //variables for initializing ball and paddle collision points 
    let balltop = ball.offsetTop;
    let ballbottom = ball.offsetTop + ball.offsetHeight;
    let ballleft = ball.offsetLeft;
    let ballright = ball.offsetLeft + ball.offsetWidth;

    let paddletop = activepaddle.offsetTop;
    let paddlebottom = activepaddle.offsetTop + activepaddle.offsetHeight;
    let paddleleft = activepaddle.offsetLeft;
    let paddleright = activepaddle.offsetLeft + activepaddle.offsetWidth;

    //ball is collided with the paddle i.e user or ai 
    if(ballbottom > paddletop && balltop < paddlebottom
    && ballright > paddleleft && ballleft < paddleright){
        return true; //collision is detected 
    } else {
        return false; //collision is not detected
    }
}

function gameloop() {
    if(ball.offsetLeft < 0){ //if ball is beyond left side then ai player will score and reset ball position to center
        aiscore.innerHTML = parseInt(aiscore.innerHTML) + 1;
        reset();
    }

    //if ball is beyond right side then user player will score and reset ball position to center
    if(ball.offsetLeft > gamebox.offsetWidth - ball.offsetWidth){
        userscore.innerHTML = parseInt(userscore.innerHTML) + 1;
        reset();
    }

    if(ball.offsetTop < 0){ //if ball hits top side then it should rebound itself in the gamebox
        Vy = -Vy;
    }

    //if ball hits bottom side then it should rebound itself in the gamebox
    if(ball.offsetTop > gamebox.offsetHeight - ball.offsetHeight){
        Vy = -Vy;
    }

    let paddle = ball.offsetLeft < gamebox.offsetWidth / 2 ? userpaddle : aipaddle; //defining ball position based on paddle

    let ballcenterY = ball.offsetTop + ball.offsetHeight / 2;  //center of the ball
    let paddlecenterY = paddle.offsetTop + paddle.offsetHeight / 2; //center of the paddle 
    let angle = 0; //initial angle of the ball 

    if(checkCollision(paddle)){
        if(paddle == userpaddle) { //paddle collided with user paddle 
            if(ballcenterY < paddlecenterY) { //condition 1 if it collides with top 
                angle = Math.PI / 4;
            } else if(ballcenterY > paddlecenterY){ //condition 2 if it collides with bottom 
                angle = Math.PI / 4;
            } else{ //condition 3 if it collides with center of user paddle
                angle = 0;
            }
        } else if(paddle == aipaddle){ //paddle collided with ai paddle
            if(ballcenterY < paddlecenterY){ //condition 1 if it collides with top 
                angle = -3 * Math.PI / 4;
            } else if(ballcenterY > paddlecenterY){ //condition 2 if it collides with bottom 
                angle = 3 * Math.PI / 4;
            } else { //condition 3 if it collides with center of ai paddle
                angle = 0;
            }
        }
        V = V + 0.2;
        Vx = V * Math.cos(angle); //changing into degrees
        Vy = V * Math.sin(angle); //changing into degrees 
    }

    let aidelay = 0.3; //an error for user to win against ai paddle
    aipaddle.style.top = 
        aipaddle.offsetTop + (ball.offsetTop - aipaddle.offsetTop - aipaddle.offsetHeight / 2) * aidelay + "px"; //a point where ball passes before ai paddle collides

    ball.style.left = ball.offsetLeft + Vx + "px";
    ball.style.top = ball.offsetTop + Vy + "px";

    if(zpressed && userpaddle.offsetTop > 55){ //moving userpaddle in upwards direction inside the gamebox
        userpaddle.style.top = userpaddle.offsetTop - 5 + "px";
    }

    if(xpressed && userpaddle.offsetTop < gamebox.offsetHeight - userpaddle.offsetHeight + 45){ //moving userpaddle in downwards direction inside the gamebox
        userpaddle.style.top = userpaddle.offsetTop + 5 + "px";
    }

    requestAnimationFrame(gameloop);
}
 
gameloop(); //calling the function 