<script lang="ts">
  import type {UserClaimsResponse} from '$types/user';

  /** @type {import('./$types').PageServerData} */
  export let data: UserClaimsResponse
  console.log('user data', data)
</script>

<h2>Welcome Admin: {data?.iss}</h2>
<div>data: {JSON.stringify(data)}</div>
