<template>
  <div v-if="merged">
    <h1>Performance: {{ images[0].performance_id }}</h1>

    <img :src="images[0].url.data.publicUrl" alt="Performance sketch" />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
let merged = ref(false);
let images = ref([]);

const route = useRoute();
const id = ref(route.params.id);

const fetchPerformanceSketch = async () => {
  const { data: files, error: filesError } = await supabase.storage
    .from("sketches")
    .list("sketches/");

  //   console.log("Performances:", files);

  const { data: metadata, error: metadataError } = await supabase
    .from("sketchesMeta")
    .select("*");

  //   console.log("Metadata:", metadata);

  const matchingFile = files.find((file) => id.value === file.id);

  //   console.log("Matching File:", matchingFile);

  const matchingMeta = metadata.find((meta) => matchingFile.name === meta.name);

  //   console.log("Matching Meta:", matchingMeta);

  images = [];

  images.push({
    ...matchingFile,
    created_at: matchingMeta.created_at,
    performance_name: matchingMeta.performance_name,
    performance_id: matchingMeta.id,
    path: matchingMeta.path,
    url: supabase.storage.from("sketches").getPublicUrl(`${matchingMeta.path}`),
  });

  //   console.log("Merged Data:", images);
  merged.value = true;
  //   console.log("Merged:", merged);
};

// Fetch images on component mount
onMounted(fetchPerformanceSketch);
</script>

<style lang="scss" scoped>
/* Add your styles here */
</style>
