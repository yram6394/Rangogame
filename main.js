const canvasSize = 600

const can = document.getElementById("can")
can.width = canvasSize
can.height = canvasSize
const ctx = can.getContext("2d")

// bot config
const noOfBotAtaTime = 20
const botMovementRate = .5 
const botTurnRate = .5 
const botFiringRate = .5 




// main character 
const player = {
  size: 20,
  color: "orange",
  pos: {
    x: 200,
    y: 300,
    dir: "up"
  },
  speed: 15,
  bulletSpeed: 6,
  bulletSize: 10,
  bulletColor: "blue",
  bulletDamage: 10,
    health: 100  
}
// enemy character 
const enemies = [
  {
    size: 15,
    color: "green",
    pos: {
      x: 400,
      y: 200,
      dir: "down"
    },
    speed: 5,
    health: 30,
    bulletSpeed: 5,
    bulletSize: 10,
    bulletColor: "red"
  },
  {
    size: 15,
    color: "yellow",
    pos: {
      x: 500,
      y: 500,
      dir: "up"
    },
    speed: 5,
    health: 100,
    bulletSpeed: 5,
    bulletSize: 10,
    bulletColor: "red"
  }
]

const bullets = []

const drawCharacter = (x, y, dir, size, color) => {
  ctx.fillStyle = color
  if (dir === "up") {
    ctx.fillRect(x - size / 2, y - 1.5 * size, size, size)
    ctx.fillRect(x - size / 2, y - size / 2, size, size)
    ctx.fillRect(x - 1.5 * size, y - size / 2, size, size)
    ctx.fillRect(x + size / 2, y - size / 2, size, size)
    ctx.fillRect(x - 1.5 * size, y + size / 2, size, size)
    ctx.fillRect(x + size / 2, y + size / 2, size, size)
  } else if (dir === "down") {
    ctx.fillRect(x - size / 2, y + size / 2, size, size)
    ctx.fillRect(x - size / 2, y - size / 2, size, size)
    ctx.fillRect(x - 1.5 * size, y - size / 2, size, size)
    ctx.fillRect(x + size / 2, y - size / 2, size, size)
    ctx.fillRect(x - 1.5 * size, y - 1.5 * size, size, size)
    ctx.fillRect(x + size / 2, y - 1.5 * size, size, size)
  } else if (dir === "left") {
    ctx.fillRect(x - 1.5 * size, y - size / 2, size, size)
    ctx.fillRect(x - size / 2, y - size / 2, size, size)
    ctx.fillRect(x - size / 2, y - 1.5 * size, size, size)
    ctx.fillRect(x + size / 2, y - 1.5 * size, size, size)
    ctx.fillRect(x - size / 2, y + size / 2, size, size)
    ctx.fillRect(x + size / 2, y + size / 2, size, size)
  } else if (dir === "right") {
    ctx.fillRect(x + size / 2, y - size / 2, size, size)
    ctx.fillRect(x - size / 2, y - size / 2, size, size)
    ctx.fillRect(x - size / 2, y - 1.5 * size, size, size)
    ctx.fillRect(x - size / 2, y + size / 2, size, size)
    ctx.fillRect(x - 1.5 * size, y + size / 2, size, size)
    ctx.fillRect(x - 1.5 * size, y - 1.5 * size, size, size)

  }
}

const drawBullets = (bullets) => {
  bullets.forEach((e) => {
    ctx.fillStyle = e.color
    ctx.fillRect(e.x - e.size / 2, e.y - e.size / 2, e.size, e.size)
  })
}

const drawEnemies = (enemies) => {
  enemies.forEach((e) => {
    drawCharacter(e.pos.x, e.pos.y, e.pos.dir, e.size, e.color)
  })
}

const moveEnemies = (enemies) => {
  enemies.forEach((e) => {
    // for movement
    const x = 10 * Math.random()
    if (x < botMovementRate) {
      if (e.pos.dir === "up") {
        e.pos.y -= e.speed
      } else if (e.pos.dir === "down") {
        e.pos.y += e.speed
      } else if (e.pos.dir === "left") {
        e.pos.x -= e.speed
      } else if (e.pos.dir === "right") {
        e.pos.x += e.speed
      }
    }

    const y = 10 * Math.random()
    if (y < botTurnRate) {
      const z = 4 * Math.random()
      if (z < 1) {
        e.pos.dir = "up"
      } else if (z < 2) {
        e.pos.dir = "down"
      } else if (z < 3) {
        e.pos.dir = "left"
      } else {
        e.pos.dir = "right"
      }
    }

    const z = 10 * Math.random()
    if (z < botFiringRate) {
      bullets.push({
        x: e.pos.x,
        y: e.pos.y,
        dir: e.pos.dir,
        size: e.bulletSize,
        speed: e.bulletSpeed,
        color: e.bulletColor,
        owner: "enemy"
      })
    }

    // keep on canavs
    if (e.pos.x > canvasSize + e.size * 1.5) {
      e.pos.x = -1.5 * e.size
    } else if (e.pos.x < -1.5 * e.size) {
      e.pos.x = canvasSize + e.size * 1.5
    } else if (e.pos.y > canvasSize + e.size * 1.5) {
      e.pos.y = -1.5 * e.size
    } else if (e.pos.y < -1.5 * e.size) {
      e.pos.y = canvasSize + e.size * 1.5
    }
  })
}

