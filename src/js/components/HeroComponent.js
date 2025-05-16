import { HeroById } from "../configData/Hero";

export default class HeroComponent {
    setId(id) {
        this.config = HeroById[id];
        return this;
    }
}
