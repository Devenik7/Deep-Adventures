#pragma strict

function Start () {
	
}

function Update () {
	
}

function OnCollisionEnter2D (other : Collision2D) {
	if (other.gameObject.tag == "enemy" || other.gameObject.tag == "boss" || other.gameObject.tag == "projectile") {
		GetComponent(healthScript).takeDamage(1, Vector2.right * Mathf.Sign(transform.position.x - other.transform.position.x));
	}
}

function OnTriggerEnter2D (other : Collider2D) {
	if (other.gameObject.tag == "enemy" || other.gameObject.tag == "boss" || other.gameObject.tag == "projectile") {
		GetComponent(healthScript).takeDamage(1, Vector2.right * Mathf.Sign(transform.position.x - other.transform.position.x));
	}
}
