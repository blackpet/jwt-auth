<script lang="ts">
  import {api} from '$lib/http';
  import type {AxiosError} from 'axios';

  const credential = {
    userId: '',
    password: '',
  }
  let error = ''

  async function login() {
    console.log('login!')
    const uri = '/login'
    try {
      const res = await api.post(uri, credential, {
        withCredentials: true,
      })
      console.log('login res', res.data)
    } catch (e: AxiosError) {
      console.log(e.response.data.message)
      error = e.response.data.message
    }
  }
</script>

<h1>Login</h1>
{#if error}
<div class="error">Error: {error}</div>
{/if}

<div>
  ID: <input type="text" bind:value={credential.userId}>
</div>
<div>
  Password: <input type="text" bind:value={credential.password}>
</div>
<div>
  <button on:click={login}>Login</button>
  <a href="/login/find-id">Find ID</a>
</div>

<style>
  .error {
    color: red;
    font-weight: bold;
  }
</style>
