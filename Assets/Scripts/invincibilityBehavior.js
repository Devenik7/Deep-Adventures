#pragma strict

public class invincibilityBehavior extends StateMachineBehaviour {

	public override function OnStateEnter(animator : Animator, stateInfo : AnimatorStateInfo, layerIndex : int) {
		var audioPlayer : AudioSource = animator.GetComponent.<AudioSource>();
	}

	public override function OnStateExit(animator : Animator, animatorStateInfo : AnimatorStateInfo, layerIndex : int) {

	}
}