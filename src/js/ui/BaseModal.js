export default class BaseModal {
    /**
     * 
     * @param {string} id 
     */
    constructor(id) {
        this.dom = document.getElementById(id);
    }
}