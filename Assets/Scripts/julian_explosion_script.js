#pragma strict

var explosion : AudioClip;

function Start () {
	var player = GetComponent(AudioSource);
	player.clip = explosion;
	player.Play();
}

function Update () {
	
}

function destoryObject () {
	Destroy(gameObject);
}
