<script lang="ts">
  import {onMount} from 'svelte';

  export let data
  onMount(async () => {
    console.log('hello/+page.svelte data', data)
  })
</script>
<h2>(server) {data?.['server_message']}</h2>
<h2>(client) {data?.['client_message']}</h2>
