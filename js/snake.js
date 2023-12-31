const NPC = function(){
    this.num = 0;
};

NPC.prototype.score = function() {
    this.num++;
};

NPC.prototype.draw = function() {
    document.querySelector('div').innerHTML = '得分：' + this.num;
};

const Food = function(ctx){
    this.x = 0;
    this.y = 0;
    
    this.ctx = ctx;

    this.radius = 5;
};

Food.prototype = new NPC();

Food.prototype.create = function(){
    return this.refresh();
};

Food.prototype.refresh = function() {
    // TODO 随机位置创建食物
    var canvasWidth = this.ctx.canvas.width;
    var canvasHeight = this.ctx.canvas.height;

    var foodX = Math.floor(Math.random() * canvasWidth / 10) * 10;
    var foodY = Math.floor(Math.random() * canvasHeight / 10) * 10;
    this.x = foodX;
    this.y = foodY;
};

Food.prototype.draw = function() {
    // TODO 绘制食物
    this.ctx.beginPath();
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, 2 * Math.PI, false);
    this.ctx.fill();
};

const Snake = function(ctx){
    this.ctx = ctx;
    this.snakeSize = 10;
    this.body = [];
    this.head = null;
    this.speed = 0;
    // 当前移动方向：0，上；1，下；2，左；3，右；
    this.direction = ['up', 'left', 'right', 'down'][Math.floor(Math.random() * 4)]; 

    this.score = 0; // 蛇游戏计分
};

Snake.prototype = new NPC();

Snake.prototype.init = function() {
    // TODO 生成随机位置，长度2 
    //蛇的随机生成位置
    var startX = Math.floor(Math.random() * this.ctx.canvas.width / 10) * 10;
    var startY = Math.floor(Math.random() * this.ctx.canvas.height / 10) * 10;

    this.head = {x: startX, y: startY};
    this.body.push(this.head);
    document.addEventListener('keydown', (event) => {
        this.keyBoard(event);
    });


    var snakeBody;
    if (this.direction === 'right') {
        snakeBody = {x: startX + 10, y: startY};
    } else if (this.direction === 'left') {
        snakeBody = {x: startX - 10, y: startY};
    } else if (this.direction === 'up') {
        snakeBody = {x: startX, y: startY - 10};
    } else if (this.direction === 'down') {
        snakeBody = {x: startX, y: startY + 10};
    }

    this.body.push(snakeBody);
    return this;
};

Snake.prototype.head = function() {
    return this.body[0];
};

Snake.prototype.draw = function() {
    // TODO 绘制蛇
    this.ctx.fillStyle = "green";
    for (let i = 0; i < this.body.length; i++) {
      const item = this.body[i];
      this.ctx.fillRect(item.x, item.y, 10, 10);
    }
};

Snake.prototype.kill = function(){
    // TODO 蛇头碰到自身、撞墙，则结束

};

Snake.prototype.isDie = function(){
    // TODO 是否撞到自身
    // TODO 是否撞墙
    // const head = this.body[0];

    let canvasWidth = this.ctx.canvas.width;
    let canvasHeight = this.ctx.canvas.height;

    if (this.head.x < 0 || this.head.y < 0 || this.head.x + this.snakeSize > canvasWidth || this.head.y + this.snakeSize > canvasHeight) {
        alert('撞到墙壁，游戏结束');
        return true;
    }

};

Snake.prototype.eat = function(food) {
    if (!(food instanceof Food))
        throw Error('不是一个有效的食物对象');

    // TODO 判断是否吃到食物，如果吃到，处理逻辑
    for (let i = 0; i < this.body.length; i++) {
        if (this.body[i].x === food.x && this.body[i].y === food.y)
            return true;
    };
    return false;
};

Snake.prototype.keyBoard = function(event) {
    switch(event.key) {
        case 'ArrowUp':
            if(this.direction != 'down')
                this.direction = 'up';
            break;
        case 'ArrowDown':
            if(this.direction != 'up')
                this.direction = 'down';
            break;
        case 'ArrowLeft':
            if(this.direction != 'right')
                this.direction = 'left';
            break;
        case 'ArrowRight':
            if(this.direction != 'left')
                this.direction = 'right';
            break;
    }
};

Snake.prototype.move = function() {
    // TODO 移动蛇
    var currentHead = {x: this.head.x, y: this.head.y};
    switch(this.direction){
        case 'down':
            this.head.y += 10;
            break;
        case 'left':
            this.head.x -= 10;
            break;
        case 'right':
            this.head.x += 10;
            break;
        case 'up':
            this.head.y -= 10;
            break;
            default:
    }
    this.body.unshift(currentHead);
    this.body.pop();
    return this;
};

Snake.prototype.increase = function() {
    const last = this.body[this.body.length - 1];
    switch(this.direction){
        case 'down':
            this.body.push({x: last.x, y: last.y + 10});
            break;
        case 'left':
            this.body.push({x: last.x - 10, y: last.y});
            break;
        case 'right':
            this.body.push({x: last.x + 10, y: last.y});
            break;
        case 'up':
            this.body.push({x: last.x, y: last.y - 10});
            break;
            default:
    }
};



const Game = function(){
    // TODO 初始化画布
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    this.ctx = ctx;

    this.snake = new Snake(ctx);
    this.food = new Food(ctx);
    this.npc = new NPC();

    this.timer = null;
    this.stime = null;
};

Game.prototype.init = function(){
    this.food.create();
    this.snake.init();
    return this;
};

Game.prototype.draw = function(){
    // TODO 清空画布
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.snake.draw();
    this.food.draw();
    this.npc.draw();
};


Game.prototype.run = function() {
    this.stime = new Date();

    this.timer = setInterval(() => {
        this.snake.move();

        if(this.snake.isDie()){
            this.snake.kill();
            return this.quit();
        }

        if(this.snake.eat(this.food)){
            this.snake.increase();
            this.food.refresh();
            this.npc.score();
        }

        this.draw();
    }, 300);
};

Game.prototype.quit = function() {
    // TODO 退出游戏，结算

    clearInterval(this.timer);
};

function draw() {
    const game = new Game();
    game.init().run();
}