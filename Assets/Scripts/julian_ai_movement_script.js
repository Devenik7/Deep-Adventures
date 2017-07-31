#pragma strict

var animator : Animator;
var body : Rigidbody2D;
var audioPlayer1 : AudioSource;
var audioPlayer2 : AudioSource;
var audioPlayer3 : AudioSource;

var sound : Transform;

var teleport : AudioClip;
var charge : AudioClip;
var explosion : AudioClip;
var ball : AudioClip;
var skull : AudioClip;
var burnout1 : AudioClip;
var burnout2 : AudioClip;
var burnout : Transform;
var soulBomb : Transform;
var soulBombPosition : Transform;

var isFacingRight : boolean = true;

function Start () {
	animator = GetComponent(Animator);
	body = GetComponent.<Rigidbody2D>();
	var audioSources = GetComponents.<AudioSource>();
	audioPlayer1 = audioSources[0];
	audioPlayer2 = audioSources[1];
	audioPlayer3 = audioSources[2];
}

function Update () {
	if (Input.GetKeyDown(KeyCode.L)) {
		//animator.Play("julian_soulbomb_charge", PlayMode.StopSameLayer);
	}
	if (Input.GetKeyDown(KeyCode.K)) {
		//var animEvent : AnimationEvent;
		//animEvent.functionName = "animEventExample";
		//animEvent.time = 0.2f;
		//AnimationClip.AddEvent(animEvent); 
	}
}

function FixedUpdate () {
	// gravity
	body.AddForce(Vector2.down * 50);
}

function playTeleportSound () {
	var soundObject = Instantiate(sound, transform.position, Quaternion.identity);
	var source = soundObject.GetComponent(AudioSource);
	source.clip = teleport;
	source.Play();
	Destroy(soundObject.gameObject, teleport.length + 1f); 
	//audioPlayer2.clip = teleport;
	//audioPlayer2.Play();
}

function playChargingSound () {
	audioPlayer1.clip = charge;
	audioPlayer1.Play();
}

function playExplosionSound () {
	audioPlayer2.clip = explosion;
	audioPlayer2.Play();
}

function playBallSound () {
	audioPlayer1.clip = ball;
	audioPlayer1.Play();
}

function playSkullSound () {
	audioPlayer3.clip = skull;
	audioPlayer3.Play();
}

function playBurnoutSound () {
	audioPlayer3.clip = (Random.Range(0.0,1.0) < 0.5) ? burnout1 : burnout2;
	audioPlayer3.Play();
}

function instantiateBurnoutPrefab () {
	Instantiate(burnout, transform.position, Quaternion.identity);
}

function instantiateSoulbombPrefab () {
	var bomb = Instantiate(soulBomb, soulBombPosition.position, Quaternion.identity);
	bomb.GetComponent.<Rigidbody2D>().velocity = 15 * Vector2.right * ((isFacingRight) ? 1 : -1);
	if(!isFacingRight)
		flipObject(bomb);
}

function flipObject (obj : Transform) {
	var currScale = obj.localScale;
	currScale.x *= -1;
	obj.localScale = currScale;
}

function OnTriggerEnter2D (collider : Collider2D) {
	if (collider.gameObject.tag == "Player") {
		collider.gameObject.GetComponent(healthScript).takeDamage(1.5, Vector2.right * Mathf.Sign(collider.transform.position.x - transform.position.x));
	}
}