#pragma strict

public class sprintAttackBehavior extends StateMachineBehaviour {

	var sprintAttackClip : AudioClip;

	public override function OnStateEnter(animator : Animator, stateInfo : AnimatorStateInfo, layerIndex : int) {
		var audioPlayer : AudioSource = animator.GetComponent.<AudioSource>();
		audioPlayer.clip = sprintAttackClip;
		audioPlayer.Play();
	}
	
}