#pragma strict

// mode 0 - Normal Mode;
// mooe 1 - Boss Mode;

var mode : int = 0;

var player : Transform;

function Start () {
	
}

function Update () {
	if (mode == 0) {

	}
	else if (mode == 1) {
		// boss mode - camera fixed no movement
	}
}

function OnTriggerStay2D (other : Collider2D) {
	if (other.gameObject.tag == "Player" && mode == 0) {
		transform.position.x = Mathf.Lerp(transform.position.x, other.gameObject.transform.position.x, 0.02);
	}
}