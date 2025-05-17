import { HeroById } from "../configData/Hero";
import Component from "./Component";

export default class HeroComponent extends Component {
    /**
     * 
     * @param {number} id 
     * @returns 
     */
    setId(id) {
        this.config = HeroById[id];
        return this;
    }
}
