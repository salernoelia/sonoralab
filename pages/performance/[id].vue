<template>
  <div class="parent" v-if="merged">
    <div class="child">
      <img
        class="performance-image"
        :src="images[0].url.data.publicUrl"
        alt="Performance sketch"
      />

      <div class="performance-info">
        <h1 class="performance-title">
          Performance {{ images[0].performance_id }}
        </h1>
        <p class="performance-date">Created: {{ images[0].updated_at }}</p>

        <NuxtLink class="button-main" to="/gallery">
          <button>< Back to Gallery</button>
        </NuxtLink>
      </div>
    </div>
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
* {
  //   box-sizing: border-box;
  font-family: "Courier New", Courier, monospace;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.body::-webkit-scrollbar {
  display: none;
}

body {
  overflow: hidden;
}

.parent {
  padding: 2rem;

  overflow: hidden;
  position: absolute;
  inset: 0;
  justify-content: center;
  align-items: center;
}

.child {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.performance-image {
  width: 70%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.performance-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: 50%;
  height: 100%;
  padding-left: 1rem;
  gap: 1rem;

  h1 {
    font-size: 2rem;
    margin: 0;
  }
  p {
    margin: 0;
  }
}

.button-main {
  background-color: none;
  border: none;
  padding: 0;

  button {
    background-color: #f0f0f0;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #e0e0e0;
    }
  }
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  transform: translateX(100%);
}
.page-enter-to,
.page-leave-from {
  transform: translateX(0);
}
</style>
