import p5 from "p5";

export default function () {
  let myp5 = ref();
  onMounted(() => {
    myp5.value = new p5.Oscillator();
  });
  return myp5;
}
