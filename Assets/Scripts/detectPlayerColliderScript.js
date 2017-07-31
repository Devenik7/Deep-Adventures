#pragma strict

var banditMovementScript : bandit_ai_movement_script;

function Start () {
	banditMovementScript = transform.parent.GetComponent(bandit_ai_movement_script);
}

function Update () {
	
}

function OnTriggerStay2D (collider : Collider2D) {
	if (collider.gameObject.tag == "Player") {
		banditMovementScript.destination = collider.gameObject.transform;
	}
}

function OnTriggerExit2D (collider : Collider2D) {
	if (collider.gameObject.tag == "Player") {
		banditMovementScript.destination = null;
	}
}