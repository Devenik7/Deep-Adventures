#pragma strict

var animator : Animator;
var body : Rigidbody2D;
var patternScript : julian_patterns_script;
var mainScript : julian_ai_movement_script;
var soulBomb : Transform;
var explosion : Transform;

var leftLoc : Transform;
var rightLoc : Transform;
var locCounter : boolean = false;
var soulBombCounter : int = 0;
var isIdle : boolean = true;
var isVanishing : boolean = false;
var isReappearing : boolean = false;
var isShooting : boolean = false;

function Start () {
	animator = GetComponent(Animator);
	body = GetComponent.<Rigidbody2D>();
	patternScript = GetComponent(julian_patterns_script);
	mainScript = GetComponent(julian_ai_movement_script);
}

function Update () {
	if(patternScript.inSoulBombMode) {
		if(isIdle) {
			isIdle = false;
			soulBombCounter++;
			if (soulBombCounter > 5) {
				patternScript.currentState = 0;
				soulBombCounter = 0;
				isIdle = true;
				animator.Play("julian_vanish", PlayMode.StopSameLayer);
				initiateMultipleSoulbomb(); 
			}
			else {
				startVanishing();
			}
		}
		else {
			// the process has already started
		}
	}
	else {
		soulBombCounter = 0;
		isIdle = true;
	}
}

function startVanishing () {
	isVanishing = true;
	//Debug.Log("came here");
	animator.Play("julian_vanish", PlayMode.StopSameLayer);
}

function SBvanishComplete () {
	isVanishing = false;
	if (locCounter) { // appear Right Side
		if (mainScript.isFacingRight) flipJulian(); // to face left
		transform.position = rightLoc.position;
	}
	else {
		if(!mainScript.isFacingRight) flipJulian();
		transform.position = leftLoc.position;
	}
	locCounter = !locCounter;
	startReappearing();
}

function startReappearing () {
	isReappearing = true;
	animator.Play("julian_reappear", PlayMode.StopSameLayer);
}

function SBreappearComplete () {
	isReappearing = false;
	startShooting();
}

function startShooting () {
	isShooting = true;
	animator.Play("julian_soulbomb_charge", PlayMode.StopSameLayer);
}

function SBshootingComplete () {
	isShooting = false;
	isIdle = true;
}

function initiateMultipleSoulbomb () {
	yield WaitForSeconds(0.5);
	transform.position = (leftLoc.position + rightLoc.position) / 2;
	animator.Play("julian_reappear", PlayMode.StopSameLayer);
	Instantiate(explosion, transform.position, Quaternion.identity);
	mainScript.playExplosionSound();
	for (var i = 0; i < 5; i++) {
		var bomb = Instantiate(soulBomb, transform.position, Quaternion.identity);
		bomb.GetComponent.<Rigidbody2D>().velocity = 15 * Vector2(Mathf.Cos(i * Mathf.PI / 4), Mathf.Sin(i * Mathf.PI / 4));
		bomb.rotation.z = i * Mathf.PI / 5;
	}
}

function flipJulian () {
	mainScript.isFacingRight = !mainScript.isFacingRight;
	var currScale = transform.localScale;
	currScale.x *= -1;
	transform.localScale = currScale;
}