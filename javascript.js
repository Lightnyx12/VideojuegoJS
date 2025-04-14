class Escena extends Phaser.Scene {

    preload() {
        this.load.image('fondo', 'img/fondo.jpg');
        this.load.spritesheet('ball', 'img/ball.png', {
            frameWidth: 100,
            frameHeight: 100
        });

        this.load.image('barra1', 'img/barra1.png');
        this.load.image('barra2', 'img/barra2.png');
        this.load.image('arriba', 'img/arriba.png');
        this.load.image('abajo', 'img/abajo.png');
        this.load.audio('theme', 'theme.mp3');

        
    }

    colocarPelota() {
            const velocidad = 500;

            // Genera un ángulo aleatorio entre -45 y 45 grados o entre 135 y 225 grados (con un margen)
            let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
            const direccion = Math.random() < 0.5 ? 1 : -1; // Aleatorio si la pelota va hacia la derecha o izquierda
            anguloInicial += direccion * Math.PI; // Cambia la dirección de la pelota

            const vx = Math.sin(anguloInicial) * velocidad;
            const vy = Math.cos(anguloInicial) * velocidad;

            // Si la pelota ya existe, solo cambia su posición y velocidad
            if (this.ball) {
                this.ball.setPosition(480, 320);  // Resetea la posición al centro
            } else {
                // Si la pelota no existe, crea una nueva
                this.ball = this.physics.add.sprite(480, 320, 'ball');
                this.ball.setBounce(1);
                this.ball.setCollideWorldBounds(true);
                this.physics.add.collider(this.ball, this.barra1);
                this.physics.add.collider(this.ball, this.barra2);
                
                // Define la animación de la pelota si es necesario
                this.anims.create({
                    key: 'brillar',
                    frames: this.anims.generateFrameNumbers('ball', {
                        start: 0,
                        end: 3
                    }),
                    frameRate: 10,
                    repeat: -1
                });
                this.ball.play('brillar');
            }

            // Establecer la nueva velocidad
            this.ball.body.velocity.x = vx;
            this.ball.body.velocity.y = vy;
            this.alguienGano = false;
        }


    create() {
        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();
        this.music = this.sound.add('theme', { loop: true, volume: 0.5 });
        this.music.play();
        this.add.sprite(480, 320, 'fondo');
        this.score1 = 0;
        this.score2 = 0;
        this.pintarMarcador();
        
        this.ball = this.physics.add.sprite(480, 320, 'ball');

        this.anims.create({
            key: 'brillar',
            frames: this.anims.generateFrameNumbers('ball', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.ball.play('brillar');

        const controlesVisuales = (posArriba, posAbajo, barra) => {
            const btnArriba = this.add.image(posArriba.x, posArriba.y, 'arriba').setInteractive();
            const btnAbajo = this.add.image(posAbajo.x, posAbajo.y, 'abajo').setInteractive();
    
            btnArriba.setScale(0.5);
            btnAbajo.setScale(0.5);
    
            btnArriba.on('pointerdown', () => {
                barra.y -= 10;
            });
    
            btnAbajo.on('pointerdown', () => {
                barra.y += 10;
            });
        };

        this.barra1 = this.physics.add.sprite(70, 320, 'barra1').setImmovable(true);
        this.barra2 = this.physics.add.sprite(885, 320, 'barra2').setImmovable(true);
        this.physics.add.collider(this.ball, this.barra1);
        this.physics.add.collider(this.ball, this.barra2);
        
        const velocidad = 500;

        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) {
            anguloInicial += Math.PI;
        }

        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;
        this.ball.body.velocity.x = vx;
        this.ball.body.velocity.y = vy;

        this.ball.setBounce(1);
        this.ball.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S
        });

        controlesVisuales ({
            x: 50,
            y: 50,
        }, {
            x: 50,
            y: 590,
        },this.barra1) 

        controlesVisuales({
            x: 910,  
            y: 50,
        }, {
            x: 910,
            y: 590,
        }, this.barra2);


        

    }

    pintarMarcador() {
        this.marcador1= this.add.text(440,75,'0', {
            fontSize: 'font1',
            fontSize: 80,
            color: '#fff',
            align: 'right',
        }).setOrigin(1, 0).setDepth(1);
        this.marcador2 = this.add.text(520,75,'0', {
            fontSize: 'font1',
            fontSize: 80,
            align: 'left',
        });

    }

    update() {
        this.ball.rotation += 0.1;

        if (this.ball.x <0 && this.alguienGano === false) {
            alert('Jugador1 perdio');
            this.alguienGano = true;
            this.marcador2.text = parseInt(this.marcador2.text) + 1;
            this.colocarPelota();
        } else if (this.ball.x > 960) {
            alert('Jugador2 perdio');
            this.marcador1.text = parseInt(this.marcador1.text) + 1;
            this.alguienGano = true;
            this.colocarPelota();
        }

        
    

        if (this.ball.y > config.height || this.ball.y < 0) {
            this.ball.body.velocity.y = -this.ball.body.velocity.y;
        }

        if (this.cursors.up.isDown) {
            this.barra1.y -= 5;
        } else if (this.cursors.down.isDown) {
            this.barra1.y += 5;
        }

        if (this.cursors.up.isDown) {
            this.barra2.y -= 5;
        } else if (this.cursors.down.isDown) {
            this.barra2.y += 5;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scene: Escena,
    physics: {
        default: 'arcade',
    }
};

new Phaser.Game(config);
