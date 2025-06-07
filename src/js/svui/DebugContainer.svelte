<script>
    import DebugData from "./DebugData.svelte";
    import DebugStat from "./DebugStat.svelte";
</script>

<div class="container">
    <DebugData />
    <DebugStat />
</div>

<style>
    .container {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
    }
</style>
