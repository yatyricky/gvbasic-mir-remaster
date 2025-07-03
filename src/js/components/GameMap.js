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
        // Destroy the current town
        if (this.map) {
            this.map.destroy();
        }

        // Generate a new random map
        const mapConfig = GameMap.genRandomMap(0.9);

        // Create new map GameObject
        this.map = new GameObject("gameMap", this.gameObject);

        // Set up the map based on the generated configuration
        this.setupGeneratedMap(mapConfig);

        dispatch("map:exit", /** @type {any} */({ entrance: mapConfig.entrance }));
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
     * @property {{x: number, y: number}} entrance - The entrance position.
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

        /**
         * Shuffle array in place using Fisher-Yates algorithm
         * @param {any[]} array - Array to shuffle
         */
        const shuffle = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        };

        // Initialize empty map
        const cells = Array(HEIGHT).fill(null).map(() =>
            Array(WIDTH).fill(null).map(() => /** @type {IMapCell} */({
                image: ["⬜"],
                type: "empty"
            }))
        );

        // Place entrance at random location on left edge (x=0, y=0-4)
        const entrance = { x: 0, y: Math.floor(Math.random() * HEIGHT) };
        // Place exit at random location on right edge (x=9, y=0-4)
        const exit = { x: WIDTH - 1, y: Math.floor(Math.random() * HEIGHT) };

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
            shuffle(directions);

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

        // Find all regions and connect them using MST approach
        const connectUnreachableRegions = () => {
            const reachable = getReachableCells();
            const visited = Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(false));
            const regions = [];

            // Helper function to flood fill a region
            /**
             * @param {number} startX 
             * @param {number} startY 
             * @param {boolean} isReachable - whether this is the main reachable region
             */
            const floodFillRegion = (startX, startY, isReachable = false) => {
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
                    shuffle(directions);

                    for (const dir of directions) {
                        const newX = current.x + dir.x;
                        const newY = current.y + dir.y;

                        if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT &&
                            !visited[newY][newX] &&
                            cells[newY][newX].type !== "wall" &&
                            cells[newY][newX].type !== "exit") {

                            // For reachable region, only include reachable cells
                            // For unreachable regions, only include unreachable cells
                            if ((isReachable && reachable[newY][newX]) ||
                                (!isReachable && !reachable[newY][newX])) {
                                visited[newY][newX] = true;
                                queue.push({ x: newX, y: newY });
                            }
                        }
                    }
                }

                return region;
            };

            // Step 1: Find the main reachable region
            let mainReachableRegion = null;
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    if (!visited[y][x] && reachable[y][x] && cells[y][x].type !== "wall") {
                        mainReachableRegion = floodFillRegion(x, y, true);
                        break;
                    }
                }
                if (mainReachableRegion) break;
            }

            if (mainReachableRegion) {
                regions.push({
                    cells: mainReachableRegion,
                    type: 'reachable',
                    id: 0
                });
            }

            // Step 2: Find all unreachable regions
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    if (!visited[y][x] &&
                        cells[y][x].type !== "wall" &&
                        cells[y][x].type !== "exit" &&
                        !reachable[y][x]) {
                        const region = floodFillRegion(x, y, false);
                        if (region.length > 0) {
                            regions.push({
                                cells: region,
                                type: 'unreachable',
                                id: regions.length
                            });
                        }
                    }
                }
            }

            // Step 3: Add exit as a special region
            regions.push({
                cells: [{ x: exit.x, y: exit.y }],
                type: 'exit',
                id: regions.length
            });

            if (regions.length <= 1) {
                return;
            }

            // Step 4: Calculate distances between all regions
            /**
             * @param {{cells: Array<{x: number, y: number}>, type: string, id: number}} regionA - First region
             * @param {{cells: Array<{x: number, y: number}>, type: string, id: number}} regionB - Second region
             * @returns {{fromCell: {x: number, y: number}, toCell: {x: number, y: number}, distance: number}|null} Best connection between regions
             */
            const distanceBetweenRegions = (regionA, regionB) => {
                let minDistance = Infinity;
                let bestConnection = null;

                for (const cellA of regionA.cells) {
                    for (const cellB of regionB.cells) {
                        // Use BFS to find shortest wall-breaking path
                        const distance = findShortestWallBreakingPath(cellA, cellB);
                        if (distance < minDistance) {
                            minDistance = distance;
                            bestConnection = { fromCell: cellA, toCell: cellB, distance };
                        }
                    }
                }

                return bestConnection;
            };

            // Helper function to find shortest wall-breaking path between two cells
            /**
             * @param {{x: number, y: number}} start - Starting cell
             * @param {{x: number, y: number}} end - Ending cell
             * @returns {number} Distance (number of walls to break)
             */
            const findShortestWallBreakingPath = (start, end) => {
                const queue = [{ x: start.x, y: start.y, distance: 0 }];
                const visited = Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(false));
                visited[start.y][start.x] = true;

                while (queue.length > 0) {
                    const current = queue.shift();

                    if (current.x === end.x && current.y === end.y) {
                        return current.distance;
                    }

                    // Create and shuffle directions on each probe to avoid bias
                    const directions = [
                        { x: 0, y: -1 }, { x: 0, y: 1 },
                        { x: -1, y: 0 }, { x: 1, y: 0 }
                    ];
                    shuffle(directions);

                    for (const dir of directions) {
                        const newX = current.x + dir.x;
                        const newY = current.y + dir.y;

                        if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT &&
                            !visited[newY][newX]) {
                            visited[newY][newX] = true;
                            const newDistance = current.distance + (cells[newY][newX].type === "wall" ? 1 : 0);
                            queue.push({ x: newX, y: newY, distance: newDistance });
                        }
                    }
                }

                return Infinity;
            };

            // Step 5: Build graph of region connections
            const edges = [];
            for (let i = 0; i < regions.length; i++) {
                for (let j = i + 1; j < regions.length; j++) {
                    const connection = distanceBetweenRegions(regions[i], regions[j]);
                    if (connection && connection.distance < Infinity) {
                        edges.push({
                            regionA: i,
                            regionB: j,
                            distance: connection.distance,
                            connection: connection
                        });
                    }
                }
            }

            // Step 6: Sort edges by distance for MST
            edges.sort((a, b) => a.distance - b.distance);

            // Step 7: Build MST using Kruskal's algorithm
            const parent = Array(regions.length).fill(null).map((_, i) => i);
            const rank = Array(regions.length).fill(0);

            /**
             * @param {number} x - Region index
             * @returns {number} Root of the set
             */
            const find = (x) => {
                if (parent[x] !== x) {
                    parent[x] = find(parent[x]);
                }
                return parent[x];
            };

            /**
             * @param {number} x - First region index
             * @param {number} y - Second region index
             * @returns {boolean} Whether union was performed
             */
            const union = (x, y) => {
                const rootX = find(x);
                const rootY = find(y);

                if (rootX !== rootY) {
                    if (rank[rootX] < rank[rootY]) {
                        parent[rootX] = rootY;
                    } else if (rank[rootX] > rank[rootY]) {
                        parent[rootY] = rootX;
                    } else {
                        parent[rootY] = rootX;
                        rank[rootX]++;
                    }
                    return true;
                }
                return false;
            };

            const mstEdges = [];
            for (const edge of edges) {
                if (union(edge.regionA, edge.regionB)) {
                    mstEdges.push(edge);
                    if (mstEdges.length === regions.length - 1) {
                        break;
                    }
                }
            }

            // Step 8: Break walls along MST edges
            for (const edge of mstEdges) {
                breakWallsBetweenCells(edge.connection.fromCell, edge.connection.toCell);
            }
        };

        // Helper function to break walls between two cells
        /**
         * @param {{x: number, y: number}} start - Starting cell
         * @param {{x: number, y: number}} end - Ending cell
         */
        const breakWallsBetweenCells = (start, end) => {
            /** @type {Array<{x: number, y: number, path: Array<{x: number, y: number}>}>} */
            const queue = [{ x: start.x, y: start.y, path: [] }];
            const visited = Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(false));
            visited[start.y][start.x] = true;

            const directions = [
                { x: 0, y: -1 }, { x: 0, y: 1 },
                { x: -1, y: 0 }, { x: 1, y: 0 }
            ];
            shuffle(directions);

            while (queue.length > 0) {
                const current = queue.shift();

                if (current.x === end.x && current.y === end.y) {
                    // Found path, break walls along it
                    for (const cell of current.path) {
                        if (cells[cell.y][cell.x].type === "wall") {
                            cells[cell.y][cell.x] = {
                                image: ["⬜"],
                                type: "empty"
                            };
                        }
                    }
                    return;
                }

                for (const dir of directions) {
                    const newX = current.x + dir.x;
                    const newY = current.y + dir.y;

                    if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT &&
                        !visited[newY][newX]) {
                        visited[newY][newX] = true;
                        const newPath = [...current.path, { x: newX, y: newY }];
                        queue.push({ x: newX, y: newY, path: newPath });
                    }
                }
            }
        };

        connectUnreachableRegions();
        // Exit connectivity is now handled by the MST approach in connectUnreachableRegions

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
            cells,
            entrance: { x: entrance.x, y: entrance.y }
        };
    }

    /**
     * Reset hero position to the entrance of the new map
     * @param {Object} eventData - Event data containing entrance position
     * @param {Object} eventData.entrance - Entrance position
     * @param {number} eventData.entrance.x - X coordinate of entrance
     * @param {number} eventData.entrance.y - Y coordinate of entrance
     */
    resetHero(eventData) {
        const hero = SceneManager.activeScene.find("game/hero");
        if (hero) {
            // If entrance position is provided, use it; otherwise default to (0, 0)
            const entranceX = eventData?.entrance?.x ?? 0;
            const entranceY = eventData?.entrance?.y ?? 0;
            hero.setPosition(entranceX, entranceY);
        }
    }
}
