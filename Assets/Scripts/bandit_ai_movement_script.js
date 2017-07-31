#pragma strict

var animator : Animator;
var health_script : healthScript;
var body : Rigidbody2D;

// delete this
var dist : float = 0;

var facingRight : boolean = true;

var grounded : boolean = false;
var groundCheckElement : Transform;
var groundCheckSizeVector : Vector2 = Vector2(0.638, 0.11);
var groundCheckBoxAngle : float = 0;
var groundLayer : LayerMask;

var jumpSpeed : float = 17.5f;
var moveSpeed : float = 4f;
var moveSpeedFactor : float = 1;
var sprintCounter : float = 0;

var canMove : boolean = true;
var canAttack : boolean = true;
var attackLoc : Transform;
var attackable : LayerMask;
var attackTimer : int = 0;
var simpleAttackDamage : float = 1;
var sprintAttackDamage : float = 1.5;

var isFollowing : boolean = false;
var isWalking : boolean = false;
var isRunning : boolean = false;
var isIdle : boolean = true;
var isInCombat : boolean = false;

var destination : Transform;

function Start () {
	animator = GetComponent(Animator);
	health_script = GetComponent(healthScript);
	body = GetComponent.<Rigidbody2D>();
}

function Update () {
	// srpiteDirection
	if (body.velocity.x < 0 && facingRight)
		flipSprite();
	else if (body.velocity.x > 0 && !facingRight)
		flipSprite();

	// verticalVelocityelocityCheck
	var verticalVelocityDirection = (GetComponent.<Rigidbody2D>().velocity.y > 0) ? 1 : -1;
	animator.SetInteger("vveldir", verticalVelocityDirection);
	if (verticalVelocityDirection == -1) {
		// groundCheck
		grounded = Physics2D.OverlapBox(groundCheckElement.position, groundCheckSizeVector, groundCheckBoxAngle, groundLayer);
		animator.SetBool("grounded", grounded);
	}

	if(health_script.damaged == 0) {
		AnalyzeTheStateMachine();
	}
	else {
		// since damage has just been taken, stay calm for 30 frames as specified in the healthScript
		body.velocity = Vector2(0, 0);
		animator.SetInteger("move", 0);
		animator.Play("idle", PlayMode.StopSameLayer);
	}
}

function FixedUpdate () {
	// gravity
	body.AddForce(Vector2.down * 50);

	attackTimer = (attackTimer == 0) ? 0 : attackTimer-1;
}

function walkTo (goToPosition : Vector3) {
	isWalking = true;
	isRunning = false;
	sprintCounter = 0;
	var move : float;
	if(Mathf.Abs(goToPosition.x - transform.position.x) < 0.06) {	
		move = 0;
	}
	else {	
		if (transform.position.x > goToPosition.x)
			move = -1;
		else if (transform.position.x < goToPosition.x)
			move = 1;
	}
	GetComponent.<Rigidbody2D>().velocity = Vector2(move * moveSpeed * moveSpeedFactor, GetComponent.<Rigidbody2D>().velocity.y);
	animator.SetInteger("move", move);
	animator.SetBool("sprint", false);
}

function runTo (goToPosition :Vector3) {
	isRunning = true;
	isWalking = false;
	sprintCounter = (sprintCounter+1 < 120) ? (sprintCounter+1) : sprintCounter;

	var move : float;
	if(Mathf.Abs(goToPosition.x - transform.position.x) < 0.06) {	
		move = 0;
	}
	else {	
		if (transform.position.x > goToPosition.x)
			move = -1;
		else if (transform.position.x < goToPosition.x)
			move = 1;
	}
	GetComponent.<Rigidbody2D>().velocity = Vector2(move * moveSpeed * (moveSpeedFactor + (sprintCounter / 200)), GetComponent.<Rigidbody2D>().velocity.y);
	animator.SetInteger("move", move);
	animator.SetBool("sprint", true);
}

function flipSprite () {
	if(facingRight) 
		transform.position.x -= .1;
	else
		transform.position.x += .1;
	facingRight = !facingRight;
	var currScale = transform.localScale;
	currScale.x *= -1;
	transform.localScale = currScale;
}

