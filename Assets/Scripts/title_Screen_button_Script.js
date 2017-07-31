#pragma strict
import UnityEngine.SceneManagement;
import UnityEngine.UI;

function Start() {
	GetComponent.<Button>().onClick.AddListener(openInfoScreen);
}

function openInfoScreen () {
	SceneManager.LoadScene(1, LoadSceneMode.Single);
}

