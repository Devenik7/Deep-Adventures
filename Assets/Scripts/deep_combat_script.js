#pragma strict

var movement : deep_movement_script;
var animator : Animator;

var groundCheck : Transform;

var canAttack : boolean = true;
var downattack : boolean = false;
var attackLoc : Transform;
var behindAttackLoc : Transform;
var attackObject : GameObject;
var attackable : LayerMask;
var down_sword_jumpable : LayerMask;
var attackChargeTimer : int = 0;
var simpleAttackDamage : float = 1;
var sprintAttackDamage : float = 1.5;
var strongAttackDamage : float = 2;

function Start () {
	movement = GetComponent(deep_movement_script);
	animator = GetComponent(Animator);
}

function Update () {
	GetComponent(BoxCollider2D).offset = Vector2(-.13f, 0f);
	GetComponent(BoxCollider2D).size = Vector2(.25f, .5f);
	//if (GetComponent.<Rigidbody2D>().velocity.y < -15)
	//	GetComponent.<Rigidbody2D>().velocity.y = -15;

	if (movement.hasControl && canAttack) {
		// attack
		var attack : boolean = Input.GetKeyDown(KeyCode.J);
		animator.SetBool("attack", attack);
		downattack = Input.GetKey(KeyCode.S);
		animator.SetBool("jumpattackdown", downattack);
		if(movement.grounded && attack) {
			movement.hasControl = false;
			canAttack = false;
			if (movement.sprintCounter < 50) {
				if(Random.Range(0.0, 1.0) > 0.5) {
					animator.Play("attack0", PlayMode.StopSameLayer);
				}
				else {
					animator.Play("attack1", PlayMode.StopSameLayer);
				}
			}
			else {
				animator.Play("sprint_attack", PlayMode.StopSameLayer);
			}
		}
		if(Input.GetKey(KeyCode.F))
			attackChargeTimer++;
		else if(Input.GetKeyUp(KeyCode.F) && attackChargeTimer >= 100) {			
			if(movement.grounded) {
				attackChargeTimer = 0;
				movement.hasControl = false;
				canAttack = false;
				animator.Play("strong_ground_attack", PlayMode.StopSameLayer);
			}
		}
		else
			attackChargeTimer = 0;
	}
	else if (!movement.hasControl) {
		attackChargeTimer = 0;
		downattack = false;
	}
	applyColliderCorrection();
}

function applyColliderCorrection () {
	if (!movement.grounded && downattack) {
		GetComponent(BoxCollider2D).offset = Vector2(-.13f, 0f);
		GetComponent(BoxCollider2D).size = Vector2(.25f, .5f);
	}
	else if (movement.grounded && movement.sprintCounter > 0) {
		GetComponent(BoxCollider2D).offset = Vector2(0, -.1f);
		GetComponent(BoxCollider2D).size = Vector2(.37f, .54f);
	}
	else {
		GetComponent(BoxCollider2D).offset = Vector2(-.15f, -.045f);
		GetComponent(BoxCollider2D).size = Vector2(.25f, .65f);
	}
}

function performSimpleAttack () {
	var attackedObjects : Collider2D[]= Physics2D.OverlapCircleAll(attackLoc.position, 0.41f, attackable, -2.0, 2.0);
	for (var i = 0; i < attackedObjects.length; i++) {
		attackedObjects[i].transform.gameObject.GetComponent(healthScript).takeDamage(simpleAttackDamage, Vector2.right * Mathf.Sign(attackedObjects[i].transform.position.x - transform.position.x));
	}
}

function performSprintAttack () {
	var attackedObjects : Collider2D[]= Physics2D.OverlapCircleAll(attackLoc.position, 0.41f, attackable, -2.0, 2.0);
	for (var i = 0; i < attackedObjects.length; i++) {
		attackedObjects[i].transform.gameObject.GetComponent(healthScript).takeDamage(sprintAttackDamage, Vector2.right * Mathf.Sign(attackedObjects[i].transform.position.x - transform.position.x));
	}
}

function performStrongAttack () {
	var attackedObjects : Collider2D[]= Physics2D.OverlapCircleAll(attackLoc.position, 0.41f, attackable, -2.0, 2.0);
	for (var i = 0; i < attackedObjects.length; i++) {
		attackedObjects[i].transform.gameObject.GetComponent(healthScript).takeDamage(strongAttackDamage, Vector2.right * Mathf.Sign(attackedObjects[i].transform.position.x - transform.position.x));
	}
}

function performStrongAttackBehind () {
	var attackedObjects : Collider2D[] = Physics2D.OverlapCircleAll(behindAttackLoc.position, 0.41f, attackable, -2.0, 2.0);
	for (var i = 0; i < attackedObjects.length; i++) {
		Debug.Log(attackedObjects[i]);
		attackedObjects[i].transform.gameObject.GetComponent(healthScript).takeDamage(strongAttackDamage, Vector2.right * Mathf.Sign(attackedObjects[i].transform.position.x - transform.position.x));
	}
}

function instantiateAttackSprite () {
	var newAttackObj = Instantiate(attackObject, attackLoc.position, Quaternion.identity);
	newAttackObj.GetComponent.<Rigidbody2D>().velocity = transform.right * 5;
	if(!movement.facingRight) {
		var currScale = newAttackObj.transform.localScale;
		currScale.x *= -1;
		newAttackObj.transform.localScale = currScale;
		newAttackObj.GetComponent.<Rigidbody2D>().velocity = transform.right * -5;
	}
}

function attackCompleted () {
	// this function will not be called if the animation is interrupeted due to damage and hence this pasting this code at the end of health script might fix it for now
	yield WaitForSeconds(.01f);
	movement.hasControl = true;
	canAttack = true;
	movement.sprintCounter = 0;
	animator.Play("idle", PlayMode.StopSameLayer);
}

function checkBelowAttack () {
	var attackedObjects : Collider2D[] = Physics2D.OverlapCircleAll(groundCheck.position, 0.41f, down_sword_jumpable, -2.0, 2.0);
	if (attackedObjects.length > 0) {
		GetComponent.<Rigidbody2D>().velocity = Vector2(GetComponent.<Rigidbody2D>().velocity.x, 17.5f);
	}
	for (var i = 0; i < attackedObjects.length; i++) {
		var health_script = attackedObjects[i].transform.gameObject.GetComponent(healthScript);
		if (health_script != null) 
			health_script.takeDamage(simpleAttackDamage, -Vector2.up);
	}
}