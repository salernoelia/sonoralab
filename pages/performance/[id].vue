<template>
  <div>
    <h1>Performance: {{ id }}</h1>

    <img :src="`${sketchUrl}`" alt="Performance sketch" />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();

const route = useRoute();
const id = ref(route.params.id);
const sketchUrl = ref();

const fetchPerformanceMeta = async () => {
  try {
    const { data, error } = await supabase
      .from("sketchesMeta")
      .select("*")
      .eq("id", id.value);
    if (error) {
      console.error("Error fetching performance:", error.message);
    } else {
      console.log("Performance:", data);
      fetchPerformanceSketch();
    }
  } catch (error) {
    console.error("Error fetching performance:", error.message);
  }
};

const fetchPerformanceSketch = async () => {
  try {
    const { data, error } = await supabase.storage
      .from("sketches")
      .getPublicUrl(`sketches/sketch(${id.value}).jpg`);
    if (error) {
      console.error("Error fetching sketch:", error.message);
    } else {
      //   console.log("Sketch:", data);
      sketchUrl.value = data.publicUrl; // Ensure to set the correct property name
      //   sketch.value = data.publicUrl; // Ensure to set the correct property name

      console.log("Sketch:", sketchUrl.value);
      return sketchUrl.value;
    }
  } catch (error) {
    console.error("Error fetching sketch:", error.message);
  }
};

// Fetch images on component mount
onMounted(fetchPerformanceMeta);
</script>

<style lang="scss" scoped>
/* Add your styles here */
</style>
