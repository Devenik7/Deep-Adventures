#pragma strict

public class jumpingbehavior extends StateMachineBehaviour {

	var jumpStartClip : AudioClip;
	var jumpFinishClip : AudioClip;

	public override function OnStateEnter(animator : Animator, stateInfo : AnimatorStateInfo, layerIndex : int) {
		if(animator.GetComponent.<Rigidbody2D>().velocity.y > 0) {
			var audioPlayer : AudioSource = animator.GetComponent.<AudioSource>();
			audioPlayer.clip = jumpStartClip;
			audioPlayer.Play();
		}
		//Debug.Log("jump started");
	}


	public override function OnStateExit(animator : Animator, stateInfo : AnimatorStateInfo, layerIndex : int) {
		var audioPlayer : AudioSource = animator.GetComponent.<AudioSource>();
		audioPlayer.clip = jumpFinishClip;
		audioPlayer.Play();
	}

}