export default class SceneManager {
    /**@type {import("./gameObjs/Scene").default} */
    static activeScene = null;

    /**
     * 
     * @param {import("./gameObjs/Scene").default} scene 
     */
    static setActiveScene(scene) {
        SceneManager.activeScene?.stop();
        SceneManager.activeScene = scene;
        scene.start();
    }

}
