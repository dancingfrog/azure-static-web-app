<script>
	export let value = 'World';
</script>

<style>
    .container, canvas {
        position: relative;
        width: 100%;
        height: 100%;
        display: block;
        overflow: hidden;
        pointer-events: none;
    }
</svelte>

<div>Hello {value}</div>
