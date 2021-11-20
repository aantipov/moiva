<template>
  <div class="mt-8 mb-14">
    <a :href="url" title="Home" class="text-2xl">← all posts</a>

    <h2>Subscribe to the monthly newsletter</h2>

    <div id="revue-embed">
      <div class="revue-form-footer">
        By subscribing, you agree with Revue’s
        <a target="_blank" href="https://www.getrevue.co/terms">Terms</a> and
        <a target="_blank" href="https://www.getrevue.co/privacy"
          >Privacy Policy</a
        >.
      </div>
      <form
        action="https://www.getrevue.co/profile/moiva/add_subscriber"
        method="post"
        id="revue-form"
        name="revue-form"
        target="_blank"
      >
        <div class="revue-form-group">
          <label for="member_email" style="display: none">Email address</label>
          <input
            class="revue-form-field"
            placeholder="Your email address..."
            type="email"
            name="member[email]"
            id="member_email"
          />
        </div>
        <div class="revue-form-actions">
          <input
            type="submit"
            value="Subscribe"
            name="member[subscribe]"
            id="member_submit"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress';
const url = withBase('/');
</script>

<style scoped>
/**  styles for the Subscribe block   **/
.revue-form-field {
  border-color: rgb(227, 227, 227);
  border-radius: 4px;
  color: inherit;
  font-weight: 400;
  width: 100%;
  background: #fff;
  font-size: 20px;
  padding: 12px;
  border: 1px solid #e3e3e3;
  flex: 1 0 auto;
  line-height: 1.4;
  margin: 0;
}
.revue-form-field:focus {
  outline: #ac4142 auto 1px;
}

#member_submit {
  background-color: #ac4142;
  font-size: 20px;
  font-weight: 500;
  width: 180px;
  height: 50px;
  border: 0;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  margin: 8px 0 0;
  padding: 8px;
  overflow: hidden;
  vertical-align: middle;
  outline: none;
}
.revue-form-footer {
  font-size: 16px;
  margin-bottom: 8px;
}
</style>
