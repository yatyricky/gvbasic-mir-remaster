import type { Component } from "svelte";
import GameObject from "./gameObjs/GameObject";

interface EventBusDefine {
    "toast": string;
    "scene:menu": null;
    "scene:game": null;
    "shop:anya": null;
    "inspect:item": { item: ItemSaveData, actionX?: () => void };
    "panel:show": () => GameObject;
    "bag:refresh": null;
    "inventory:refresh": null;
}

export function subscribe<T extends keyof EventBusDefine>(event: T, callback: (data: EventBusDefine[T]) => void, fireImmediately = false): () => void;
export function dispatch<T extends keyof EventBusDefine>(event: T, data: EventBusDefine[T]): void;
export function flushEvents(): void;
