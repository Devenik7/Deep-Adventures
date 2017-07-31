#pragma strict

var bossSpawnPos : Transform;
var boss : Transform;
var bossArena : Transform;
var bossMusic : AudioClip;
var mainCamera : Transform;
var mainAudioManager : AudioSource;

function Start () {
	
}

function Update () {
	transform.Rotate(0, 0, 5, Space.Self);
}

function OnTriggerEnter2D (other : Collider2D) {
	if (other.gameObject.tag == "Player" && bossSpawnPos != null) {
		other.gameObject.transform.position = bossSpawnPos.position;
		other.gameObject.GetComponent.<Rigidbody2D>().velocity = Vector2(0, 0);
		mainCamera.position = bossArena.position;
		mainCamera.position.z = -1;
		mainCamera.GetComponent(camera_script).mode = 1;
		startBossSequence(3f);
	}
}

function startBossSequence (delay : float) {
	mainAudioManager.clip = bossMusic;
	yield WaitForSeconds(3);
	mainAudioManager.Play();
	boss.GetComponent(julian_patterns_script).startFighting();
}