<script lang="ts">
  import {goto} from '$app/navigation'
  import type {LoginCredentialRequest} from '$types/user';
  import {signin} from '$lib/api/auth-api';

  const credential: LoginCredentialRequest = {
    userId: '',
    password: '',
  }
  let error = ''

  async function login() {
    try {
      await signin(credential)
      await goto('/user')
    } catch (e: any) {
      console.log('login failed!', e)
      error = e.message
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
