<script lang="ts">
	import { queryRouter } from '../router';
</script>

<main>
	<button on:click={() => queryRouter.pop()}>Back</button>
</main>

<style lang="scss">
	main {
		width: 100%;
		padding: 20px;
	}

	button {
		width: 100px;
		height: 50px;
		font-size: 20px;

		color: white;
		background-color: #555555;

		border: 1px solid #393939;
		border-radius: 50px;
	}
</style>