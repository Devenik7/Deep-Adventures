#pragma strict

// NOTE
/* 
	states
	0 - idle
	1 - bigbang
	2 - soulbomb
	3 - randomskullsdevastation
*/

var animator : Animator;

var currentState : int = 0;
var nextState : int = -1;
var stateCounters : int[];
var isFighting : boolean = false;
var inIdleMode : boolean = true;
var inBigbangMode : boolean = false;
var inSoulBombMode : boolean = false;
var inRandomSkullsMode : boolean = false;

function Start () {
	animator = GetComponent(Animator);
	stateCounters = [0, 0, 0];
}

function Update () {
	if (currentState == 0 && nextState == -1 && isFighting) {
		nextState = Random.Range(1,4);
		stateCounters[nextState -1]++;
		startState(2f);
	}
	switch (currentState) {
		case 1:
			inIdleMode = false;
			inBigbangMode = true;
			inSoulBombMode = false;
			inRandomSkullsMode = false;
			break;
		case 2:
			inIdleMode = false;
			inBigbangMode = false;
			inSoulBombMode = true;
			inRandomSkullsMode = false;
			break;
		case 3:
			inIdleMode = false;
			inBigbangMode = false;
			inSoulBombMode = false;
			inRandomSkullsMode = true;
			break;
		case 0:;
		default:
			inIdleMode = true;
			inBigbangMode = false;
			inSoulBombMode = false;
			inRandomSkullsMode = false;
			break;
	}
}

function startFighting () {
	isFighting = true;
}

function startState (delay : float) {
	yield WaitForSeconds(delay);
	currentState = nextState;
	nextState = -1;
}

function vanishComplete () {
	if (inSoulBombMode) {
		GetComponent(julian_soulbombMode_script).SBvanishComplete();
	}
	else if (inBigbangMode) {

	}
	else if (inRandomSkullsMode) {
		GetComponent(julian_randomSkullsMode_script).RSvanishComplete();
	}
	else {
		
	}
}

function reappearComplete () {
	if (inSoulBombMode) {
		GetComponent(julian_soulbombMode_script).SBreappearComplete();
	}
	else if (inBigbangMode) {

	}
	else if (inRandomSkullsMode) {
		GetComponent(julian_randomSkullsMode_script).RSreappearComplete();
	}
	else {
		animator.Play("julian_idle", PlayMode.StopSameLayer);
	}
}

function shootingComplete () {
	if (inSoulBombMode) {
		GetComponent(julian_soulbombMode_script).SBshootingComplete();
	}
	else if (inBigbangMode) {
	}
	else if (inRandomSkullsMode) {	
	}
	else {
	}
}

function shootSkull () {
	if (inSoulBombMode) {
	}
	else if (inBigbangMode) {
	}
	else if (inRandomSkullsMode) {
		GetComponent(julian_randomSkullsMode_script).RSshootSkull();
	}
	else {
	}
}

function skullShootingComplete () {
	if (inSoulBombMode) {
	}
	else if (inBigbangMode) {
	}
	else if (inRandomSkullsMode) {
		GetComponent(julian_randomSkullsMode_script).RSskullShootingComplete();
	}
	else {
	}
}

function bigbangComplete () {
	if (inSoulBombMode) {	
	}
	else if (inBigbangMode) {
		GetComponent(julian_bigbangMode_script).BBexplodingComplete();
	}
	else if (inRandomSkullsMode) {	
	}
	else {
	}
}