#pragma strict

var hit : Transform;

function Start () {
	Destroy(gameObject, 10);
}

function Update () {
	
}

function OnTriggerEnter2D (collider : Collider2D) {
	if (collider.gameObject.tag == "Player") {
		collider.gameObject.GetComponent(healthScript).takeDamage(1, Vector2.right * Mathf.Sign(collider.gameObject.transform.position.x - transform.position.x));
		instantiateHitPrefab(collider.gameObject.transform);
	}
}

function instantiateHitPrefab (target : Transform) {
	Instantiate(hit, target.position, Quaternion.identity);
}