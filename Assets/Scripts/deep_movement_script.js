#pragma strict

var animator : Animator;

var damageReceptionCounter : int = 0;

var facingRight : boolean = true;

var hasControl : boolean = true; 
var canMove : boolean = true;
var canJump : boolean = true;

var grounded : boolean = false;
var groundCheckElement : Transform;
var groundCheckSizeVector : Vector2 = Vector2(0.25, 0.1);
var groundCheckBoxAngle : float = 0;
var groundLayer : LayerMask;

var jumpSpeed : float = 17.5f;
var moveSpeed : float = 4f;
var moveSpeedFactor : float = 1;
var sprintCounter : float = 0;

var inputSequenceArray : Array;

function Start () {
	animator = GetComponent(Animator);
}

function Update () {
	// verticalVelocityelocityCheck
	var verticalVelocityDirection = (GetComponent.<Rigidbody2D>().velocity.y > 0) ? 1 : -1;
	animator.SetInteger("vveldir", verticalVelocityDirection);
	if (verticalVelocityDirection == -1) {
		// groundCheck
		grounded = Physics2D.OverlapBox(groundCheckElement.position, groundCheckSizeVector, groundCheckBoxAngle, groundLayer);
		animator.SetBool("grounded", grounded);
	}

	if(hasControl) {
		// jump
		if(grounded) {
			var jump : boolean = Input.GetButtonDown("Jump");
			if(jump) {
				grounded = false;
				animator.SetBool("grounded", grounded);
				GetComponent.<Rigidbody2D>().velocity = Vector2(GetComponent.<Rigidbody2D>().velocity.x, jumpSpeed);
			}
		}

		// sprintCheck
		moveSpeedFactor = 1;
		if(GetComponent.<Rigidbody2D>().velocity.x != 0 && Input.GetButton("Sprint")) {
			sprintCounter = (sprintCounter+1 < 120) ? (sprintCounter+1) : sprintCounter;
			moveSpeedFactor += (sprintCounter / 200);
			animator.SetBool("sprint",true);
		}
		else {
			sprintCounter = 0;
			animator.SetBool("sprint",false);
		}
	}
	else if (!hasControl) {
		sprintCounter = 0;
		animator.SetBool("sprint",false);
	}

}

function FixedUpdate () {
	// gravity
	GetComponent.<Rigidbody2D>().AddForce(Vector2.down * 50);

	// damageReception
	if(damageReceptionCounter > 0) damageReceptionCounter--;

	if(hasControl) {
		// movement
		var move : float = Input.GetAxis("Horizontal");
		animator.SetInteger("move", move);
		GetComponent.<Rigidbody2D>().velocity = Vector2(move * moveSpeed * moveSpeedFactor, GetComponent.<Rigidbody2D>().velocity.y);
		if(move > 0 && !facingRight)
			flipPlayer();
		else if(move < 0 && facingRight)
			flipPlayer();
	}
	else if (!hasControl) {
		move = 0;
		animator.SetInteger("move", move);
	}

	if (transform.position.y < -7)
		GetComponent(healthScript).takeDamage(10000, Vector2(0, 0));
}

function flipPlayer () {
	if(facingRight) 
		transform.position.x -= .4;
	else
		transform.position.x += .4;
	facingRight = !facingRight;
	var currScale = transform.localScale;
	currScale.x *= -1;
	transform.localScale = currScale;
}

function addVelocity () {

}