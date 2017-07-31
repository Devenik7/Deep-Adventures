#pragma strict

var counter : int = 0;

function Start () {
	
}

function Update () {
	GetComponent(Animator).Play("attack0", PlayMode.StopSameLayer);
}

function performSimpleAttack () {
	// dummy function for dummy script for info screen 
}

function attackCompleted () {
	if (counter % 2 == 0) {
		GetComponent(Animator).Play("attack1", PlayMode.StopSameLayer);
	}
	else {
		GetComponent(Animator).Play("attack0", PlayMode.StopSameLayer);
	}
	counter++;
}
