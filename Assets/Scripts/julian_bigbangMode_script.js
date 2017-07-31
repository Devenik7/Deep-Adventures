#pragma strict

var animator : Animator;
var body : Rigidbody2D;
var audioPlayer : AudioSource;
var patternScript : julian_patterns_script;
var mainScript : julian_ai_movement_script;
var player : Transform;
var explosion : Transform;
var soulBomb : Transform;
var jump : AudioClip;

var leftLoc : Transform;
var rightLoc : Transform;
var currentLoc : int = 0;
var nextLoc : int = 0;

var isIdle : boolean = true;
var isSliding : boolean = false;
var isExploding : boolean = false;
var bigbangCounter : int = 0;

function Start () {
	animator = GetComponent(Animator);
	body = GetComponent.<Rigidbody2D>();
	audioPlayer = GetComponents.<AudioSource>() [2];
	patternScript = GetComponent(julian_patterns_script);
	mainScript = GetComponent(julian_ai_movement_script);
}

function Update () {
	if (patternScript.inBigbangMode) {
		if (isIdle) {
			isIdle = false;
			bigbangCounter++;
			if (bigbangCounter == 1) {
				goToStartLoc();
			}
			else if (bigbangCounter > 3) {
				patternScript.currentState = 0;
				isIdle = true;
				bigbangCounter = 0;
				initiateHorizontalMultipleSoulbomb();
			}
			else {
				goToNextLoc();
			}
		}
		else if (isSliding) {
			startSlidingToLoc();
		}
		else {
			// process already started
		}
	}
	else {
		isIdle = true;
		bigbangCounter = 0;
	}
}

function goToStartLoc () {
	if (player != null) {
		if (player.position.x < transform.position.x) {
			currentLoc = 0;
			nextLoc = 1;
		}
		else {
			currentLoc = 2;
			nextLoc = 1;
		}
		startSlidingToLoc();
		audioPlayer.clip = jump;
		audioPlayer.Play();
	}
}

function goToNextLoc () {
	if (currentLoc < nextLoc) {
		currentLoc = nextLoc;
		nextLoc++;
	}
	else {
		currentLoc = nextLoc;
		nextLoc--;
	}
	startSlidingToLoc();
	audioPlayer.clip = jump;
	audioPlayer.Play();
}

function startSlidingToLoc () {
	isSliding = true;
	animator.Play("julian_sliding", PlayMode.StopSameLayer);
	var destination : float;
	switch (currentLoc) {
		case 0: destination = leftLoc.position.x; break;
		case 1: destination = (leftLoc.position.x + rightLoc.position.x)/2; break;
		case 2: destination = rightLoc.position.x; break;
		default: destination = leftLoc.position.x;
	}
	if (destination < transform.position.x) {
		body.velocity = Vector2(-15, 0);
		if (mainScript.isFacingRight) flipJulian();
	}
	else if (destination > transform.position.x) {
		body.velocity = Vector2(15, 0);
		if (!mainScript.isFacingRight) flipJulian();
	}
	if (Mathf.Abs(destination - transform.position.x) < 0.2) {
		body.velocity = Vector2.zero;
		transform.position.x = destination; // If julian should latch onto the exact destination
		startBigbang();
	}
}

function startBigbang () {
	isSliding = false;
	isExploding = true;
	animator.Play("julian_bigbang_charge", PlayMode.StopSameLayer);
}

function BBexplodingComplete () {
	isExploding = false;
	isIdle = true;
}

function initiateHorizontalMultipleSoulbomb () {
	if (player.position.x > transform.position.x) {
		if (!mainScript.isFacingRight) flipJulian();
	}
	else {
		if (mainScript.isFacingRight) flipJulian();
	}
	Instantiate(explosion, transform.position, Quaternion.identity);
	mainScript.playExplosionSound();
	for (var i = 0; i < 3; i++) {
		var bomb = Instantiate(soulBomb, transform.position, Quaternion.identity);
		bomb.position.y += (i * 1.2);
		bomb.GetComponent.<Rigidbody2D>().velocity = (mainScript.isFacingRight) ? (Vector2(15 - 2*i, 0)) : (Vector2(-(15 - 2*i), 0));
		bomb.rotation.z = (mainScript.isFacingRight) ? 0 : Mathf.PI;
	}
}

function flipJulian () {
	mainScript.isFacingRight = !mainScript.isFacingRight;
	var currScale = transform.localScale;
	currScale.x *= -1;
	transform.localScale = currScale;
}