<script lang="ts">
import '../app.css'
</script>

<h1>Layout</h1>
<ul class="flex justify-evenly bg-blue-300 mb-10 py-5 text-lg">
  <li><a href="/">Home</a></li>
  <li><a href="/login">Login</a></li>
  <li><a href="/user">User</a></li>
  <li><a href="/hello">Hello</a></li>
</ul>

<slot></slot>

<style>
  a {@apply hover:text-red-500;}
</style>
