import type { Component } from "svelte";
import GameObject from "./gameObjs/GameObject";
import KeyEvent from "./KeyEvent";

interface EventBusDefine {
    "toast": string;
    "scene:menu": null;
    "scene:game": number;
    "shop:anya": null;
    "exit:anya": null;
    "inspect:item": { item: ItemSaveData, actionX?: () => void };
    "panel:show": () => GameObject;
    "bag:refresh": null;
    "inventory:refresh": null;
    "skill:refresh": null;
    "modal:show": { component: any, props?: Record<string, any>, multiple?: boolean };
    "modal:close": any;
    "item:refresh": string;
    "key:click": KeyEvent;
    "map:exit": null;
}

export function subscribe<T extends keyof EventBusDefine>(event: T, callback: (data: EventBusDefine[T]) => void, fireImmediately = false, priority = 0): () => void;
export function dispatch<T extends keyof EventBusDefine>(event: T, data: EventBusDefine[T]): void;
export function flushEvents(): void;
