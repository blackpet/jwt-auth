<script lang="ts">
  import {onMount} from 'svelte';
  import {hello_client} from '../../lib/api/auth-api';

  export let data
  let clientData
  onMount(async () => {
    clientData = await hello_client()
  })
</script>
<h2>(server) {data.message}</h2>
<h2>(client) {clientData?.message}</h2>
