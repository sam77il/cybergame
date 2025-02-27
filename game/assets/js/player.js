export default class Player {
  constructor(
    context,
    startPosX,
    startPosY,
    playerWidth,
    playerHeight,
    tileSize,
    map
  ) {
    this.playerPosX = startPosX;
    this.playerPosY = startPosY;
    this.playerWidth = playerWidth;
    this.playerHeight = playerHeight;
    this.playerSpeed = 5;
    this.context = context;
    this.controls = null;
    this.onGround = false;
    this.playerFall = 0;
    this.playerJumpForce = 20;
    this.velocityY = 0.3;
    this.tileSize = tileSize;
    this.map = map;
    this.blocks = "PB";
    this.gravity = 1;
  }

  initialize() {
    console.log("first");
    this.context.fillStyle = "black";
    this.context.fillRect(
      this.playerPosX,
      this.playerPosY,
      this.playerWidth,
      this.playerHeight
    );
  }

  update() {
    this.context.fillStyle = "black";
    this.context.fillRect(
      this.playerPosX,
      this.playerPosY,
      this.playerWidth,
      this.playerHeight
    );
  }

  block() {
    let b = {}; // Blockade-Objekt als Rückgabewert
    b.spalteL = Math.floor(this.playerPosX / this.tileSize); // Spaltennummer der linken Spielerkante
    b.spalteR = Math.floor(
      (this.playerPosX + this.playerWidth) / this.tileSize
    ); // Spaltennummer der rechten Spielerkante
    b.zeileO = Math.floor(this.playerPosY / this.tileSize); // Zeilennummer der oberen Spielerkante
    b.zeileU = Math.floor(
      (this.playerPosY + this.playerHeight) / this.tileSize
    ); // Zeilennummer der unteren Spielerkante
    // Prüfung, ob Spieler mit einer seiner Ecken in einem BLOCKER-Tile steht:
    if (this.onGround) {
      b.links =
        this.blocks.indexOf(this.map[b.zeileO].charAt(b.spalteL)) >= 0 ||
        this.blocks.indexOf(this.map[b.zeileU].charAt(b.spalteL)) >= 0;
      b.rechts =
        this.blocks.indexOf(this.map[b.zeileO].charAt(b.spalteR)) >= 0 ||
        this.blocks.indexOf(this.map[b.zeileU].charAt(b.spalteR)) >= 0;
    } else {
      //console.log("checking on air");
      b.links =
        this.blocks.indexOf(this.map[b.zeileO].charAt(b.spalteL)) >= 0 ||
        this.blocks.indexOf(this.map[b.zeileU].charAt(b.spalteL)) >= 0;
      b.rechts =
        this.blocks.indexOf(this.map[b.zeileO].charAt(b.spalteR)) >= 0 ||
        this.blocks.indexOf(this.map[b.zeileU].charAt(b.spalteR)) >= 0;
    }

    b.oben =
      this.blocks.indexOf(this.map[b.zeileO].charAt(b.spalteL)) >= 0 ||
      this.blocks.indexOf(this.map[b.zeileO].charAt(b.spalteR)) >= 0;

    b.unten =
      this.blocks.indexOf(this.map[b.zeileU].charAt(b.spalteL)) >= 0 ||
      this.blocks.indexOf(this.map[b.zeileU].charAt(b.spalteR)) >= 0;

    return b; // Liefert das Objekt an die Stelle des Aufrufs zurück
  }

  move(controls) {
    let abc = this.block();
    console.log(abc.unten);
    if (controls.left) {
      let blocked = this.block();

      this.playerPosX -= this.playerSpeed;
      if (blocked.links) {
        this.playerPosX = this.tileSize * blocked.spalteL + this.tileSize;
      }
    }
    if (controls.right) {
      let blocked = this.block();

      this.playerPosX += this.playerSpeed;
      if (blocked.rechts) {
        this.playerPosX =
          this.tileSize * blocked.spalteR - this.playerWidth - 1;
      }
    }
    if (this.onGround) {
      if (controls.up) {
        this.onGround = false;
        this.playerFall = -this.playerJumpForce;
      }
      let blocked = this.block();
      if (!blocked.unten) {
        this.onGround = false;
      }
    } else {
      this.playerFall += this.gravity;
      this.playerPosY += this.playerFall;
      let blocked = this.block();

      if (this.playerFall > 0 && blocked.unten) {
        this.playerFall = 0;
        this.playerPosY =
          this.tileSize * blocked.zeileU - this.playerHeight - 0.5;
        this.onGround = true;
      }
      if (this.playerFall < 0 && blocked.oben) {
        this.playerPosY = this.tileSize * blocked.zeileO + this.tileSize;
        this.playerFall = 0;
      }
    }
  }
}
