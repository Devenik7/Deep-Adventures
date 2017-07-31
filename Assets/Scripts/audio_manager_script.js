#pragma strict

var source : AudioSource;
var mainTheme : AudioClip;
var bossTheme : AudioClip;

function Start () {
	source = GetComponent(AudioSource);
	source.clip = mainTheme;
	source.Play();
}

function Update () {
	
}
