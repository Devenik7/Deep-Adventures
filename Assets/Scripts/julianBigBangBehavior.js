#pragma strict

public class julianBigBangBehavior extends StateMachineBehaviour {

	public override function OnStateEnter(animator : Animator, stateInfo : AnimatorStateInfo, layerIndex : int) {
		 animator.GetComponent.<CapsuleCollider2D>().enabled =  true;
	}

	public override function OnStateExit(animator : Animator, stateInfo : AnimatorStateInfo, layerIndex : int) {
		animator.GetComponent.<CapsuleCollider2D>().enabled =  false;
	}
}