<script lang="ts">
	import { queryRouter} from '../../router';

	const clickHandler = (e: Event) => {
		const page = (e.target as HTMLElement).innerHTML;
		queryRouter.push({page: page, param: {}});
	};
</script>

<main>
	<h1>This is Home</h1>
	<div class="box">
		<p on:click={e => clickHandler(e)}>home</p>
		<p on:click={e => clickHandler(e)}>profile</p>
		<p on:click={e => clickHandler(e)}>settings</p>
	</div>
</main>

<style lang="scss">
	main {
		padding: 20px;
	}

	.box {
		width: 98vw;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	p {
		width: 400px;
		height: 40px;
		background-color: #282828;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 0px 10px;
		user-select: none;
		border-radius: 50px;
		
		&:hover {
			cursor: pointer;
		}

		&:active {
			background-color: #393939;
		}

	}
</style>