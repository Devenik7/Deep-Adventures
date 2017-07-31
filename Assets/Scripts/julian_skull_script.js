#pragma strict

var body : Rigidbody2D;
var animator : Animator;
var player : Transform;
var hit : AudioClip;

var followTimer : int = 0;
var isDestroyed : boolean = false;

function Start () {
	body = GetComponent.<Rigidbody2D>();
	animator = GetComponent(Animator);
	var playerObj = GameObject.FindWithTag("Player");
	player = (playerObj == null) ? null : playerObj.transform;
}

function Update () {
	if (!isDestroyed) {
		animator.SetFloat("sqrvel", body.velocity.sqrMagnitude);
		flippedSprite(2 * Mathf.Sign(body.velocity.x));
		transform.rotation = Quaternion.identity;
		transform.Rotate(0, 0, Mathf.Atan(body.velocity.y / (body.velocity.x)) * 180 / Mathf.PI);
	}
}

function FixedUpdate () {
	if (!isDestroyed) {
		followTimer++;
		if (player != null && followTimer < 120)
			body.AddForce(2 * (player.position - transform.position));
		if (followTimer > 500) {
			destroyThis();
		}
	}
}

function flippedSprite (x : int) {
	var currScale = transform.localScale;
	currScale.x = x;
	transform.localScale = currScale;
}

function OnTriggerEnter2D (other: Collider2D) {
	if (other.gameObject.tag == "Player") {
		var audioPlayer : AudioSource = GetComponent(AudioSource);
		audioPlayer.clip = hit;
		audioPlayer.Play();
		destroyThis();
	}
}

function destroyThis () {
	isDestroyed = true;
	GetComponent(CircleCollider2D).enabled = false;
	body.velocity = Vector2(0, 0);
	animator.Play("skull_destroyed", PlayMode.StopSameLayer);
	Destroy(gameObject, 1f);
}