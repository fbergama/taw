/***************************************************
  An example of modern OOP in JavaScript.

  Characters inspired to role playing games like D&D
  are implemented using Mixins instead of classic
  class based inheritance.
***************************************************/


function Character( name ) {
    this.name = function() { return name };

    (function( o ) {
        let health = 100;
        let mana = 100;
        o.takeDamage = function( amount ) { health = Math.max( health-amount, 0 ); }
        o.consumeMana = function( amount ) { mana = Math.max( mana-amount, 0 ); }
        o.getMana = function() { return mana; }
        o.getHealth = function() { return health; }
    })(this);
}

Character.prototype =  {
    toString: function() { return "Character " + this.name() + " " + this.getHealth() + "/" + this.getMana() },
    isDead: function() { return this.getHealth()===0; }
}


let asSpellCaster = function( magictype ) {
    this.magictype = magictype;

    this.castSpell = function() {
        if( this.getMana() > 10 ) {
            console.log(`${this.name()} (${this.magictype} magic)  is casting a spell!`);
            this.consumeMana(10);
        }
    }
}

let asStealer = function() {
    this.steal = function() {
        if( this.getMana()>3 ) {
            console.log(this.name() + " is stealing an object...");
            this.consumeMana(3);
        }
    }
}

let asLockpicker = function() {
    this.lockpick = function() {
        if( this.getMana()>2 ) {
            console.log(this.name() + " is lockpiking...");
            this.consumeMana(2);
        }
    }
}

// Mage character definition
//
function Mage( name, type ) {
    this.magictype = type;
    Character.apply( this, arguments );
}
Mage.prototype = Object.create( Character.prototype );
Mage.prototype.toString = function() { return Character.prototype.toString.apply(this) + " mage type " + this.magictype }
asSpellCaster.call( Mage.prototype, "fire" );



// Thief character definition
//
function Thief( name ) {
    Character.apply( this, arguments )
}
Thief.prototype = Object.create( Character.prototype );
Thief.prototype.toString = function() { return Character.prototype.toString.apply(this) + " thief" };
asStealer.call( Thief.prototype );
asLockpicker.call( Thief.prototype );


// Bard character definition
//
function Bard( name ) {
    Character.apply( this, arguments )
}

Bard.prototype = Object.create(Character.prototype);
Bard.prototype.toString = function () { return Character.prototype.toString.apply(this) + " bard"; }

asSpellCaster.call( Bard.prototype, "arcane" );
asStealer.call( Bard.prototype );
Bard.prototype.sing = function () {
    console.log(this.name() + " is playing a song... ");
    if( this.getMana()>1 )
        this.consumeMana(1);
}




// Let's instantiate a few characters for testing

let m = new Mage( "Merlino", "ice" )
console.log(m.toString())

let r = new Thief( "Robin Hood")
console.log( r.toString() )

let b = new Bard("Pippo the bard")
console.log( b.toString() )


m.castSpell()
r.steal()
r.lockpick()

b.castSpell()
b.steal()
b.sing()
