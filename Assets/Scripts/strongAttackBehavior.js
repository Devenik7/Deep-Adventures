#pragma strict

public class strongAttackBehavior extends StateMachineBehaviour {

	var strongAttackClip : AudioClip;

	public override function OnStateEnter(animator : Animator, stateInfo : AnimatorStateInfo, layerIndex : int) {
		var audioPlayer : AudioSource = animator.GetComponent.<AudioSource>();
		audioPlayer.clip = strongAttackClip;
		audioPlayer.Play();
	}
	
}