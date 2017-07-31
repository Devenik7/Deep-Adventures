#pragma strict
import UnityEngine.SceneManagement;
import UnityEngine.UI;

var walk : Transform;
var sprint : Transform;
var attack : Transform;
var jump_attack_down : Transform;
var button : Button;

function Start () {
	walk.GetComponent(Animator).Play("walk", PlayMode.StopSameLayer);
	sprint.GetComponent(Animator).Play("sprint", PlayMode.StopSameLayer);
	attack.GetComponent(Animator).Play("attack0", PlayMode.StopSameLayer);
	jump_attack_down.GetComponent(Animator).Play("jump_attack_down", PlayMode.StopSameLayer);
	button.GetComponent.<Button>().onClick.AddListener(startGame);
}

function Update () {
	
}

function startGame () {
	SceneManager.LoadScene(2, LoadSceneMode.Single);
}