function AnalyzeTheStateMachine () {
	if (destination == null) {
		// following an idle and patrol coroutine
		// An idea is to have a fallCheck Object infront fo the character and perform raycasts to check for ground and if no ground turn back
		isFollowing = false;
		isWalking = false;
		isRunning = false;
		animator.SetInteger("move", 0);
		animator.SetBool("sprint", false);
	}
	else {
		isFollowing = true;
		var hit : RaycastHit2D = Physics2D.Raycast(attackLoc.position, Vector2.right * Mathf.Sign(destination.position.x - transform.position.x), Mathf.Infinity, attackable);
		if (hit.distance > 2) {
			if (isWalking) walkTo(destination.position);
			else runTo(destination.position);
		}
		else if (hit.distance > .3) {
			if (isRunning) runTo(destination.position);
			else walkTo(destination.position);
		}
		else if (hit.distance == 0)
			return; // when the player just jumped into the collider, raycast will register 0 distance
				   // coz it is just a single line in the middle of the actual detection collider
				  // correct this and enhance this with proper functions for each coroutine rather than just setting variables to false and true
		else {
			isWalking = false;
			isRunning = false;
			animator.SetInteger("move", 0);
			animator.SetBool("sprint", false);
			if(canAttack) {
				performAnAttack();
				body.velocity = Vector2(0,0);
			}
		}
	}
	// This was the First Attempt
	/*
	if (!isFollowing) {
		if (destination == null) {
			isWalking = false;
			isRunning = false;
			animator.SetInteger("move", 0);
			animator.SetBool("sprint", false);
			// just follow a coroutine to walk here and there or be idle
		}
		else {
			isFollowing = true;
			if (Mathf.Abs(transform.position.x - destination.position.x) > 2) {
				// Run towards the position
				runTo(destination.position);
			}
			else {
				walkTo(destination.position);
			}
		}
	}
	else if (isFollowing) {
		if (destination == null) {
			isFollowing = false;
			isWalking = false;
			isRunning = false;
			animator.SetInteger("move", 0);
			animator.SetBool("sprint", false);
			// fallback to idle or walk coroutines
			// lost the target in this frame only so preferrably idle and then after sometime patrol
		}
		else {
			// player was earlier detected and followed and is still being followed, let the running or walking continue.
			// check the distance and if close intiate attack and let the attack be normal or sprint depending on the sprintCounter.
			if (Mathf.Abs(transform.position.x - destination.position.x) <= .7) {
				isWalking = false;
				isRunning = false;
				animator.SetInteger("move", 0);
				animator.SetBool("sprint", false);
				if(canAttack) {
					performAnAttack();
					GetComponent.<Rigidbody2D>().velocity = Vector2(0,0);
				}
			}
			else {
				if (isWalking) {
					walkTo(destination.position);
				}
				else if (isRunning) {
					runTo(destination.position);
				}
				else {
					if (Mathf.Abs(transform.position.x - destination.position.x) > 2) {
						// Run towards the position
						runTo(destination.position);
					}
					else {
						walkTo(destination.position);
					}
				}
			}
		}
	}
	*/
}

function performAnAttack () {
	if(attackTimer == 0) {
		canAttack = false;
		if (sprintCounter < 50) {
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
}

function performSimpleAttack () {
	var attackedObjects : Collider2D[]= Physics2D.OverlapBoxAll(attackLoc.position, Vector2(1, 1), 0, attackable);
	for (var i = 0; i < attackedObjects.length; i++) {
		attackedObjects[i].transform.gameObject.GetComponent(healthScript).takeDamage(simpleAttackDamage, Vector2.right * Mathf.Sign(attackedObjects[i].transform.position.x - transform.position.x));
	}
}

function performSprintAttack () {
	var attackedObjects : Collider2D[]= Physics2D.OverlapBoxAll(attackLoc.position, Vector2(1, 1), 0, attackable);
	for (var i = 0; i < attackedObjects.length; i++) {
		attackedObjects[i].transform.gameObject.GetComponent(healthScript).takeDamage(sprintAttackDamage, Vector2.right * Mathf.Sign(attackedObjects[i].transform.position.x - transform.position.x));
	}
}

function attackCompleted () {
	attackTimer = 60;
	canMove = true;
	canAttack = true;
	sprintCounter = 0;
	animator.Play("idle", PlayMode.StopSameLayer);
}