//Dynamic variables(Global scope to update player dashboard)
var flurbos = 0,
    round = 1,
    bases = [],
    missileSilos = [],
    playerMissiles = [],
    meeseeksMissiles = [],
    timerID;

// Generates a randon number for use in game logic
var rand = function( min, max ) {
  return Math.floor( Math.random() * (max - min + 1) ) + min;
};

//Game function to construct game canvas, animations, and logic
var mrMeeseeksMissiles = (function() {
  var canvas = document.querySelector( 'canvas' ),
      ctx = canvas.getContext( '2d' );

  //Constant variables
  var CANVAS_WIDTH  = canvas.width,
      CANVAS_HEIGHT = canvas.height,
      MISSILE = {
        active: 1,
        exploding: 2,
        imploding: 3,
        exploded: 4
      };

  //Background Overlay to allow for animation frame refresh
  var drawBackground = function() {

    // Night sky background overlay
    ctx.fillStyle = 'rgba(0,0,102,0.1)';
    ctx.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

    //Build ground level for placement of bases and missileSilos
    ctx.fillStyle = '#668d3c';
    ctx.fillRect(0, 450, 700, 50);
  };

  //Adds initial coordinates for bases and missileSilos
  var initialize = function() {

    //Grid coordinates of bases
    bases.push( new Base( 60,  420 ) );
    bases.push( new Base(160, 420 ) );
    bases.push( new Base( 260, 420 ) );
    bases.push( new Base( 380, 420 ) );
    bases.push( new Base( 480, 420 ) );
    bases.push( new Base( 580, 420 ) );

    //Grid coordinates of missileSilos
    missileSilos.push( new MissileSilo( 20,  450 ) );
    missileSilos.push( new MissileSilo( 335, 450 ) );
    missileSilos.push( new MissileSilo( 650, 450 ) );
    startNewRound();
  };

  //Resets listed variables at the start of new round
  var startNewRound = function() {
    $.each( missileSilos, function( index, ms ) {
      ms.missilesLeft = 10;
    });
    playerMissiles = [];
    meeseeksMissiles = [];
    createMeeseeksMissiles();
    drawGameState();
  };

  //Draw missiles in missileSilos
  var drawMissileSilos = function() {
    $.each( missileSilos, function( index, ms ) {
      ms.draw();
    });
  };

  //Bonus multiplier for saved bases and missiles left
  var bonusMultiplier = function() {
    return ( round > 10 ) ? 10 : Math.floor( (round + 1) / 2 );
  };


  //Continous updating of flurbos, round, and dynamic objects in game
  var drawGameState = function() {
    drawBackground();
    drawBases();
    drawMissileSilos();
    drawFlurbos();
    showRound();
  };

  // Show current flurbos
  var drawFlurbos = function() {
    $('.playerScore').html(flurbos);
  };

  //Show current round
  var showRound = function() {
    $('.roundCount').html(round);
  };

  //Message update at the end of each round, tells player how many bases remain
  var drawRoundOver = function( missilesLeft, missilesBonus, 
                               basesSaved, basesBonus ) {
    drawGameState();
    $('.roundMessage').html(basesSaved + " bases left, Morty! You'll get bonus flurbos for using less missiles and saving more bases! Click to start the next round!");
  };

  //Shows game over message when all bases destroyed
  var gameOver = function() {
    $('.roundMessage').html(flurbos + " flurbos, Morty! Don't worry about all the bases Meeseeks destroyed! Lets go to BLIPS AND CHHIIITTTZZZ! Click the game screen to play again!");

  };

  //Draws active bases
  var drawBases = function() {
    $.each( bases, function( index, base ) {
      if( base.active ) {
        base.draw();
      }
    });
  };

  //Base Contructor
  function Base( x, y ) {
    this.x = x;
    this.y = y;
    this.active = true;
  }

  //Builds bases based on grid coordinates
  Base.prototype.draw = function() {
    var x = this.x,
        y = this.y;

    ctx.fillStyle = '#696969';
    ctx.beginPath();
    ctx.moveTo( x, y );
    ctx.lineTo( x, y + 40 );
    ctx.lineTo( x + 30, y + 40 );
    ctx.lineTo( x + 30, y);
    ctx.closePath();
    ctx.fill();
  };

  //MissileSilo Constructor
  function MissileSilo( x, y ) {
    this.x = x;
    this.y = y;
    this.missilesLeft = 10;
  }

  //Assigns boolean type to missilesLeft
  MissileSilo.prototype.hasMissile = function() {
    return !!this.missilesLeft;
  };

  //Draw missiles in silo and shows remaining missiles
  MissileSilo.prototype.draw = function() {

    //Decalares variables for coordinates
    var x, y;
    
    //Sets starting point for different missiles in silo
    var delta = [ [0, 0], [0, 10], [0, 20], [0, 30], [-5, 5],
                  [-5, 15], [-5, 25], [5, 5], [5, 15], [5, 25] ];

    for( var i = 0, len = this.missilesLeft; i < len; i++ ) {
      x = this.x + delta[i][0];
      y = this.y + delta[i][1];

      //Draws missiles in silo
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo( x, y );
      ctx.lineTo( x, y + 8 );
      ctx.moveTo( x - 1, y + 8 );
      ctx.lineTo( x - 1, y + 6 );
      ctx.moveTo( x + 1, y + 8 );
      ctx.lineTo( x + 1, y + 6 );
      ctx.stroke();
    }
  };


  //***MISSILES***

  // Constructor for a Missile, applied to player and meeseeks missiles
  //The arguement 'options' will including beginning and ending coordinates
  //as well as body and trail color of missiles, width and height, and starting explodeRadius
  function Missile( options ) {
    this.startX = options.startX;
    this.startY = options.startY;
    this.endX = options.endX;
    this.endY = options.endY;
    this.color = options.color;
    this.trailColor = options.trailColor;

    //Initial coordinates set to startX/startY option
    this.x = options.startX;
    this.y = options.startY;

    //State property allows for animation changes and proximity explosions
    this.state = MISSILE.active;
    this.width = 2;
    this.height = 3;
    this.explodeRadius = 0;
  }

  //Draws trail of missiles
  Missile.prototype.draw = function() {
    if( this.state === MISSILE.active ){
      ctx.strokeStyle = this.trailColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo( this.startX, this.startY );
      ctx.lineTo( this.x, this.y );
      ctx.stroke();

      //Draws body of missile, offset by 1 grid point 
      ctx.fillStyle = this.color;
      ctx.fillRect( this.x - 1, this.y - 1, this.width, this.height );

      //Draws explosion bubble for exploding and imploding missiles
    } else if( this.state === MISSILE.exploding ||
               this.state === MISSILE.imploding ) {
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath();
      ctx.arc( this.x, this.y, this.explodeRadius, 0, 2 * Math.PI );
      ctx.closePath();

      //Sets proximity explode to area of explosion bubble
      proximityExplode( this, ctx );

      ctx.fill();
    }
  };

  //Animation effects and ctx for exploding/imploding missiles
  Missile.prototype.explode = function() {
    if( this.state === MISSILE.exploding ) {
      this.explodeRadius++;
    }
    if( this.explodeRadius > 35 ) {
      this.state = MISSILE.imploding;
    }
    if( this.state === MISSILE.imploding ) {
      this.explodeRadius--;

      //When missile hits target: sets base to inactive/removes all missiles from silo
      if( this.groundExplosion ) {
        ( this.target[2] instanceof Base ) ? this.target[2].active = false
                                        : this.target[2].missilesLeft = 0;
      }
    }

    //Keep exploded missile from affecting any other missiles after full implode
    if( this.explodeRadius < 0 ) {
      this.state = MISSILE.exploded;
    }
  };


  //***PLAYER MISSILES***

  //PlayerMissile constructor, inherits from Missile
  function PlayerMissile( source, endX, endY ) {

    //Declares variable for Silo selection
    var ms = missileSilos[source];

    Missile.call( this, { startX: ms.x,  startY: ms.y,
                          endX: endX,     endY: endY, 
                          color: '#00ff00', trailColor: '#02afc5' } );

    var xDistance = this.endX - this.startX,
        yDistance = this.endY - this.startY;

    //Determines length and angle of missile path to ensure flight 
    //in correct direction and at constant speed(Remove for laser effect)
    var scale = (function() {

      //Distance/Angle
      var distance = Math.sqrt( Math.pow(xDistance, 2) + Math.pow(yDistance, 2) ),
          distancePerFrame = 15;

      //Speed
      return distance / distancePerFrame;
    })();

    this.dx = xDistance / scale;
    this.dy = yDistance / scale;
    ms.missilesLeft--;
  }

  // Set PlayerMissile to inherit from Missile
  PlayerMissile.prototype = Object.create( Missile.prototype );
  PlayerMissile.prototype.constructor = PlayerMissile;

  // Update the location/state of player missile
  PlayerMissile.prototype.update = function() {
    if( this.state === MISSILE.active && this.y <= this.endY ) {
      
      //Sets endX/endY once target reached
      this.x = this.endX;
      this.y = this.endY;
      this.state = MISSILE.exploding;
    }

    //Active missile-s continue path
    if( this.state === MISSILE.active ) {
      this.x += this.dx;
      this.y += this.dy;
    } else {
      this.explode();
    }
  };

  // Creates missiles to fire at targeted location
  var playerShoot = function( x, y ) {
    if( y >= 50 && y <= 390 ) {
      var source = whichMissileSilo( x );
      if( source === -1 ){ // No missiles left
        return;
      }
      playerMissiles.push( new PlayerMissile( source, x, y ) );
    }
  };

  //Updates player missiles and removes exploded missiles
  var updatePlayerMissiles = function() {
    $.each( playerMissiles, function( index, missile ) {
      missile.update();
    });
    playerMissiles = playerMissiles.filter( function( missile ) {
      return missile.state !== MISSILE.exploded;
    });
  };

  //Draws player missiles
  var drawPlayerMissiles = function() {
    $.each( playerMissiles, function( index, missile ) {
      missile.draw();
    });
  };

  //Determines which missile silo to fire from based on proximity
  //of target and which silos have remaining missiles
  var whichMissileSilo = function( x ) {
    var firedOuter = function( priority1, priority2, priority3) {
      if( missileSilos[priority1].hasMissile() ) {
        return priority1;
      } else if ( missileSilos[priority2].hasMissile() ) {
        return priority2;
      } else {
        return priority3;
      }
    };

    var firedCenter = function( priority1, priority2 ) {
      if( missileSilos[priority1].hasMissile() ) {
        return priority1;
      } else {
        return priority2;
      }
    };

    //If all silos are out of missiles
    if( !missileSilos[0].hasMissile() && 
        !missileSilos[1].hasMissile() &&
        !missileSilos[2].hasMissile() ) {
      return -1;
    }

    //If target lies in in first third of grid
    if( x <= CANVAS_WIDTH / 3 ){
      return firedOuter( 0, 1, 2 );

    //If target lies in middle third of grid
    } else if( x <= (2 * CANVAS_WIDTH / 3) ) {
      if ( missileSilos[1].hasMissile() ) {
        return 1;

      //If middile silo is empty, determine which half of grid
      //target lies in to determine closest silo
      } else {
        return ( x <= CANVAS_WIDTH / 2 ) ? firedCenter( 0, 2 )
                                         : firedCenter( 2, 0 );
      }

    //If target lies in last third of grid
    } else {
      return firedOuter( 2, 1, 0 );
    }
  };



  //***MEESEEKS MISSILES***

  //Meeseeks Missile Constructor, inherits from Missile
  function MeeseeksMissile( targets ) {
    var startX = rand( 0, CANVAS_WIDTH ),
        startY = 0,

        //Use rand() to creat variations in missile speed
        speed = rand(80, 120) / 100,

        //Use rand() to pick random targets
        target = targets[ rand(0, targets.length - 1) ],
        framesToTarget;

    Missile.call( this, { startX: startX,  startY: startY, 
                          endX: target[0], endY: target[1],
                          color: '#02afc5', trailColor: '#00ff00' } );

    framesToTarget = ( 450 - 30 * round ) / speed;
    if( framesToTarget < 20 ) {
      framesToTarget = 20;
    }
    this.dx = ( this.endX - this.startX ) / framesToTarget;
    this.dy = ( this.endY - this.startY ) / framesToTarget;

    this.target = target;

    // Make missiles heading to their target at random times
    this.delay = rand( 0, 400 + (round * 10) );
    this.groundExplosion = false;
  }

  //Set meeseeks missile to inherit from Missile
  MeeseeksMissile.prototype = Object.create( Missile.prototype );
  MeeseeksMissile.prototype.constructor = MeeseeksMissile;

  //Updates location/state of meeseeks missile and counts down delayed firing
  MeeseeksMissile.prototype.update = function() {
    if( this.delay ) {
      this.delay--;
      return;
    }
    if( this.state === MISSILE.active && this.y >= this.endY ) {

      //Update for meeseek missile hitting target
      this.x = this.endX;
      this.y = this.endY;
      this.state = MISSILE.exploding;
      this.groundExplosion = true;
    }
    if( this.state === MISSILE.active ) {
      this.x += this.dx;
      this.y += this.dy;
    } else {
      this.explode();
    }
  };

  //Allows proximity-based chain reaction if meeseeks missile is 
  //within explosion bubble of another missile
  var proximityExplode = function( missile, ctx ) {
    if( !missile.groundExplosion ){
      $.each( meeseeksMissiles, function( index, otherMissile ) {
        if( ctx.isPointInPath( otherMissile.x, otherMissile.y ) &&
            otherMissile.state === MISSILE.active ) {
          flurbos += 25 * bonusMultiplier();
          otherMissile.state = MISSILE.exploding;
        }
      });
    }
  };

  //Get possible targets for meeseeks missiles
  //Only active bases and missileSilos included
  var possibleTargets = function() {
    var targets = [];

    //Selects active bases
    $.each( bases, function( index, base ) {
      if( base.active ) {
        targets.push( [base.x + 15, base.y - 10, base] );
      }
    });

    //Only allows at most 3 bases to be targeted per round
    while( targets.length > 3 ) {
      targets.splice( rand(0, targets.length - 1), 1 );
    }

    //All active missileSilos included each round
    $.each( missileSilos, function( index, ms ) {
      targets.push( [ms.x, ms.y, ms]);
    });
    
    return targets;
  };

  //Generates the number of meeseeks missiles in one round
  //Formula for numMissiles prior to 10th round
  //10th round begins insane mode
  var createMeeseeksMissiles = function() {
    var targets = possibleTargets(),
        numMissiles = ( round < 10 ) ? round * 5 : 300;
    for( var i = 0; i < numMissiles; i++ ) {
      meeseeksMissiles.push( new MeeseeksMissile(targets) );
    }
  };

  //Updates meeseeks missiles and removes exploded missiles
  var updateMeeseeksMissiles = function() {
    $.each( meeseeksMissiles, function( index, missile ) {
      missile.update();
    });
    meeseeksMissiles = meeseeksMissiles.filter( function( missile ) {
      return missile.state !== MISSILE.exploded;
    });
  };

  //Draws meeseeks missiles
  var drawMeeseeksMissiles = function() {
    $.each( meeseeksMissiles, function( index, missile ) {
      missile.draw();
    });
  };

  //Refresh frames for game animation
  var nextFrame = function() {
    drawGameState();
    updateMeeseeksMissiles();
    drawMeeseeksMissiles();
    updatePlayerMissiles();
    drawPlayerMissiles();
    checkRoundOver();
  };

  //Checks for end of round or end of game
  var checkRoundOver = function() {
    if( !meeseeksMissiles.length ) {

      //Stops animation refresh, removes .on() listeners
      stopRound();
      $( '.container' ).off( 'click' );

      //Declare vars to count bases and missiles left for bonus flurbos
      var missilesLeft = totalMissilesLeft(),
          basesSaved  = totalBasesSaved();

      !basesSaved ? endGame( missilesLeft ) 
                   : roundOver( missilesLeft, basesSaved );
    }
  };

  //Creates bonus flurbos at end of round
  var roundOver = function( missilesLeft, basesSaved ) {
    var missilesBonus = missilesLeft * 5 * bonusMultiplier(),
        basesBonus = basesSaved * 100 * bonusMultiplier();

    drawRoundOver( missilesLeft, missilesBonus, 
                  basesSaved, basesBonus );

    //Updates flurbos count with bonuses after 2 second delay
    setTimeout( function() {
      flurbos += missilesBonus + basesBonus;
      drawRoundOver( missilesLeft, missilesBonus, 
                    basesSaved, basesBonus );
    }, 2000 );

    //Sets up new round after 2 second delay
    setTimeout( setupNewRound, 2000 );
  };

  //Sets up new round
  var setupNewRound = function() {
    round++;
    startNewRound();
    setupListeners();
  };

  //Adds missile bonus flurbos and runs game over message
  var endGame = function( missilesLeft ) {
    flurbos += missilesLeft * 5 * bonusMultiplier();
    gameOver();

    $( 'body' ).on( 'click', 'div', function() {
      location.reload();
    });
  };

  //Counts total missiles left in all silos at end of round
  var totalMissilesLeft = function() {
    var total = 0;
    $.each( missileSilos, function(index, ms) {
      total += ms.missilesLeft;
    });
    return total;
  };

  //Counts all active bases at end of round
  var totalBasesSaved = function() {
    var total = 0;
    $.each( bases, function(index, base) {
      if( base.active ) {
        total++;
      }
    });
    return total;
  };

  // Start animating a new round
  var newRound = function() {
    timerID = setInterval( nextFrame, 1000 / 30 );
  };

  // Stop animating current round
  var stopRound = function() {
    clearInterval( timerID );
  };

  //Create event listeners so player can interact with canvas and
  //begin game/round.
  var setupListeners = function() {
    $( '.container' ).one( 'click', function() {
      newRound();

      $( '.container' ).on( 'click', function( event ) {
        playerShoot( event.pageX - this.offsetLeft, 
                     event.pageY - this.offsetTop );
      });
    });
  };

  return {
    initialize: initialize,
    setupListeners: setupListeners
  };

})();

$( document ).ready( function() {
  mrMeeseeksMissiles.initialize();
  mrMeeseeksMissiles.setupListeners();
});