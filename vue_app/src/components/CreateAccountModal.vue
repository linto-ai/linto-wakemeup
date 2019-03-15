<template>
  <div>
    <div class="modal" :class="[showCreateAccountModal ? 'visible' : 'hidden']">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title green">Créer un compte</h3>
          <button @click="closeModal()" class="close-modal"></button>
          <button @click="backToLogin()" class="back-login-modal"></button>
        </div>
        <div class="modal-body">
          <div class="field-container">
            <div class="field-label">
              <span class="required">*</span>
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
              <span class="required">*</span>
              <span class="label">Mot de passe :</span>
            </div>
            <input type="password" class="input" v-model="userPswd">
            <span
              class="error-field"
              :class="[userPswdErrorMsg.length > 0 ? 'visible' : 'hidden']"
            >{{ userPswdErrorMsg }}</span>
          </div>
          <div class="field-container">
            <div class="field-label">
              <span class="required">*</span>
              <span class="label">Confirmation du mot de passe :</span>
            </div>
            <input type="password" class="input" v-model="userPswdConfirm">
            <span
              class="error-field"
              :class="[userPswdConfirmdErrorMsg.length > 0 ? 'visible' : 'hidden']"
            >{{ userPswdConfirmErrorMsg }}</span>
          </div>
          <div class="field-container">
            <div class="field-label">
              <span class="required">*</span>
              <span class="label">Sexe :</span>
              <select class="select">
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
            </div>
          </div>
          <div class="field-container">
            <div class="field-label">
              <span class="required">*</span>
              <span class="label">Type de mircophone :</span>
            </div>
            <div class="micro-type-container">
              <div class="micro-type-item" @click="setMicrophone('default')" :class="[selectedMic == 'default' ? 'active' : '']">
                <span class="icon default"></span>
                <span class="label">Micro par défaut</span>
              </div>
              <div class="micro-type-item" @click="setMicrophone('casque')" :class="[selectedMic == 'casque' ? 'active' : '']">
                <span class="icon casque"></span>
                <span class="label">Micro-casque</span>
              </div>
              <div @click="setMicrophone('pied')" class="micro-type-item" :class="[selectedMic == 'pied' ? 'active' : '']">
                <span class="icon pied"></span>
                <span class="label">Micro à pied</span>
              </div>
            </div>
          </div>
          <div class="field-container btn">
            <button class="button green large">Créer mon compte</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from "../main.js";
export default {
  data() {
    return {
      showCreateAccountModal: false,
      selectedMic: 'default',
      userEmail: "",
      userEmailValid: false,
      userEmailErrorMsg: "",
      userPswd: "",
      userPswdValid: false,
      userPswdErrorMsg: "",
      userPswdConfirm: "",
      userPswdConfirmValid: false,
      userPswdConfirmdErrorMsg: ""
    };
  },
  mounted() {
    bus.$on("toggle_create_account_modal", () => {
      this.showCreateAccountModal = true;
    });
  },
  methods: {
    setMicrophone (selected) {
      this.selectedMic = selected
    },
    closeModal() {
      this.showCreateAccountModal = false;
    },
    backToLogin() {
      this.showCreateAccountModal = false;
      bus.$emit("toggle_connection_modal", () => {});
    }
  }
};
</script>
