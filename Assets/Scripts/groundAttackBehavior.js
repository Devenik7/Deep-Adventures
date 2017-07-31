#pragma strict

public class groundAttackBehavior extends StateMachineBehaviour {

	var attackClip : AudioClip;

	public override function OnStateEnter(animator : Animator, stateInfo : AnimatorStateInfo, layerIndex : int) {
		var audioPlayer : AudioSource = animator.GetComponent.<AudioSource>();
		audioPlayer.clip = attackClip;
		audioPlayer.Play();
	}
	
}