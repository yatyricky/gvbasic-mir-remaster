<script>
    import { numFloor } from "../../Utils";

    const {
        max = 100,
        value = 0,
        color = "#ceae0f",
        showText = true,
        backgroundColor = "#6d7070",
        textSize = "12px",
        showPercentage = true,
    } = $props();

    // Calculate percentage for display
    const getPercentage = () => {
        if (max <= 0) return 0;
        const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
        return numFloor(percentage, 2);
    };

    // Format display text
    const getDisplayText = () => {
        return `${value}/${max}${showPercentage ? ` (${getPercentage()}%)` : ""}`;
    };
</script>

<div class="pg-background" style="background-color: {backgroundColor}; --text-size: {textSize};">
    <div class="pg-progress" style="width: {getPercentage()}%; background-color: {color};"></div>
    {#if showText}
        <div class="pg-text">{getDisplayText()}</div>
    {/if}
</div>

<style>
    .pg-background {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #0e0e0b;
        box-shadow: inset 0 0 4px 2px rgba(0, 0, 0, 0.3);
    }

    .pg-progress {
        position: absolute;
        height: 100%;
        left: 0;
        top: 0;
        transition: width 0.3s ease;
        box-shadow: inset 0 0 4px 2px rgba(0, 0, 0, 0.3);
    }

    .pg-text {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        font-size: var(--text-size, 12px);
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        z-index: 1;
    }
</style>
