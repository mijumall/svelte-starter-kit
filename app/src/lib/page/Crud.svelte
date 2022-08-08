<script lang="ts">
	import {Box} from '../../util/box';

	const OBJECTSTORE = 'box';

	async function create() {
		const b = await Box.init(OBJECTSTORE);
		const result = await b.put('name', 'Ichigo🍓');
		console.log(result);
	}

	let name: string = '';
	async function read() {
		const b = await Box.init(OBJECTSTORE);
		name = await b.get('name');
		console.log(name);
	}

	async function update() {
		const b = await Box.init(OBJECTSTORE);
		const result = await b.put('name', 'Mizuki🌙');
		console.log(result);
	}

	async function deleteName() {
		const b = await Box.init(OBJECTSTORE);
		const result = await b.delete('name');
		console.log(result);
	}
		
</script>

<main>
	<h2>CRUD Operation with IndexedDB</h2>
	<p>Create name - Ichigo🍓</p>
	<p>console.log Ichigo</p>
	<p>Update name - Mizuki🌙</p>
	<p>Delete name</p>

	<br>

	<div class="operation">
		<button on:click={create}>Create</button>
	</div>

	<div class="horizontal-divider"></div>

	<div class="operation">
		<button on:click={read}>Read</button>
		<p>{name}</p>
	</div>
	<div class="horizontal-divider"></div>

	<div class="operation">
		<button on:click={update}>Update</button>
	</div>
	<div class="horizontal-divider"></div>


	<div class="operation">
		<button on:click={deleteName}>Delete</button>
	</div>

</main>

<style lang="scss">
	main {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;

		font-size: 20px;
		font-family: sans-serif;
	}

	.horizontal-divider {
		width: 90%;
		margin: 20px;
		border: 1px solid #555555;
	}

	.operation {
		width: 100%;

		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	button {
		color: white;
		background-color: #282828;
		border: solid 1px #282828;
		border-radius: 50px;

		font-size: 20px;
		padding: 20px;

		&:hover {
			cursor: pointer;
		}

		&:active {
			background-color: #393939;
		}
	}
</style>