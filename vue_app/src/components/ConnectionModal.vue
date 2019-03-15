<template>
  <div>
    <div class="modal" :class="[showConnectionModal ? 'visible' : 'hidden']">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title red">Se connecter</h3>
          <button @click="closeModal" class="close-modal"></button>
        </div>
        <div class="modal-body">
          <span>Veuillez renseigner vos identifiants</span>
          <div class="field-container">
            <div class="field-label">
              <span class="icon user"></span>
              <span class="label">Adresse email:</span>
            </div>
            <input type="text" class="input" v-model="userEmail">
            <span
              class="error-field"
              :class="[userEmailErrorMsg.length > 0 ? 'visible' : 'hidden']"
            >{{ userEmailErrorMsg }}</span>
          </div>
          <div class="field-container">
            <div class="field-label">
              <span class="icon pswd"></span>
              <span class="label">Mot de passe :</span>
            </div>
            <input type="password" class="input" v-model="userPswd">
            <span
              class="error-field"
              :class="[userPswdErrorMsg.length > 0 ? 'visible' : 'hidden']"
            >{{ userPswdErrorMsg }}</span>
          </div>
          <div class="field-container btn">
            <button class="button red large" @click="sendLogin()">S'identifier</button>
          </div>
          <button class="aslink">Identifiants oubliés ?</button>
          <div class="spacer"></div>
          <div class="divider red"></div>
          <div class="spacer"></div>
          <span>Vous n'avez pas d'identifiants ?</span>
          <div class="field-container btn">
            <button class="button green large" @click="toggleCreateAccountModal">Créer un compte</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { bus } from "../main.js";
export default {
  data() {
    return {
      showConnectionModal: false,
      userEmail: "",
      userEmailValid: false,
      userEmailErrorMsg: "",
      userPswd: "",
      userPswdValid: false,
      userPswdErrorMsg: ""
    };
  },
  mounted() {
    bus.$on("toggle_connection_modal", () => {
      this.toggleConnectionModal();
    });
  },
  methods: {
    toggleConnectionModal() {
      this.showConnectionModal = !this.showConnectionModal;
    },
    closeModal() {
      this.showConnectionModal = false;
    },
    toggleCreateAccountModal () {
      this.showConnectionModal = false
      bus.$emit('toggle_create_account_modal', {})
    },
    async sendLogin () {
      const payload = {
        email: this.userEmail,
        password: this.userPswd
      }
      const login = await axios('http://localhost:3003/login/userAuth', {
        method: 'post',
        data: payload
      })
      console.log(login)

}
  }
};
</script>
