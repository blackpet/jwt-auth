<script lang="ts">
  import type {UserClaimsResponse} from '$types/user';

  /** @type {import('./$types').PageServerData} */
  export let data: { server: UserClaimsResponse, client: UserClaimsResponse }
  console.log('user/+page.svelte data', data)
</script>

<h2>Welcome Admin: {data.server?.iss}</h2>
<div>server data: {JSON.stringify(data.server)}</div>
<div>client data: {JSON.stringify(data.client)}</div>
