#pragma strict

function Start () {
	
}

function Update () {
	
}

function OnTriggerEnter2D (other : Collider2D) {
	if (other.gameObject.tag == "Player") {
		other.gameObject.GetComponent(healthScript).takeDamage(100000, Vector2(0,0));
	}
} 