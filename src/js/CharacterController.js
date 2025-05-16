const randomText = `Lorem ipsum dolo用FFmpeg拼接两个视频为一个文件时，需要根据视频格式和编码特性选择合适的方法。以下是三种主流方案及其操作步骤：

一、快速无损拼接法（推荐）
😊☺😰😱v😊☺😰😱v😊☺😰😱v😊☺😰😱v😊☺😰😱v😊☺😰😱v😊☺😰😱v😊☺😰😱v😊☺😰😱v😊☺😰😱v😊☺😰😱elid es
​​适用场景​​：两个视频编码格式（H.264/H.265）、分辨sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."`;

function shuffleString(str) {
    // Use Array.from with a string to properly split by unicode characters
    // This correctly handles emojis and other surrogate pairs
    const arr = Array.from(str);

    // Fisher-Yates shuffle algorithm
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.join('');
}

export default class CharacterController {
    onInput(key) {
        // if (key === "a") {
        //     this.gameObject.getComponent("TextRenderer").setText(shuffleString(randomText));
        // }

        if (key === "u") {
            this.gameObject.y = Math.max(this.gameObject.y - 1, 0);
        }

        if (key === "d") {
            this.gameObject.y = Math.min(this.gameObject.y + 1, 4);
        }

        if (key === "l") {
            this.gameObject.x = Math.max(this.gameObject.x - 2, 0);
        }

        if (key === "r") {
            this.gameObject.x = Math.min(this.gameObject.x + 2, 18);
        }

    }
}