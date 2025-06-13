<script>
    import DebugData from "./DebugData.svelte";
    import DebugStat from "./DebugStat.svelte";
    import DebugHierarchy from "./DebugHierarchy.svelte";
</script>

<div class="container">
    <DebugData />
    <DebugStat />
    <DebugHierarchy />
</div>

<style>
    .container {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
    }
</style>
