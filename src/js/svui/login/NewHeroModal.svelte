<script>
    import userData from "../../data/UserData";
    import { dispatch } from "../../EventBus";
    import MessageBox from "../MessageBox.svelte";

    const { close } = $props();

    /**
     *
     * @param {UnitId} klass
     */
    function createHero(klass) {
        dispatch("modal:show", {
            component: MessageBox,
            props: {
                title: "创建角色",
                content: `请输入你的名字：`,
                input: {
                    placeholder: "角色名",
                    maxLength: 10,
                },
                actions: [
                    {
                        text: "取消",
                        autoClose: true,
                    },
                    {
                        text: "确定",
                        /**
                         * @param {any} param0
                         */
                        action: ({ inputValue }) => {
                            if (inputValue.trim() === "") {
                                dispatch("modal:show", {
                                    component: MessageBox,
                                    props: {
                                        title: "错误",
                                        content: "角色名不能为空！",
                                        actions: [
                                            {
                                                text: "确定",
                                                autoClose: true,
                                            },
                                        ],
                                    },
                                });
                                return;
                            }
                            if (userData.data.chars.some((c) => c.name === inputValue)) {
                                dispatch("modal:show", {
                                    component: MessageBox,
                                    props: {
                                        title: "错误",
                                        content: "角色名已存在，请选择其他名字！",
                                        actions: [
                                            {
                                                text: "确定",
                                                autoClose: true,
                                            },
                                        ],
                                    },
                                });
                                return;
                            }
                            userData.addChar(klass, inputValue);
                            close();
                            dispatch("scene:game", userData.data.chars.length - 1);
                        },
                        autoClose: true,
                    },
                ],
            },
        });
    }
</script>

<div class="backdrop">
    <div class="wrapper">
        <div class="title">
            <div class="title-text">背包</div>
            <button onclick={close} class="btn close-btn">X</button>
        </div>
        <div class="container">
            <button class="btn btn-hero" onclick={() => createHero("warr")}>战士</button>
            <button class="btn btn-hero" onclick={() => createHero("mage")} style="top: 100px">法师</button>
            <button class="btn btn-hero" onclick={() => createHero("wlk")} style="top: 200px">道士</button>
        </div>
    </div>
</div>

<style>
    .backdrop {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .btn {
        background-color: #680000;
        border-radius: 4px;
        padding: 0px;
        color: #ceae0f;
    }
    .wrapper {
        position: absolute;
        display: flex;
        flex-direction: column;
        background-color: #403a36;
        border-radius: 4px;
        color: #ffffff;
        border: 1px solid #0e0e0b;
        box-shadow:
            0 0 1px 2px #726e6c,
            inset 0 0 8px 4px #23201f;
        width: 94%;
        height: 94%;
        left: 3%;
        top: 3%;
    }
    .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 16px;
        border-radius: 4px;
        border-bottom: 1px solid #6d7070;
        box-shadow: inset 0 0 4px 2px #23201f;
        width: 100%;
        height: 24px;
        padding: 0;
    }
    .title-text {
        flex: 1;
        text-align: center;
        color: #ceae0f;
    }

    .close-btn {
        position: absolute;
        top: 0;
        right: 0;
        width: 24px;
        height: 24px;
    }
    .container {
        flex: 1;
        /* padding: 4px; */
        border-radius: 4px;
        word-break: break-all;
        overflow: auto;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 30px;
    }
    .container::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }
    .btn-hero {
        width: 200px;
        height: 50px;
        font-size: 20px;
    }
</style>
