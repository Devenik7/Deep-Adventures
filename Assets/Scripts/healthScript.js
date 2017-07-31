#pragma strict
import UnityEngine.SceneManagement;

var health : float;
var mana : float;
var damaged : int = 0;
var damageRecoveryTime : int = 20;
var canTakeDamage : boolean = true;
var damageTakenClip1 : AudioClip;
var damageTakenClip2 : AudioClip;
var animator : Animator;

function Start () {
	animator =  GetComponent(Animator);
}

function Update () {
	damaged = (damaged > 0) ? damaged-1 : 0;
}

public function takeDamage (damage : float, direction : Vector2) {
	if (canTakeDamage) {
		playDamageSound();
		damaged = damageRecoveryTime;
		health -= damage;
		
		animator.SetBool("damaged", true);

		if (gameObject.tag == "Player") {
			canTakeDamage = false;
			animator.SetBool("invincible", true);
			gameObject.layer = 12;
			animator.Play("wobble", PlayMode.StopSameLayer);
			damagePush(direction);
		}
		else if (gameObject.tag == "projectile") {
			// probably do nothing
		}
		else if (gameObject.tag != "boss") {
			transform.position += (direction * .4);
		}
		damageCompleted();
	}
	if(health <= 0) {
		if (gameObject.tag == "Player") 
			SceneManager.LoadScene(0, LoadSceneMode.Single);
		Destroy(gameObject);
	}
}

function playDamageSound () {
	var audioSources : AudioSource[] = GetComponents.<AudioSource>();
	var audioPlayer : AudioSource = audioSources[audioSources.length -1];
	audioPlayer.clip = (Random.Range(0.0, 1.0) > 0.4) ? damageTakenClip1 : damageTakenClip2;
	audioPlayer.Play();
}

function damagePush (direction : Vector2) {
	GetComponent(deep_movement_script).hasControl = false;
	GetComponent.<Rigidbody2D>().velocity = 5 * direction + 9 * Vector2.up;
	yield WaitForSeconds(.5f);
	GetComponent(deep_movement_script).hasControl = true;
	GetComponent(deep_combat_script).canAttack = true;
	GetComponent(deep_movement_script).sprintCounter = 0;
}

function damageCompleted () {
	yield WaitForSeconds(.5f);
	animator.SetBool("damaged", false);
	if (gameObject.tag == "Player") {
		yield WaitForSeconds(2);
		canTakeDamage = true;
		gameObject.layer = 9;
		animator.SetBool("invincible", false);
	}
}