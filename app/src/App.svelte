<script lang="ts">
  import { scrollBinder } from './util/query_router';
  import { queryRouter } from './router';

  import BackButton from './lib/BackButton.svelte';

  const app = queryRouter.app;
</script>

<main bind:this={$scrollBinder}>
  <BackButton/>
  <svelte:component this={$app.component}/>
</main>

<style lang="scss">
  main {
    // Default & Must settings
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    overflow: hidden scroll;


    // Personal Preferences
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;

    color: white;
    background-color: black;

    font-size: 20px;
    font-family: sans-serif;
  }
</style>