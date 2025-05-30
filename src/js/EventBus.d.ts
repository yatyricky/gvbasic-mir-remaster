import type { Component } from "svelte";
import BaseModal from "./ui/BaseModal";

interface EventBusDefine {
    "toast": string;
    "scene:login": null;
    "scene:game": null;
    "shop:anya": null;
    "inspect:item": ItemSaveData;
    "modal:open": BaseModal;
    "modal:close": BaseModal;
}

export function subscribe<T extends keyof EventBusDefine>(event: T, callback: (data: EventBusDefine[T]) => void, fireImmediately = false): () => void;
export function dispatch<T extends keyof EventBusDefine>(event: T, data: EventBusDefine[T]): void;
export function flushEvents(): void;