const moveBullets = (bullets) => {
  bullets.forEach((e, i) => {
    if (e.dir === "up") {
      e.y -= e.speed
    } else if (e.dir === "down") {
      e.y += e.speed
    } else if (e.dir === "right") {
      e.x += e.speed
    } else if (e.dir === "left") {
      e.x -= e.speed
    }
    if (e.x < 0 || e.x > canvasSize || e.y < 0 || e.y > canvasSize || e.isHitted) {
      bullets.splice(i, 1)
    }
  })
}

const checkBulletsHit = () => {
  bullets.forEach((b) => {
    if (b.owner === "player") {
      enemies.forEach((e, i) => {
        if ((Math.abs(b.x - e.pos.x) < 1.5 * e.size + b.size / 2)
          && (Math.abs(b.y - e.pos.y) < 1.5 * e.size + b.size / 2)) {
          b.isHitted = true
          e.health -= b.damage
          if (e.health <= 0) {
            console.log("dead")
            enemies.splice(i, 1)
          }
        }
      })
    }
  })
}


const checkPlayerHit = () => {
  bullets.forEach((b, i) => {

    if (b.owner === "enemy") {

      if (
        Math.abs(b.x - player.pos.x) < 1.5 * player.size + b.size / 2 &&
        Math.abs(b.y - player.pos.y) < 1.5 * player.size + b.size / 2
      ) {

        bullets.splice(i, 1) // bullet delete
        player.health -= 10

        console.log("Player health:", player.health)

        if (player.health <= 0) {
          alert("Game Over")
          location.reload()
        }

      }

    }

  })
}

const checkEnemyCount = () => {

  while (enemies.length < noOfBotAtaTime) {
    const dirs = ["up", "down", "left", "right"]
    const colors = ["blue", "green", "red", "aqua", "yellow", "pink"]
    enemies.push(
      {
        size: 10 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        pos: {
          x: Math.random() * canvasSize,
          y: Math.random() * canvasSize,
          dir: dirs[Math.floor(Math.random() * dirs.length)]
        },
        speed: 5,
        health: 100,
        bulletSpeed: 5,
        bulletSize: 10,
        bulletColor: "red"
      }
    )
  }
}

setInterval(() => {
  // calculation
  checkEnemyCount(enemies)
  moveEnemies(enemies)
  moveBullets(bullets)
  checkBulletsHit()
    checkBulletsHit()
  checkPlayerHit()   
  // drawing
  ctx.clearRect(0, 0, canvasSize, canvasSize)
  drawBullets(bullets)
  drawEnemies(enemies)
  drawCharacter(player.pos.x, player.pos.y, player.pos.dir, player.size, player.color)
}, 20)

window.addEventListener("keypress", (e) => {
  if (e.code === "KeyW") {
    player.pos.y -= player.speed
    player.pos.dir = "up"
  } else if (e.code === "KeyS") {
    player.pos.y += player.speed
    player.pos.dir = "down"
  } else if (e.code === "KeyA") {
    player.pos.x -= player.speed
    player.pos.dir = "left"
  } else if (e.code === "KeyD") {
    player.pos.x += player.speed
    player.pos.dir = "right"
  } else if (e.code === "Space") {
    bullets.push(
      {
        x: player.pos.x,
        y: player.pos.y,
        dir: player.pos.dir,
        size: player.bulletSize,
        speed: player.bulletSpeed,
        color: player.bulletColor,
        owner: "player",
        damage: player.bulletDamage
      })
     checkBulletsHit()
  checkPlayerHit()   // ADD THIS
  }

  // keep player on canavs
  if (player.pos.x > canvasSize + player.size * 1.5) {
    player.pos.x = -1.5 * player.size
  } else if (player.pos.x < -1.5 * player.size) {
    player.pos.x = canvasSize + player.size * 1.5
  } else if (player.pos.y > canvasSize + player.size * 1.5) {
    player.pos.y = -1.5 * player.size
  } else if (player.pos.y < -1.5 * player.size) {
    player.pos.y = canvasSize + player.size * 1.5
  }
})