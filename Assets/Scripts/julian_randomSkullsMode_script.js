#pragma strict

var animator : Animator;
var body : Rigidbody2D;
var patternScript : julian_patterns_script;
var mainScript : julian_ai_movement_script;

var skull : Transform;
var skullPosition : Transform;
var leftLoc : Transform;
var rightLoc : Transform;

var isIdle : boolean = true;
var isVanishing : boolean = false;
var isReappearing : boolean = false;
var isShootingSkulls : boolean = false;
var skullCounter : int = 0;

function Start () {
	animator = GetComponent(Animator);
	body = GetComponent.<Rigidbody2D>();
	var audioPlayers = GetComponents(AudioSource);
	patternScript = GetComponent(julian_patterns_script);
	mainScript = GetComponent(julian_ai_movement_script);
}

function Update () {
	if (patternScript.inRandomSkullsMode) {
		if (isIdle) {
			isIdle = false;
			skullCounter++;
			if (skullCounter == 1) {
				goToStartLoc();
			}
			else if (skullCounter > 5) {
				patternScript.currentState = 0;
				isIdle = true;
				skullCounter = 0;
			}
			else {
				flipJulian();
				startShootingSkulls();
			}
		}
	}
	else {
		isIdle = true;
		skullCounter = 0;
	}
}

function goToStartLoc () {
	startVanishing();
}

function startVanishing () {
	isVanishing = true;
	animator.Play("julian_vanish", PlayMode.StopSameLayer);
}

function RSvanishComplete () {
	isVanishing = false;
	transform.position = (leftLoc.position + rightLoc.position) /2;
	startReappearing();
}

function startReappearing () {
	isReappearing = true;
	animator.Play("julian_reappear", PlayMode.StopSameLayer);
}

function RSreappearComplete () {
	isReappearing = false;
	startShootingSkulls();
}

function startShootingSkulls () {
	isShootingSkulls = true;
	animator.Play("julian_skull_mode", PlayMode.StopSameLayer);
}

function RSshootSkull () {
	var RSskull = Instantiate(skull, skullPosition.position, Quaternion.identity);
	RSskull.GetComponent.<Rigidbody2D>().velocity = Vector2(1, 0) * ((mainScript.isFacingRight) ? 1 : -1) * Random.Range(3,8) + transform.up * Random.Range(-2,3);
}

function RSskullShootingComplete () {
	isShootingSkulls = false;
	yield WaitForSeconds(1.5f);
	isIdle = true;
}

function flipJulian () {
	mainScript.isFacingRight = !mainScript.isFacingRight;
	var currScale = transform.localScale;
	currScale.x *= -1;
	transform.localScale = currScale;
}