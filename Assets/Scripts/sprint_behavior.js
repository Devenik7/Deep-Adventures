#pragma strict

public class sprint_behavior extends StateMachineBehaviour {

	var audioPlayer : AudioSource;
	var sprintClip0 : AudioClip;
	var sprintClip1 : AudioClip;
	var counter : int;

	public override function OnStateEnter (animator : Animator, stateInfo : AnimatorStateInfo, layerIndex : int) {
		audioPlayer = animator.GetComponent.<AudioSource>();
		counter = (Random.Range(0,1) < 0.5) ? 0 : 1;
	}

	public override function OnStateExit (animator : Animator, stateInfo : AnimatorStateInfo, layerIndex : int) {
	}

	public override function OnStateUpdate (animator : Animator, animatorStateInfo : AnimatorStateInfo, layerIndex : int) {
		if (!audioPlayer.isPlaying) {
			if (counter % 2) {
				audioPlayer.clip = sprintClip0;
				audioPlayer.Play();
			}
			else{
				audioPlayer.clip = sprintClip1;
				audioPlayer.Play();
			}
			counter++;
		}
	}

}