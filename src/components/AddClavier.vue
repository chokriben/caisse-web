<template>
  <div class="clavier-numerique">
    <div class="ligne" v-for="(ligne, rowIndex) in touches" :key="rowIndex">
      <button
        v-for="touche in ligne"
        :key="touche"
        class="touche"
        @click="ajouterTouche(touche)"
      >
        {{ touche }}
      </button>
    </div>
    <div class="ligne">
      <button class="touche touche-effacer" @click="effacerDernier">⌫</button>
      <button class="touche touche-clear" @click="effacerTout">C</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddClavier",
  emits: ["ajout"],
  setup(props, { emit }) {
    const touches = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      [".", "0"],
    ];

    const ajouterTouche = (touche) => {
      emit("ajout", touche);
    };

    const effacerDernier = () => {
      emit("ajout", "⌫");
    };

    const effacerTout = () => {
      emit("ajout", "C");
    };

    return { touches, ajouterTouche, effacerDernier, effacerTout };
  },
};
</script>

<style scoped>
.clavier-numerique {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 1rem;
}
.ligne {
  display: flex;
  gap: 10px;
}
.touche {
  flex: 1;
  padding: 20px;
  font-size: 2rem;
  background: #eeeeee;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.touche:hover {
  background-color: #dcdcdc;
}
.touche-effacer {
  background: #ffc107;
}
.touche-clear {
  background: #f44336;
  color: white;
}
</style>
