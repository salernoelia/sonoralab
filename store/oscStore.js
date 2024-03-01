import { defineStore } from "pinia";

export const useOscStore = defineStore("osc", {
  state: () => {
    return {
      oscData: {
        adress: "",
        args: [],
      },
    };
  },
});
