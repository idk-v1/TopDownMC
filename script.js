let width = window.innerWidth;
let height = window.innerHeight;

let mwidth = 500;
let mheight = 500;
let tilesize = 10;
let viewdist = 30; // Cannot be less than 20

let now = performance.now();
let last = now;
let delta = 0;
let tps = 20;
let ticks = 0;

let w = false;
let a = false;
let s = false;
let d = false;
let shift = false;

document.addEventListener("keydown", function(e)
{
    switch(e.key)
    {
        case "w":
            w = true;
            break;
        case "a":
            a = true;
            break;
        case "s":
            s = true;
            break;
        case "d":
            d = true;
            break;
        case "W":
            w = true;
            break;
        case "A":
            a = true;
            break;
        case "S":
            s = true;
            break;
        case "D":
            d = true;
            break;
    }
    if (e.shiftKey) shift = true;
});
document.addEventListener("keyup", function(e)
{
    switch(e.key)
    {
        case "w":
            w = false;
            break;
        case "a":
            a = false;
            break;
        case "s":
            s = false;
            break;
        case "d":
            d = false;
            break;
        case "W":
            w = false;
            break;
        case "A":
            a = false;
            break;
        case "S":
            s = false;
            break;
        case "D":
            d = false;
            break;
    }
    if (!e.shiftKey) shift = false;
});

can.width = width;
can.height = height;
let ctx = can.getContext("2d");

let terrain = new Array(mwidth);
for (let i = 0; i < mwidth; i++)
{
    terrain[i] = new Array(mheight);
}

let light = new Array(mwidth);
for (let i = 0; i <  mwidth; i++)
{
    light[i] = new Array(mheight).fill(0);
}

class Player
{
    constructor()
    {
        this.x = mwidth / 2;
        this.y = mheight / 2;
        this.width = tilesize * 3;
        this.vx = 0;
        this.vy = 0;
        this.speed = 1;
    }
}
let play = new Player();

let conslines = [];
function cons(text)
{
    conslines.push(text);
    if(conslines.length >= 15)
    {
        conslines.shift();
    }
    con.innerHTML = conslines.join("<br>");
}

generate();
function generate()
{
    let t = 0;
    for(let x = 0; x < mheight; x++)
    {
        for(let y = 0; y < mwidth; y++)
        {
            t++
            let output = 0;
            output = perlin.get(x / 10, y / 10) + 1.01;
            terrain[x][y] = Math.floor(output);
        }
    }
    terrain[0][0] = 4;
}

setInterval(time, 0);
function time()
{
    now = performance.now();
    delta += now - last;
    last = now;

    while(delta >= 1000 / tps)
    {
        delta -= 1000 / tps;
        tick();
    }

    update();
    render();
}

function tick()
{
    ticks++;

    play.vx -= (a * play.speed - d * play.speed) * (0.125 * shift + 1 * !shift);
    play.vy -= (w * play.speed - s * play.speed) * (0.125 * shift + 1 * !shift);

    play.x += play.vx;
    play.y += play.vy;

    play.vx *= 0.3;
    play.vy *= 0.3;

    for(let x = 0; x < mwidth; x++)
    {
        for(let y = 0; y < mheight; y++)
        {
            light[x][y] = 0;
        }
    }
    lighttile(Math.round(play.x), Math.round(play.y), 20);
}

function render()
{
    ctx.clearRect(0, 0, can.width, can.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, can.width, can.height);
    ctx.save();
    ctx.translate(can.width / 2 - mwidth / 2 * tilesize + (mwidth / 2 - play.x) * tilesize, can.height / 2 - mheight / 2 * tilesize + (mheight / 2 - play.y) * tilesize);

    for(let y = 0; y < mheight; y++)
    {
        for(let x = 0; x < mwidth; x++)
        {
            let xr = Math.abs(play.x - x - (play.x % 1));
            let yr = Math.abs(play.y - y - (play.y % 1));
            if(xr <= viewdist && xr >= -viewdist && yr <= viewdist && yr >= -viewdist)
            {
                switch(terrain[x][y])
                {
                    case 0:
                        ctx.fillStyle = `rgb(${light[x][y] * 0.05 * 32}, ${light[x][y] * 0.05 * 32}, ${light[x][y] * 0.05 * 32})`;
                        break;
                    case 1:
                        ctx.fillStyle = `rgb(${light[x][y] * 0.05 * 128}, ${light[x][y] * 0.05 * 128}, ${light[x][y] * 0.05 * 128})`;
                        break;
                    case 2:
                        ctx.fillStyle = `rgb(${light[x][y] * 0.05 * 196}, ${light[x][y] * 0.05 * 196}, ${light[x][y] * 0.05 * 196})`;
                        break;
                    case 3:
                        ctx.fillStyle = `rgb(0, 0, ${light[x][y] * 0.05 * 255})`;
                        break;
                    default:
                        ctx.fillStyle = `rgb(255, 0, 255)`;
                }
                //ctx.strokeStyle = "#fff4";
                ctx.fillRect(x * tilesize - tilesize / 2 + (play.x % 1) * tilesize * 0, y * tilesize - tilesize / 2 + (play.y % 1) * tilesize * 0, tilesize, tilesize);
                //ctx.strokeRect(x * tilesize - tilesize / 2 + (play.x % 1) * tilesize * 0, y * tilesize - tilesize / 2 + (play.y % 1) * tilesize * 0, tilesize, tilesize);
            }
        }
    }

    ctx.restore();

    ctx.fillStyle = "#fff8";
    ctx.fillRect(can.width / 2 - play.width / 2, can.height / 2 - play.width / 2, play.width, play.width);
}

function update()
{

}

function lighttile(x, y, level)
{
    if(light[x] != undefined) if(light[x][y] != undefined) light[x][y] = level;
    if(level > 0)
    {
        if(light[x - 1] != undefined) if(light[x - 1][y] != undefined) if (light[x - 1][y] < level - 1) lighttile(x - 1, y, level - 1);
        if(light[x + 1] != undefined) if(light[x + 1][y] != undefined) if (light[x + 1][y] < level - 1) lighttile(x + 1, y, level - 1);
        if(light[x] != undefined) if(light[x][y - 1] != undefined) if (light[x][y - 1] < level - 1) lighttile(x, y - 1, level - 1);
        if(light[x] != undefined) if(light[x][y + 1] != undefined) if (light[x][y + 1] < level - 1) lighttile(x, y + 1, level - 1);
    }
}