class UserData {
    constructor() {
        this.data = this.loadFromDisk();
    }

    loadFromDisk() {
        const json = localStorage.getItem('data');
        let obj = {};
        try {
            obj = JSON.parse(json);
        } catch (error) {
        }
        return obj;
    }

    saveToDisk() {
        localStorage.setItem('data', JSON.stringify(this.data));
    }
}

const userData = new UserData();
export default userData;