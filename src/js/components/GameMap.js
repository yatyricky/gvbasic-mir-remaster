import { UnitById } from "../config/Unit";
import Const from "../Const";
import { dispatch, subscribe } from "../EventBus";
import GameObject from "../gameObjs/GameObject";
import SceneManager from "../SceneManager";
import Collider from "./Collider";
import Component from "./Component";
import TextRenderer from "./TextRenderer";
import UnitComponent from "./UnitComponent";

export default class GameMap extends Component {
    onInit() {
        super.onInit();
        this.map = new GameObject("town", this.gameObject);

        this.anya = new GameObject("anya", this.map);
        this.anya.setPosition(8, 1);
        this.anya.addComponent(Collider).setLayer(Const.LAYER_NPC).setCallback(this.onAnya.bind(this)).setExitCollision(this.offAnya.bind(this));
        const anyaConfig = UnitById.anya;
        this.anya.addComponent(TextRenderer).setText(anyaConfig.image).setQueue(Const.QUEUE_NPC);

        this.expTablet = new GameObject("expTablet", this.map);
        this.expTablet.setPosition(1, 1);
        this.expTablet.addComponent(Collider).setLayer(Const.LAYER_NPC).setCallback(this.onExpTablet.bind(this));
        this.expTablet.addComponent(TextRenderer).setText("📜").setQueue(Const.QUEUE_NPC);

        this.wallRange(0, 0, 9, 0, "🌲", this.map);
        this.wallRange(0, 1, 0, 3, "🌲", this.map);
        this.wallRange(0, 4, 4, 4, "🪵", this.map);
        this.wallRange(9, 1, 9, 3, "🌲", this.map);
        this.wallRange(6, 4, 9, 4, "🪵", this.map);
        this.wallRange(1, 3, 1, 3, "🪨", this.map);

        const exit = new GameObject("exit", this.map).setPosition(5, 5);
        exit.addComponent(Collider).setLayer(Const.LAYER_NPC).setCallback(this.onExit.bind(this));

        this.unsub = subscribe("map:exit", this.resetHero.bind(this));
    }

    onDisable() {
        this.unsub?.();
        this.unsub = null;
    }

