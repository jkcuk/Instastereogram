// ProjectPersistence.js

export class ProjectPersistence {

    constructor({
        controls,
        scenes,
        Vector3,
        getNextIds,
        setNextIds,
        sceneManager,
        rebuildGui,
        renderScene
    }) {
        this.controls = controls;
        this.scenes = scenes;
        this.Vector3 = Vector3;
        this.getNextIds = getNextIds;
        this.setNextIds = setNextIds;
        this.sceneManager = sceneManager;
        this.rebuildGui = rebuildGui;
        this.renderScene = renderScene;
    }

    save() {

        const data = {
            controls: this.controls,
            scenes: this.scenes,
            ...this.getNextIds()
        };

        const json = JSON.stringify(
            data,
            (key, value) => {

                if (value instanceof this.Vector3) {
                    return {
                        __type: "Vector3",
                        x: value.x,
                        y: value.y,
                        z: value.z
                    };
                }

                return value;
            },
            2
        );

        const blob = new Blob(
            [json],
            { type: "application/json" }
        );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;
        a.download = "project.json";

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    async loadFromFile(file) {

        const text =
            await file.text();

        this.loadFromJson(text);
    }

    loadFromJson(jsonText) {

        const data =
            JSON.parse(
                jsonText,
                (key, value) => {

                    if (
                        value &&
                        value.__type === "Vector3"
                    ) {
                        return new this.Vector3(
                            value.x,
                            value.y,
                            value.z
                        );
                    }

                    return value;
                }
            );

        if (
            !Array.isArray(data.scenes)
            || data.scenes.length === 0
        ) {
            throw new Error("The project must contain at least one scene.");
        }

        Object.assign(
            this.controls,
            data.controls
        );

        this.scenes.length = 0;
        this.scenes.push(...data.scenes);

        this.sceneManager.selectScene(
            Math.min(
                this.sceneManager.currentSceneIndex,
                this.scenes.length - 1
            )
        );

        this.setNextIds({
            nextStereoId:
                data.nextStereoId,
            nextSceneId:
                data.nextSceneId,
            nextObjectId:
                data.nextObjectId
        });

        this.rebuildGui();
        this.renderScene();
    }

    createLoadButton() {

        const input =
            document.createElement("input");

        input.id = "project-file";
        input.name = "project-file";

        input.type = "file";
        input.accept = ".json";

        input.addEventListener(
            "change",
            async event => {

                const file =
                    event.target.files?.[0];

                if (!file) {
                    return;
                }

                try {
                    await this.loadFromFile(file);
                } catch (error) {
                    alert(`Unable to load project: ${error.message}`);
                }
            }
        );

        input.click();
    }
}