    /**
     * 
     * @param {number} x1 
     * @param {number} y1 
     * @param {number} x2 
     * @param {number} y2 
     * @param {string} image 
     * @param {GameObject} parent
     */
    wallRange(x1, y1, x2, y2, image, parent) {
        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                const wall = new GameObject("wall", this.map).setPosition(x, y);
                wall.addComponent(Collider).setLayer(Const.LAYER_WALL);
                wall.addComponent(TextRenderer).setText(image).setQueue(Const.QUEUE_PROPS);
            }
        }
    }

    onAnya() {
        dispatch("shop:anya", null);
    }

    offAnya() {
        dispatch("exit:anya", null);
    }

    onExit() {
        console.log("Generating new random map...");
        
        // Destroy the current town
        if (this.map) {
            this.map.destroy();
        }
        
        // Generate a new random map
        const mapConfig = GameMap.genRandomMap(0.5);
        console.log(`Generated map: ${mapConfig.name}`);
        
        // Create new map GameObject
        this.map = new GameObject("gameMap", this.gameObject);
        
        // Set up the map based on the generated configuration
        this.setupGeneratedMap(mapConfig);
        
        dispatch("map:exit", null);
    }

    onExpTablet() {
        SceneManager.activeScene.find("game/hero").getComponent(UnitComponent).addExp(100000);
    }

    /**
     * Sets up a map based on the generated configuration
     * @param {IMapConfig} mapConfig - The map configuration to set up
     */
    setupGeneratedMap(mapConfig) {
        const cells = mapConfig.cells;
        const HEIGHT = cells.length;
        const WIDTH = cells[0].length;
        
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                const cell = cells[y][x];
                
                // Skip empty cells with no special setup needed
                if (cell.type === "empty") {
                    continue;
                }
                
                // Create GameObject for this cell
                const cellObj = new GameObject(`${cell.type}_${x}_${y}`, this.map);
                cellObj.setPosition(x, y);
                
                // Get random image from the cell's image array
                const image = cell.image[Math.floor(Math.random() * cell.image.length)];
                
                // Set up based on cell type
                switch (cell.type) {
                    case "wall":
                        cellObj.addComponent(Collider).setLayer(Const.LAYER_WALL);
                        cellObj.addComponent(TextRenderer).setText(image).setQueue(Const.QUEUE_PROPS);
                        break;
                        
                    case "entrance":
                        cellObj.addComponent(TextRenderer).setText(image).setQueue(Const.QUEUE_PROPS);
                        break;
                        
                    case "exit":
                        cellObj.addComponent(Collider).setLayer(Const.LAYER_NPC).setCallback(this.onExit.bind(this));
                        cellObj.addComponent(TextRenderer).setText(image).setQueue(Const.QUEUE_PROPS);
                        break;
                        
                    case "chest":
                        cellObj.addComponent(Collider).setLayer(Const.LAYER_NPC).setCallback(() => this.onChest(cellObj));
                        cellObj.addComponent(TextRenderer).setText(image).setQueue(Const.QUEUE_PROPS);
                        break;
                        
                    case "mob":
                        cellObj.addComponent(Collider).setLayer(Const.LAYER_NPC).setCallback(() => this.onMob(cellObj));
                        cellObj.addComponent(TextRenderer).setText(image).setQueue(Const.QUEUE_NPC);
                        break;
                }
            }
        }
    }

    /**
     * Handle chest interaction
     * @param {GameObject} chestObj - The chest game object
     */
    onChest(chestObj) {
        console.log("Chest opened!");
        // Add treasure logic here
        const hero = SceneManager.activeScene.find("game/hero").getComponent(UnitComponent);
        hero.addExp(1000);
        
        // Remove the chest after opening
        chestObj.destroy();
    }

    /**
     * Handle mob interaction
     * @param {GameObject} mobObj - The mob game object
     */
    onMob(mobObj) {
        console.log("Combat with mob!");
        // Add combat logic here
        const hero = SceneManager.activeScene.find("game/hero").getComponent(UnitComponent);
        hero.addExp(500);
        
        // Remove the mob after combat
        mobObj.destroy();
    }

    /**
     * @typedef {Object} IMapCell
     * @property {string[]} image - The possible image representing the cell. Null for rendering nothing.
     * @property {"chest" | "entrance" | "exit" | "mob" | "wall" | "empty"} type - The type of the cell.
     */

    /**
     * @typedef {Object} IMapConfig
     * @property {string} name - The name of the map.
     * @property {IMapCell[][]} cells - A 2D array representing the map cells, where each cell is an object containing its type and image.
     */

    /**
     * Generates a random map configuration. The return value's cells prop is always a 10x5 2d array.
     * This method ensures every cell is reachable from the entrance.
     * CellType "wall" is the only type that blocks path.
     * @param {number} density - The density of the map, which determines how many walls and obstacles are present. Ranges from 0 to 1, where 0 means no walls and 1 means maximum walls.
     * @returns {IMapConfig} A random map configuration.
     */
    static genRandomMap(density = 0.3) {
        const WIDTH = 10;
        const HEIGHT = 5;
        
        // Initialize empty map
        const cells = Array(HEIGHT).fill(null).map(() => 
            Array(WIDTH).fill(null).map(() => /** @type {IMapCell} */ ({
                image: ["⬜"],
                type: "empty"
            }))
        );
        
        // Place entrance at top-left and exit at bottom-right
        const entrance = { x: 0, y: 0 };
        const exit = { x: WIDTH - 1, y: HEIGHT - 1 };
        
        cells[entrance.y][entrance.x] = /** @type {IMapCell} */ ({
            image: ["🚪"],
            type: "entrance"
        });
        
        cells[exit.y][exit.x] = /** @type {IMapCell} */ ({
            image: ["🚪"],
            type: "exit"
        });
        
        // Generate walls with density, avoiding entrance and exit
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                // Skip entrance and exit
                if ((x === entrance.x && y === entrance.y) || (x === exit.x && y === exit.y)) {
                    continue;
                }
                
                if (Math.random() < density) {
                    cells[y][x] = /** @type {IMapCell} */ ({
                        image: ["🧱", "🌲", "🪨"],
                        type: "wall"
                    });
                }
            }
        }
        
        // Get all reachable cells from entrance using flood fill
        const getReachableCells = () => {
            const visited = Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(false));
            const queue = [entrance];
            visited[entrance.y][entrance.x] = true;
            
            // Directions: up, down, left, right - shuffle to avoid bias
            const directions = [
                { x: 0, y: -1 }, { x: 0, y: 1 }, 
                { x: -1, y: 0 }, { x: 1, y: 0 }
            ];
            
            while (queue.length > 0) {
                const current = queue.shift();
                for (const dir of directions) {
                    const newX = current.x + dir.x;
                    const newY = current.y + dir.y;
                    
                    // Check bounds
                    if (newX < 0 || newX >= WIDTH || newY < 0 || newY >= HEIGHT) {
                        continue;
                    }
                    
                    // Skip if already visited, is a wall, or is the exit (treat exit as wall)
                    if (visited[newY][newX] || cells[newY][newX].type === "wall" || cells[newY][newX].type === "exit") {
                        continue;
                    }
                    
                    visited[newY][newX] = true;
                    queue.push({ x: newX, y: newY });
                }
            }
            
            return visited;
        };
        
        // Find all unreachable regions and connect them to reachable areas
        const connectUnreachableRegions = () => {
            const reachable = getReachableCells();
            const visited = Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(false));
            const regions = [];
            
            // Step 1: Find all unreachable regions using flood fill
            /**
             * @param {number} startX 
             * @param {number} startY 
             */
            const floodFillRegion = (startX, startY) => {
                const region = [];
                const queue = [{ x: startX, y: startY }];
                visited[startY][startX] = true;
                
                while (queue.length > 0) {
                    const current = queue.shift();
                    region.push(current);
                    
                    const directions = [
                        { x: 0, y: -1 }, { x: 0, y: 1 }, 
                        { x: -1, y: 0 }, { x: 1, y: 0 }
                    ];
                    
                    for (const dir of directions) {
                        const newX = current.x + dir.x;
                        const newY = current.y + dir.y;
                        
                        if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT &&
                            !visited[newY][newX] && 
                            cells[newY][newX].type !== "wall" && 
                            cells[newY][newX].type !== "exit" &&
                            !reachable[newY][newX]) {
                            visited[newY][newX] = true;
                            queue.push({ x: newX, y: newY });
                        }
                    }
                }
                
                return region;
            };
            
            // Find all unreachable regions
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    if (!visited[y][x] && 
                        cells[y][x].type !== "wall" && 
                        cells[y][x].type !== "exit" &&
                        !reachable[y][x]) {
                        const region = floodFillRegion(x, y);
                        if (region.length > 0) {
                            regions.push(region);
                        }
                    }
                }
            }
            
            console.log(`Found ${regions.length} unreachable regions`);
            
            // Step 2: Connect each region to reachable areas
            for (let i = 0; i < regions.length; i++) {
                const region = regions[i];
                console.log(`Connecting region ${i} with ${region.length} cells`);
                
                // Create distance map for this region
                const distanceMap = Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(-1));
                
                // Mark region cells as 0
                for (const cell of region) {
                    distanceMap[cell.y][cell.x] = 0;
                }
                
                // Expand outward marking distances
                let currentDistance = 0;
                let foundReachable = false;
                let pathEndpoints = [];
                
                while (!foundReachable && currentDistance < Math.max(WIDTH, HEIGHT)) {
                    const nextCells = [];
                    
                    for (let y = 0; y < HEIGHT; y++) {
                        for (let x = 0; x < WIDTH; x++) {
                            if (distanceMap[y][x] === currentDistance) {
                                const directions = [
                                    { x: 0, y: -1 }, { x: 0, y: 1 }, 
                                    { x: -1, y: 0 }, { x: 1, y: 0 }
                                ];
                                
                                for (const dir of directions) {
                                    const newX = x + dir.x;
                                    const newY = y + dir.y;
                                    
                                    if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT) {
                                        if (reachable[newY][newX] && cells[newY][newX].type !== "exit") {
                                            // Found a reachable cell
                                            pathEndpoints.push({ x: newX, y: newY, fromX: x, fromY: y });
                                            foundReachable = true;
                                        } else if (distanceMap[newY][newX] === -1 && cells[newY][newX].type === "wall") {
                                            // Mark wall as next distance
                                            distanceMap[newY][newX] = currentDistance + 1;
                                            nextCells.push({ x: newX, y: newY });
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    currentDistance++;
                }
                
                if (foundReachable && pathEndpoints.length > 0) {
                    // Pick a random endpoint and trace back to create path
                    const endpoint = pathEndpoints[Math.floor(Math.random() * pathEndpoints.length)];
                    console.log(`Creating path from region to reachable cell at (${endpoint.x}, ${endpoint.y})`);
                    
                    // Trace back and clear walls
                    let currentX = endpoint.fromX;
                    let currentY = endpoint.fromY;
                    
                    while (distanceMap[currentY][currentX] > 0) {
                        if (cells[currentY][currentX].type === "wall") {
                            cells[currentY][currentX] = {
                                image: ["⬜"],
                                type: "empty"
                            };
                        }
                        
                        // Find the cell with the previous distance
                        const directions = [
                            { x: 0, y: -1 }, { x: 0, y: 1 }, 
                            { x: -1, y: 0 }, { x: 1, y: 0 }
                        ];
                        
                        let found = false;
                        for (const dir of directions) {
                            const newX = currentX + dir.x;
                            const newY = currentY + dir.y;
                            
                            if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT &&
                                distanceMap[newY][newX] === distanceMap[currentY][currentX] - 1) {
                                currentX = newX;
                                currentY = newY;
                                found = true;
                                break;
                            }
                        }
                        
                        if (!found) break;
                    }
                } else {
                    console.error(`Region ${i} could not be connected to reachable areas`);
                }
            }
        };
        
        // Step 4: Handle exit connectivity
        const connectExit = () => {
            const reachable = getReachableCells();
            
            // Check if exit is already reachable (adjacent to reachable cell)
            const directions = [
                { x: 0, y: -1 }, { x: 0, y: 1 }, 
                { x: -1, y: 0 }, { x: 1, y: 0 }
            ];
            
            let exitReachable = false;
            for (const dir of directions) {
                const newX = exit.x + dir.x;
                const newY = exit.y + dir.y;
                
                if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT &&
                    reachable[newY][newX]) {
                    exitReachable = true;
                    break;
                }
            }
            
            if (!exitReachable) {
                console.log("Exit not reachable, creating path to exit");
                
                // Create distance map from exit
                const distanceMap = Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(-1));
                distanceMap[exit.y][exit.x] = 0;
                
                let currentDistance = 0;
                let foundReachable = false;
                let pathEndpoints = [];
                
                while (!foundReachable && currentDistance < Math.max(WIDTH, HEIGHT)) {
                    for (let y = 0; y < HEIGHT; y++) {
                        for (let x = 0; x < WIDTH; x++) {
                            if (distanceMap[y][x] === currentDistance) {
                                for (const dir of directions) {
                                    const newX = x + dir.x;
                                    const newY = y + dir.y;
                                    
                                    if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT) {
                                        if (reachable[newY][newX]) {
                                            pathEndpoints.push({ x: newX, y: newY, fromX: x, fromY: y });
                                            foundReachable = true;
                                        } else if (distanceMap[newY][newX] === -1 && cells[newY][newX].type === "wall") {
                                            distanceMap[newY][newX] = currentDistance + 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    currentDistance++;
                }
                
                if (foundReachable && pathEndpoints.length > 0) {
                    const endpoint = pathEndpoints[Math.floor(Math.random() * pathEndpoints.length)];
                    console.log(`Creating path from exit to reachable cell at (${endpoint.x}, ${endpoint.y})`);
                    
                    // Trace back and clear walls
                    let currentX = endpoint.fromX;
                    let currentY = endpoint.fromY;
                    
                    while (distanceMap[currentY][currentX] > 0) {
                        if (cells[currentY][currentX].type === "wall") {
                            cells[currentY][currentX] = {
                                image: ["⬜"],
                                type: "empty"
                            };
                        }
                        
                        let found = false;
                        for (const dir of directions) {
                            const newX = currentX + dir.x;
                            const newY = currentY + dir.y;
                            
                            if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT &&
                                distanceMap[newY][newX] === distanceMap[currentY][currentX] - 1) {
                                currentX = newX;
                                currentY = newY;
                                found = true;
                                break;
                            }
                        }
                        
                        if (!found) break;
                    }
                }
            }
        };
        
        // Add some random features to non-wall, non-entrance, non-exit cells
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                if (cells[y][x].type === "empty" && Math.random() < 0.1) {
                    const rand = Math.random();
                    if (rand < 0.5) {
                        cells[y][x] = /** @type {IMapCell} */ ({
                            image: ["📦"],
                            type: "chest"
                        });
                    } else {
                        cells[y][x] = /** @type {IMapCell} */ ({
                            image: ["👹", "🧌", "💀"],
                            type: "mob"
                        });
                    }
                }
            }
        }
        
        return {
            name: `Random Dungeon ${Math.floor(Math.random() * 1000)}`,
            cells
        };
    }

    resetHero() {
        const hero = SceneManager.activeScene.find("game/hero");
        if (hero) {
            hero.setPosition(0, 0);
        }
    }
}
